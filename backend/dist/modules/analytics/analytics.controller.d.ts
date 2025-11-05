import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    trackEvent(userId: string, body: {
        eventType: string;
        eventData?: any;
    }): Promise<{
        id: string;
        userId: string;
        lessonId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        accuracy: import("@prisma/client/runtime/library").Decimal | null;
        timeSpent: number | null;
        xpEarned: number | null;
        exerciseId: string | null;
        eventType: string;
        timestamp: Date;
    }>;
    getMyAnalytics(userId: string, days?: number): Promise<{
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
    getLeaderboard(limit?: number): Promise<{
        rank: number;
        userId: string;
        name: string;
        level: number;
        xp: number;
        streak: number;
        lessonsCompleted: number;
    }[]>;
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
}
