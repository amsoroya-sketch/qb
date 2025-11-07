"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountLockoutService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const crypto = require("crypto");
let AccountLockoutService = class AccountLockoutService {
    constructor(config) {
        this.config = config;
        this.redis = new ioredis_1.default({
            host: this.config.get('REDIS_HOST', 'localhost'),
            port: this.config.get('REDIS_PORT', 6379),
            password: this.config.get('REDIS_PASSWORD') || undefined,
            db: 2,
        });
        this.MAX_ATTEMPTS = this.config.get('LOCKOUT_MAX_ATTEMPTS', 5);
        this.LOCKOUT_DURATION = this.config.get('LOCKOUT_DURATION', 900);
        this.ATTEMPT_WINDOW = this.config.get('LOCKOUT_ATTEMPT_WINDOW', 900);
    }
    async recordFailedAttempt(identifier) {
        const key = this.getAttemptsKey(identifier);
        const lockKey = this.getLockKey(identifier);
        const isCurrentlyLocked = await this.isLocked(identifier);
        if (isCurrentlyLocked.isLocked) {
            return isCurrentlyLocked;
        }
        const attempts = await this.redis.incr(key);
        if (attempts === 1) {
            await this.redis.expire(key, this.ATTEMPT_WINDOW);
        }
        if (attempts >= this.MAX_ATTEMPTS) {
            await this.redis.setex(lockKey, this.LOCKOUT_DURATION, 'locked');
            await this.redis.del(key);
            const lockoutExpiresAt = new Date(Date.now() + this.LOCKOUT_DURATION * 1000);
            return {
                isLocked: true,
                totalAttempts: attempts,
                lockoutExpiresAt,
            };
        }
        return {
            isLocked: false,
            attemptsRemaining: this.MAX_ATTEMPTS - attempts,
            totalAttempts: attempts,
        };
    }
    async isLocked(identifier) {
        const lockKey = this.getLockKey(identifier);
        const ttl = await this.redis.ttl(lockKey);
        if (ttl > 0) {
            const lockoutExpiresAt = new Date(Date.now() + ttl * 1000);
            return {
                isLocked: true,
                lockoutExpiresAt,
            };
        }
        const attemptsKey = this.getAttemptsKey(identifier);
        const attempts = await this.redis.get(attemptsKey);
        const totalAttempts = attempts ? parseInt(attempts, 10) : 0;
        return {
            isLocked: false,
            attemptsRemaining: this.MAX_ATTEMPTS - totalAttempts,
            totalAttempts,
        };
    }
    async resetAttempts(identifier) {
        const key = this.getAttemptsKey(identifier);
        await this.redis.del(key);
    }
    async unlockAccount(identifier) {
        const lockKey = this.getLockKey(identifier);
        const attemptsKey = this.getAttemptsKey(identifier);
        await this.redis.del(lockKey);
        await this.redis.del(attemptsKey);
    }
    async getLockoutInfo(identifier) {
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
    async getGlobalStats() {
        const lockKeys = await this.redis.keys('lockout:lock:*');
        const attemptKeys = await this.redis.keys('lockout:attempts:*');
        return {
            totalLockedAccounts: lockKeys.length,
            totalAccountsWithAttempts: attemptKeys.length,
        };
    }
    getAttemptsKey(identifier) {
        const hash = crypto.createHash('sha256').update(identifier).digest('hex');
        return `lockout:attempts:${hash}`;
    }
    getLockKey(identifier) {
        const hash = crypto.createHash('sha256').update(identifier).digest('hex');
        return `lockout:lock:${hash}`;
    }
    async onModuleDestroy() {
        await this.redis.quit();
    }
};
exports.AccountLockoutService = AccountLockoutService;
exports.AccountLockoutService = AccountLockoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AccountLockoutService);
//# sourceMappingURL=account-lockout.service.js.map