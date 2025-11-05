import { PrismaService } from '../../prisma/prisma.service';
import { UserProgressResponseDto, AnalyticsResponseDto, TopicMasteryResponseDto, ActivityCalendarResponseDto } from './dto';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserProgress(userId: string): Promise<UserProgressResponseDto>;
    addXP(userId: string, xpToAdd: number): Promise<{
        leveledUp: boolean;
        previousLevel: number;
        xpAdded: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currentXP: number;
        currentLevel: number;
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null;
        lessonsCompleted: number;
        exercisesCompleted: number;
        totalTimeSpent: number;
        averageAccuracy: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }>;
    updateStreak(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currentXP: number;
        currentLevel: number;
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null;
        lessonsCompleted: number;
        exercisesCompleted: number;
        totalTimeSpent: number;
        averageAccuracy: import("@prisma/client/runtime/library").Decimal;
        userId: string;
    }>;
    getLessonProgress(userId: string): Promise<({
        lesson: {
            id: string;
            title: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            xpReward: number;
            titleArabic: string;
            track: import(".prisma/client").$Enums.Track;
            stage: number;
        };
    } & {
        id: string;
        userId: string;
        lessonId: string;
        timeSpent: number;
        completedAt: Date | null;
        startedAt: Date | null;
        status: import(".prisma/client").$Enums.LessonStatus;
    })[]>;
    getAchievementProgress(userId: string): Promise<{
        unlocked: {
            id: string;
            name: string;
            createdAt: Date;
            description: string;
            xpReward: number;
            nameArabic: string;
            icon: string;
            category: string;
            rarity: import(".prisma/client").$Enums.AchievementRarity;
            requirement: import("@prisma/client/runtime/library").JsonValue;
        }[];
        locked: {
            id: string;
            name: string;
            createdAt: Date;
            description: string;
            xpReward: number;
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
    getDashboardStats(userId: string): Promise<{
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
            userId: string;
            lessonId: string;
            timeSpent: number;
            completedAt: Date | null;
            startedAt: Date | null;
            status: import(".prisma/client").$Enums.LessonStatus;
        })[];
    }>;
    getAnalytics(userId: string): Promise<AnalyticsResponseDto>;
    getTopicMastery(userId: string): Promise<TopicMasteryResponseDto>;
    getActivityCalendar(userId: string, days?: number): Promise<ActivityCalendarResponseDto>;
    private calculateXPForLevel;
    private calculateLevelFromXP;
    private getDaysDifference;
}
