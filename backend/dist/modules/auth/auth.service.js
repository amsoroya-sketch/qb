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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../prisma/prisma.service");
const token_blacklist_service_1 = require("./services/token-blacklist.service");
const account_lockout_service_1 = require("./services/account-lockout.service");
const refresh_token_service_1 = require("./services/refresh-token.service");
const audit_log_service_1 = require("../../common/middleware/audit-log.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, config, tokenBlacklist, accountLockout, refreshTokenService, auditLog) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
        this.tokenBlacklist = tokenBlacklist;
        this.accountLockout = accountLockout;
        this.refreshTokenService = refreshTokenService;
        this.auditLog = auditLog;
    }
    async register(dto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (exists) {
            throw new common_1.UnauthorizedException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                name: dto.name,
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
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(dto, ipAddress) {
        const identifier = ipAddress ? `${dto.email}:${ipAddress}` : dto.email;
        const lockoutStatus = await this.accountLockout.isLocked(identifier);
        if (lockoutStatus.isLocked) {
            const minutesRemaining = lockoutStatus.lockoutExpiresAt
                ? Math.ceil((lockoutStatus.lockoutExpiresAt.getTime() - Date.now()) / 60000)
                : 0;
            throw new common_1.UnauthorizedException(`Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes.`);
        }
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                progress: true,
            },
        });
        if (!user) {
            await this.accountLockout.recordFailedAttempt(identifier);
            await this.auditLog.logLoginFailed(dto.email, ipAddress, undefined, 'User not found');
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) {
            const status = await this.accountLockout.recordFailedAttempt(identifier);
            await this.auditLog.logLoginFailed(dto.email, ipAddress, undefined, 'Invalid password');
            if (status.isLocked) {
                const minutesRemaining = status.lockoutExpiresAt
                    ? Math.ceil((status.lockoutExpiresAt.getTime() - Date.now()) / 60000)
                    : 0;
                await this.auditLog.logAccountLocked(identifier, ipAddress, status.totalAttempts);
                throw new common_1.UnauthorizedException(`Account locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minutes.`);
            }
            const attemptsMsg = status.attemptsRemaining
                ? ` ${status.attemptsRemaining} attempt(s) remaining before account lockout.`
                : '';
            throw new common_1.UnauthorizedException(`Invalid credentials.${attemptsMsg}`);
        }
        await this.accountLockout.resetAttempts(identifier);
        await this.auditLog.logLoginSuccess(user.id, ipAddress);
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async refreshTokens(refreshToken) {
        const validationResult = await this.refreshTokenService.validateAndRotateToken(refreshToken);
        const tokens = await this.generateTokens(validationResult.userId, validationResult.email, validationResult.role, validationResult.familyId);
        return tokens;
    }
    async generateTokens(userId, email, role, familyId) {
        const accessToken = this.jwtService.sign({ sub: userId, email, role }, {
            secret: this.config.get('JWT_ACCESS_SECRET'),
            expiresIn: this.config.get('JWT_ACCESS_EXPIRATION', '15m'),
        });
        const { refreshToken, familyId: tokenFamilyId } = await this.refreshTokenService.createRefreshToken(userId, email, role, familyId);
        return { accessToken, refreshToken, familyId: tokenFamilyId };
    }
    sanitizeUser(user) {
        const { password, ...sanitized } = user;
        return sanitized;
    }
    async logout(token) {
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded || !decoded.exp) {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
            if (expiresIn > 0) {
                await this.tokenBlacklist.blacklistToken(token, expiresIn);
            }
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async changePassword(userId, dto, ipAddress) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const samePassword = await bcrypt.compare(dto.newPassword, user.password);
        if (samePassword) {
            throw new common_1.BadRequestException('New password must be different from current password');
        }
        const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        await this.refreshTokenService.revokeAllUserTokens(userId);
        await this.tokenBlacklist.blacklistAllUserTokens(userId, 604800);
        await this.auditLog.logPasswordChange(userId, ipAddress);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        token_blacklist_service_1.TokenBlacklistService,
        account_lockout_service_1.AccountLockoutService,
        refresh_token_service_1.RefreshTokenService,
        audit_log_service_1.AuditLogService])
], AuthService);
//# sourceMappingURL=auth.service.js.map