export declare class ExerciseAttemptDto {
    id: string;
    exerciseId: string;
    userId: string;
    userAnswer: string;
    isCorrect: boolean;
    attempts: number;
    timeSpent: number;
    xpEarned: number;
    attemptedAt: Date;
}
