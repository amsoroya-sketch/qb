"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const refresh_token_service_1 = require("./refresh-token.service");
const prisma_service_1 = require("../../../prisma/prisma.service");
describe('RefreshTokenService', () => {
    let service;
    const mockPrismaService = {
        refreshToken: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
            deleteMany: jest.fn(),
            count: jest.fn(),
        },
    };
    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };
    const mockConfigService = {
        get: jest.fn((key, defaultValue) => {
            const config = {
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_REFRESH_EXPIRATION: '7d',
            };
            return config[key] ?? defaultValue;
        }),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                refresh_token_service_1.RefreshTokenService,
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
            ],
        }).compile();
        service = module.get(refresh_token_service_1.RefreshTokenService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createRefreshToken', () => {
        it('should create and store a new refresh token', async () => {
            const userId = 'user-1';
            const email = 'test@example.com';
            const role = 'STUDENT';
            const mockToken = 'mock-jwt-token';
            const mockFamilyId = 'family-123';
            mockJwtService.sign.mockReturnValue(mockToken);
            mockPrismaService.refreshToken.create.mockResolvedValue({
                id: 'token-1',
                userId,
                tokenHash: expect.any(String),
                familyId: mockFamilyId,
                expiresAt: expect.any(Date),
            });
            const result = await service.createRefreshToken(userId, email, role, mockFamilyId);
            expect(result.refreshToken).toBe(mockToken);
            expect(result.familyId).toBe(mockFamilyId);
            expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: userId, email, role, familyId: mockFamilyId }, {
                secret: 'test-refresh-secret',
                expiresIn: '7d',
            });
            expect(mockPrismaService.refreshToken.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    tokenHash: expect.any(String),
                    familyId: mockFamilyId,
                    expiresAt: expect.any(Date),
                },
            });
        });
        it('should generate new family ID if not provided', async () => {
            const mockToken = 'mock-jwt-token';
            mockJwtService.sign.mockReturnValue(mockToken);
            mockPrismaService.refreshToken.create.mockResolvedValue({
                id: 'token-1',
            });
            const result = await service.createRefreshToken('user-1', 'test@example.com', 'STUDENT');
            expect(result.familyId).toBeDefined();
            expect(result.familyId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        });
        it('should hash token before storing', async () => {
            const mockToken = 'mock-jwt-token';
            mockJwtService.sign.mockReturnValue(mockToken);
            mockPrismaService.refreshToken.create.mockResolvedValue({});
            await service.createRefreshToken('user-1', 'test@example.com', 'STUDENT', 'family-1');
            const createCall = mockPrismaService.refreshToken.create.mock.calls[0][0];
            expect(createCall.data.tokenHash).not.toBe(mockToken);
            expect(createCall.data.tokenHash).toHaveLength(64);
        });
        it('should calculate correct expiration date', async () => {
            const mockToken = 'mock-jwt-token';
            mockJwtService.sign.mockReturnValue(mockToken);
            mockPrismaService.refreshToken.create.mockResolvedValue({});
            const beforeCall = Date.now();
            await service.createRefreshToken('user-1', 'test@example.com', 'STUDENT', 'family-1');
            const afterCall = Date.now();
            const createCall = mockPrismaService.refreshToken.create.mock.calls[0][0];
            const expiresAt = createCall.data.expiresAt.getTime();
            const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
            expect(expiresAt).toBeGreaterThanOrEqual(beforeCall + sevenDaysMs);
            expect(expiresAt).toBeLessThanOrEqual(afterCall + sevenDaysMs + 1000);
        });
    });
    describe('validateAndRotateToken', () => {
        it('should successfully validate a valid token', async () => {
            const mockToken = 'valid-token';
            const mockPayload = {
                sub: 'user-1',
                email: 'test@example.com',
                role: 'STUDENT',
                familyId: 'family-1',
            };
            const mockStoredToken = {
                userId: 'user-1',
                tokenHash: 'token-hash',
                familyId: 'family-1',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isRevoked: false,
                isUsed: false,
                user: {
                    email: 'test@example.com',
                    role: 'STUDENT',
                },
            };
            mockJwtService.verify.mockReturnValue(mockPayload);
            mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            mockPrismaService.refreshToken.update.mockResolvedValue({});
            const result = await service.validateAndRotateToken(mockToken);
            expect(result.userId).toBe('user-1');
            expect(result.email).toBe('test@example.com');
            expect(result.role).toBe('STUDENT');
            expect(result.familyId).toBe('family-1');
            expect(mockPrismaService.refreshToken.update).toHaveBeenCalledWith({
                where: { tokenHash: expect.any(String) },
                data: {
                    isUsed: true,
                    usedAt: expect.any(Date),
                },
            });
        });
        it('should throw UnauthorizedException if token not found in database', async () => {
            mockJwtService.verify.mockReturnValue({ sub: 'user-1' });
            mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);
            await expect(service.validateAndRotateToken('invalid-token')).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.validateAndRotateToken('invalid-token')).rejects.toThrow('Invalid refresh token');
        });
        it('should throw UnauthorizedException if token has expired', async () => {
            const mockStoredToken = {
                userId: 'user-1',
                tokenHash: 'token-hash',
                familyId: 'family-1',
                expiresAt: new Date(Date.now() - 1000),
                isRevoked: false,
                isUsed: false,
                user: { email: 'test@example.com', role: 'STUDENT' },
            };
            mockJwtService.verify.mockReturnValue({ sub: 'user-1' });
            mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({});
            await expect(service.validateAndRotateToken('expired-token')).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.validateAndRotateToken('expired-token')).rejects.toThrow('Refresh token has expired');
        });
        it('should revoke token when expired', async () => {
            const mockStoredToken = {
                userId: 'user-1',
                tokenHash: expect.any(String),
                expiresAt: new Date(Date.now() - 1000),
                isRevoked: false,
                isUsed: false,
                user: { email: 'test@example.com', role: 'STUDENT' },
            };
            mockJwtService.verify.mockReturnValue({ sub: 'user-1' });
            mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({});
            await expect(service.validateAndRotateToken('expired-token')).rejects.toThrow(common_1.UnauthorizedException);
            expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
                where: { tokenHash: expect.any(String) },
                data: {
                    isRevoked: true,
                    revokedAt: expect.any(Date),
                },
            });
        });
        it('should throw UnauthorizedException if token is revoked', async () => {
            const mockStoredToken = {
                userId: 'user-1',
                tokenHash: 'token-hash',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isRevoked: true,
                isUsed: false,
                user: { email: 'test@example.com', role: 'STUDENT' },
            };
            mockJwtService.verify.mockReturnValue({ sub: 'user-1' });
            mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            await expect(service.validateAndRotateToken('revoked-token')).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.validateAndRotateToken('revoked-token')).rejects.toThrow('Refresh token has been revoked');
        });
        it('should detect token reuse and revoke entire family (CRITICAL SECURITY)', async () => {
            const mockStoredToken = {
                userId: 'user-1',
                tokenHash: 'token-hash',
                familyId: 'family-1',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isRevoked: false,
                isUsed: true,
                user: { email: 'test@example.com', role: 'STUDENT' },
            };
            mockJwtService.verify.mockReturnValue({ sub: 'user-1' });
            mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({});
            await expect(service.validateAndRotateToken('reused-token')).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.validateAndRotateToken('reused-token')).rejects.toThrow('Token reuse detected');
            expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
                where: { familyId: 'family-1' },
                data: {
                    isRevoked: true,
                    revokedAt: expect.any(Date),
                },
            });
        });
        it('should throw UnauthorizedException if JWT verification fails', async () => {
            mockJwtService.verify.mockImplementation(() => {
                throw new Error('Invalid signature');
            });
            await expect(service.validateAndRotateToken('invalid-jwt')).rejects.toThrow(common_1.UnauthorizedException);
            await expect(service.validateAndRotateToken('invalid-jwt')).rejects.toThrow('Invalid or expired refresh token');
        });
        it('should mark token as used after successful validation', async () => {
            const mockStoredToken = {
                userId: 'user-1',
                tokenHash: 'token-hash',
                familyId: 'family-1',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                isRevoked: false,
                isUsed: false,
                user: { email: 'test@example.com', role: 'STUDENT' },
            };
            mockJwtService.verify.mockReturnValue({ sub: 'user-1' });
            mockPrismaService.refreshToken.findUnique.mockResolvedValue(mockStoredToken);
            mockPrismaService.refreshToken.update.mockResolvedValue({});
            await service.validateAndRotateToken('valid-token');
            expect(mockPrismaService.refreshToken.update).toHaveBeenCalledWith({
                where: { tokenHash: expect.any(String) },
                data: {
                    isUsed: true,
                    usedAt: expect.any(Date),
                },
            });
        });
    });
    describe('revokeToken', () => {
        it('should revoke a single token by hash', async () => {
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 1 });
            await service.revokeToken('token-hash-123');
            expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
                where: { tokenHash: 'token-hash-123' },
                data: {
                    isRevoked: true,
                    revokedAt: expect.any(Date),
                },
            });
        });
        it('should not throw if token does not exist', async () => {
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 0 });
            await expect(service.revokeToken('nonexistent-hash')).resolves.not.toThrow();
        });
    });
    describe('revokeTokenFamily', () => {
        it('should revoke all tokens in a family', async () => {
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 3 });
            await service.revokeTokenFamily('family-123');
            expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
                where: { familyId: 'family-123' },
                data: {
                    isRevoked: true,
                    revokedAt: expect.any(Date),
                },
            });
        });
        it('should work even if family does not exist', async () => {
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 0 });
            await expect(service.revokeTokenFamily('nonexistent-family')).resolves.not.toThrow();
        });
    });
    describe('revokeAllUserTokens', () => {
        it('should revoke all tokens for a user', async () => {
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 5 });
            await service.revokeAllUserTokens('user-1');
            expect(mockPrismaService.refreshToken.updateMany).toHaveBeenCalledWith({
                where: { userId: 'user-1' },
                data: {
                    isRevoked: true,
                    revokedAt: expect.any(Date),
                },
            });
        });
        it('should work even if user has no tokens', async () => {
            mockPrismaService.refreshToken.updateMany.mockResolvedValue({ count: 0 });
            await expect(service.revokeAllUserTokens('user-with-no-tokens')).resolves.not.toThrow();
        });
    });
    describe('cleanupExpiredTokens', () => {
        it('should delete expired tokens and return count', async () => {
            mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 15 });
            const result = await service.cleanupExpiredTokens();
            expect(result).toBe(15);
            expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
                where: {
                    expiresAt: {
                        lt: expect.any(Date),
                    },
                },
            });
        });
        it('should return 0 if no expired tokens', async () => {
            mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 0 });
            const result = await service.cleanupExpiredTokens();
            expect(result).toBe(0);
        });
        it('should only delete tokens with expiration in the past', async () => {
            mockPrismaService.refreshToken.deleteMany.mockResolvedValue({ count: 5 });
            const beforeCall = Date.now();
            await service.cleanupExpiredTokens();
            const afterCall = Date.now();
            const deleteCall = mockPrismaService.refreshToken.deleteMany.mock.calls[0][0];
            const ltDate = deleteCall.where.expiresAt.lt.getTime();
            expect(ltDate).toBeGreaterThanOrEqual(beforeCall);
            expect(ltDate).toBeLessThanOrEqual(afterCall);
        });
    });
    describe('getActiveTokenCount', () => {
        it('should return count of active tokens for user', async () => {
            mockPrismaService.refreshToken.count.mockResolvedValue(3);
            const result = await service.getActiveTokenCount('user-1');
            expect(result).toBe(3);
            expect(mockPrismaService.refreshToken.count).toHaveBeenCalledWith({
                where: {
                    userId: 'user-1',
                    isRevoked: false,
                    expiresAt: {
                        gt: expect.any(Date),
                    },
                },
            });
        });
        it('should return 0 if user has no active tokens', async () => {
            mockPrismaService.refreshToken.count.mockResolvedValue(0);
            const result = await service.getActiveTokenCount('user-with-no-tokens');
            expect(result).toBe(0);
        });
        it('should only count non-revoked tokens', async () => {
            mockPrismaService.refreshToken.count.mockResolvedValue(2);
            await service.getActiveTokenCount('user-1');
            const countCall = mockPrismaService.refreshToken.count.mock.calls[0][0];
            expect(countCall.where.isRevoked).toBe(false);
        });
        it('should only count non-expired tokens', async () => {
            mockPrismaService.refreshToken.count.mockResolvedValue(2);
            const beforeCall = Date.now();
            await service.getActiveTokenCount('user-1');
            const afterCall = Date.now();
            const countCall = mockPrismaService.refreshToken.count.mock.calls[0][0];
            const gtDate = countCall.where.expiresAt.gt.getTime();
            expect(gtDate).toBeGreaterThanOrEqual(beforeCall);
            expect(gtDate).toBeLessThanOrEqual(afterCall);
        });
    });
});
//# sourceMappingURL=refresh-token.service.spec.js.map