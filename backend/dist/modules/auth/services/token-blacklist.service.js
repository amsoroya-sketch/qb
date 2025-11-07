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
exports.TokenBlacklistService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const crypto = require("crypto");
let TokenBlacklistService = class TokenBlacklistService {
    constructor(config) {
        this.config = config;
        this.redis = new ioredis_1.default({
            host: this.config.get('REDIS_HOST', 'localhost'),
            port: this.config.get('REDIS_PORT', 6379),
            password: this.config.get('REDIS_PASSWORD') || undefined,
            db: 1,
        });
    }
    async blacklistToken(token, expiresIn) {
        const key = this.getBlacklistKey(token);
        await this.redis.setex(key, expiresIn, 'blacklisted');
    }
    async isBlacklisted(token) {
        const key = this.getBlacklistKey(token);
        const result = await this.redis.get(key);
        return result === 'blacklisted';
    }
    async removeFromBlacklist(token) {
        const key = this.getBlacklistKey(token);
        await this.redis.del(key);
    }
    async blacklistAllUserTokens(userId, expiresIn = 604800) {
        const key = this.getUserBlacklistKey(userId);
        await this.redis.setex(key, expiresIn, 'all_blacklisted');
    }
    async areAllUserTokensBlacklisted(userId) {
        const key = this.getUserBlacklistKey(userId);
        const result = await this.redis.get(key);
        return result === 'all_blacklisted';
    }
    async clearUserBlacklist(userId) {
        const key = this.getUserBlacklistKey(userId);
        await this.redis.del(key);
    }
    async getBlacklistStats() {
        const tokenKeys = await this.redis.keys('blacklist:token:*');
        const userKeys = await this.redis.keys('blacklist:user:*');
        return {
            totalBlacklisted: tokenKeys.length,
            userBlacklisted: userKeys.length,
        };
    }
    getBlacklistKey(token) {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        return `blacklist:token:${tokenHash}`;
    }
    getUserBlacklistKey(userId) {
        return `blacklist:user:${userId}`;
    }
    async onModuleDestroy() {
        await this.redis.quit();
    }
};
exports.TokenBlacklistService = TokenBlacklistService;
exports.TokenBlacklistService = TokenBlacklistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TokenBlacklistService);
//# sourceMappingURL=token-blacklist.service.js.map