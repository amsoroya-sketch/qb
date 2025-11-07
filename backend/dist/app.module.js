"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const http_logger_middleware_1 = require("./common/middleware/http-logger.middleware");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const lessons_module_1 = require("./modules/lessons/lessons.module");
const exercises_module_1 = require("./modules/exercises/exercises.module");
const progress_module_1 = require("./modules/progress/progress.module");
const verses_module_1 = require("./modules/verses/verses.module");
const achievements_module_1 = require("./modules/achievements/achievements.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const gdpr_module_1 = require("./modules/gdpr/gdpr.module");
const practice_module_1 = require("./modules/practice/practice.module");
const quiz_module_1 = require("./modules/quiz/quiz.module");
const exam_module_1 = require("./modules/exam/exam.module");
const cache_module_1 = require("./common/cache/cache.module");
const audit_log_module_1 = require("./common/middleware/audit-log.module");
const health_module_1 = require("./health/health.module");
const redis_module_1 = require("./redis/redis.module");
const logger_module_1 = require("./common/logger/logger.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(http_logger_middleware_1.HttpLoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            logger_module_1.LoggerModule,
            cache_module_1.CacheModule,
            audit_log_module_1.AuditLogModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            lessons_module_1.LessonsModule,
            exercises_module_1.ExercisesModule,
            progress_module_1.ProgressModule,
            verses_module_1.VersesModule,
            achievements_module_1.AchievementsModule,
            analytics_module_1.AnalyticsModule,
            gdpr_module_1.GdprModule,
            practice_module_1.PracticeModule,
            quiz_module_1.QuizModule,
            exam_module_1.ExamModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map