import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService, AuditEventType } from '../middleware/audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const userId = request.user?.id || request.user?.sub;

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        // Log specific security-relevant endpoints
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

        // Log all failed requests (4xx, 5xx)
        if (statusCode >= 400) {
          this.auditLogService.log({
            eventType:
              statusCode === 401 || statusCode === 403
                ? AuditEventType.ACCESS_DENIED
                : AuditEventType.SUSPICIOUS_ACTIVITY,
            userId,
            ipAddress: this.getClientIp(request),
            userAgent,
            endpoint: url,
            method,
            statusCode,
            metadata: { duration },
          });
        }
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        // Log errors
        this.auditLogService.log({
          eventType: AuditEventType.SUSPICIOUS_ACTIVITY,
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
      }),
    );
  }

  /**
   * Determine if endpoint is security-relevant and should be logged
   */
  private isSecurityRelevantEndpoint(url: string, _method: string): boolean {
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

  /**
   * Map endpoint and status to audit event type
   */
  private getEventType(url: string, method: string, statusCode: number): AuditEventType {
    if (url.includes('/auth/login')) {
      return statusCode === 200 ? AuditEventType.LOGIN_SUCCESS : AuditEventType.LOGIN_FAILED;
    }

    if (url.includes('/auth/register')) {
      return AuditEventType.REGISTER;
    }

    if (url.includes('/auth/logout')) {
      return AuditEventType.LOGOUT;
    }

    if (url.includes('/auth/refresh')) {
      return AuditEventType.TOKEN_REFRESH;
    }

    if (url.includes('/auth/change-password')) {
      return AuditEventType.PASSWORD_CHANGE;
    }

    if (url.includes('/gdpr/export')) {
      return AuditEventType.DATA_EXPORT_REQUESTED;
    }

    if (url.includes('/gdpr/delete-account')) {
      return AuditEventType.ACCOUNT_DELETED;
    }

    return AuditEventType.SENSITIVE_DATA_ACCESSED;
  }

  /**
   * Extract real client IP address (considering proxies)
   */
  private getClientIp(req: any): string {
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
}
