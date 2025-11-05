export declare class CreateLessonDto {
    title: string;
    titleArabic: string;
    description?: string;
    content: string;
    contentArabic?: string;
    track: 'A' | 'B';
    stage: number;
    order: number;
    grammarTopic: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    estimatedTime: number;
    xpReward?: number;
}
