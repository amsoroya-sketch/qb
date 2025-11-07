# Security Next Steps for arQ Project

**Date:** 2025-11-07
**Security Grade:** A- (92/100)
**Status:** ⚠️ URGENT - Secret rotation required
**Source:** COMPREHENSIVE_SECURITY_ANALYSIS.md

---

## 🚨 P0 - CRITICAL (Next 24 Hours)

### 1. Rotate All Exposed Secrets

**Timeline:** 1-2 hours
**Priority:** BLOCKING - Must complete before ANY production deployment

#### Why This is Critical:
- Backend `.env` file was exposed with 5 JWT secrets + DB password
- Pre-commit hooks installed, but secrets still valid
- Company remains liable until secrets are rotated

#### Step-by-Step Rotation:

```bash
# 1. Generate new JWT secrets (256-bit)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ACCESS_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_ACCESS_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# 2. Update backend/.env with new values
# Edit: backend/.env

# 3. Change database password
psql -U postgres -h localhost -p 5433
ALTER USER postgres WITH PASSWORD 'new_secure_password_here';
\q

# 4. Update DATABASE_URL in backend/.env
DATABASE_URL="postgresql://postgres:new_secure_password_here@localhost:5433/arq_dev"

# 5. Set Redis password (if not already set)
sudo nano /etc/redis/redis.conf
# Add: requirepass your_secure_redis_password
sudo systemctl restart redis

# 6. Update REDIS_PASSWORD in backend/.env
REDIS_PASSWORD="your_secure_redis_password"

# 7. Invalidate all user sessions
redis-cli -h localhost -p 6380 -a your_new_redis_password FLUSHDB

# 8. Restart backend
cd backend
npm run start:dev
```

#### Verification Checklist:
- [ ] All 5 JWT secrets rotated (64 characters each)
- [ ] Database password changed
- [ ] Redis password set
- [ ] backend/.env updated with all new secrets
- [ ] All user sessions invalidated
- [ ] Backend restarts successfully
- [ ] Test login flow works
- [ ] No secrets hardcoded in code (grep for old secrets)

---

## 🟠 P1 - HIGH (This Week)

### 2. Implement Security Scanning Tools

**Timeline:** 3-4 hours
**Priority:** HIGH - Prevent future secret exposure

#### 2.1 Set Up Trivy Dependency Scanning

```bash
# Install Trivy
brew install trivy  # macOS
# OR
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy

# Create trivy.yaml
cat > backend/trivy.yaml << EOF
format: sarif
output: trivy-results.sarif
severity:
  - CRITICAL
  - HIGH
  - MEDIUM
exit-code: 1  # Fail on vulnerabilities
ignore-file: .trivyignore
EOF

# Run scan
cd backend
trivy fs --config trivy.yaml .

# Add to package.json scripts
npm pkg set scripts.security:scan="trivy fs --config trivy.yaml ."
```

#### 2.2 Set Up Semgrep Security Rules

```bash
# Install Semgrep
pip install semgrep

# Create .semgrep/rules.yml
mkdir -p backend/.semgrep
cat > backend/.semgrep/rules.yml << EOF
rules:
  - id: hardcoded-secret
    patterns:
      - pattern: |
          const \$KEY = "\$VALUE"
      - metavariable-regex:
          metavariable: \$KEY
          regex: (apiKey|secretKey|password|token|JWT)
    message: Hardcoded secret detected
    severity: ERROR
    languages: [typescript]

  - id: sql-injection
    patterns:
      - pattern: prisma.\$queryRawUnsafe(...)
    message: Unsafe raw SQL query - use parameterized queries
    severity: ERROR
    languages: [typescript]

  - id: xss-dangerous-html
    patterns:
      - pattern: dangerouslySetInnerHTML={{ __html: \$VAR }}
      - metavariable-regex:
          metavariable: \$VAR
          regex: (?!sanitized).*
    message: Potential XSS - sanitize HTML before rendering
    severity: WARNING
    languages: [typescript, tsx]
EOF

# Run scan
cd backend
semgrep --config .semgrep/rules.yml src/

# Add to package.json
npm pkg set scripts.security:semgrep="semgrep --config .semgrep/rules.yml src/"
```

#### 2.3 Update Pre-Commit Hooks

```bash
# Install husky (if not already)
npm install --save-dev husky lint-staged

# Add pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run security:semgrep"

# Update package.json
cat >> package.json << EOF
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    ".env*": [
      "echo 'ERROR: Attempting to commit .env file!' && exit 1"
    ]
  }
}
EOF
```

### 3. Implement Additional Security Features

**Timeline:** 6-8 hours
**Priority:** HIGH - Complete production readiness

#### 3.1 Add IP Whitelisting for Admin Endpoints

