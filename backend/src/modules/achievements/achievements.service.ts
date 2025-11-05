import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const achievements = await this.prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { xpReward: 'asc' }],
    });

    return achievements;
  }

  async findOne(id: string) {
    const achievement = await this.prisma.achievement.findUnique({
      where: { id },
    });

    if (!achievement) {
      throw new NotFoundException(`Achievement with ID ${id} not found`);
    }

    return achievement;
  }

  async getUserAchievements(userId: string) {
    // Get user progress for calculating locked achievement progress
    const userProgress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    // Get all unlocked achievements
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    // Get all achievements to include locked ones with progress
    const allAchievements = await this.prisma.achievement.findMany({
      orderBy: [{ category: 'asc' }, { xpReward: 'asc' }],
    });

    const unlockedIdSet = new Set(userAchievements.map((ua) => ua.achievementId));

    // Map all achievements with progress data
    const achievementsWithProgress = allAchievements.map((achievement) => {
      const isUnlocked = unlockedIdSet.has(achievement.id);
      const userAchievement = userAchievements.find((ua) => ua.achievementId === achievement.id);

      if (isUnlocked) {
        // Unlocked achievements have 100% progress
        return {
          achievement,
          isUnlocked: true,
          unlockedAt: userAchievement?.unlockedAt,
          progress: 100,
          progressCurrent: 0,
          progressRequired: 0,
        };
      }

      // Calculate progress for locked achievements
      const requirement =
        typeof achievement.requirement === 'string'
          ? JSON.parse(achievement.requirement)
          : achievement.requirement;

      const progressData = this.calculateProgress(userProgress, requirement);

      return {
        achievement,
        isUnlocked: false,
        unlockedAt: null,
        progress: progressData.percentage,
        progressCurrent: progressData.current,
        progressRequired: progressData.required,
      };
    });

    return achievementsWithProgress;
  }

  async checkAndUnlockAchievements(userId: string) {
    // Get user progress
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      return [];
    }

    // Get all achievements not yet unlocked
    const unlockedIds = await this.prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });

    const unlockedIdSet = new Set(unlockedIds.map((ua) => ua.achievementId));

    const allAchievements = await this.prisma.achievement.findMany();
    const lockedAchievements = allAchievements.filter((a) => !unlockedIdSet.has(a.id));

    // Check each locked achievement
    const newlyUnlocked = [];

    for (const achievement of lockedAchievements) {
      const requirement =
        typeof achievement.requirement === 'string'
          ? JSON.parse(achievement.requirement)
          : achievement.requirement;

      if (this.checkRequirement(progress, requirement)) {
        // Unlock achievement
        const userAchievement = await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        // Award XP
        await this.prisma.userProgress.update({
          where: { userId },
          data: {
            currentXP: { increment: achievement.xpReward },
          },
        });

        newlyUnlocked.push({
          ...userAchievement,
          achievement,
        });
      }
    }

    return newlyUnlocked;
  }

  private calculateProgress(
    progress: any,
    requirement: any,
  ): { percentage: number; current: number; required: number } {
    if (!progress) {
      return { percentage: 0, current: 0, required: 0 };
    }

    let current = 0;
    let required = 0;

    switch (requirement.type) {
      case 'lessons_completed':
        current = progress.lessonsCompleted;
        required = requirement.count;
        break;

      case 'exercises_completed':
        current = progress.exercisesCompleted;
        required = requirement.count;
        break;

      case 'streak':
        current = progress.currentStreak;
        required = requirement.count;
        break;

      case 'level':
        current = progress.currentLevel;
        required = requirement.level;
        break;

      case 'xp':
        current = progress.currentXP;
        required = requirement.xp;
        break;

      case 'time_spent':
        current = Math.floor(progress.totalTimeSpent / 3600);
        required = requirement.hours;
        break;

      case 'accuracy':
        current = Number(progress.averageAccuracy);
        required = requirement.value;
        break;

      default:
        return { percentage: 0, current: 0, required: 0 };
    }

    const percentage = required > 0 ? Math.min(100, Math.floor((current / required) * 100)) : 0;

    return { percentage, current, required };
  }

  private checkRequirement(progress: any, requirement: any): boolean {
    switch (requirement.type) {
      case 'lessons_completed':
        return progress.lessonsCompleted >= requirement.count;

      case 'exercises_completed':
        return progress.exercisesCompleted >= requirement.count;

      case 'streak':
        return progress.currentStreak >= requirement.count;

      case 'level':
        return progress.currentLevel >= requirement.level;

      case 'xp':
        return progress.currentXP >= requirement.xp;

      case 'time_spent':
        const hoursSpent = progress.totalTimeSpent / 3600;
        return hoursSpent >= requirement.hours;

      case 'accuracy':
        return progress.averageAccuracy >= requirement.value;

      default:
        return false;
    }
  }

  async getAchievementsByCategory(category: string) {
    const achievements = await this.prisma.achievement.findMany({
      where: { category },
      orderBy: { xpReward: 'asc' },
    });

    if (achievements.length === 0) {
      throw new NotFoundException(`No achievements found for category: ${category}`);
    }

    return achievements;
  }

  async getAchievementCategories() {
    const achievements = await this.prisma.achievement.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return achievements.map((a) => a.category);
  }

  async getAchievementStats() {
    const totalAchievements = await this.prisma.achievement.count();
    const totalUnlocked = await this.prisma.userAchievement.count();

    const topAchievers = await this.prisma.user.findMany({
      include: {
        _count: {
          select: { achievements: true },
        },
        achievements: {
          include: { achievement: true },
        },
      },
      orderBy: {
        achievements: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const rarest = await this.prisma.achievement.findMany({
      include: {
        _count: {
          select: { userAchievements: true },
        },
      },
      orderBy: {
        userAchievements: {
          _count: 'asc',
        },
      },
      take: 10,
    });

    // Get all achievements with category for breakdown
    const allAchievements = await this.prisma.achievement.findMany({
      include: {
        _count: {
          select: { userAchievements: true },
        },
      },
    });

    // Calculate rarity breakdown
    const rarityBreakdown = {
      commonUnlocked: 0,
      rareUnlocked: 0,
      epicUnlocked: 0,
      legendaryUnlocked: 0,
    };

    // Calculate based on unlock percentage
    allAchievements.forEach((achievement) => {
      const unlockPercentage =
        totalUnlocked > 0 ? (achievement._count.userAchievements / totalUnlocked) * 100 : 0;

      if (unlockPercentage >= 50) {
        rarityBreakdown.commonUnlocked += achievement._count.userAchievements;
      } else if (unlockPercentage >= 20) {
        rarityBreakdown.rareUnlocked += achievement._count.userAchievements;
      } else if (unlockPercentage >= 5) {
        rarityBreakdown.epicUnlocked += achievement._count.userAchievements;
      } else {
        rarityBreakdown.legendaryUnlocked += achievement._count.userAchievements;
      }
    });

    // Get categories breakdown
    const categories = await this.getAchievementCategories();
    const categoriesBreakdown: Record<string, { total: number; unlocked: number }> = {};

    for (const category of categories) {
      const categoryAchievements = allAchievements.filter((a) => a.category === category);
      const total = categoryAchievements.length;
      const unlocked = categoryAchievements.reduce((sum, a) => sum + a._count.userAchievements, 0);

      categoriesBreakdown[category] = { total, unlocked };
    }

    return {
      totalAchievements,
      totalUnlocked,
      ...rarityBreakdown,
      categoriesBreakdown,
      topAchievers: topAchievers.map((user) => ({
        userId: user.id,
        name: user.name,
        achievementsCount: user._count.achievements,
      })),
      rarestAchievements: rarest.map((a) => ({
        ...a,
        unlockedBy: a._count.userAchievements,
      })),
    };
  }
}
