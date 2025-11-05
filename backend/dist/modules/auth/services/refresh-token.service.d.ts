import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
export interface RefreshTokenPayload {
    refreshToken: string;
    accessToken: string;
}
export interface TokenValidationResult {
    userId: string;
    email: string;
    role: string;
    familyId: string;
}
export declare class RefreshTokenService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    createRefreshToken(userId: string, email: string, role: string, familyId?: string): Promise<{
        refreshToken: string;
        familyId: string;
    }>;
    validateAndRotateToken(token: string): Promise<TokenValidationResult>;
    revokeToken(tokenHash: string): Promise<void>;
    revokeTokenFamily(familyId: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
    cleanupExpiredTokens(): Promise<number>;
    getActiveTokenCount(userId: string): Promise<number>;
    private hashToken;
    private calculateExpiration;
}
