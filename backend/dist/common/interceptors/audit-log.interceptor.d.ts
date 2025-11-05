import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuditLogService } from '../middleware/audit-log.service';
export declare class AuditLogInterceptor implements NestInterceptor {
    private auditLogService;
    constructor(auditLogService: AuditLogService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private isSecurityRelevantEndpoint;
    private getEventType;
    private getClientIp;
}
