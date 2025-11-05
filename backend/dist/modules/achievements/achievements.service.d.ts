import { PrismaService } from '../../prisma/prisma.service';
export declare class AchievementsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    }>;
    getUserAchievements(userId: string): Promise<({
        achievement: {
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
        };
        isUnlocked: boolean;
        unlockedAt: Date | undefined;
        progress: number;
        progressCurrent: number;
        progressRequired: number;
    } | {
        achievement: {
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
        };
        isUnlocked: boolean;
        unlockedAt: null;
        progress: number;
        progressCurrent: number;
        progressRequired: number;
    })[]>;
    checkAndUnlockAchievements(userId: string): Promise<{
        achievement: {
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
        };
        id: string;
        userId: string;
        achievementId: string;
        unlockedAt: Date;
    }[]>;
    private calculateProgress;
    private checkRequirement;
    getAchievementsByCategory(category: string): Promise<{
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
    }[]>;
    getAchievementCategories(): Promise<string[]>;
    getAchievementStats(): Promise<{
        categoriesBreakdown: Record<string, {
            total: number;
            unlocked: number;
        }>;
        topAchievers: {
            userId: string;
            name: string;
            achievementsCount: number;
        }[];
        rarestAchievements: {
            unlockedBy: number;
            _count: {
                userAchievements: number;
            };
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
        commonUnlocked: number;
        rareUnlocked: number;
        epicUnlocked: number;
        legendaryUnlocked: number;
        totalAchievements: number;
        totalUnlocked: number;
    }>;
}
