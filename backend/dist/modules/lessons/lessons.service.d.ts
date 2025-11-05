import { PrismaService } from '../../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { FindLessonsDto } from './dto/find-lessons.dto';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateLessonDto): Promise<{
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
    }>;
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
    }>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, dto: UpdateLessonDto): Promise<{
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getUserLessonProgress(userId: string, lessonId: string): Promise<{
        id: string;
        userId: string;
        lessonId: string;
        timeSpent: number;
        completedAt: Date | null;
        startedAt: Date | null;
        status: import(".prisma/client").$Enums.LessonStatus;
    }>;
    startLesson(userId: string, lessonId: string): Promise<{
        id: string;
        userId: string;
        lessonId: string;
        timeSpent: number;
        completedAt: Date | null;
        startedAt: Date | null;
        status: import(".prisma/client").$Enums.LessonStatus;
    }>;
    completeLesson(userId: string, lessonId: string, timeSpent: number): Promise<{
        id: string;
        userId: string;
        lessonId: string;
        timeSpent: number;
        completedAt: Date | null;
        startedAt: Date | null;
        status: import(".prisma/client").$Enums.LessonStatus;
    }>;
}
