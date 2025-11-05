import { PrismaService } from '../../prisma/prisma.service';
export declare enum AuditEventType {
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGIN_FAILED = "LOGIN_FAILED",
    LOGOUT = "LOGOUT",
    REGISTER = "REGISTER",
    PASSWORD_CHANGE = "PASSWORD_CHANGE",
    PASSWORD_RESET = "PASSWORD_RESET",
    TOKEN_REFRESH = "TOKEN_REFRESH",
    TOKEN_REUSE_DETECTED = "TOKEN_REUSE_DETECTED",
    TOKEN_REVOKED = "TOKEN_REVOKED",
    ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
    ACCOUNT_UNLOCKED = "ACCOUNT_UNLOCKED",
    ACCESS_DENIED = "ACCESS_DENIED",
    PERMISSION_DENIED = "PERMISSION_DENIED",
    DATA_EXPORT_REQUESTED = "DATA_EXPORT_REQUESTED",
    ACCOUNT_DELETED = "ACCOUNT_DELETED",
    SENSITIVE_DATA_ACCESSED = "SENSITIVE_DATA_ACCESSED",
    ADMIN_ACTION = "ADMIN_ACTION",
    SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED"
}
export interface AuditLogEntry {
    eventType: AuditEventType;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    errorMessage?: string;
    metadata?: Record<string, any>;
}
export declare class AuditLogService {
    private prisma;
    constructor(prisma: PrismaService);
    log(entry: AuditLogEntry): Promise<void>;
    logLoginSuccess(userId: string, ipAddress?: string, userAgent?: string): Promise<void>;
    logLoginFailed(email: string, ipAddress?: string, userAgent?: string, reason?: string): Promise<void>;
    logLogout(userId: string, ipAddress?: string): Promise<void>;
    logPasswordChange(userId: string, ipAddress?: string): Promise<void>;
    logTokenReuseDetected(userId: string, familyId: string, ipAddress?: string): Promise<void>;
    logAccountLocked(identifier: string, ipAddress?: string, attemptsCount?: number): Promise<void>;
    logDataExport(userId: string, ipAddress?: string): Promise<void>;
    logAccountDeletion(userId: string, email: string, ipAddress?: string): Promise<void>;
    logAccessDenied(userId: string | undefined, endpoint: string, method: string, ipAddress?: string, reason?: string): Promise<void>;
    logRateLimitExceeded(userId: string | undefined, endpoint: string, ipAddress?: string): Promise<void>;
    queryLogs(filters: {
        userId?: string;
        eventType?: AuditEventType;
        startDate?: Date;
        endDate?: Date;
        ipAddress?: string;
    }, limit?: number): Promise<any[]>;
    getUserSecuritySummary(userId: string): Promise<{
        totalEvents: number;
        loginSuccessCount: number;
        loginFailedCount: number;
        passwordChanges: number;
        suspiciousEvents: number;
        lastLogin?: Date;
    }>;
}
