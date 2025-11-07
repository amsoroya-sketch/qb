import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { ProgressModule } from './modules/progress/progress.module';
import { VersesModule } from './modules/verses/verses.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { GdprModule } from './modules/gdpr/gdpr.module';
import { PracticeModule } from './modules/practice/practice.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ExamModule } from './modules/exam/exam.module';
import { CacheModule } from './common/cache/cache.module';
import { AuditLogModule } from './common/middleware/audit-log.module';
import { HealthModule } from './health/health.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Core modules
    PrismaModule,
    RedisModule,
    LoggerModule,
    CacheModule,
    AuditLogModule,
    HealthModule,

    // Feature modules
    AuthModule,
    UsersModule,
    LessonsModule,
    ExercisesModule,
    ProgressModule,
    VersesModule,
    AchievementsModule,
    AnalyticsModule,
    GdprModule,
    PracticeModule,
    QuizModule,
    ExamModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