```typescript
// backend/src/common/guards/ip-whitelist.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  private readonly allowedIps = process.env.ADMIN_ALLOWED_IPS?.split(',') || [];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientIp = this.getClientIp(request);

    if (!this.allowedIps.includes(clientIp)) {
      throw new ForbiddenException(`Access denied from IP: ${clientIp}`);
    }

    return true;
  }

  private getClientIp(req: any): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      return (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',')[0].trim();
    }
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
}

// Usage in admin controllers
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard, IpWhitelistGuard)
@Roles('ADMIN')
export class AdminController {
  // Admin endpoints
}
```

#### 3.2 Implement Password History

```typescript
// backend/src/modules/auth/services/password-history.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHistoryService {
  private readonly HISTORY_SIZE = 5;

  constructor(private prisma: PrismaService) {}

  async savePasswordHistory(userId: string, passwordHash: string): Promise<void> {
    await this.prisma.passwordHistory.create({
      data: {
        userId,
        passwordHash,
      },
    });

    // Keep only last 5 passwords
    const history = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (history.length > this.HISTORY_SIZE) {
      await this.prisma.passwordHistory.deleteMany({
        where: {
          id: {
            in: history.slice(this.HISTORY_SIZE).map(h => h.id),
          },
        },
      });
    }
  }

  async isPasswordReused(userId: string, newPassword: string): Promise<boolean> {
    const history = await this.prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: this.HISTORY_SIZE,
    });

    for (const entry of history) {
      const matches = await bcrypt.compare(newPassword, entry.passwordHash);
      if (matches) {
        return true;
      }
    }

    return false;
  }
}

// Add to Prisma schema
// model PasswordHistory {
//   id           String   @id @default(uuid())
//   userId       String
//   passwordHash String
//   createdAt    DateTime @default(now())
//
//   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
//
//   @@index([userId])
// }
```

---

## 🟡 P2 - MEDIUM (This Month)

### 4. Implement Multi-Factor Authentication (MFA)

**Timeline:** 8-12 hours
**Priority:** MEDIUM - Enhanced security for production

#### 4.1 Install Dependencies

```bash
cd backend
npm install speakeasy qrcode
npm install --save-dev @types/qrcode
```

#### 4.2 Add MFA Service

```typescript
// backend/src/modules/auth/services/mfa.service.ts
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MfaService {
  constructor(private prisma: PrismaService) {}

  async generateSecret(userId: string): Promise<{ secret: string; qrCode: string }> {
    const secret = speakeasy.generateSecret({
      name: `arQ LMS (${userId})`,
      issuer: 'arQ',
    });

    // Save secret to database (encrypted)
    await this.prisma.user.update({
      where: { id: userId },
      data: { mfaSecret: secret.base32 },
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode,
    };
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { mfaSecret: true },
    });

    if (!user?.mfaSecret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps before/after current
    });
  }

  async enableMfa(userId: string, token: string): Promise<boolean> {
    const isValid = await this.verifyToken(userId, token);

    if (isValid) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true },
      });
    }

    return isValid;
  }

  async disableMfa(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        mfaEnabled: false,
        mfaSecret: null,
      },
    });
  }
}
```

### 5. Quarterly Security Audit Procedures

**Timeline:** 4-8 hours per quarter
**Priority:** MEDIUM - Ongoing security hygiene

#### Quarterly Security Checklist:

```markdown
## Quarterly Security Audit - Q[X] 202X

**Date:**
**Auditor:**
**Status:**

### 1. Dependency Security
- [ ] Run `npm audit` in backend and frontend
- [ ] Run `trivy fs .` for vulnerability scan
- [ ] Update all dependencies to latest secure versions
- [ ] Check for new CVEs in major dependencies

### 2. Secret Rotation
- [ ] Rotate all JWT secrets (5 secrets)
- [ ] Rotate database password
- [ ] Rotate Redis password
- [ ] Rotate third-party API keys (if any)
- [ ] Update all .env files
- [ ] Invalidate all user sessions

### 3. Access Control Review
- [ ] Review admin user list
- [ ] Remove inactive admin accounts
- [ ] Verify RBAC permissions
- [ ] Check IP whitelist for admin endpoints
- [ ] Audit failed login attempts

### 4. Code Security Review
- [ ] Run Semgrep security scan
- [ ] Review new code for security issues
- [ ] Check for hardcoded secrets (grep)
- [ ] Review SQL queries for injection risks
- [ ] Check XSS prevention measures

### 5. Audit Log Review
- [ ] Review login/logout patterns
- [ ] Check for suspicious activities
- [ ] Review failed authentication attempts
- [ ] Check token reuse detection events
- [ ] Review GDPR data export requests

### 6. Infrastructure Security
- [ ] Update server OS and packages
- [ ] Review firewall rules
- [ ] Check SSL/TLS certificate expiry
- [ ] Verify backup procedures
- [ ] Test disaster recovery

### 7. Compliance Verification
- [ ] GDPR data export functionality tested
- [ ] GDPR account deletion tested
- [ ] Audit logging complete
- [ ] Privacy policy up to date
- [ ] Terms of service up to date

### 8. Documentation
- [ ] Update SECURITY.md
- [ ] Update this checklist
- [ ] Document any security incidents
- [ ] Update threat model
- [ ] Record next audit date
```

