import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',

  // Password events
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  PASSWORD_RESET = 'PASSWORD_RESET',

  // Token events
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  TOKEN_REUSE_DETECTED = 'TOKEN_REUSE_DETECTED',
  TOKEN_REVOKED = 'TOKEN_REVOKED',

  // Account lockout events
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',

  // Authorization events
  ACCESS_DENIED = 'ACCESS_DENIED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',

  // GDPR events
  DATA_EXPORT_REQUESTED = 'DATA_EXPORT_REQUESTED',
  ACCOUNT_DELETED = 'ACCOUNT_DELETED',

  // Data access events
  SENSITIVE_DATA_ACCESSED = 'SENSITIVE_DATA_ACCESSED',
  ADMIN_ACTION = 'ADMIN_ACTION',

  // Security events
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface AuditLogEntry {
  eventType: AuditEventType;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log a security audit event
   * @param entry - Audit log entry
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      // If userId is provided, use userEvent table (linked to user)
      if (entry.userId) {
        await this.prisma.userEvent.create({
          data: {
            userId: entry.userId,
            eventType: entry.eventType,
            timestamp: new Date(),
            metadata: {
              ipAddress: entry.ipAddress,
              userAgent: entry.userAgent,
              endpoint: entry.endpoint,
              method: entry.method,
              statusCode: entry.statusCode,
              errorMessage: entry.errorMessage,
              ...entry.metadata,
            },
          },
        });
      } else {
        // For anonymous events (e.g., failed login attempts before user identified)
        // We could create a separate AuditLog table or use a generic logging service
        // For now, log to console in production you'd use a proper logging service
        console.log('[AUDIT]', {
          ...entry,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      // Never let audit logging failures break the application
      console.error('[AUDIT LOG ERROR]', error);
    }
  }

  /**
   * Log authentication success
   */
  async logLoginSuccess(userId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      eventType: AuditEventType.LOGIN_SUCCESS,
      userId,
      ipAddress,
      userAgent,
    });
  }

  /**
   * Log authentication failure
   */
  async logLoginFailed(
    email: string,
    ipAddress?: string,
    userAgent?: string,
    reason?: string,
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.LOGIN_FAILED,
      ipAddress,
      userAgent,
      metadata: { email, reason },
    });
  }

  /**
   * Log logout
   */
  async logLogout(userId: string, ipAddress?: string): Promise<void> {
    await this.log({
      eventType: AuditEventType.LOGOUT,
      userId,
      ipAddress,
    });
  }

  /**
   * Log password change
   */
  async logPasswordChange(userId: string, ipAddress?: string): Promise<void> {
    await this.log({
      eventType: AuditEventType.PASSWORD_CHANGE,
      userId,
      ipAddress,
    });
  }

  /**
   * Log token reuse detection (security incident)
   */
  async logTokenReuseDetected(userId: string, familyId: string, ipAddress?: string): Promise<void> {
    await this.log({
      eventType: AuditEventType.TOKEN_REUSE_DETECTED,
      userId,
      ipAddress,
      metadata: {
        familyId,
        severity: 'HIGH',
        description: 'Potential security breach: refresh token reused',
      },
    });
  }

  /**
   * Log account lockout
   */
  async logAccountLocked(
    identifier: string,
    ipAddress?: string,
    attemptsCount?: number,
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.ACCOUNT_LOCKED,
      ipAddress,
      metadata: {
        identifier,
        attemptsCount,
        severity: 'MEDIUM',
      },
    });
  }

  /**
   * Log GDPR data export request
   */
  async logDataExport(userId: string, ipAddress?: string): Promise<void> {
    await this.log({
      eventType: AuditEventType.DATA_EXPORT_REQUESTED,
      userId,
      ipAddress,
      metadata: {
        compliance: 'GDPR Article 20',
      },
    });
  }

  /**
   * Log account deletion
   */
  async logAccountDeletion(userId: string, email: string, ipAddress?: string): Promise<void> {
    await this.log({
      eventType: AuditEventType.ACCOUNT_DELETED,
      userId,
      ipAddress,
      metadata: {
        email,
        compliance: 'GDPR Article 17',
        severity: 'HIGH',
      },
    });
  }

  /**
   * Log access denial
   */
  async logAccessDenied(
    userId: string | undefined,
    endpoint: string,
    method: string,
    ipAddress?: string,
    reason?: string,
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.ACCESS_DENIED,
      userId,
      endpoint,
      method,
      ipAddress,
      metadata: { reason },
    });
  }

  /**
   * Log rate limit exceeded
   */
  async logRateLimitExceeded(
    userId: string | undefined,
    endpoint: string,
    ipAddress?: string,
  ): Promise<void> {
    await this.log({
      eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
      userId,
      endpoint,
      ipAddress,
      metadata: {
        severity: 'LOW',
      },
    });
  }

  /**
   * Query audit logs for security analysis
   * @param filters - Filter criteria
   * @param limit - Maximum number of results
   */
  async queryLogs(
    filters: {
      userId?: string;
      eventType?: AuditEventType;
      startDate?: Date;
      endDate?: Date;
      ipAddress?: string;
    },
    limit: number = 100,
  ): Promise<any[]> {
    const where: any = {};

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.eventType) {
      where.eventType = filters.eventType;
    }

    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) {
        where.timestamp.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.timestamp.lte = filters.endDate;
      }
    }

    const logs = await this.prisma.userEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    // Filter by IP if provided (stored in metadata)
    if (filters.ipAddress) {
      return logs.filter((log: any) => log.metadata?.ipAddress === filters.ipAddress);
    }

    return logs;
  }

  /**
   * Get security summary for a user
   */
  async getUserSecuritySummary(userId: string): Promise<{
    totalEvents: number;
    loginSuccessCount: number;
    loginFailedCount: number;
    passwordChanges: number;
    suspiciousEvents: number;
    lastLogin?: Date;
  }> {
    const events = await this.prisma.userEvent.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });

    const summary = {
      totalEvents: events.length,
      loginSuccessCount: events.filter((e) => e.eventType === AuditEventType.LOGIN_SUCCESS).length,
      loginFailedCount: events.filter((e) => e.eventType === AuditEventType.LOGIN_FAILED).length,
      passwordChanges: events.filter((e) => e.eventType === AuditEventType.PASSWORD_CHANGE).length,
      suspiciousEvents: events.filter(
        (e) =>
          e.eventType === AuditEventType.TOKEN_REUSE_DETECTED ||
          e.eventType === AuditEventType.ACCOUNT_LOCKED ||
          e.eventType === AuditEventType.SUSPICIOUS_ACTIVITY,
      ).length,
      lastLogin: events.find((e) => e.eventType === AuditEventType.LOGIN_SUCCESS)?.timestamp,
    };

    return summary;
  }
}
