import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { AccountLockoutService } from './services/account-lockout.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { AuditLogService } from '../../common/middleware/audit-log.service';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let tokenBlacklistService: TokenBlacklistService;
  let accountLockoutService: AccountLockoutService;
  let refreshTokenService: RefreshTokenService;
  let auditLogService: AuditLogService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    decode: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        JWT_ACCESS_SECRET: 'test-access-secret',
        JWT_ACCESS_EXPIRATION: '15m',
      };
      return config[key] || defaultValue;
    }),
  };

  const mockTokenBlacklistService = {
    blacklistToken: jest.fn(),
    blacklistAllUserTokens: jest.fn(),
  };

  const mockAccountLockoutService = {
    isLocked: jest.fn(),
    recordFailedAttempt: jest.fn(),
    resetAttempts: jest.fn(),
  };

  const mockRefreshTokenService = {
    createRefreshToken: jest.fn(),
    validateAndRotateToken: jest.fn(),
    revokeAllUserTokens: jest.fn(),
  };

  const mockAuditLogService = {
    logLoginSuccess: jest.fn(),
    logLoginFailed: jest.fn(),
    logAccountLocked: jest.fn(),
    logPasswordChange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: TokenBlacklistService,
          useValue: mockTokenBlacklistService,
        },
        {
          provide: AccountLockoutService,
          useValue: mockAccountLockoutService,
        },
        {
          provide: RefreshTokenService,
          useValue: mockRefreshTokenService,
        },
        {
          provide: AuditLogService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    tokenBlacklistService = module.get<TokenBlacklistService>(TokenBlacklistService);
    accountLockoutService = module.get<AccountLockoutService>(AccountLockoutService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    auditLogService = module.get<AuditLogService>(AuditLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user with hashed password and progress', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'StrongPass123!',
        name: 'Test User',
      };

      const hashedPassword = 'hashed-password';
      const mockUser = {
        id: 'user-1',
        email: registerDto.email,
        name: registerDto.name,
        password: hashedPassword,
        role: 'STUDENT',
        progress: {
          id: 'progress-1',
          userId: 'user-1',
          currentXP: 0,
          currentLevel: 1,
          currentStreak: 0,
        },
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-access-token');
      mockRefreshTokenService.createRefreshToken.mockResolvedValue({
        refreshToken: 'mock-refresh-token',
        familyId: 'family-1',
      });

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
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
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
      expect(result.accessToken).toBe('mock-access-token');
      expect(result.refreshToken).toBe('mock-refresh-token');
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'StrongPass123!',
        name: 'Test User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.register(registerDto)).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'Password123!' };
      const ipAddress = '192.168.1.1';

      const mockUser = {
        id: 'user-1',
        email: loginDto.email,
        password: 'hashed-password',
        role: 'STUDENT',
        progress: {
          id: 'progress-1',
          currentXP: 100,
        },
      };

      mockAccountLockoutService.isLocked.mockResolvedValue({ isLocked: false });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock-access-token');
      mockRefreshTokenService.createRefreshToken.mockResolvedValue({
        refreshToken: 'mock-refresh-token',
        familyId: 'family-1',
      });

      const result = await service.login(loginDto, ipAddress);

      expect(mockAccountLockoutService.isLocked).toHaveBeenCalledWith(
        `${loginDto.email}:${ipAddress}`,
      );
      expect(mockAccountLockoutService.resetAttempts).toHaveBeenCalledWith(
        `${loginDto.email}:${ipAddress}`,
      );
      expect(mockAuditLogService.logLoginSuccess).toHaveBeenCalledWith('user-1', ipAddress);
      expect(result.user).toBeDefined();
      expect(result.user.password).toBeUndefined();
      expect(result.accessToken).toBe('mock-access-token');
    });

    it('should throw UnauthorizedException if account is locked', async () => {
      const loginDto = { email: 'test@example.com', password: 'Password123!' };
      const ipAddress = '192.168.1.1';

      const lockoutExpiresAt = new Date(Date.now() + 30 * 60000); // 30 minutes
      mockAccountLockoutService.isLocked.mockResolvedValue({
        isLocked: true,
        lockoutExpiresAt,
      });

      await expect(service.login(loginDto, ipAddress)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto, ipAddress)).rejects.toThrow(
        'Account temporarily locked',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const loginDto = { email: 'nonexistent@example.com', password: 'Password123!' };
      const ipAddress = '192.168.1.1';

      mockAccountLockoutService.isLocked.mockResolvedValue({ isLocked: false });
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto, ipAddress)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto, ipAddress)).rejects.toThrow('Invalid credentials');
      expect(mockAccountLockoutService.recordFailedAttempt).toHaveBeenCalledWith(
        `${loginDto.email}:${ipAddress}`,
      );
      expect(mockAuditLogService.logLoginFailed).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'WrongPassword' };
      const ipAddress = '192.168.1.1';

      const mockUser = {
        id: 'user-1',
        email: loginDto.email,
        password: 'hashed-password',
        role: 'STUDENT',
      };

      mockAccountLockoutService.isLocked.mockResolvedValue({ isLocked: false });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockAccountLockoutService.recordFailedAttempt.mockResolvedValue({
        isLocked: false,
        attemptsRemaining: 3,
      });

      await expect(service.login(loginDto, ipAddress)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto, ipAddress)).rejects.toThrow('Invalid credentials');
      expect(mockAccountLockoutService.recordFailedAttempt).toHaveBeenCalled();
      expect(mockAuditLogService.logLoginFailed).toHaveBeenCalled();
    });

    it('should lock account after multiple failed attempts', async () => {
      const loginDto = { email: 'test@example.com', password: 'WrongPassword' };
      const ipAddress = '192.168.1.1';

      const mockUser = {
        id: 'user-1',
        email: loginDto.email,
        password: 'hashed-password',
        role: 'STUDENT',
      };

      const lockoutExpiresAt = new Date(Date.now() + 30 * 60000);
      mockAccountLockoutService.isLocked.mockResolvedValue({ isLocked: false });
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      mockAccountLockoutService.recordFailedAttempt.mockResolvedValue({
        isLocked: true,
        lockoutExpiresAt,
        totalAttempts: 5,
      });

      await expect(service.login(loginDto, ipAddress)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto, ipAddress)).rejects.toThrow('Account locked');
      expect(mockAuditLogService.logAccountLocked).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should generate new token pair from valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';

      const validationResult = {
        userId: 'user-1',
        email: 'test@example.com',
        role: 'STUDENT',
        familyId: 'family-1',
      };

      mockRefreshTokenService.validateAndRotateToken.mockResolvedValue(validationResult);
      mockJwtService.sign.mockReturnValue('new-access-token');
      mockRefreshTokenService.createRefreshToken.mockResolvedValue({
        refreshToken: 'new-refresh-token',
        familyId: 'family-1',
      });

      const result = await service.refreshTokens(refreshToken);

      expect(mockRefreshTokenService.validateAndRotateToken).toHaveBeenCalledWith(refreshToken);
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
      expect(result.familyId).toBe('family-1');
    });
  });

  describe('logout', () => {
    it('should blacklist valid token on logout', async () => {
      const token = 'valid-token';
      const decodedToken = {
        sub: 'user-1',
        exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
      };

      mockJwtService.decode.mockReturnValue(decodedToken);

      await service.logout(token);

      expect(mockJwtService.decode).toHaveBeenCalledWith(token);
      expect(mockTokenBlacklistService.blacklistToken).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if no token provided', async () => {
      await expect(service.logout('')).rejects.toThrow(UnauthorizedException);
      await expect(service.logout('')).rejects.toThrow('No token provided');
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const token = 'invalid-token';
      mockJwtService.decode.mockReturnValue(null);

      await expect(service.logout(token)).rejects.toThrow(UnauthorizedException);
      await expect(service.logout(token)).rejects.toThrow('Invalid token');
    });

    it('should not blacklist expired token', async () => {
      const token = 'expired-token';
      const decodedToken = {
        sub: 'user-1',
        exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
      };

      mockJwtService.decode.mockReturnValue(decodedToken);

      await service.logout(token);

      expect(mockTokenBlacklistService.blacklistToken).not.toHaveBeenCalled();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const userId = 'user-1';
      const changePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };
      const ipAddress = '192.168.1.1';

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashed-old-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true) // Current password is correct
        .mockResolvedValueOnce(false); // New password is different
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-new-password');

      await service.changePassword(userId, changePasswordDto, ipAddress);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: 'hashed-new-password' },
      });
      expect(mockRefreshTokenService.revokeAllUserTokens).toHaveBeenCalledWith(userId);
      expect(mockTokenBlacklistService.blacklistAllUserTokens).toHaveBeenCalledWith(userId, 604800);
      expect(mockAuditLogService.logPasswordChange).toHaveBeenCalledWith(userId, ipAddress);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const userId = 'nonexistent';
      const changePasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      const userId = 'user-1';
      const changePasswordDto = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword123!',
      };

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashed-old-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(
        'Current password is incorrect',
      );
    });

    it('should throw BadRequestException if new password is same as current', async () => {
      const userId = 'user-1';
      const changePasswordDto = {
        currentPassword: 'SamePassword123!',
        newPassword: 'SamePassword123!',
      };

      const mockUser = {
        id: userId,
        email: 'test@example.com',
        password: 'hashed-password',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock)
        .mockResolvedValueOnce(true) // Current password is correct
        .mockResolvedValueOnce(true); // New password is same

      await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(
        'New password must be different from current password',
      );
    });
  });
});
