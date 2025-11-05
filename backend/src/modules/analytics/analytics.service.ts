import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(userId: string, eventType: string, eventData?: any) {
    const event = await this.prisma.userEvent.create({
      data: {
        userId,
        eventType,
        metadata: eventData || null,
      },
    });

    return event;
  }

  async getUserAnalytics(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Get user events
    const events = await this.prisma.userEvent.findMany({
      where: {
        userId,
        timestamp: {
          gte: since,
        },
      },
      orderBy: { timestamp: 'desc' },
    });

    // Activity by day
    const activityByDay = this.groupByDay(events);

    // Event type breakdown
    const eventTypeCount = this.countByEventType(events);

    // Learning time per day
    const timePerDay = await this.getTimeSpentPerDay(userId, since);

    // XP gained over time
    const xpOverTime = await this.getXPOverTime(userId, since);

    return {
      totalEvents: events.length,
      activityByDay,
      eventTypeBreakdown: eventTypeCount,
      timeSpentPerDay: timePerDay,
      xpGainedOverTime: xpOverTime,
    };
  }

  async getAdminAnalytics() {
    // Total users
    const totalUsers = await this.prisma.user.count();

    // Active users (logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers = await this.prisma.user.count({
      where: {
        progress: {
          lastActiveDate: {
            gte: thirtyDaysAgo,
          },
        },
      },
    });

    // Total lessons completed
    const totalLessonsCompleted = await this.prisma.userLessonProgress.count({
      where: { status: 'COMPLETED' },
    });

    // Total exercises completed
    const totalExercisesCompleted = await this.prisma.userExercise.count({
      where: { isCorrect: true },
    });

    // Average accuracy
    const allExercises = await this.prisma.userExercise.count();
    const correctExercises = await this.prisma.userExercise.count({
      where: { isCorrect: true },
    });
    const avgAccuracy = allExercises > 0 ? (correctExercises / allExercises) * 100 : 0;

    // User growth (last 30 days)
    const userGrowth = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Most popular lessons
    const popularLessons = await this.prisma.lesson.findMany({
      include: {
        _count: {
          select: { userProgress: true },
        },
      },
      orderBy: {
        userProgress: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // User level distribution
    const levelDistribution = await this.getUserLevelDistribution();

    return {
      overview: {
        totalUsers,
        activeUsers,
        userGrowthLast30Days: userGrowth,
        totalLessonsCompleted,
        totalExercisesCompleted,
        averageAccuracy: Math.round(avgAccuracy * 10) / 10,
      },
      popularLessons: popularLessons.map((l) => ({
        id: l.id,
        title: l.title,
        titleArabic: l.titleArabic,
        enrollments: l._count.userProgress,
      })),
      levelDistribution,
    };
  }

  async getLeaderboard(limit: number = 50) {
    const users = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        progress: true,
      },
      orderBy: {
        progress: {
          currentXP: 'desc',
        },
      },
      take: limit,
    });

    return users
      .filter((u) => u.progress)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        name: user.name,
        level: user.progress!.currentLevel,
        xp: user.progress!.currentXP,
        streak: user.progress!.currentStreak,
        lessonsCompleted: user.progress!.lessonsCompleted,
      }));
  }

  // Helper methods
  private groupByDay(events: any[]) {
    const grouped: Record<string, number> = {};

    events.forEach((event) => {
      const date = event.timestamp.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private countByEventType(events: any[]) {
    const counts: Record<string, number> = {};

    events.forEach((event) => {
      counts[event.eventType] = (counts[event.eventType] || 0) + 1;
    });

    return Object.entries(counts).map(([eventType, count]) => ({
      eventType,
      count,
    }));
  }

  private async getTimeSpentPerDay(userId: string, since: Date) {
    const lessonProgress = await this.prisma.userLessonProgress.findMany({
      where: {
        userId,
        startedAt: {
          gte: since,
        },
      },
    });

    const grouped: Record<string, number> = {};

    lessonProgress.forEach((lp) => {
      if (lp.startedAt) {
        const date = lp.startedAt.toISOString().split('T')[0];
        grouped[date] = (grouped[date] || 0) + lp.timeSpent;
      }
    });

    return Object.entries(grouped).map(([date, timeSpent]) => ({
      date,
      timeSpent: Math.round(timeSpent / 60), // Convert to minutes
    }));
  }

  private async getXPOverTime(userId: string, since: Date) {
    // This is a simplified version - in production, you'd track XP changes in events
    const exercises = await this.prisma.userExercise.findMany({
      where: {
        userId,
        completedAt: {
          gte: since,
        },
      },
      orderBy: { completedAt: 'asc' },
    });

    const grouped: Record<string, number> = {};

    exercises.forEach((ex) => {
      const date = ex.completedAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + ex.xpEarned;
    });

    return Object.entries(grouped).map(([date, xp]) => ({
      date,
      xp,
    }));
  }

  private async getUserLevelDistribution() {
    const users = await this.prisma.userProgress.groupBy({
      by: ['currentLevel'],
      _count: {
        currentLevel: true,
      },
      orderBy: {
        currentLevel: 'asc',
      },
    });

    return users.map((u) => ({
      level: u.currentLevel,
      count: u._count.currentLevel,
    }));
  }
}
