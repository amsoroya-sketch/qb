import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogService } from '../../common/middleware/audit-log.service';
export interface GDPRDataExport {
    exportMetadata: {
        userId: string;
        exportedAt: string;
        formatVersion: string;
        dataTypes: string[];
    };
    userData: {
        profile: any;
        progress: any;
        exercises: any[];
        achievements: any[];
        lessonProgress: any[];
        bookmarks: any[];
        events: any[];
    };
}
export declare class GdprService {
    private prisma;
    private auditLog;
    constructor(prisma: PrismaService, auditLog: AuditLogService);
    exportUserData(userId: string, ipAddress?: string): Promise<GDPRDataExport>;
    deleteUserData(userId: string, ipAddress?: string): Promise<{
        deleted: boolean;
        deletedAt: string;
    }>;
    getUserDataSummary(userId: string): Promise<{
        user: any;
        dataCounts: {
            exercises: number;
            achievements: number;
            lessonProgress: number;
            bookmarks: number;
            events: number;
        };
    }>;
}
