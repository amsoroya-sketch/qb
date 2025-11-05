import { PrismaService } from '../../prisma/prisma.service';
import { FindExercisesDto, SubmitExerciseDto } from './dto';
export declare class ExercisesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: FindExercisesDto): Promise<{
        data: ({
            lesson: {
                id: string;
                title: string;
                titleArabic: string;
                stage: number;
                track: import(".prisma/client").$Enums.Track;
            };
        } & {
            type: import(".prisma/client").$Enums.ExerciseType;
            id: string;
            title: string;
            question: string;
            questionArabic: string | null;
            options: import("@prisma/client/runtime/library").JsonValue | null;
            correctAnswer: string;
            explanation: string | null;
            order: number;
            xpReward: number;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        lesson: {
            id: string;
            title: string;
            titleArabic: string;
            stage: number;
            track: import(".prisma/client").$Enums.Track;
            difficulty: import(".prisma/client").$Enums.Difficulty;
        };
    } & {
        type: import(".prisma/client").$Enums.ExerciseType;
        id: string;
        title: string;
        question: string;
        questionArabic: string | null;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string;
        explanation: string | null;
        order: number;
        xpReward: number;
        createdAt: Date;
        updatedAt: Date;
        lessonId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findByLesson(lessonId: string): Promise<{
        type: import(".prisma/client").$Enums.ExerciseType;
        id: string;
        title: string;
        question: string;
        questionArabic: string | null;
        options: import("@prisma/client/runtime/library").JsonValue | null;
        correctAnswer: string;
        explanation: string | null;
        order: number;
        xpReward: number;
        createdAt: Date;
        updatedAt: Date;
        lessonId: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    submit(userId: string, exerciseId: string, dto: SubmitExerciseDto): Promise<{
        correctAnswer: string;
        explanation: string | null;
        isCorrect: boolean;
        xpEarned: number;
        timeBonus: number;
        id: string;
        timeSpent: number;
        completedAt: Date;
        userId: string;
        userAnswer: string;
        exerciseId: string;
        accuracy: import("@prisma/client/runtime/library").Decimal;
        attemptNumber: number;
    }>;
    getUserExercises(userId: string, exerciseId: string): Promise<{
        id: string;
        xpEarned: number;
        timeSpent: number;
        completedAt: Date;
        userId: string;
        userAnswer: string;
        isCorrect: boolean;
        exerciseId: string;
        accuracy: import("@prisma/client/runtime/library").Decimal;
        attemptNumber: number;
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
