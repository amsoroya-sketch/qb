import { ExercisesService } from './exercises.service';
import { FindExercisesDto, SubmitExerciseDto } from './dto';
export declare class ExercisesController {
    private readonly exercisesService;
    constructor(exercisesService: ExercisesService);
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
    submit(exerciseId: string, dto: SubmitExerciseDto, userId: string): Promise<{
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
    getUserAttempts(exerciseId: string, userId: string): Promise<{
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
    getStats(exerciseId: string): Promise<{
        totalAttempts: number;
        correctAttempts: number;
        accuracy: number;
        avgTimeSpent: number;
    }>;
}
