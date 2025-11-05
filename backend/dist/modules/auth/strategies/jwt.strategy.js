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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../../prisma/prisma.service");
const token_blacklist_service_1 = require("../services/token-blacklist.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(config, prisma, tokenBlacklist) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.accessToken;
                },
                passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: config.get('JWT_ACCESS_SECRET'),
            passReqToCallback: true,
        });
        this.config = config;
        this.prisma = prisma;
        this.tokenBlacklist = tokenBlacklist;
    }
    async validate(req, payload) {
        const token = req?.cookies?.accessToken || passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const isBlacklisted = await this.tokenBlacklist.isBlacklisted(token);
        if (isBlacklisted) {
            throw new common_1.UnauthorizedException('Token has been revoked');
        }
        const areAllBlacklisted = await this.tokenBlacklist.areAllUserTokensBlacklisted(payload.sub);
        if (areAllBlacklisted) {
            throw new common_1.UnauthorizedException('All tokens for this user have been revoked');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: {
                progress: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { password, ...sanitizedUser } = user;
        return { ...sanitizedUser, sub: payload.sub };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        token_blacklist_service_1.TokenBlacklistService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map