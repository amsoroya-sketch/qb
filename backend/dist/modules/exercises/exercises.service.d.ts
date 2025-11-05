import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { FindExercisesDto, SubmitExerciseDto } from './dto';
export declare class ExercisesService {
    private prisma;
    private cache;
    private readonly EXERCISE_CACHE_TTL;
    private readonly LIST_CACHE_TTL;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(query: FindExercisesDto): Promise<{
        data: ({
            lesson: {
                id: string;
                title: string;
                titleArabic: string;
                track: import(".prisma/client").$Enums.Track;
                stage: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ExerciseType;
            lessonId: string;
            title: string;
            question: string;
            questionArabic: string | null;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string;
            explanation: string | null;
            order: number;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            xpReward: number;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    findByLesson(lessonId: string): Promise<any>;
    submit(userId: string, exerciseId: string, dto: SubmitExerciseDto): Promise<{
        correctAnswer: any;
        explanation: any;
        isCorrect: boolean;
        xpEarned: any;
        timeBonus: number;
        id: string;
        userId: string;
        userAnswer: string;
        accuracy: import("@prisma/client/runtime/library").Decimal;
        timeSpent: number;
        attemptNumber: number;
        completedAt: Date;
        exerciseId: string;
    }>;
    getUserExercises(userId: string, exerciseId: string): Promise<{
        id: string;
        userId: string;
        userAnswer: string;
        isCorrect: boolean;
        accuracy: import("@prisma/client/runtime/library").Decimal;
        timeSpent: number;
        xpEarned: number;
        attemptNumber: number;
        completedAt: Date;
        exerciseId: string;
    }[]>;
    getExerciseStats(exerciseId: string): Promise<{
        totalAttempts: number;
        correctAttempts: number;
        accuracy: number;
        avgTimeSpent: number;
    }>;
    private checkAnswer;
    private normalizArabic;
}
