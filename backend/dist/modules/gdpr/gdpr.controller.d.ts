import { GdprService } from './gdpr.service';
export declare class GdprController {
    private gdprService;
    constructor(gdprService: GdprService);
    exportData(userId: string): Promise<{
        success: boolean;
        data: import("./gdpr.service").GDPRDataExport;
    }>;
    getDataSummary(userId: string): Promise<{
        success: boolean;
        data: {
            user: any;
            dataCounts: {
                exercises: number;
                achievements: number;
                lessonProgress: number;
                bookmarks: number;
                events: number;
            };
        };
    }>;
    deleteAccount(userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            deleted: boolean;
            deletedAt: string;
        };
    }>;
}
