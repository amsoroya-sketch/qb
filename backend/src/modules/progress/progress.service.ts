import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  UserProgressResponseDto,
  AnalyticsResponseDto,
  TopicMasteryResponseDto,
  ActivityCalendarResponseDto,
  XpHistoryItem,
  LevelMilestone,
  TopicItem,
  MasteryLevel,
  CalendarDayItem,
  ActivityLevel,
} from './dto';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string): Promise<UserProgressResponseDto> {
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      throw new NotFoundException('User progress not found');
    }

    // Calculate level progress
    const xpForNextLevel = this.calculateXPForLevel(progress.currentLevel + 1);
    const xpForCurrentLevel = this.calculateXPForLevel(progress.currentLevel);
    const xpInCurrentLevel = progress.currentXP - xpForCurrentLevel;
    const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
    const levelProgressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

    return {
      ...progress,
      averageAccuracy: Number(progress.averageAccuracy),
      xpForNextLevel,
      xpNeededForNextLevel,
      levelProgressPercentage: Math.round(levelProgressPercentage * 10) / 10,
    };
  }

  async addXP(userId: string, xpToAdd: number) {
    const currentProgress = await this.getUserProgress(userId);
    const newXP = currentProgress.currentXP + xpToAdd;

    // Check if level up
    const newLevel = this.calculateLevelFromXP(newXP);
    const leveledUp = newLevel > currentProgress.currentLevel;

    const updatedProgress = await this.prisma.userProgress.update({
      where: { userId },
      data: {
        currentXP: newXP,
        currentLevel: newLevel,
      },
    });

    return {
      ...updatedProgress,
      leveledUp,
      previousLevel: currentProgress.currentLevel,
      xpAdded: xpToAdd,
    };
  }

  async updateStreak(userId: string) {
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      throw new NotFoundException('User progress not found');
    }

    const now = new Date();
    const lastActive = progress.lastActiveDate;

    // If no last active date, set streak to 1
    if (!lastActive) {
      return this.prisma.userProgress.update({
        where: { userId },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(progress.longestStreak, 1),
          lastActiveDate: now,
        },
      });
    }

    const daysDiff = this.getDaysDifference(lastActive, now);

    let newStreak = progress.currentStreak;
    let longestStreak = progress.longestStreak;

    if (daysDiff === 0) {
      // Same day, don't change streak
      return progress;
    } else if (daysDiff === 1) {
      // Next day, increment streak
      newStreak += 1;
      longestStreak = Math.max(longestStreak, newStreak);
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }

    return this.prisma.userProgress.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak,
        lastActiveDate: now,
      },
    });
  }

  async getLessonProgress(userId: string) {
    const lessonProgress = await this.prisma.userLessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            titleArabic: true,
            track: true,
            stage: true,
            difficulty: true,
            xpReward: true,
          },
        },
      },
      orderBy: [
        { lesson: { track: 'asc' } },
        { lesson: { stage: 'asc' } },
        { lesson: { order: 'asc' } },
      ],
    });

    return lessonProgress;
  }

  async getAchievementProgress(userId: string) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    const allAchievements = await this.prisma.achievement.findMany({
      orderBy: { xpReward: 'asc' },
    });

    const unlocked = userAchievements.map((ua) => ua.achievement);
    const locked = allAchievements.filter((a) => !unlocked.find((u) => u.id === a.id));

    return {
      unlocked,
      locked,
      totalUnlocked: unlocked.length,
      totalAchievements: allAchievements.length,
      completionPercentage: (unlocked.length / allAchievements.length) * 100,
    };
  }

  async getDashboardStats(userId: string) {
    const [progress, lessonProgress, , achievements] = await Promise.all([
      this.getUserProgress(userId),
      this.prisma.userLessonProgress.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.userExercise.count({ where: { userId, isCorrect: true } }),
      this.prisma.userAchievement.count({ where: { userId } }),
    ]);

    // Get recent activity
    const recentLessons = await this.prisma.userLessonProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          select: { title: true, titleArabic: true, track: true },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 5,
    });

    // Calculate accuracy
    const totalExercises = await this.prisma.userExercise.count({ where: { userId } });
    const correctExercises = await this.prisma.userExercise.count({
      where: { userId, isCorrect: true },
    });
    const accuracy = totalExercises > 0 ? (correctExercises / totalExercises) * 100 : 0;

    return {
      currentLevel: progress.currentLevel,
      currentXP: progress.currentXP,
      xpForNextLevel: progress.xpForNextLevel,
      levelProgress: progress.levelProgressPercentage,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      lessonsCompleted: lessonProgress,
      exercisesCompleted: correctExercises,
      achievementsUnlocked: achievements,
      accuracy: Math.round(accuracy * 10) / 10,
      totalTimeSpent: progress.totalTimeSpent,
      recentActivity: recentLessons,
    };
  }

  async getAnalytics(userId: string): Promise<AnalyticsResponseDto> {
    // Get current progress
    const progress = await this.getUserProgress(userId);

    // Get XP history for past 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch all exercises and lesson completions to calculate daily XP
    const exercises = await this.prisma.userExercise.findMany({
      where: {
        userId,
        completedAt: { gte: thirtyDaysAgo },
      },
      orderBy: { completedAt: 'asc' },
      select: {
        xpEarned: true,
        completedAt: true,
      },
    });

    const lessonCompletions = await this.prisma.userLessonProgress.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: thirtyDaysAgo },
      },
      orderBy: { completedAt: 'asc' },
      select: {
        completedAt: true,
        lesson: {
          select: { xpReward: true },
        },
      },
    });

    // Build XP history by day
    const cumulativeXP = progress.currentXP;

    // Calculate starting XP (30 days ago)
    const totalXpGained =
      exercises.reduce((sum, e) => sum + e.xpEarned, 0) +
      lessonCompletions.reduce((sum, lc) => sum + lc.lesson.xpReward, 0);
    const startingXP = cumulativeXP - totalXpGained;

    // Generate all dates for past 30 days
    const xpHistory: XpHistoryItem[] = [];
    let currentXP = startingXP;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Add XP from exercises on this day
      const dayExercises = exercises.filter(
        (e) => e.completedAt.toISOString().split('T')[0] === dateStr,
      );
      const dayLessons = lessonCompletions.filter(
        (lc) => lc.completedAt && lc.completedAt.toISOString().split('T')[0] === dateStr,
      );

      const dayXP =
        dayExercises.reduce((sum, e) => sum + e.xpEarned, 0) +
        dayLessons.reduce((sum, lc) => sum + lc.lesson.xpReward, 0);

      currentXP += dayXP;

      xpHistory.push({
        date: dateStr,
        xp: currentXP,
        level: this.calculateLevelFromXP(currentXP),
      });
    }

    // Calculate level milestones
    const maxLevel = progress.currentLevel + 5; // Show next 5 levels
    const levelMilestones: LevelMilestone[] = [];

    for (let level = 1; level <= maxLevel; level++) {
      const xpRequired = this.calculateXPForLevel(level);

      // Find when user achieved this level
      let achievedDate: string | null = null;
      if (level <= progress.currentLevel) {
        // Find first time XP reached this threshold
        const milestone = xpHistory.find((h) => h.level >= level);
        achievedDate = milestone ? new Date(milestone.date).toISOString() : null;
      }

      levelMilestones.push({
        level,
        xpRequired,
        achievedDate,
      });
    }

    // Calculate weekly stats
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Current week (last 7 days)
    const currentWeekExercises = await this.prisma.userExercise.findMany({
      where: {
        userId,
        completedAt: { gte: oneWeekAgo },
      },
      select: { xpEarned: true },
    });

    const currentWeekLessons = await this.prisma.userLessonProgress.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: oneWeekAgo },
      },
    });

    const currentWeekXP = currentWeekExercises.reduce((sum, e) => sum + e.xpEarned, 0);

    // Last week (7-14 days ago)
    const lastWeekExercises = await this.prisma.userExercise.findMany({
      where: {
        userId,
        completedAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
      },
      select: { xpEarned: true },
    });

    const lastWeekLessons = await this.prisma.userLessonProgress.count({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
      },
    });

    const lastWeekXP = lastWeekExercises.reduce((sum, e) => sum + e.xpEarned, 0);

    // Calculate percentage change
    const change = lastWeekXP === 0 ? 100 : ((currentWeekXP - lastWeekXP) / lastWeekXP) * 100;

    return {
      xpHistory,
      levelMilestones,
      weeklyStats: {
        currentWeek: {
          xpGained: currentWeekXP,
          lessonsCompleted: currentWeekLessons,
        },
        lastWeek: {
          xpGained: lastWeekXP,
          lessonsCompleted: lastWeekLessons,
        },
        change: Math.round(change * 10) / 10,
      },
    };
  }

  async getTopicMastery(userId: string): Promise<TopicMasteryResponseDto> {
    // Get all exercises with their lesson grammar topics
    const userExercises = await this.prisma.userExercise.findMany({
      where: { userId },
      include: {
        exercise: {
          include: {
            lesson: {
              select: {
                grammarTopic: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    if (userExercises.length === 0) {
      return {
        topics: [],
        overallMastery: 0,
        strongestTopic: null,
        weakestTopic: null,
      };
    }

    // Group by grammar topic
    const topicMap = new Map<
      string,
      {
        total: number;
        correct: number;
        lastPracticed: Date;
      }
    >();

    for (const ue of userExercises) {
      const topic = ue.exercise.lesson.grammarTopic;

      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          total: 0,
          correct: 0,
          lastPracticed: ue.completedAt,
        });
      }

      const topicData = topicMap.get(topic)!;
      topicData.total += 1;
      if (ue.isCorrect) {
        topicData.correct += 1;
      }
      // Update last practiced if this is more recent
      if (ue.completedAt > topicData.lastPracticed) {
        topicData.lastPracticed = ue.completedAt;
      }
    }

    // Calculate topics with mastery levels
    const topics: TopicItem[] = [];
    let totalAccuracy = 0;

    for (const [topic, data] of topicMap.entries()) {
      const accuracy = (data.correct / data.total) * 100;
      totalAccuracy += accuracy;

      let level: MasteryLevel;
      if (accuracy >= 80) {
        level = 'advanced';
      } else if (accuracy >= 60) {
        level = 'intermediate';
      } else {
        level = 'beginner';
      }

      topics.push({
        topic,
        totalExercises: data.total,
        correctAnswers: data.correct,
        accuracy: Math.round(accuracy * 10) / 10,
        lastPracticed: data.lastPracticed.toISOString(),
        level,
      });
    }

    // Sort by accuracy descending
    topics.sort((a, b) => b.accuracy - a.accuracy);

    const overallMastery = totalAccuracy / topics.length;
    const strongestTopic = topics.length > 0 ? topics[0].topic : null;
    const weakestTopic = topics.length > 0 ? topics[topics.length - 1].topic : null;

    return {
      topics,
      overallMastery: Math.round(overallMastery * 10) / 10,
      strongestTopic,
      weakestTopic,
    };
  }

  async getActivityCalendar(
    userId: string,
    days: number = 365,
  ): Promise<ActivityCalendarResponseDto> {
    // Validate days parameter
    if (days < 1 || days > 730) {
      days = 365; // Default to 1 year
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all exercises in the time range
    const exercises = await this.prisma.userExercise.findMany({
      where: {
        userId,
        completedAt: { gte: startDate },
      },
      select: {
        completedAt: true,
        xpEarned: true,
        timeSpent: true,
        isCorrect: true,
      },
    });

    // Get all lesson completions
    const lessonCompletions = await this.prisma.userLessonProgress.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        completedAt: { gte: startDate },
      },
      select: {
        completedAt: true,
        timeSpent: true,
        lesson: {
          select: { xpReward: true },
        },
      },
    });

    // Build daily activity map
    const activityMap = new Map<
      string,
      {
        exercisesCompleted: number;
        lessonsCompleted: number;
        xpEarned: number;
        timeSpent: number;
      }
    >();

    // Initialize all days with zero activity
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      activityMap.set(dateStr, {
        exercisesCompleted: 0,
        lessonsCompleted: 0,
        xpEarned: 0,
        timeSpent: 0,
      });
    }

    // Aggregate exercises by day
    for (const exercise of exercises) {
      const dateStr = exercise.completedAt.toISOString().split('T')[0];
      if (!activityMap.has(dateStr)) continue;

      const dayData = activityMap.get(dateStr)!;
      dayData.exercisesCompleted += 1;
      dayData.xpEarned += exercise.xpEarned;
      dayData.timeSpent += exercise.timeSpent;
    }

    // Aggregate lessons by day
    for (const lesson of lessonCompletions) {
      if (!lesson.completedAt) continue;
      const dateStr = lesson.completedAt.toISOString().split('T')[0];
      if (!activityMap.has(dateStr)) continue;

      const dayData = activityMap.get(dateStr)!;
      dayData.lessonsCompleted += 1;
      dayData.xpEarned += lesson.lesson.xpReward;
      dayData.timeSpent += lesson.timeSpent;
    }

    // Build calendar array with activity levels
    const calendar: CalendarDayItem[] = [];
    const dates = Array.from(activityMap.keys()).sort();

    for (const date of dates) {
      const data = activityMap.get(date)!;

      // Determine activity level based on XP
      let activityLevel: ActivityLevel;
      if (data.xpEarned === 0) {
        activityLevel = 'none';
      } else if (data.xpEarned <= 50) {
        activityLevel = 'low';
      } else if (data.xpEarned <= 150) {
        activityLevel = 'medium';
      } else {
        activityLevel = 'high';
      }

      calendar.push({
        date,
        exercisesCompleted: data.exercisesCompleted,
        lessonsCompleted: data.lessonsCompleted,
        xpEarned: data.xpEarned,
        timeSpent: Math.round(data.timeSpent / 60), // Convert to minutes
        activityLevel,
      });
    }

    // Calculate statistics
    const activeDays = calendar.filter((d) => d.xpEarned > 0);
    const totalActiveDays = activeDays.length;

    // Calculate streaks using existing method (get from progress)
    const progress = await this.getUserProgress(userId);

    // Calculate longest streak from calendar data
    let longestStreak = 0;
    let currentStreak = 0;

    const sortedDates = [...dates].sort().reverse(); // Most recent first
    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const data = activityMap.get(date)!;

      if (data.xpEarned > 0) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Average XP per active day
    const totalXP = activeDays.reduce((sum, d) => sum + d.xpEarned, 0);
    const averagePerDay = totalActiveDays > 0 ? totalXP / totalActiveDays : 0;

    return {
      calendar,
      stats: {
        totalActiveDays,
        longestStreak,
        currentStreak: progress.currentStreak,
        averagePerDay: Math.round(averagePerDay * 10) / 10,
      },
    };
  }

  // Helper methods
  private calculateXPForLevel(level: number): number {
    // XP curve: level * 100 * 1.5^(level-1)
    // Level 1: 0 XP
    // Level 2: 100 XP
    // Level 3: 250 XP
    // Level 4: 475 XP
    // Level 5: 812 XP
    if (level === 1) return 0;
    return Math.floor(100 * level * Math.pow(1.5, level - 2));
  }

  private calculateLevelFromXP(xp: number): number {
    let level = 1;
    while (this.calculateXPForLevel(level + 1) <= xp) {
      level++;
    }
    return level;
  }

  private getDaysDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
    return diffDays;
  }
}
