"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const token_blacklist_service_1 = require("./services/token-blacklist.service");
const account_lockout_service_1 = require("./services/account-lockout.service");
const refresh_token_service_1 = require("./services/refresh-token.service");
const audit_log_service_1 = require("../../common/middleware/audit-log.service");
const bcrypt = require("bcrypt");
jest.mock('bcrypt');
describe('AuthService', () => {
    let service;
    let prismaService;
    let jwtService;
    let configService;
    let tokenBlacklistService;
    let accountLockoutService;
    let refreshTokenService;
    let auditLogService;
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
        get: jest.fn((key, defaultValue) => {
            const config = {
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
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: token_blacklist_service_1.TokenBlacklistService,
                    useValue: mockTokenBlacklistService,
                },
                {
                    provide: account_lockout_service_1.AccountLockoutService,
                    useValue: mockAccountLockoutService,
                },
                {
                    provide: refresh_token_service_1.RefreshTokenService,
                    useValue: mockRefreshTokenService,
                },
                {
                    provide: audit_log_service_1.AuditLogService,
                    useValue: mockAuditLogService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        prismaService = module.get(prisma_service_1.PrismaService);
        jwtService = module.get(jwt_1.JwtService);
        configService = module.get(config_1.ConfigService);
        tokenBlacklistService = module.get(token_blacklist_service_1.TokenBlacklistService);
        accountLockoutService = module.get(account_lockout_service_1.AccountLockoutService);
        refreshTokenService = module.get(refresh_token_service_1.RefreshTokenService);
        auditLogService = module.get(audit_log_service_1.AuditLogService);
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
            bcrypt.hash.mockResolvedValue(hashedPassword);
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
            await expect(service.register(registerDto)).rejects.toThrow(common_1.UnauthorizedException);
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
            bcrypt.compare.mockResolvedValue(true);
            mockJwtService.sign.mockReturnValue('mock-access-token');
            mockRefreshTokenService.createRefreshToken.mockResolvedValue({
                refreshToken: 'mock-refresh-token',
                familyId: 'family-1',
            });
            const result = await service.login(loginDto, ipAddress);
            expect(mockAccountLockoutService.isLocked).toHaveBeenCalledWith(`${loginDto.email}:${ipAddress}`);
            expect(mockAccountLockoutService.resetAttempts).toHaveBeenCalledWith(`${loginDto.email}:${ipAddress}`);
            expect(mockAuditLogService.logLoginSuccess).toHaveBeenCalledWith('user-1', ipAddress);
            expect(result.user).toBeDefined();
            expect(result.user.password).toBeUndefined();
            expect(result.accessToken).toBe('mock-access-token');
        });
        it('should throw UnauthorizedException if account is locked', async () => {
            const loginDto = { email: 'test@example.com', password: 'Password123!' };
            const ipAddress = '192.168.1.1';
            const lockoutExpiresAt = new Date(Date.now() + 30 * 60000);
            mockAccountLockoutService.isLocked.mockResolvedValue({
                isLocked: true,
                lockoutExpiresAt,
            });
            await expect(service.login(loginDto, ipAddress)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.login(loginDto, ipAddress)).rejects.toThrow('Account temporarily locked');
        });
        it('should throw UnauthorizedException if user not found', async () => {
            const loginDto = { email: 'nonexistent@example.com', password: 'Password123!' };
            const ipAddress = '192.168.1.1';
            mockAccountLockoutService.isLocked.mockResolvedValue({ isLocked: false });
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            await expect(service.login(loginDto, ipAddress)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.login(loginDto, ipAddress)).rejects.toThrow('Invalid credentials');
            expect(mockAccountLockoutService.recordFailedAttempt).toHaveBeenCalledWith(`${loginDto.email}:${ipAddress}`);
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
            bcrypt.compare.mockResolvedValue(false);
            mockAccountLockoutService.recordFailedAttempt.mockResolvedValue({
                isLocked: false,
                attemptsRemaining: 3,
            });
            await expect(service.login(loginDto, ipAddress)).rejects.toThrow(common_1.UnauthorizedException);
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
            bcrypt.compare.mockResolvedValue(false);
            mockAccountLockoutService.recordFailedAttempt.mockResolvedValue({
                isLocked: true,
                lockoutExpiresAt,
                totalAttempts: 5,
            });
            await expect(service.login(loginDto, ipAddress)).rejects.toThrow(common_1.UnauthorizedException);
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
                exp: Math.floor(Date.now() / 1000) + 3600,
            };
            mockJwtService.decode.mockReturnValue(decodedToken);
            await service.logout(token);
            expect(mockJwtService.decode).toHaveBeenCalledWith(token);
            expect(mockTokenBlacklistService.blacklistToken).toHaveBeenCalled();
        });
        it('should throw UnauthorizedException if no token provided', async () => {
            await expect(service.logout('')).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.logout('')).rejects.toThrow('No token provided');
        });
        it('should throw UnauthorizedException if token is invalid', async () => {
            const token = 'invalid-token';
            mockJwtService.decode.mockReturnValue(null);
            await expect(service.logout(token)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.logout(token)).rejects.toThrow('Invalid token');
        });
        it('should not blacklist expired token', async () => {
            const token = 'expired-token';
            const decodedToken = {
                sub: 'user-1',
                exp: Math.floor(Date.now() / 1000) - 3600,
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
            bcrypt.compare
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(false);
            bcrypt.hash.mockResolvedValue('hashed-new-password');
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
            await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow('User not found');
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
            bcrypt.compare.mockResolvedValue(false);
            await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow(common_1.BadRequestException);
            await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow('Current password is incorrect');
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
            bcrypt.compare
                .mockResolvedValueOnce(true)
                .mockResolvedValueOnce(true);
            await expect(service.changePassword(userId, changePasswordDto)).rejects.toThrow('New password must be different from current password');
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map