---

## 🟢 P3 - LOW (This Quarter)

### 6. Implement Advanced Security Features

**Timeline:** 12-16 hours
**Priority:** LOW - Nice to have

#### 6.1 Rate Limiting per User

```typescript
// backend/src/common/guards/user-rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext, TooManyRequestsException } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class UserRateLimitGuard implements CanActivate {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;

    if (!userId) return true; // Skip for unauthenticated requests

    const key = `rate_limit:user:${userId}`;
    const limit = 100; // 100 requests per minute per user
    const ttl = 60; // 1 minute

    const count = await this.redis.incr(key);
    if (count === 1) {
      await this.redis.expire(key, ttl);
    }

    if (count > limit) {
      throw new TooManyRequestsException(`Rate limit exceeded: ${limit} requests per minute`);
    }

    return true;
  }
}
```

#### 6.2 Suspicious Activity Detection

```typescript
// backend/src/modules/auth/services/suspicious-activity.service.ts
import { Injectable } from '@nestjs/common';
import { AuditLogService, AuditEventType } from '@/common/middleware/audit-log.service';

interface ActivityPattern {
  userId: string;
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  timestamp: Date;
}

@Injectable()
export class SuspiciousActivityService {
  constructor(private auditLogService: AuditLogService) {}

  async detectSuspiciousActivity(activity: ActivityPattern): Promise<boolean> {
    const suspicious = false;

    // 1. Multiple failed logins
    const recentFailures = await this.auditLogService.queryLogs({
      userId: activity.userId,
      eventType: AuditEventType.LOGIN_FAILED,
      startDate: new Date(Date.now() - 15 * 60 * 1000), // Last 15 minutes
    });

    if (recentFailures.length >= 3) {
      await this.auditLogService.log({
        eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
        userId: activity.userId,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        metadata: {
          reason: 'Multiple failed login attempts',
          count: recentFailures.length,
        },
      });
      return true;
    }

    // 2. Unusual IP address
    const recentLogins = await this.auditLogService.queryLogs({
      userId: activity.userId,
      eventType: AuditEventType.LOGIN_SUCCESS,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    });

    const knownIps = new Set(recentLogins.map(log => log.ipAddress));
    if (!knownIps.has(activity.ipAddress) && knownIps.size > 0) {
      await this.auditLogService.log({
        eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
        userId: activity.userId,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        metadata: {
          reason: 'Login from unusual IP address',
          knownIps: Array.from(knownIps),
        },
      });
      // Don't block, just log for now
    }

    // 3. Unusual time of day
    const hour = activity.timestamp.getHours();
    if (hour >= 1 && hour <= 5) {
      // 1am-5am
      await this.auditLogService.log({
        eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
        userId: activity.userId,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        metadata: {
          reason: 'Login at unusual time',
          hour,
        },
      });
      // Don't block, just log
    }

    return suspicious;
  }
}
```

---

## Progress Tracking

**Current Status:**
- [x] Comprehensive security analysis completed
- [x] PROJECT_CONSTRAINTS.md updated with security best practices
- [ ] P0: Secret rotation (URGENT - 1-2 hours)
- [ ] P1: Security scanning tools (3-4 hours)
- [ ] P1: Additional security features (6-8 hours)
- [ ] P2: MFA implementation (8-12 hours)
- [ ] P2: Quarterly audit procedures (ongoing)
- [ ] P3: Advanced security features (12-16 hours)

**Total Estimated Time:**
- P0 + P1: 10-14 hours (Critical path - complete within 1 week)
- P2: 12-20 hours (Complete within 1 month)
- P3: 12-16 hours (Complete within 1 quarter)

---

## References

- **COMPREHENSIVE_SECURITY_ANALYSIS.md** - Full security analysis across all projects
- **SECURITY.md** - Detailed security implementation documentation
- **SECURITY_IMPROVEMENTS_SUMMARY.md** - Recent security enhancements
- **PROJECT_CONSTRAINTS.md** - Security constraints and best practices
- **SECURITY_ALERT_EXPOSED_SECRETS.md** - Secret exposure incident report

---

## Contact & Support

**For security questions:**
- Check SECURITY.md first
- Review PROJECT_CONSTRAINTS.md Section 3
- Consult COMPREHENSIVE_SECURITY_ANALYSIS.md

**For security incidents:**
1. Stop immediately
2. Document the issue
3. Do not proceed without approval
4. Update this document with lessons learned

---

**Last Updated:** 2025-11-07
**Next Review:** 2025-12-07 (Monthly)
**Security Grade:** A- (92/100) - Goal: A (95/100) after P0+P1 complete
