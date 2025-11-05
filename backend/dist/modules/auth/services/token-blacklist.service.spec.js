"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const token_blacklist_service_1 = require("./token-blacklist.service");
jest.mock('ioredis', () => {
    return {
        default: jest.fn().mockImplementation(() => ({
            setex: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
            keys: jest.fn(),
            quit: jest.fn(),
        })),
    };
});
describe('TokenBlacklistService', () => {
    let service;
    let redis;
    const mockConfigService = {
        get: jest.fn((key, defaultValue) => {
            const config = {
                REDIS_HOST: 'localhost',
                REDIS_PORT: 6379,
            };
            return config[key] ?? defaultValue;
        }),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                token_blacklist_service_1.TokenBlacklistService,
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(token_blacklist_service_1.TokenBlacklistService);
        redis = service.redis;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('blacklistToken', () => {
        it('should add token to blacklist with expiration', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistToken('test-jwt-token', 3600);
            expect(redis.setex).toHaveBeenCalledWith(expect.any(String), 3600, 'blacklisted');
        });
        it('should hash token before storing', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistToken('sensitive-token', 3600);
            const callArg = redis.setex.mock.calls[0][0];
            expect(callArg).not.toContain('sensitive-token');
            expect(callArg).toContain('blacklist:token:');
            expect(callArg).toMatch(/^blacklist:token:[a-f0-9]{64}$/);
        });
        it('should use TTL matching token natural expiration', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistToken('token', 7200);
            expect(redis.setex).toHaveBeenCalledWith(expect.any(String), 7200, 'blacklisted');
        });
        it('should store blacklisted status', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistToken('token', 3600);
            const callArg = redis.setex.mock.calls[0][2];
            expect(callArg).toBe('blacklisted');
        });
    });
    describe('isBlacklisted', () => {
        it('should return true if token is blacklisted', async () => {
            redis.get.mockResolvedValue('blacklisted');
            const result = await service.isBlacklisted('blacklisted-token');
            expect(result).toBe(true);
            expect(redis.get).toHaveBeenCalledWith(expect.any(String));
        });
        it('should return false if token is not blacklisted', async () => {
            redis.get.mockResolvedValue(null);
            const result = await service.isBlacklisted('valid-token');
            expect(result).toBe(false);
        });
        it('should return false if Redis returns unexpected value', async () => {
            redis.get.mockResolvedValue('some-other-value');
            const result = await service.isBlacklisted('token');
            expect(result).toBe(false);
        });
        it('should hash token before checking', async () => {
            redis.get.mockResolvedValue(null);
            await service.isBlacklisted('check-this-token');
            const callArg = redis.get.mock.calls[0][0];
            expect(callArg).not.toContain('check-this-token');
            expect(callArg).toContain('blacklist:token:');
        });
    });
    describe('removeFromBlacklist', () => {
        it('should remove token from blacklist', async () => {
            redis.del.mockResolvedValue(1);
            await service.removeFromBlacklist('token-to-remove');
            expect(redis.del).toHaveBeenCalledWith(expect.any(String));
        });
        it('should hash token before removing', async () => {
            redis.del.mockResolvedValue(1);
            await service.removeFromBlacklist('remove-token');
            const callArg = redis.del.mock.calls[0][0];
            expect(callArg).not.toContain('remove-token');
            expect(callArg).toContain('blacklist:token:');
        });
        it('should work even if token was not blacklisted', async () => {
            redis.del.mockResolvedValue(0);
            await expect(service.removeFromBlacklist('non-existent-token')).resolves.not.toThrow();
        });
    });
    describe('blacklistAllUserTokens', () => {
        it('should blacklist all tokens for a user', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistAllUserTokens('user-123', 604800);
            expect(redis.setex).toHaveBeenCalledWith('blacklist:user:user-123', 604800, 'all_blacklisted');
        });
        it('should use default expiration if not provided', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistAllUserTokens('user-123');
            expect(redis.setex).toHaveBeenCalledWith('blacklist:user:user-123', 604800, 'all_blacklisted');
        });
        it('should use custom expiration when provided', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistAllUserTokens('user-123', 86400);
            expect(redis.setex).toHaveBeenCalledWith('blacklist:user:user-123', 86400, 'all_blacklisted');
        });
        it('should store all_blacklisted status', async () => {
            redis.setex.mockResolvedValue('OK');
            await service.blacklistAllUserTokens('user-123', 604800);
            const callArg = redis.setex.mock.calls[0][2];
            expect(callArg).toBe('all_blacklisted');
        });
    });
    describe('areAllUserTokensBlacklisted', () => {
        it('should return true if all user tokens are blacklisted', async () => {
            redis.get.mockResolvedValue('all_blacklisted');
            const result = await service.areAllUserTokensBlacklisted('user-123');
            expect(result).toBe(true);
            expect(redis.get).toHaveBeenCalledWith('blacklist:user:user-123');
        });
        it('should return false if user tokens are not blacklisted', async () => {
            redis.get.mockResolvedValue(null);
            const result = await service.areAllUserTokensBlacklisted('user-456');
            expect(result).toBe(false);
        });
        it('should return false if Redis returns unexpected value', async () => {
            redis.get.mockResolvedValue('some-other-value');
            const result = await service.areAllUserTokensBlacklisted('user-789');
            expect(result).toBe(false);
        });
    });
    describe('clearUserBlacklist', () => {
        it('should clear user-wide blacklist', async () => {
            redis.del.mockResolvedValue(1);
            await service.clearUserBlacklist('user-123');
            expect(redis.del).toHaveBeenCalledWith('blacklist:user:user-123');
        });
        it('should work even if user blacklist did not exist', async () => {
            redis.del.mockResolvedValue(0);
            await expect(service.clearUserBlacklist('user-456')).resolves.not.toThrow();
        });
    });
    describe('getBlacklistStats', () => {
        it('should return blacklist statistics', async () => {
            redis.keys
                .mockResolvedValueOnce([
                'blacklist:token:hash1',
                'blacklist:token:hash2',
                'blacklist:token:hash3',
            ])
                .mockResolvedValueOnce(['blacklist:user:user1', 'blacklist:user:user2']);
            const result = await service.getBlacklistStats();
            expect(result.totalBlacklisted).toBe(3);
            expect(result.userBlacklisted).toBe(2);
            expect(redis.keys).toHaveBeenCalledWith('blacklist:token:*');
            expect(redis.keys).toHaveBeenCalledWith('blacklist:user:*');
        });
        it('should return zero counts when no blacklisted entries', async () => {
            redis.keys
                .mockResolvedValueOnce([])
                .mockResolvedValueOnce([]);
            const result = await service.getBlacklistStats();
            expect(result.totalBlacklisted).toBe(0);
            expect(result.userBlacklisted).toBe(0);
        });
        it('should call keys with correct patterns', async () => {
            redis.keys.mockResolvedValue([]);
            await service.getBlacklistStats();
            expect(redis.keys).toHaveBeenNthCalledWith(1, 'blacklist:token:*');
            expect(redis.keys).toHaveBeenNthCalledWith(2, 'blacklist:user:*');
        });
    });
    describe('key generation', () => {
        it('should generate consistent keys for same token', async () => {
            redis.get.mockResolvedValue(null);
            await service.isBlacklisted('same-token');
            const firstKey = redis.get.mock.calls[0][0];
            await service.isBlacklisted('same-token');
            const secondKey = redis.get.mock.calls[1][0];
            expect(firstKey).toBe(secondKey);
        });
        it('should generate different keys for different tokens', async () => {
            redis.get.mockResolvedValue(null);
            await service.isBlacklisted('token-1');
            const key1 = redis.get.mock.calls[0][0];
            await service.isBlacklisted('token-2');
            const key2 = redis.get.mock.calls[1][0];
            expect(key1).not.toBe(key2);
        });
        it('should use SHA-256 hash for token keys', async () => {
            redis.get.mockResolvedValue(null);
            await service.isBlacklisted('test-token');
            const callArg = redis.get.mock.calls[0][0];
            const hashPart = callArg.replace('blacklist:token:', '');
            expect(hashPart).toMatch(/^[a-f0-9]{64}$/);
        });
        it('should use user ID directly for user blacklist keys', async () => {
            redis.get.mockResolvedValue(null);
            await service.areAllUserTokensBlacklisted('user-123');
            expect(redis.get).toHaveBeenCalledWith('blacklist:user:user-123');
        });
    });
    describe('onModuleDestroy', () => {
        it('should quit Redis connection on destroy', async () => {
            redis.quit.mockResolvedValue('OK');
            await service.onModuleDestroy();
            expect(redis.quit).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=token-blacklist.service.spec.js.map