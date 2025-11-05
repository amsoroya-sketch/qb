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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../prisma/prisma.service");
const crypto = require("crypto");
let RefreshTokenService = class RefreshTokenService {
    constructor(prisma, jwtService, config) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.config = config;
    }
    async createRefreshToken(userId, email, role, familyId) {
        const tokenFamilyId = familyId || crypto.randomUUID();
        const refreshToken = this.jwtService.sign({ sub: userId, email, role, familyId: tokenFamilyId }, {
            secret: this.config.get('JWT_REFRESH_SECRET'),
            expiresIn: this.config.get('JWT_REFRESH_EXPIRATION', '7d'),
        });
        const tokenHash = this.hashToken(refreshToken);
        const expiresIn = this.config.get('JWT_REFRESH_EXPIRATION', '7d');
        const expiresAt = this.calculateExpiration(expiresIn);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                familyId: tokenFamilyId,
                expiresAt,
            },
        });
        return { refreshToken, familyId: tokenFamilyId };
    }
    async validateAndRotateToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
            });
            const tokenHash = this.hashToken(token);
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { tokenHash },
                include: { user: true },
            });
            if (!storedToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            if (storedToken.expiresAt < new Date()) {
                await this.revokeToken(tokenHash);
                throw new common_1.UnauthorizedException('Refresh token has expired');
            }
            if (storedToken.isRevoked) {
                throw new common_1.UnauthorizedException('Refresh token has been revoked');
            }
            if (storedToken.isUsed) {
                await this.revokeTokenFamily(storedToken.familyId);
                throw new common_1.UnauthorizedException('Token reuse detected. All tokens in this family have been revoked for security.');
            }
            await this.prisma.refreshToken.update({
                where: { tokenHash },
                data: {
                    isUsed: true,
                    usedAt: new Date(),
                },
            });
            return {
                userId: storedToken.userId,
                email: storedToken.user.email,
                role: storedToken.user.role,
                familyId: storedToken.familyId,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
    }
    async revokeToken(tokenHash) {
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            },
        });
    }
    async revokeTokenFamily(familyId) {
        await this.prisma.refreshToken.updateMany({
            where: { familyId },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            },
        });
    }
    async revokeAllUserTokens(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId },
            data: {
                isRevoked: true,
                revokedAt: new Date(),
            },
        });
    }
    async cleanupExpiredTokens() {
        const result = await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
        return result.count;
    }
    async getActiveTokenCount(userId) {
        return this.prisma.refreshToken.count({
            where: {
                userId,
                isRevoked: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    calculateExpiration(duration) {
        const match = duration.match(/^(\d+)([dhms])$/);
        if (!match) {
            throw new Error(`Invalid duration format: ${duration}`);
        }
        const value = parseInt(match[1], 10);
        const unit = match[2];
        const now = new Date();
        switch (unit) {
            case 'd':
                return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
            case 'h':
                return new Date(now.getTime() + value * 60 * 60 * 1000);
            case 'm':
                return new Date(now.getTime() + value * 60 * 1000);
            case 's':
                return new Date(now.getTime() + value * 1000);
            default:
                throw new Error(`Unknown duration unit: ${unit}`);
        }
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map