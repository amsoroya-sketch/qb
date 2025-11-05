import { ConfigService } from '@nestjs/config';
export interface LockoutStatus {
    isLocked: boolean;
    attemptsRemaining?: number;
    lockoutExpiresAt?: Date;
    totalAttempts?: number;
}
export declare class AccountLockoutService {
    private config;
    private redis;
    private readonly MAX_ATTEMPTS;
    private readonly LOCKOUT_DURATION;
    private readonly ATTEMPT_WINDOW;
    constructor(config: ConfigService);
    recordFailedAttempt(identifier: string): Promise<LockoutStatus>;
    isLocked(identifier: string): Promise<LockoutStatus>;
    resetAttempts(identifier: string): Promise<void>;
    unlockAccount(identifier: string): Promise<void>;
    getLockoutInfo(identifier: string): Promise<{
        isLocked: boolean;
        failedAttempts: number;
        attemptsRemaining: number;
        lockoutExpiresAt?: Date;
        maxAttempts: number;
        lockoutDurationMinutes: number;
    }>;
    getGlobalStats(): Promise<{
        totalLockedAccounts: number;
        totalAccountsWithAttempts: number;
    }>;
    private getAttemptsKey;
    private getLockKey;
    onModuleDestroy(): Promise<void>;
}
