export declare enum PracticeModeEnum {
    QUICK_PRACTICE = "quick_practice",
    GRAMMAR_DRILLS = "grammar_drills",
    VERSE_BASED = "verse_based",
    SPACED_REPETITION = "spaced_repetition",
    CHALLENGE = "challenge",
    DAILY = "daily"
}
export declare class GetPracticeSetDto {
    mode: PracticeModeEnum;
    count?: number;
    grammarFocus?: string;
    surahNumber?: number;
    difficulty?: string;
}
export declare class SubmitPracticeAnswerDto {
    exerciseId: string;
    userAnswer: string;
    timeSpent: number;
}
export declare class PracticeExerciseDto {
    id: string;
    type: string;
    title: string;
    question: string;
    questionArabic?: string;
    options?: any[];
    xpReward: number;
    difficulty: string;
    metadata?: any;
}
export declare class PracticeSetResponseDto {
    mode: PracticeModeEnum;
    exercises: PracticeExerciseDto[];
    totalCount: number;
    estimatedTime: number;
    grammarFocus?: string;
    surahNumber?: number;
    weakTopics?: string[];
}
export declare class PracticeResultDto {
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
    xpEarned: number;
    timeBonus: number;
    totalXP: number;
    accuracy: number;
}
