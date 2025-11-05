import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FindLessonsDto } from './dto/find-lessons.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    const lesson = await this.prisma.lesson.create({
      data: dto,
    });

    return lesson;
  }

  async findAll(query: FindLessonsDto) {
    const { page = 1, limit = 20, track, stage, difficulty } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (track) where.track = track;
    if (stage) where.stage = stage;
    if (difficulty) where.difficulty = difficulty;

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ stage: 'asc' }, { order: 'asc' }],
        include: {
          _count: {
            select: { exercises: true },
          },
        },
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return {
      data: lessons,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
        verses: {
          include: {
            verse: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    return lesson;
  }

  async update(id: string, dto: UpdateLessonDto) {
    await this.findOne(id);

    const lesson = await this.prisma.lesson.update({
      where: { id },
      data: dto,
    });

    return lesson;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.lesson.delete({
      where: { id },
    });

    return { message: 'Lesson deleted successfully' };
  }

  async getUserLessonProgress(userId: string, lessonId: string) {
    let progress = await this.prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (!progress) {
      progress = await this.prisma.userLessonProgress.create({
        data: {
          userId,
          lessonId,
          status: 'NOT_STARTED',
        },
      });
    }

    return progress;
  }

  async startLesson(userId: string, lessonId: string) {
    await this.findOne(lessonId);

    const progress = await this.prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      create: {
        userId,
        lessonId,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
      update: {
        status: 'IN_PROGRESS',
        startedAt: new Date(),
      },
    });

    return progress;
  }

  async completeLesson(userId: string, lessonId: string, timeSpent: number) {
    const lesson = await this.findOne(lessonId);

    const progress = await this.prisma.userLessonProgress.update({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        timeSpent,
      },
    });

    // Update user progress
    await this.prisma.userProgress.update({
      where: { userId },
      data: {
        lessonsCompleted: {
          increment: 1,
        },
        currentXP: {
          increment: lesson.xpReward,
        },
        totalTimeSpent: {
          increment: timeSpent,
        },
      },
    });

    return progress;
  }
}
