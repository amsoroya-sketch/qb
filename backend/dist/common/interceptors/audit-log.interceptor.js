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
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_log_service_1 = require("../middleware/audit-log.service");
let AuditLogInterceptor = class AuditLogInterceptor {
    constructor(auditLogService) {
        this.auditLogService = auditLogService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const { method, url, ip, headers } = request;
        const userAgent = headers['user-agent'] || 'unknown';
        const userId = request.user?.id || request.user?.sub;
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            const statusCode = response.statusCode;
            if (this.isSecurityRelevantEndpoint(url, method)) {
                this.auditLogService.log({
                    eventType: this.getEventType(url, method, statusCode),
                    userId,
                    ipAddress: this.getClientIp(request),
                    userAgent,
                    endpoint: url,
                    method,
                    statusCode,
                    metadata: {
                        duration,
                    },
                });
            }
            if (statusCode >= 400) {
                this.auditLogService.log({
                    eventType: statusCode === 401 || statusCode === 403
                        ? audit_log_service_1.AuditEventType.ACCESS_DENIED
                        : audit_log_service_1.AuditEventType.SUSPICIOUS_ACTIVITY,
                    userId,
                    ipAddress: this.getClientIp(request),
                    userAgent,
                    endpoint: url,
                    method,
                    statusCode,
                    metadata: { duration },
                });
            }
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - startTime;
            this.auditLogService.log({
                eventType: audit_log_service_1.AuditEventType.SUSPICIOUS_ACTIVITY,
                userId,
                ipAddress: this.getClientIp(request),
                userAgent,
                endpoint: url,
                method,
                statusCode: error.status || 500,
                errorMessage: error.message,
                metadata: {
                    duration,
                    errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
                },
            });
            throw error;
        }));
    }
    isSecurityRelevantEndpoint(url, method) {
        const securityEndpoints = [
            '/api/v1/auth/login',
            '/api/v1/auth/register',
            '/api/v1/auth/logout',
            '/api/v1/auth/refresh',
            '/api/v1/auth/change-password',
            '/api/v1/gdpr/export',
            '/api/v1/gdpr/delete-account',
        ];
        return securityEndpoints.some((endpoint) => url.includes(endpoint));
    }
    getEventType(url, method, statusCode) {
        if (url.includes('/auth/login')) {
            return statusCode === 200 ? audit_log_service_1.AuditEventType.LOGIN_SUCCESS : audit_log_service_1.AuditEventType.LOGIN_FAILED;
        }
        if (url.includes('/auth/register')) {
            return audit_log_service_1.AuditEventType.REGISTER;
        }
        if (url.includes('/auth/logout')) {
            return audit_log_service_1.AuditEventType.LOGOUT;
        }
        if (url.includes('/auth/refresh')) {
            return audit_log_service_1.AuditEventType.TOKEN_REFRESH;
        }
        if (url.includes('/auth/change-password')) {
            return audit_log_service_1.AuditEventType.PASSWORD_CHANGE;
        }
        if (url.includes('/gdpr/export')) {
            return audit_log_service_1.AuditEventType.DATA_EXPORT_REQUESTED;
        }
        if (url.includes('/gdpr/delete-account')) {
            return audit_log_service_1.AuditEventType.ACCOUNT_DELETED;
        }
        return audit_log_service_1.AuditEventType.SENSITIVE_DATA_ACCESSED;
    }
    getClientIp(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded) {
            const ips = (typeof forwarded === 'string' ? forwarded : forwarded[0]).split(',');
            return ips[0].trim();
        }
        const realIp = req.headers['x-real-ip'];
        if (realIp) {
            return typeof realIp === 'string' ? realIp : realIp[0];
        }
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map