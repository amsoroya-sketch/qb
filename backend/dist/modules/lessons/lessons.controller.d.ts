import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FindLessonsDto } from './dto/find-lessons.dto';
import { CompleteLessonDto } from './dto/complete-lesson.dto';
export declare class LessonsController {
    private lessonsService;
    constructor(lessonsService: LessonsService);
    findAll(query: FindLessonsDto): Promise<{
        data: ({
            _count: {
                exercises: number;
            };
        } & {
            description: string | null;
            content: string;
            id: string;
            title: string;
            order: number;
            titleArabic: string;
            stage: number;
            track: import(".prisma/client").$Enums.Track;
            xpReward: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            contentArabic: string | null;
            grammarTopic: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            estimatedTime: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        success: boolean;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: {
            exercises: {
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
            }[];
            verses: ({
                verse: {
                    id: string;
                    createdAt: Date;
                    surahNumber: number;
                    verseNumber: number;
                    textArabic: string;
                    textWithoutDiacritics: string;
                    translation: string;
                    transliteration: string | null;
                    searchVectorAr: string | null;
                    searchVectorEn: string | null;
                };
            } & {
                id: string;
                order: number;
                lessonId: string;
                verseId: string;
                notes: string | null;
            })[];
        } & {
            description: string | null;
            content: string;
            id: string;
            title: string;
            order: number;
            titleArabic: string;
            stage: number;
            track: import(".prisma/client").$Enums.Track;
            xpReward: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            contentArabic: string | null;
            grammarTopic: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            estimatedTime: number;
        };
    }>;
    getProgress(lessonId: string, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            startedAt: Date | null;
            timeSpent: number;
            completedAt: Date | null;
            userId: string;
            lessonId: string;
            status: import(".prisma/client").$Enums.LessonStatus;
        };
    }>;
    startLesson(lessonId: string, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            startedAt: Date | null;
            timeSpent: number;
            completedAt: Date | null;
            userId: string;
            lessonId: string;
            status: import(".prisma/client").$Enums.LessonStatus;
        };
    }>;
    completeLesson(lessonId: string, dto: CompleteLessonDto, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            startedAt: Date | null;
            timeSpent: number;
            completedAt: Date | null;
            userId: string;
            lessonId: string;
            status: import(".prisma/client").$Enums.LessonStatus;
        };
    }>;
    create(dto: CreateLessonDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            content: string;
            id: string;
            title: string;
            order: number;
            titleArabic: string;
            stage: number;
            track: import(".prisma/client").$Enums.Track;
            xpReward: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            contentArabic: string | null;
            grammarTopic: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            estimatedTime: number;
        };
    }>;
    update(id: string, dto: UpdateLessonDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            content: string;
            id: string;
            title: string;
            order: number;
            titleArabic: string;
            stage: number;
            track: import(".prisma/client").$Enums.Track;
            xpReward: number;
            isPublished: boolean;
            createdAt: Date;
            updatedAt: Date;
            contentArabic: string | null;
            grammarTopic: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            estimatedTime: number;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
