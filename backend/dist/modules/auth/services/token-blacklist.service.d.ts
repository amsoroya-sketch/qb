import { ConfigService } from '@nestjs/config';
export declare class TokenBlacklistService {
    private config;
    private redis;
    constructor(config: ConfigService);
    blacklistToken(token: string, expiresIn: number): Promise<void>;
    isBlacklisted(token: string): Promise<boolean>;
    removeFromBlacklist(token: string): Promise<void>;
    blacklistAllUserTokens(userId: string, expiresIn?: number): Promise<void>;
    areAllUserTokensBlacklisted(userId: string): Promise<boolean>;
    clearUserBlacklist(userId: string): Promise<void>;
    getBlacklistStats(): Promise<{
        totalBlacklisted: number;
        userBlacklisted: number;
    }>;
    private getBlacklistKey;
    private getUserBlacklistKey;
    onModuleDestroy(): Promise<void>;
}
