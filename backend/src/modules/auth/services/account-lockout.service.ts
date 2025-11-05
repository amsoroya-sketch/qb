import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface LockoutStatus {
  isLocked: boolean;
  attemptsRemaining?: number;
  lockoutExpiresAt?: Date;
  totalAttempts?: number;
}

@Injectable()
export class AccountLockoutService {
  private redis: Redis;
  private readonly MAX_ATTEMPTS: number;
  private readonly LOCKOUT_DURATION: number; // seconds
  private readonly ATTEMPT_WINDOW: number; // seconds

  constructor(private config: ConfigService) {
    // Initialize Redis client
    this.redis = new Redis({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get('REDIS_PORT', 6379),
      password: this.config.get('REDIS_PASSWORD') || undefined,
      db: 2, // Use separate DB for account lockout
    });

    // Configurable thresholds
    this.MAX_ATTEMPTS = this.config.get('LOCKOUT_MAX_ATTEMPTS', 5);
    this.LOCKOUT_DURATION = this.config.get('LOCKOUT_DURATION', 900); // 15 minutes
    this.ATTEMPT_WINDOW = this.config.get('LOCKOUT_ATTEMPT_WINDOW', 900); // 15 minutes
  }

  /**
   * Record a failed login attempt
   * @param identifier - Email or IP address
   * @returns LockoutStatus indicating if account is now locked
   */
  async recordFailedAttempt(identifier: string): Promise<LockoutStatus> {
    const key = this.getAttemptsKey(identifier);
    const lockKey = this.getLockKey(identifier);

    // Check if already locked
    const isCurrentlyLocked = await this.isLocked(identifier);
    if (isCurrentlyLocked.isLocked) {
      return isCurrentlyLocked;
    }

    // Increment failed attempts counter
    const attempts = await this.redis.incr(key);

    // Set expiration on first attempt (sliding window)
    if (attempts === 1) {
      await this.redis.expire(key, this.ATTEMPT_WINDOW);
    }

    // Lock account if threshold exceeded
    if (attempts >= this.MAX_ATTEMPTS) {
      await this.redis.setex(lockKey, this.LOCKOUT_DURATION, 'locked');

      // Clear attempts counter (will start fresh after lockout expires)
      await this.redis.del(key);

      const lockoutExpiresAt = new Date(Date.now() + this.LOCKOUT_DURATION * 1000);

      return {
        isLocked: true,
        totalAttempts: attempts,
        lockoutExpiresAt,
      };
    }

    // Return status with attempts remaining
    return {
      isLocked: false,
      attemptsRemaining: this.MAX_ATTEMPTS - attempts,
      totalAttempts: attempts,
    };
  }

  /**
   * Check if an account is currently locked
   * @param identifier - Email or IP address
   * @returns LockoutStatus
   */
  async isLocked(identifier: string): Promise<LockoutStatus> {
    const lockKey = this.getLockKey(identifier);
    const ttl = await this.redis.ttl(lockKey);

    if (ttl > 0) {
      const lockoutExpiresAt = new Date(Date.now() + ttl * 1000);

      return {
        isLocked: true,
        lockoutExpiresAt,
      };
    }

    // Not locked - check current attempts
    const attemptsKey = this.getAttemptsKey(identifier);
    const attempts = await this.redis.get(attemptsKey);
    const totalAttempts = attempts ? parseInt(attempts, 10) : 0;

    return {
      isLocked: false,
      attemptsRemaining: this.MAX_ATTEMPTS - totalAttempts,
      totalAttempts,
    };
  }

  /**
   * Reset failed attempts counter (called on successful login)
   * @param identifier - Email or IP address
   */
  async resetAttempts(identifier: string): Promise<void> {
    const key = this.getAttemptsKey(identifier);
    await this.redis.del(key);
  }

  /**
   * Manually unlock an account (admin action)
   * @param identifier - Email or IP address
   */
  async unlockAccount(identifier: string): Promise<void> {
    const lockKey = this.getLockKey(identifier);
    const attemptsKey = this.getAttemptsKey(identifier);

    await this.redis.del(lockKey);
    await this.redis.del(attemptsKey);
  }

  /**
   * Get lockout statistics for monitoring
   * @param identifier - Email or IP address
   * @returns Detailed lockout information
   */
  async getLockoutInfo(identifier: string): Promise<{
    isLocked: boolean;
    failedAttempts: number;
    attemptsRemaining: number;
    lockoutExpiresAt?: Date;
    maxAttempts: number;
    lockoutDurationMinutes: number;
  }> {
    const status = await this.isLocked(identifier);

    return {
      isLocked: status.isLocked,
      failedAttempts: status.totalAttempts || 0,
      attemptsRemaining: status.attemptsRemaining || this.MAX_ATTEMPTS,
      lockoutExpiresAt: status.lockoutExpiresAt,
      maxAttempts: this.MAX_ATTEMPTS,
      lockoutDurationMinutes: this.LOCKOUT_DURATION / 60,
    };
  }

  /**
   * Get global lockout statistics (for monitoring dashboard)
   */
  async getGlobalStats(): Promise<{
    totalLockedAccounts: number;
    totalAccountsWithAttempts: number;
  }> {
    const lockKeys = await this.redis.keys('lockout:lock:*');
    const attemptKeys = await this.redis.keys('lockout:attempts:*');

    return {
      totalLockedAccounts: lockKeys.length,
      totalAccountsWithAttempts: attemptKeys.length,
    };
  }

  /**
   * Generate Redis key for failed attempts counter
   */
  private getAttemptsKey(identifier: string): string {
    // Hash identifier for privacy
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(identifier).digest('hex');
    return `lockout:attempts:${hash}`;
  }

  /**
   * Generate Redis key for lockout flag
   */
  private getLockKey(identifier: string): string {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(identifier).digest('hex');
    return `lockout:lock:${hash}`;
  }

  /**
   * Cleanup method for graceful shutdown
   */
  async onModuleDestroy() {
    await this.redis.quit();
  }
}
