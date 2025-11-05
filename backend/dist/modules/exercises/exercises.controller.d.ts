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
    submit(exerciseId: string, dto: SubmitExerciseDto, userId: string): Promise<{
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
    getUserAttempts(exerciseId: string, userId: string): Promise<{
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
    getStats(exerciseId: string): Promise<{
        totalAttempts: number;
        correctAttempts: number;
        accuracy: number;
        avgTimeSpent: number;
    }>;
}
