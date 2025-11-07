import { AchievementsService } from './achievements.service';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    findAll(): Promise<{
        id: string;
        name: string;
        nameArabic: string;
        description: string;
        icon: string;
        category: string;
        rarity: import(".prisma/client").$Enums.AchievementRarity;
        requirement: import("@prisma/client/runtime/library").JsonValue;
        xpReward: number;
        createdAt: Date;
    }[]>;
    getStats(): Promise<{
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
            id: string;
            name: string;
            nameArabic: string;
            description: string;
            icon: string;
            category: string;
            rarity: import(".prisma/client").$Enums.AchievementRarity;
            requirement: import("@prisma/client/runtime/library").JsonValue;
            xpReward: number;
            createdAt: Date;
        }[];
        commonUnlocked: number;
        rareUnlocked: number;
        epicUnlocked: number;
        legendaryUnlocked: number;
        totalAchievements: number;
        totalUnlocked: number;
    }>;
    getCategories(): Promise<string[]>;
    getAchievementsByCategory(category: string): Promise<{
        id: string;
        name: string;
        nameArabic: string;
        description: string;
        icon: string;
        category: string;
        rarity: import(".prisma/client").$Enums.AchievementRarity;
        requirement: import("@prisma/client/runtime/library").JsonValue;
        xpReward: number;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        nameArabic: string;
        description: string;
        icon: string;
        category: string;
        rarity: import(".prisma/client").$Enums.AchievementRarity;
        requirement: import("@prisma/client/runtime/library").JsonValue;
        xpReward: number;
        createdAt: Date;
    }>;
    getMyStats(userId: string): Promise<{
        commonUnlocked: number;
        rareUnlocked: number;
        epicUnlocked: number;
        legendaryUnlocked: number;
        totalAchievements: number;
        unlockedAchievements: number;
    }>;
    getMyAchievements(userId: string): Promise<({
        achievement: {
            id: string;
            name: string;
            nameArabic: string;
            description: string;
            icon: string;
            category: string;
            rarity: import(".prisma/client").$Enums.AchievementRarity;
            requirement: import("@prisma/client/runtime/library").JsonValue;
            xpReward: number;
            createdAt: Date;
        };
        isUnlocked: boolean;
        unlockedAt: Date | undefined;
        progress: number;
        progressCurrent: number;
        progressRequired: number;
    } | {
        achievement: {
            id: string;
            name: string;
            nameArabic: string;
            description: string;
            icon: string;
            category: string;
            rarity: import(".prisma/client").$Enums.AchievementRarity;
            requirement: import("@prisma/client/runtime/library").JsonValue;
            xpReward: number;
            createdAt: Date;
        };
        isUnlocked: boolean;
        unlockedAt: null;
        progress: number;
        progressCurrent: number;
        progressRequired: number;
    })[]>;
    checkAchievements(userId: string): Promise<{
        achievement: {
            id: string;
            name: string;
            nameArabic: string;
            description: string;
            icon: string;
            category: string;
            rarity: import(".prisma/client").$Enums.AchievementRarity;
            requirement: import("@prisma/client/runtime/library").JsonValue;
            xpReward: number;
            createdAt: Date;
        };
        id: string;
        userId: string;
        achievementId: string;
        unlockedAt: Date;
    }[]>;
}
