import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import * as crypto from 'crypto';

export interface RefreshTokenPayload {
  refreshToken: string;
  accessToken: string;
}

export interface TokenValidationResult {
  userId: string;
  email: string;
  role: string;
  familyId: string;
}

@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Create and store a new refresh token
   * @param userId - User ID
   * @param email - User email
   * @param role - User role
   * @param familyId - Token family ID (for first token, generate new; for rotation, use existing)
   * @returns Refresh token string
   */
  async createRefreshToken(
    userId: string,
    email: string,
    role: string,
    familyId?: string,
  ): Promise<{ refreshToken: string; familyId: string }> {
    // Generate new family ID if not provided (first token in family)
    const tokenFamilyId = familyId || crypto.randomUUID();

    // Generate JWT refresh token
    const refreshToken = this.jwtService.sign(
      { sub: userId, email, role, familyId: tokenFamilyId },
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRATION', '7d'),
      },
    );

    // Hash token for storage (never store raw tokens)
    const tokenHash = this.hashToken(refreshToken);

    // Calculate expiration time
    const expiresIn = this.config.get('JWT_REFRESH_EXPIRATION', '7d');
    const expiresAt = this.calculateExpiration(expiresIn);

    // Store in database
    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        familyId: tokenFamilyId,
        expiresAt,
      },
    });

    return { refreshToken, familyId: tokenFamilyId };
  }

  /**
   * Validate and rotate refresh token
   * @param token - Refresh token to validate
   * @returns New token pair (access + refresh)
   * @throws UnauthorizedException if token is invalid, expired, or reused
   */
  async validateAndRotateToken(token: string): Promise<TokenValidationResult> {
    try {
      // Verify JWT signature and expiration
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _payload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const tokenHash = this.hashToken(token);

      // Look up token in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if token has expired
      if (storedToken.expiresAt < new Date()) {
        await this.revokeToken(tokenHash);
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Check if token is revoked
      if (storedToken.isRevoked) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      // CRITICAL: Detect token reuse attack
      if (storedToken.isUsed) {
        // Token reuse detected - revoke entire token family
        await this.revokeTokenFamily(storedToken.familyId);
        throw new UnauthorizedException(
          'Token reuse detected. All tokens in this family have been revoked for security.',
        );
      }

      // Mark token as used (it can't be used again)
      await this.prisma.refreshToken.update({
        where: { tokenHash },
        data: {
          isUsed: true,
          usedAt: new Date(),
        },
      });

      // Return validation result
      return {
        userId: storedToken.userId,
        email: storedToken.user.email,
        role: storedToken.user.role,
        familyId: storedToken.familyId,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Revoke a single refresh token
   * @param tokenHash - Hash of the token to revoke
   */
  async revokeToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Revoke all tokens in a token family (used when reuse is detected)
   * @param familyId - Family ID to revoke
   */
  async revokeTokenFamily(familyId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { familyId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Revoke all refresh tokens for a user
   * @param userId - User ID
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Clean up expired tokens (should be run periodically via cron)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Get active token count for a user
   * @param userId - User ID
   * @returns Number of active (non-revoked, non-expired) tokens
   */
  async getActiveTokenCount(userId: string): Promise<number> {
    return this.prisma.refreshToken.count({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  /**
   * Hash a token using SHA-256
   * @param token - Token to hash
   * @returns Hex-encoded hash
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Calculate expiration timestamp from duration string
   * @param duration - Duration string (e.g., "7d", "24h")
   * @returns Expiration date
   */
  private calculateExpiration(duration: string): Date {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const now = new Date();
    switch (unit) {
      case 'd':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'm':
        return new Date(now.getTime() + value * 60 * 1000);
      case 's':
        return new Date(now.getTime() + value * 1000);
      default:
        throw new Error(`Unknown duration unit: ${unit}`);
    }
  }
}
