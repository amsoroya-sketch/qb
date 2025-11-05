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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            content: string;
            title: string;
            order: number;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            xpReward: number;
            titleArabic: string;
            contentArabic: string | null;
            track: import(".prisma/client").$Enums.Track;
            stage: number;
            grammarTopic: string;
            estimatedTime: number;
            isPublished: boolean;
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
                lessonId: string;
                order: number;
                verseId: string;
                notes: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            content: string;
            title: string;
            order: number;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            xpReward: number;
            titleArabic: string;
            contentArabic: string | null;
            track: import(".prisma/client").$Enums.Track;
            stage: number;
            grammarTopic: string;
            estimatedTime: number;
            isPublished: boolean;
        };
    }>;
    getProgress(lessonId: string, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            lessonId: string;
            timeSpent: number;
            completedAt: Date | null;
            startedAt: Date | null;
            status: import(".prisma/client").$Enums.LessonStatus;
        };
    }>;
    startLesson(lessonId: string, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            lessonId: string;
            timeSpent: number;
            completedAt: Date | null;
            startedAt: Date | null;
            status: import(".prisma/client").$Enums.LessonStatus;
        };
    }>;
    completeLesson(lessonId: string, dto: CompleteLessonDto, userId: string): Promise<{
        success: boolean;
        data: {
            id: string;
            userId: string;
            lessonId: string;
            timeSpent: number;
            completedAt: Date | null;
            startedAt: Date | null;
            status: import(".prisma/client").$Enums.LessonStatus;
        };
    }>;
    create(dto: CreateLessonDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            content: string;
            title: string;
            order: number;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            xpReward: number;
            titleArabic: string;
            contentArabic: string | null;
            track: import(".prisma/client").$Enums.Track;
            stage: number;
            grammarTopic: string;
            estimatedTime: number;
            isPublished: boolean;
        };
    }>;
    update(id: string, dto: UpdateLessonDto): Promise<{
        success: boolean;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            content: string;
            title: string;
            order: number;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            xpReward: number;
            titleArabic: string;
            contentArabic: string | null;
            track: import(".prisma/client").$Enums.Track;
            stage: number;
            grammarTopic: string;
            estimatedTime: number;
            isPublished: boolean;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        success: boolean;
    }>;
}
