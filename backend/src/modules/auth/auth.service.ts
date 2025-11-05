import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { AccountLockoutService } from './services/account-lockout.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditLogService } from '../../common/middleware/audit-log.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private tokenBlacklist: TokenBlacklistService,
    private accountLockout: AccountLockoutService,
    private refreshTokenService: RefreshTokenService,
    private auditLog: AuditLogService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user exists
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user with progress
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        role: 'STUDENT',
        progress: {
          create: {
            currentXP: 0,
            currentLevel: 1,
            currentStreak: 0,
          },
        },
      },
      include: {
        progress: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto, ipAddress?: string) {
    // Create identifier for lockout tracking (combine email + IP for better security)
    const identifier = ipAddress ? `${dto.email}:${ipAddress}` : dto.email;

    // Check if account is locked
    const lockoutStatus = await this.accountLockout.isLocked(identifier);
    if (lockoutStatus.isLocked) {
      const minutesRemaining = lockoutStatus.lockoutExpiresAt
        ? Math.ceil((lockoutStatus.lockoutExpiresAt.getTime() - Date.now()) / 60000)
        : 0;

      throw new UnauthorizedException(
        `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes.`,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        progress: true,
      },
    });

    if (!user) {
      // Record failed attempt for non-existent user (prevent user enumeration timing attacks)
      await this.accountLockout.recordFailedAttempt(identifier);

      // Audit log failed login
      await this.auditLog.logLoginFailed(dto.email, ipAddress, undefined, 'User not found');

      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      // Record failed attempt
      const status = await this.accountLockout.recordFailedAttempt(identifier);

      // Audit log failed login
      await this.auditLog.logLoginFailed(dto.email, ipAddress, undefined, 'Invalid password');

      if (status.isLocked) {
        const minutesRemaining = status.lockoutExpiresAt
          ? Math.ceil((status.lockoutExpiresAt.getTime() - Date.now()) / 60000)
          : 0;

        // Audit log account lockout
        await this.auditLog.logAccountLocked(identifier, ipAddress, status.totalAttempts);

        throw new UnauthorizedException(
          `Account locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes.`,
        );
      }

      // Inform user of remaining attempts (security best practice)
      const attemptsMsg = status.attemptsRemaining
        ? ` ${status.attemptsRemaining} attempt(s) remaining before account lockout.`
        : '';

      throw new UnauthorizedException(`Invalid credentials.${attemptsMsg}`);
    }

    // Successful login - reset failed attempts counter
    await this.accountLockout.resetAttempts(identifier);

    // Audit log successful login
    await this.auditLog.logLoginSuccess(user.id, ipAddress);

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    // Validate and mark old token as used
    const validationResult = await this.refreshTokenService.validateAndRotateToken(refreshToken);

    // Generate new token pair with same family ID (rotation)
    const tokens = await this.generateTokens(
      validationResult.userId,
      validationResult.email,
      validationResult.role,
      validationResult.familyId, // Maintain family for rotation tracking
    );

    return tokens;
  }

  private async generateTokens(userId: string, email: string, role: string, familyId?: string) {
    // Generate access token (short-lived)
    const accessToken = this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_EXPIRATION', '15m'),
      },
    );

    // Generate and store refresh token with rotation support
    const { refreshToken, familyId: tokenFamilyId } =
      await this.refreshTokenService.createRefreshToken(userId, email, role, familyId);

    return { accessToken, refreshToken, familyId: tokenFamilyId };
  }

  private sanitizeUser(user: any) {
    const { password: _password, ...sanitized } = user;
    return sanitized;
  }

  async logout(token: string): Promise<void> {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Decode token to get expiration time
      const decoded = this.jwtService.decode(token) as any;

      if (!decoded || !decoded.exp) {
        throw new UnauthorizedException('Invalid token');
      }

      // Calculate remaining time until token expires
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

      if (expiresIn > 0) {
        // Add token to blacklist
        await this.tokenBlacklist.blacklistToken(token, expiresIn);
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto, ipAddress?: string): Promise<void> {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Verify new password is different from current
    const samePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (samePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens (database-stored)
    await this.refreshTokenService.revokeAllUserTokens(userId);

    // Blacklist all access tokens (Redis-stored) - force re-login
    // Tokens expire in max 7 days (refresh token lifetime)
    await this.tokenBlacklist.blacklistAllUserTokens(userId, 604800);

    // Audit log password change
    await this.auditLog.logPasswordChange(userId, ipAddress);
  }
}
