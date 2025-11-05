export declare enum ExamTypeEnum {
    STAGE_COMPLETION = "STAGE_COMPLETION",
    FINAL_ASSESSMENT = "FINAL_ASSESSMENT",
    CERTIFICATION = "CERTIFICATION"
}
export declare enum TrackEnum {
    A = "A",
    B = "B"
}
export declare enum ExerciseTypeEnum {
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    FILL_IN_BLANK = "FILL_IN_BLANK",
    TRUE_FALSE = "TRUE_FALSE",
    MATCHING = "MATCHING",
    DRAG_DROP = "DRAG_DROP",
    WORD_ANALYSIS = "WORD_ANALYSIS",
    MORPHEME_IDENTIFICATION = "MORPHEME_IDENTIFICATION",
    VERB_CONJUGATION = "VERB_CONJUGATION",
    NOUN_DECLENSION = "NOUN_DECLENSION",
    ROOT_EXTRACTION = "ROOT_EXTRACTION",
    SENTENCE_TYPE = "SENTENCE_TYPE",
    SYNTACTIC_ROLE = "SYNTACTIC_ROLE",
    PHRASE_GROUPING = "PHRASE_GROUPING",
    AGREEMENT_CHECKING = "AGREEMENT_CHECKING",
    I3RAB_ANALYSIS = "I3RAB_ANALYSIS",
    MORPHEME_SEGMENTATION = "MORPHEME_SEGMENTATION",
    DEPENDENCY_TREE = "DEPENDENCY_TREE"
}
export declare class CreateExamQuestionDto {
    question: string;
    questionArabic?: string;
    type: ExerciseTypeEnum;
    options?: any[];
    correctAnswer: string;
    explanation?: string;
    grammarFocus?: string;
    verseReference?: string;
    wordPosition?: number;
    order: number;
    points?: number;
}
export declare class CreateExamDto {
    title: string;
    titleArabic?: string;
    description?: string;
    type: ExamTypeEnum;
    stage: number;
    track: TrackEnum;
    minPassScore?: number;
    timeLimit: number;
    xpReward?: number;
    certificateTemplate?: string;
    retakeCooldown?: number;
    isPublished?: boolean;
    questions?: CreateExamQuestionDto[];
}
declare const UpdateExamDto_base: import("@nestjs/common").Type<Partial<CreateExamDto>>;
export declare class UpdateExamDto extends UpdateExamDto_base {
}
export declare class ExamQuestionDto {
    id: string;
    question: string;
    questionArabic?: string;
    type: ExerciseTypeEnum;
    options?: any[];
    explanation?: string;
    grammarFocus?: string;
    verseReference?: string;
    wordPosition?: number;
    order: number;
    points: number;
    correctAnswer?: string;
}
export declare class ExamDetailDto {
    id: string;
    title: string;
    titleArabic?: string;
    description?: string;
    type: ExamTypeEnum;
    stage: number;
    track: TrackEnum;
    minPassScore: number;
    timeLimit: number;
    xpReward: number;
    certificateTemplate?: string;
    retakeCooldown: number;
    isPublished: boolean;
    questions: ExamQuestionDto[];
    totalQuestions: number;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ExamListDto {
    id: string;
    title: string;
    titleArabic?: string;
    description?: string;
    type: ExamTypeEnum;
    stage: number;
    track: TrackEnum;
    minPassScore: number;
    timeLimit: number;
    xpReward: number;
    retakeCooldown: number;
    isPublished: boolean;
    totalQuestions: number;
    totalPoints: number;
    bestScore?: number;
    attemptCount?: number;
    canRetake?: boolean;
    createdAt: Date;
}
export declare class StartExamDto {
    examId: string;
    attemptId: string;
    questions: ExamQuestionDto[];
    timeLimit: number;
    totalQuestions: number;
    totalPoints: number;
    startedAt: Date;
}
export declare class SubmitExamDto {
    answers: Record<string, string>;
}
export declare class ExamResultDto {
    attemptId: string;
    examId: string;
    score: number;
    passed: boolean;
    xpEarned: number;
    timeSpent: number;
    totalQuestions: number;
    correctAnswers: number;
    totalPoints: number;
    pointsEarned: number;
    certificateUrl?: string;
    completedAt: Date;
    answers: Array<{
        questionId: string;
        question: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        pointsEarned: number;
        explanation?: string;
    }>;
}
export declare class ExamAttemptDto {
    id: string;
    examId: string;
    examTitle: string;
    score: number;
    passed: boolean;
    xpEarned: number;
    timeSpent: number;
    certificateUrl?: string;
    startedAt: Date;
    completedAt?: Date;
}
export declare class FindExamsDto {
    type?: ExamTypeEnum;
    stage?: number;
    track?: TrackEnum;
    isPublished?: boolean;
}
export declare class CanRetakeExamDto {
    canRetake: boolean;
    secondsUntilRetake?: number;
    lastAttemptDate?: Date;
    nextAvailableDate?: Date;
}
export {};
