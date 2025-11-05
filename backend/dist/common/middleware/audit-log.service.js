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
exports.AuditLogService = exports.AuditEventType = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
var AuditEventType;
(function (AuditEventType) {
    AuditEventType["LOGIN_SUCCESS"] = "LOGIN_SUCCESS";
    AuditEventType["LOGIN_FAILED"] = "LOGIN_FAILED";
    AuditEventType["LOGOUT"] = "LOGOUT";
    AuditEventType["REGISTER"] = "REGISTER";
    AuditEventType["PASSWORD_CHANGE"] = "PASSWORD_CHANGE";
    AuditEventType["PASSWORD_RESET"] = "PASSWORD_RESET";
    AuditEventType["TOKEN_REFRESH"] = "TOKEN_REFRESH";
    AuditEventType["TOKEN_REUSE_DETECTED"] = "TOKEN_REUSE_DETECTED";
    AuditEventType["TOKEN_REVOKED"] = "TOKEN_REVOKED";
    AuditEventType["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
    AuditEventType["ACCOUNT_UNLOCKED"] = "ACCOUNT_UNLOCKED";
    AuditEventType["ACCESS_DENIED"] = "ACCESS_DENIED";
    AuditEventType["PERMISSION_DENIED"] = "PERMISSION_DENIED";
    AuditEventType["DATA_EXPORT_REQUESTED"] = "DATA_EXPORT_REQUESTED";
    AuditEventType["ACCOUNT_DELETED"] = "ACCOUNT_DELETED";
    AuditEventType["SENSITIVE_DATA_ACCESSED"] = "SENSITIVE_DATA_ACCESSED";
    AuditEventType["ADMIN_ACTION"] = "ADMIN_ACTION";
    AuditEventType["SUSPICIOUS_ACTIVITY"] = "SUSPICIOUS_ACTIVITY";
    AuditEventType["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
})(AuditEventType || (exports.AuditEventType = AuditEventType = {}));
let AuditLogService = class AuditLogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(entry) {
        try {
            if (entry.userId) {
                await this.prisma.userEvent.create({
                    data: {
                        userId: entry.userId,
                        eventType: entry.eventType,
                        timestamp: new Date(),
                        metadata: {
                            ipAddress: entry.ipAddress,
                            userAgent: entry.userAgent,
                            endpoint: entry.endpoint,
                            method: entry.method,
                            statusCode: entry.statusCode,
                            errorMessage: entry.errorMessage,
                            ...entry.metadata,
                        },
                    },
                });
            }
            else {
                console.log('[AUDIT]', {
                    ...entry,
                    timestamp: new Date().toISOString(),
                });
            }
        }
        catch (error) {
            console.error('[AUDIT LOG ERROR]', error);
        }
    }
    async logLoginSuccess(userId, ipAddress, userAgent) {
        await this.log({
            eventType: AuditEventType.LOGIN_SUCCESS,
            userId,
            ipAddress,
            userAgent,
        });
    }
    async logLoginFailed(email, ipAddress, userAgent, reason) {
        await this.log({
            eventType: AuditEventType.LOGIN_FAILED,
            ipAddress,
            userAgent,
            metadata: { email, reason },
        });
    }
    async logLogout(userId, ipAddress) {
        await this.log({
            eventType: AuditEventType.LOGOUT,
            userId,
            ipAddress,
        });
    }
    async logPasswordChange(userId, ipAddress) {
        await this.log({
            eventType: AuditEventType.PASSWORD_CHANGE,
            userId,
            ipAddress,
        });
    }
    async logTokenReuseDetected(userId, familyId, ipAddress) {
        await this.log({
            eventType: AuditEventType.TOKEN_REUSE_DETECTED,
            userId,
            ipAddress,
            metadata: {
                familyId,
                severity: 'HIGH',
                description: 'Potential security breach: refresh token reused',
            },
        });
    }
    async logAccountLocked(identifier, ipAddress, attemptsCount) {
        await this.log({
            eventType: AuditEventType.ACCOUNT_LOCKED,
            ipAddress,
            metadata: {
                identifier,
                attemptsCount,
                severity: 'MEDIUM',
            },
        });
    }
    async logDataExport(userId, ipAddress) {
        await this.log({
            eventType: AuditEventType.DATA_EXPORT_REQUESTED,
            userId,
            ipAddress,
            metadata: {
                compliance: 'GDPR Article 20',
            },
        });
    }
    async logAccountDeletion(userId, email, ipAddress) {
        await this.log({
            eventType: AuditEventType.ACCOUNT_DELETED,
            userId,
            ipAddress,
            metadata: {
                email,
                compliance: 'GDPR Article 17',
                severity: 'HIGH',
            },
        });
    }
    async logAccessDenied(userId, endpoint, method, ipAddress, reason) {
        await this.log({
            eventType: AuditEventType.ACCESS_DENIED,
            userId,
            endpoint,
            method,
            ipAddress,
            metadata: { reason },
        });
    }
    async logRateLimitExceeded(userId, endpoint, ipAddress) {
        await this.log({
            eventType: AuditEventType.RATE_LIMIT_EXCEEDED,
            userId,
            endpoint,
            ipAddress,
            metadata: {
                severity: 'LOW',
            },
        });
    }
    async queryLogs(filters, limit = 100) {
        const where = {};
        if (filters.userId) {
            where.userId = filters.userId;
        }
        if (filters.eventType) {
            where.eventType = filters.eventType;
        }
        if (filters.startDate || filters.endDate) {
            where.timestamp = {};
            if (filters.startDate) {
                where.timestamp.gte = filters.startDate;
            }
            if (filters.endDate) {
                where.timestamp.lte = filters.endDate;
            }
        }
        const logs = await this.prisma.userEvent.findMany({
            where,
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
        if (filters.ipAddress) {
            return logs.filter((log) => log.metadata?.ipAddress === filters.ipAddress);
        }
        return logs;
    }
    async getUserSecuritySummary(userId) {
        const events = await this.prisma.userEvent.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
        });
        const summary = {
            totalEvents: events.length,
            loginSuccessCount: events.filter((e) => e.eventType === AuditEventType.LOGIN_SUCCESS).length,
            loginFailedCount: events.filter((e) => e.eventType === AuditEventType.LOGIN_FAILED).length,
            passwordChanges: events.filter((e) => e.eventType === AuditEventType.PASSWORD_CHANGE).length,
            suspiciousEvents: events.filter((e) => e.eventType === AuditEventType.TOKEN_REUSE_DETECTED ||
                e.eventType === AuditEventType.ACCOUNT_LOCKED ||
                e.eventType === AuditEventType.SUSPICIOUS_ACTIVITY).length,
            lastLogin: events.find((e) => e.eventType === AuditEventType.LOGIN_SUCCESS)?.timestamp,
        };
        return summary;
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map