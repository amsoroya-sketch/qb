import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AccountLockoutService } from './account-lockout.service';

// Mock ioredis
jest.mock('ioredis', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      incr: jest.fn(),
      expire: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      ttl: jest.fn(),
      get: jest.fn(),
      keys: jest.fn(),
      quit: jest.fn(),
    })),
  };
});

describe('AccountLockoutService', () => {
  let service: AccountLockoutService;
  let redis: any;

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: any) => {
      const config: Record<string, any> = {
        REDIS_HOST: 'localhost',
        REDIS_PORT: 6379,
        LOCKOUT_MAX_ATTEMPTS: 5,
        LOCKOUT_DURATION: 900, // 15 minutes
        LOCKOUT_ATTEMPT_WINDOW: 900,
      };
      return config[key] ?? defaultValue;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountLockoutService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AccountLockoutService>(AccountLockoutService);
    redis = (service as any).redis;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordFailedAttempt', () => {
    it('should increment failed attempts counter', async () => {
      redis.incr.mockResolvedValue(1);
      redis.expire.mockResolvedValue(1);
      redis.ttl.mockResolvedValue(-2); // Not locked

      const result = await service.recordFailedAttempt('test@example.com');

      expect(result.isLocked).toBe(false);
      expect(result.attemptsRemaining).toBe(4); // 5 max - 1 attempt
      expect(result.totalAttempts).toBe(1);
      expect(redis.incr).toHaveBeenCalled();
      expect(redis.expire).toHaveBeenCalled();
    });

    it('should set expiration on first attempt', async () => {
      redis.incr.mockResolvedValue(1);
      redis.expire.mockResolvedValue(1);
      redis.ttl.mockResolvedValue(-2);

      await service.recordFailedAttempt('test@example.com');

      expect(redis.expire).toHaveBeenCalledWith(expect.any(String), 900);
    });

    it('should not set expiration on subsequent attempts', async () => {
      redis.incr.mockResolvedValue(2); // Second attempt
      redis.ttl.mockResolvedValue(-2);

      await service.recordFailedAttempt('test@example.com');

      expect(redis.expire).not.toHaveBeenCalled();
    });

    it('should lock account after max attempts', async () => {
      redis.incr.mockResolvedValue(5); // 5th attempt
      redis.ttl.mockResolvedValue(-2);
      redis.setex.mockResolvedValue('OK');
      redis.del.mockResolvedValue(1);

      const result = await service.recordFailedAttempt('test@example.com');

      expect(result.isLocked).toBe(true);
      expect(result.totalAttempts).toBe(5);
      expect(result.lockoutExpiresAt).toBeInstanceOf(Date);
      expect(redis.setex).toHaveBeenCalledWith(expect.any(String), 900, 'locked');
      expect(redis.del).toHaveBeenCalled(); // Clear attempts counter
    });

    it('should return already locked status if currently locked', async () => {
      redis.ttl.mockResolvedValue(600); // 10 minutes remaining

      const result = await service.recordFailedAttempt('test@example.com');

      expect(result.isLocked).toBe(true);
      expect(redis.incr).not.toHaveBeenCalled(); // Should not increment
    });

    it('should calculate correct attempts remaining', async () => {
      redis.incr.mockResolvedValue(3);
      redis.ttl.mockResolvedValue(-2);

      const result = await service.recordFailedAttempt('test@example.com');

      expect(result.attemptsRemaining).toBe(2); // 5 - 3 = 2
    });
  });

  describe('isLocked', () => {
    it('should return locked status when account is locked', async () => {
      redis.ttl.mockResolvedValue(600); // 10 minutes remaining

      const result = await service.isLocked('test@example.com');

      expect(result.isLocked).toBe(true);
      expect(result.lockoutExpiresAt).toBeInstanceOf(Date);
    });

    it('should return not locked when TTL is -2 (key does not exist)', async () => {
      redis.ttl.mockResolvedValue(-2);
      redis.get.mockResolvedValue(null);

      const result = await service.isLocked('test@example.com');

      expect(result.isLocked).toBe(false);
      expect(result.attemptsRemaining).toBe(5);
      expect(result.totalAttempts).toBe(0);
    });

    it('should return not locked when TTL is -1 (key exists but no expiry)', async () => {
      redis.ttl.mockResolvedValue(-1);
      redis.get.mockResolvedValue('2');

      const result = await service.isLocked('test@example.com');

      expect(result.isLocked).toBe(false);
      expect(result.totalAttempts).toBe(2);
      expect(result.attemptsRemaining).toBe(3);
    });

    it('should include current attempts when not locked', async () => {
      redis.ttl.mockResolvedValue(-2);
      redis.get.mockResolvedValue('3');

      const result = await service.isLocked('test@example.com');

      expect(result.isLocked).toBe(false);
      expect(result.totalAttempts).toBe(3);
      expect(result.attemptsRemaining).toBe(2);
    });

    it('should calculate lockout expiration correctly', async () => {
      const ttlSeconds = 600;
      redis.ttl.mockResolvedValue(ttlSeconds);

      const beforeCall = Date.now();
      const result = await service.isLocked('test@example.com');
      const afterCall = Date.now();

      expect(result.lockoutExpiresAt).toBeInstanceOf(Date);
      const expiresAt = result.lockoutExpiresAt!.getTime();
      expect(expiresAt).toBeGreaterThanOrEqual(beforeCall + ttlSeconds * 1000);
      expect(expiresAt).toBeLessThanOrEqual(afterCall + ttlSeconds * 1000);
    });
  });

  describe('resetAttempts', () => {
    it('should delete failed attempts counter', async () => {
      redis.del.mockResolvedValue(1);

      await service.resetAttempts('test@example.com');

      expect(redis.del).toHaveBeenCalledWith(expect.any(String));
    });

    it('should work even if no attempts exist', async () => {
      redis.del.mockResolvedValue(0); // Key didn't exist

      await expect(service.resetAttempts('test@example.com')).resolves.not.toThrow();
    });
  });

  describe('unlockAccount', () => {
    it('should delete both lock and attempts keys', async () => {
      redis.del.mockResolvedValue(1);

      await service.unlockAccount('test@example.com');

      expect(redis.del).toHaveBeenCalledTimes(2); // Lock key and attempts key
    });

    it('should work even if account is not locked', async () => {
      redis.del.mockResolvedValue(0);

      await expect(service.unlockAccount('test@example.com')).resolves.not.toThrow();
    });
  });

  describe('getLockoutInfo', () => {
    it('should return detailed lockout information when locked', async () => {
      redis.ttl.mockResolvedValue(600);

      const result = await service.getLockoutInfo('test@example.com');

      expect(result.isLocked).toBe(true);
      expect(result.lockoutExpiresAt).toBeInstanceOf(Date);
      expect(result.maxAttempts).toBe(5);
      expect(result.lockoutDurationMinutes).toBe(15); // 900 seconds / 60
    });

    it('should return detailed information when not locked', async () => {
      redis.ttl.mockResolvedValue(-2);
      redis.get.mockResolvedValue('2');

      const result = await service.getLockoutInfo('test@example.com');

      expect(result.isLocked).toBe(false);
      expect(result.failedAttempts).toBe(2);
      expect(result.attemptsRemaining).toBe(3);
      expect(result.maxAttempts).toBe(5);
      expect(result.lockoutDurationMinutes).toBe(15);
    });

    it('should return zero failed attempts when no attempts recorded', async () => {
      redis.ttl.mockResolvedValue(-2);
      redis.get.mockResolvedValue(null);

      const result = await service.getLockoutInfo('test@example.com');

      expect(result.failedAttempts).toBe(0);
      expect(result.attemptsRemaining).toBe(5);
    });
  });

  describe('getGlobalStats', () => {
    it('should return global lockout statistics', async () => {
      redis.keys
        .mockResolvedValueOnce(['lockout:lock:hash1', 'lockout:lock:hash2']) // Locked accounts
        .mockResolvedValueOnce([
          'lockout:attempts:hash1',
          'lockout:attempts:hash2',
          'lockout:attempts:hash3',
        ]); // Accounts with attempts

      const result = await service.getGlobalStats();

      expect(result.totalLockedAccounts).toBe(2);
      expect(result.totalAccountsWithAttempts).toBe(3);
    });

    it('should handle no locked accounts', async () => {
      redis.keys
        .mockResolvedValueOnce([]) // No locked accounts
        .mockResolvedValueOnce([]); // No attempts

      const result = await service.getGlobalStats();

      expect(result.totalLockedAccounts).toBe(0);
      expect(result.totalAccountsWithAttempts).toBe(0);
    });
  });

  describe('key generation', () => {
    it('should use hashed identifier for privacy', async () => {
      const identifier = 'test@example.com';
      redis.ttl.mockResolvedValue(-2);
      redis.get.mockResolvedValue(null);

      await service.isLocked(identifier);

      // The key should be hashed, not contain the raw email
      const callArg = redis.ttl.mock.calls[0][0];
      expect(callArg).not.toContain('test@example.com');
      expect(callArg).toContain('lockout:lock:');
    });

    it('should generate consistent keys for same identifier', async () => {
      redis.ttl.mockResolvedValue(-2);
      redis.get.mockResolvedValue(null);

      await service.isLocked('test@example.com');
      const firstKey = redis.ttl.mock.calls[0][0];

      await service.isLocked('test@example.com');
      const secondKey = redis.ttl.mock.calls[1][0];

      expect(firstKey).toBe(secondKey);
    });

    it('should generate different keys for different identifiers', async () => {
      redis.ttl.mockResolvedValue(-2);
      redis.get.mockResolvedValue(null);

      await service.isLocked('user1@example.com');
      const key1 = redis.ttl.mock.calls[0][0];

      await service.isLocked('user2@example.com');
      const key2 = redis.ttl.mock.calls[1][0];

      expect(key1).not.toBe(key2);
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
