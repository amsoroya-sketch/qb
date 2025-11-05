import { PrismaService } from '../../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    trackEvent(userId: string, eventType: string, eventData?: any): Promise<{
        id: string;
        xpEarned: number | null;
        timeSpent: number | null;
        userId: string;
        lessonId: string | null;
        eventType: string;
        timestamp: Date;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        exerciseId: string | null;
        accuracy: import("@prisma/client/runtime/library").Decimal | null;
    }>;
    getUserAnalytics(userId: string, days?: number): Promise<{
        totalEvents: number;
        activityByDay: {
            date: string;
            count: number;
        }[];
        eventTypeBreakdown: {
            eventType: string;
            count: number;
        }[];
        timeSpentPerDay: {
            date: string;
            timeSpent: number;
        }[];
        xpGainedOverTime: {
            date: string;
            xp: number;
        }[];
    }>;
    getAdminAnalytics(): Promise<{
        overview: {
            totalUsers: number;
            activeUsers: number;
            userGrowthLast30Days: number;
            totalLessonsCompleted: number;
            totalExercisesCompleted: number;
            averageAccuracy: number;
        };
        popularLessons: {
            id: string;
            title: string;
            titleArabic: string;
            enrollments: number;
        }[];
        levelDistribution: {
            level: number;
            count: number;
        }[];
    }>;
    getLeaderboard(limit?: number): Promise<{
        rank: number;
        userId: string;
        name: string;
        level: number;
        xp: number;
        streak: number;
        lessonsCompleted: number;
    }[]>;
    private groupByDay;
    private countByEventType;
    private getTimeSpentPerDay;
    private getXPOverTime;
    private getUserLevelDistribution;
}
