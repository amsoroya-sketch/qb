import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class TokenBlacklistService {
  private redis: Redis;

  constructor(private config: ConfigService) {
    // Initialize Redis client
    this.redis = new Redis({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get('REDIS_PORT', 6379),
      password: this.config.get('REDIS_PASSWORD') || undefined,
      db: 1, // Use separate DB for token blacklist
    });
  }

  /**
   * Add a token to the blacklist
   * @param token - JWT token to blacklist
   * @param expiresIn - Time in seconds until token naturally expires
   */
  async blacklistToken(token: string, expiresIn: number): Promise<void> {
    const key = this.getBlacklistKey(token);

    // Store in Redis with expiration matching token's natural expiration
    // This ensures blacklist entries are auto-cleaned
    await this.redis.setex(key, expiresIn, 'blacklisted');
  }

  /**
   * Check if a token is blacklisted
   * @param token - JWT token to check
   * @returns true if token is blacklisted, false otherwise
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const key = this.getBlacklistKey(token);
    const result = await this.redis.get(key);
    return result === 'blacklisted';
  }

  /**
   * Remove a token from blacklist (rarely needed, but available)
   * @param token - JWT token to remove from blacklist
   */
  async removeFromBlacklist(token: string): Promise<void> {
    const key = this.getBlacklistKey(token);
    await this.redis.del(key);
  }

  /**
   * Blacklist all tokens for a specific user
   * Used when user changes password or is compromised
   * @param userId - User ID whose tokens should be blacklisted
   * @param expiresIn - Time in seconds (use max token lifetime, e.g., 7 days)
   */
  async blacklistAllUserTokens(userId: string, expiresIn: number = 604800): Promise<void> {
    const key = this.getUserBlacklistKey(userId);

    // Mark all tokens for this user as invalid
    await this.redis.setex(key, expiresIn, 'all_blacklisted');
  }

  /**
   * Check if all tokens for a user are blacklisted
   * @param userId - User ID to check
   * @returns true if all user tokens are blacklisted
   */
  async areAllUserTokensBlacklisted(userId: string): Promise<boolean> {
    const key = this.getUserBlacklistKey(userId);
    const result = await this.redis.get(key);
    return result === 'all_blacklisted';
  }

  /**
   * Clear user-wide blacklist (e.g., after grace period)
   * @param userId - User ID to clear blacklist for
   */
  async clearUserBlacklist(userId: string): Promise<void> {
    const key = this.getUserBlacklistKey(userId);
    await this.redis.del(key);
  }

  /**
   * Get blacklist statistics (for monitoring)
   */
  async getBlacklistStats(): Promise<{ totalBlacklisted: number; userBlacklisted: number }> {
    const tokenKeys = await this.redis.keys('blacklist:token:*');
    const userKeys = await this.redis.keys('blacklist:user:*');

    return {
      totalBlacklisted: tokenKeys.length,
      userBlacklisted: userKeys.length,
    };
  }

  /**
   * Generate Redis key for token blacklist
   */
  private getBlacklistKey(token: string): string {
    // Hash token for privacy (don't store raw tokens in Redis)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    return `blacklist:token:${tokenHash}`;
  }

  /**
   * Generate Redis key for user-wide blacklist
   */
  private getUserBlacklistKey(userId: string): string {
    return `blacklist:user:${userId}`;
  }

  /**
   * Cleanup method for graceful shutdown
   */
  async onModuleDestroy() {
    await this.redis.quit();
  }
}
