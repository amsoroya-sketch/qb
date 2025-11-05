import { ProgressService } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    getMyProgress(userId: string): Promise<import("./dto").UserProgressResponseDto>;
    getDashboard(userId: string): Promise<{
        currentLevel: number;
        currentXP: number;
        xpForNextLevel: number;
        levelProgress: number;
        currentStreak: number;
        longestStreak: number;
        lessonsCompleted: number;
        exercisesCompleted: number;
        achievementsUnlocked: number;
        accuracy: number;
        totalTimeSpent: number;
        recentActivity: ({
            lesson: {
                title: string;
                titleArabic: string;
                track: import(".prisma/client").$Enums.Track;
            };
        } & {
            id: string;
            startedAt: Date | null;
            timeSpent: number;
            completedAt: Date | null;
            userId: string;
            lessonId: string;
            status: import(".prisma/client").$Enums.LessonStatus;
        })[];
    }>;
    getMyLessonProgress(userId: string): Promise<({
        lesson: {
            id: string;
            title: string;
            titleArabic: string;
            stage: number;
            track: import(".prisma/client").$Enums.Track;
            xpReward: number;
            difficulty: import(".prisma/client").$Enums.Difficulty;
        };
    } & {
        id: string;
        startedAt: Date | null;
        timeSpent: number;
        completedAt: Date | null;
        userId: string;
        lessonId: string;
        status: import(".prisma/client").$Enums.LessonStatus;
    })[]>;
    getMyAchievements(userId: string): Promise<{
        unlocked: {
            description: string;
            id: string;
            name: string;
            xpReward: number;
            createdAt: Date;
            nameArabic: string;
            icon: string;
            category: string;
            rarity: import(".prisma/client").$Enums.AchievementRarity;
            requirement: import("@prisma/client/runtime/library").JsonValue;
        }[];
        locked: {
            description: string;
            id: string;
            name: string;
            xpReward: number;
            createdAt: Date;
            nameArabic: string;
            icon: string;
            category: string;
            rarity: import(".prisma/client").$Enums.AchievementRarity;
            requirement: import("@prisma/client/runtime/library").JsonValue;
        }[];
        totalUnlocked: number;
        totalAchievements: number;
        completionPercentage: number;
    }>;
    updateMyStreak(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currentXP: number;
        currentLevel: number;
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null;
        lessonsCompleted: number;
        exercisesCompleted: number;
        totalTimeSpent: number;
        averageAccuracy: import("@prisma/client/runtime/library").Decimal;
    }>;
    getMyAnalytics(userId: string): Promise<import("./dto").AnalyticsResponseDto>;
    getMyTopicMastery(userId: string): Promise<import("./dto").TopicMasteryResponseDto>;
    getMyActivityCalendar(userId: string, days?: string): Promise<import("./dto").ActivityCalendarResponseDto>;
    getUserProgress(userId: string): Promise<import("./dto").UserProgressResponseDto>;
}
