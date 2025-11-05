export type MasteryLevel = 'beginner' | 'intermediate' | 'advanced';
export declare class TopicItem {
    topic: string;
    totalExercises: number;
    correctAnswers: number;
    accuracy: number;
    lastPracticed: string;
    level: MasteryLevel;
}
export declare class TopicMasteryResponseDto {
    topics: TopicItem[];
    overallMastery: number;
    strongestTopic: string | null;
    weakestTopic: string | null;
}
