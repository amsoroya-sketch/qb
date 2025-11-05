export declare enum QuizTypeEnum {
    TOPIC = "TOPIC",
    COMPREHENSIVE = "COMPREHENSIVE",
    DIAGNOSTIC = "DIAGNOSTIC",
    PRACTICE = "PRACTICE"
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
export declare class CreateQuizQuestionDto {
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
export declare class CreateQuizDto {
    title: string;
    titleArabic?: string;
    description?: string;
    type: QuizTypeEnum;
    lessonId?: string;
    stage?: number;
    track?: TrackEnum;
    minPassScore?: number;
    timeLimit?: number;
    xpReward?: number;
    isPublished?: boolean;
    questions?: CreateQuizQuestionDto[];
}
declare const UpdateQuizDto_base: import("@nestjs/common").Type<Partial<CreateQuizDto>>;
export declare class UpdateQuizDto extends UpdateQuizDto_base {
}
export declare class QuizQuestionDto {
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
export declare class QuizDetailDto {
    id: string;
    title: string;
    titleArabic?: string;
    description?: string;
    type: QuizTypeEnum;
    lessonId?: string;
    stage?: number;
    track?: TrackEnum;
    minPassScore: number;
    timeLimit?: number;
    xpReward: number;
    isPublished: boolean;
    questions: QuizQuestionDto[];
    totalQuestions: number;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class QuizListDto {
    id: string;
    title: string;
    titleArabic?: string;
    description?: string;
    type: QuizTypeEnum;
    lessonId?: string;
    stage?: number;
    track?: TrackEnum;
    minPassScore: number;
    timeLimit?: number;
    xpReward: number;
    isPublished: boolean;
    totalQuestions: number;
    totalPoints: number;
    bestScore?: number;
    attemptCount?: number;
    createdAt: Date;
}
export declare class StartQuizDto {
    quizId: string;
    attemptId: string;
    questions: QuizQuestionDto[];
    timeLimit?: number;
    totalQuestions: number;
    totalPoints: number;
    startedAt: Date;
}
export declare class SubmitQuizAnswerDto {
    attemptId: string;
    questionId: string;
    userAnswer: string;
}
export declare class QuizResultDto {
    questionId: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
    pointsEarned: number;
    currentScore: number;
    questionsAnswered: number;
    totalQuestions: number;
}
export declare class CompleteQuizDto {
    attemptId: string;
    quizId: string;
    score: number;
    passed: boolean;
    xpEarned: number;
    timeSpent: number;
    totalQuestions: number;
    correctAnswers: number;
    totalPoints: number;
    pointsEarned: number;
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
export declare class QuizAttemptDto {
    id: string;
    quizId: string;
    quizTitle: string;
    score: number;
    passed: boolean;
    xpEarned: number;
    timeSpent: number;
    completedAt: Date;
}
export declare class GenerateQuizDto {
    grammarFocus: string;
    questionCount?: number;
    title?: string;
    minPassScore?: number;
    timeLimit?: number;
}
export declare class FindQuizzesDto {
    type?: QuizTypeEnum;
    stage?: number;
    track?: TrackEnum;
    lessonId?: string;
    isPublished?: boolean;
}
export declare class LeaderboardEntryDto {
    userId: string;
    userName: string;
    score: number;
    timeSpent: number;
    completedAt: Date;
    rank: number;
}
export {};
