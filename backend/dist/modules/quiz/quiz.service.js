"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const exercise_generator_service_1 = require("../exercises/exercise-generator.service");
const cache_service_1 = require("../../common/cache/cache.service");
const client_1 = require("@prisma/client");
let QuizService = class QuizService {
    constructor(prisma, exerciseGenerator, cacheService) {
        this.prisma = prisma;
        this.exerciseGenerator = exerciseGenerator;
        this.cacheService = cacheService;
        this.LEADERBOARD_CACHE_TTL = 300;
    }
    async create(dto) {
        const quizData = {
            title: dto.title,
            titleArabic: dto.titleArabic,
            description: dto.description,
            type: dto.type,
            minPassScore: dto.minPassScore ?? 80,
            timeLimit: dto.timeLimit,
            xpReward: dto.xpReward ?? 50,
            isPublished: dto.isPublished ?? false,
            stage: dto.stage,
            track: dto.track,
        };
        if (dto.lessonId) {
            const lesson = await this.prisma.lesson.findUnique({
                where: { id: dto.lessonId },
            });
            if (!lesson) {
                throw new common_1.NotFoundException(`Lesson ${dto.lessonId} not found`);
            }
            quizData.lessonId = dto.lessonId;
        }
        const quiz = await this.prisma.quiz.create({
            data: quizData,
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (dto.questions && dto.questions.length > 0) {
            for (const questionDto of dto.questions) {
                await this.addQuestion(quiz.id, questionDto);
            }
            const quizWithQuestions = await this.prisma.quiz.findUnique({
                where: { id: quiz.id },
                include: {
                    questions: {
                        orderBy: { order: 'asc' },
                    },
                },
            });
            return this.mapToQuizDetailDto(quizWithQuestions);
        }
        return this.mapToQuizDetailDto(quiz);
    }
    async update(id, dto) {
        const existing = await this.prisma.quiz.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Quiz ${id} not found`);
        }
        const updateData = {
            title: dto.title,
            titleArabic: dto.titleArabic,
            description: dto.description,
            type: dto.type,
            minPassScore: dto.minPassScore,
            timeLimit: dto.timeLimit,
            xpReward: dto.xpReward,
            isPublished: dto.isPublished,
            stage: dto.stage,
            track: dto.track,
        };
        if (dto.lessonId !== undefined) {
            if (dto.lessonId) {
                const lesson = await this.prisma.lesson.findUnique({
                    where: { id: dto.lessonId },
                });
                if (!lesson) {
                    throw new common_1.NotFoundException(`Lesson ${dto.lessonId} not found`);
                }
                updateData.lessonId = dto.lessonId;
            }
            else {
                updateData.lessonId = null;
            }
        }
        const quiz = await this.prisma.quiz.update({
            where: { id },
            data: updateData,
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        return this.mapToQuizDetailDto(quiz);
    }
    async delete(id) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                attempts: true,
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException(`Quiz ${id} not found`);
        }
        if (quiz.attempts.length > 0) {
            await this.prisma.quiz.update({
                where: { id },
                data: { isPublished: false },
            });
        }
        else {
            await this.prisma.quiz.delete({
                where: { id },
            });
        }
    }
    async addQuestion(quizId, question) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
        });
        if (!quiz) {
            throw new common_1.NotFoundException(`Quiz ${quizId} not found`);
        }
        const createdQuestion = await this.prisma.quizQuestion.create({
            data: {
                quizId,
                question: question.question,
                questionArabic: question.questionArabic,
                type: question.type,
                options: question.options,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation,
                grammarFocus: question.grammarFocus,
                verseReference: question.verseReference,
                wordPosition: question.wordPosition,
                order: question.order,
                points: question.points ?? 1,
            },
        });
        return this.mapToQuizQuestionDto(createdQuestion, false);
    }
    async generateQuizFromGrammar(dto) {
        const questionCount = dto.questionCount ?? 10;
        const title = dto.title ??
            `${dto.grammarFocus.charAt(0).toUpperCase() + dto.grammarFocus.slice(1)} Practice Quiz`;
        const quiz = await this.prisma.quiz.create({
            data: {
                title,
                titleArabic: `اختبار ${dto.grammarFocus}`,
                description: `Auto-generated practice quiz focusing on ${dto.grammarFocus}`,
                type: client_1.QuizType.PRACTICE,
                minPassScore: dto.minPassScore ?? 80,
                timeLimit: dto.timeLimit ?? 600,
                xpReward: 50,
                isPublished: true,
            },
        });
        const questions = await this.generateQuestionsFromGrammar(dto.grammarFocus, questionCount);
        if (questions.length === 0) {
            await this.prisma.quiz.delete({ where: { id: quiz.id } });
            throw new common_1.BadRequestException(`Could not generate questions for grammar focus: ${dto.grammarFocus}`);
        }
        for (let i = 0; i < questions.length; i++) {
            await this.prisma.quizQuestion.create({
                data: {
                    quizId: quiz.id,
                    ...questions[i],
                    order: i + 1,
                    points: 1,
                },
            });
        }
        const completeQuiz = await this.prisma.quiz.findUnique({
            where: { id: quiz.id },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        return this.mapToQuizDetailDto(completeQuiz);
    }
    async findAll(userId, filters) {
        const where = {
            isPublished: filters?.isPublished ?? true,
        };
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.stage) {
            where.stage = filters.stage;
        }
        if (filters?.track) {
            where.track = filters.track;
        }
        if (filters?.lessonId) {
            where.lessonId = filters.lessonId;
        }
        const quizzes = await this.prisma.quiz.findMany({
            where,
            include: {
                questions: {
                    select: { id: true, points: true },
                },
                attempts: userId
                    ? {
                        where: { userId },
                        select: { score: true },
                    }
                    : false,
            },
            orderBy: [{ type: 'asc' }, { stage: 'asc' }, { createdAt: 'desc' }],
        });
        return quizzes.map((quiz) => this.mapToQuizListDto(quiz, userId));
    }
    async findOne(id, userId) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException(`Quiz ${id} not found`);
        }
        if (!quiz.isPublished && !userId) {
            throw new common_1.ForbiddenException('Quiz is not published');
        }
        return this.mapToQuizDetailDto(quiz);
    }
    async startQuiz(quizId, userId) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!quiz) {
            throw new common_1.NotFoundException(`Quiz ${quizId} not found`);
        }
        if (!quiz.isPublished) {
            throw new common_1.ForbiddenException('Quiz is not published');
        }
        if (quiz.questions.length === 0) {
            throw new common_1.BadRequestException('Quiz has no questions');
        }
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const existingAttempt = await this.prisma.quizAttempt.findFirst({
            where: {
                userId,
                quizId,
                completedAt: { gt: oneHourAgo },
                score: 0,
            },
            orderBy: { completedAt: 'desc' },
        });
        if (existingAttempt) {
            throw new common_1.BadRequestException('You have an in-progress quiz attempt. Please complete or abandon it first.');
        }
        const attempt = await this.prisma.quizAttempt.create({
            data: {
                userId,
                quizId,
                score: 0,
                answers: {},
                timeSpent: 0,
                xpEarned: 0,
                passed: false,
                completedAt: new Date(),
            },
        });
        const questionsWithoutAnswers = quiz.questions.map((q) => this.mapToQuizQuestionDto(q, false));
        const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
        return {
            quizId: quiz.id,
            attemptId: attempt.id,
            questions: questionsWithoutAnswers,
            timeLimit: quiz.timeLimit ?? undefined,
            totalQuestions: quiz.questions.length,
            totalPoints,
            startedAt: attempt.completedAt,
        };
    }
    async submitAnswer(attemptId, userId, dto) {
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
            include: {
                quiz: {
                    include: {
                        questions: true,
                    },
                },
            },
        });
        if (!attempt) {
            throw new common_1.NotFoundException(`Quiz attempt ${attemptId} not found`);
        }
        if (attempt.userId !== userId) {
            throw new common_1.ForbiddenException('This attempt does not belong to you');
        }
        const startedAt = attempt.completedAt;
        const now = new Date();
        const timeDiff = (now.getTime() - startedAt.getTime()) / 1000;
        if (timeDiff > 7200) {
            throw new common_1.BadRequestException('Quiz attempt has expired');
        }
        const question = attempt.quiz.questions.find((q) => q.id === dto.questionId);
        if (!question) {
            throw new common_1.NotFoundException(`Question ${dto.questionId} not found in this quiz`);
        }
        const isCorrect = this.checkAnswer(dto.userAnswer, question.correctAnswer);
        const pointsEarned = isCorrect ? question.points : 0;
        const currentAnswers = attempt.answers || {};
        currentAnswers[dto.questionId] = {
            userAnswer: dto.userAnswer,
            isCorrect,
            pointsEarned,
            submittedAt: new Date().toISOString(),
        };
        await this.prisma.quizAttempt.update({
            where: { id: attemptId },
            data: {
                answers: currentAnswers,
            },
        });
        const answeredQuestions = Object.keys(currentAnswers).length;
        let totalPointsEarned = 0;
        for (const answer of Object.values(currentAnswers)) {
            totalPointsEarned += Number(answer.pointsEarned) || 0;
        }
        const totalPoints = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);
        const currentScore = totalPoints > 0 ? Math.round((totalPointsEarned / totalPoints) * 100) : 0;
        return {
            questionId: dto.questionId,
            isCorrect,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation ?? undefined,
            pointsEarned,
            currentScore,
            questionsAnswered: answeredQuestions,
            totalQuestions: attempt.quiz.questions.length,
        };
    }
    async completeQuiz(attemptId, userId) {
        const attempt = await this.prisma.quizAttempt.findUnique({
            where: { id: attemptId },
            include: {
                quiz: {
                    include: {
                        questions: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (!attempt) {
            throw new common_1.NotFoundException(`Quiz attempt ${attemptId} not found`);
        }
        if (attempt.userId !== userId) {
            throw new common_1.ForbiddenException('This attempt does not belong to you');
        }
        const startedAt = attempt.completedAt;
        const completedAt = new Date();
        const timeSpent = Math.round((completedAt.getTime() - startedAt.getTime()) / 1000);
        const answers = attempt.answers || {};
        const totalQuestions = attempt.quiz.questions.length;
        const answeredCount = Object.keys(answers).length;
        if (answeredCount < totalQuestions) {
            throw new common_1.BadRequestException(`You must answer all questions. Answered: ${answeredCount}/${totalQuestions}`);
        }
        const totalPoints = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);
        let pointsEarned = 0;
        for (const answer of Object.values(answers)) {
            pointsEarned += Number(answer.pointsEarned) || 0;
        }
        const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length;
        const score = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
        const passed = score >= attempt.quiz.minPassScore;
        const xpEarned = passed ? attempt.quiz.xpReward : 0;
        await this.prisma.quizAttempt.update({
            where: { id: attemptId },
            data: {
                score,
                timeSpent,
                xpEarned,
                passed,
                completedAt,
            },
        });
        if (passed) {
            await this.updateUserProgress(userId, xpEarned, timeSpent);
            await this.cacheService.delPattern(`leaderboard:${attempt.quiz.id}:*`);
        }
        const detailedAnswers = attempt.quiz.questions.map((question) => {
            const userAnswer = answers[question.id];
            return {
                questionId: question.id,
                question: question.question,
                userAnswer: userAnswer?.userAnswer || '',
                correctAnswer: question.correctAnswer,
                isCorrect: userAnswer?.isCorrect || false,
                pointsEarned: Number(userAnswer?.pointsEarned) || 0,
                explanation: question.explanation ?? undefined,
            };
        });
        return {
            attemptId: attempt.id,
            quizId: attempt.quiz.id,
            score,
            passed,
            xpEarned,
            timeSpent,
            totalQuestions,
            correctAnswers,
            totalPoints,
            pointsEarned,
            completedAt,
            answers: detailedAnswers,
        };
    }
    async getAttempts(userId, quizId) {
        const where = {
            userId,
        };
        if (quizId) {
            where.quizId = quizId;
        }
        const attempts = await this.prisma.quizAttempt.findMany({
            where,
            include: {
                quiz: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { completedAt: 'desc' },
        });
        const completedAttempts = attempts.filter((attempt) => {
            if (attempt.score === 0) {
                const timeSince = (Date.now() - attempt.completedAt.getTime()) / 1000;
                return timeSince > 3600;
            }
            return true;
        });
        return completedAttempts.map((attempt) => ({
            id: attempt.id,
            quizId: attempt.quizId,
            quizTitle: attempt.quiz.title,
            score: attempt.score,
            passed: attempt.passed,
            xpEarned: attempt.xpEarned,
            timeSpent: attempt.timeSpent,
            completedAt: attempt.completedAt,
        }));
    }
    async getLeaderboard(quizId, limit = 10) {
        const cacheKey = `leaderboard:${quizId}:${limit}`;
        const cached = await this.cacheService.getJson(cacheKey);
        if (cached) {
            return cached;
        }
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
        });
        if (!quiz) {
            throw new common_1.NotFoundException(`Quiz ${quizId} not found`);
        }
        const attempts = await this.prisma.quizAttempt.findMany({
            where: {
                quizId,
                score: { gt: 0 },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [{ score: 'desc' }, { timeSpent: 'asc' }],
        });
        const userBestAttempts = new Map();
        for (const attempt of attempts) {
            const userId = attempt.userId;
            const existing = userBestAttempts.get(userId);
            const entry = {
                userId: attempt.userId,
                userName: attempt.user.name,
                score: attempt.score,
                timeSpent: attempt.timeSpent,
                completedAt: attempt.completedAt,
                rank: 0,
            };
            if (!existing ||
                entry.score > existing.score ||
                (entry.score === existing.score && entry.timeSpent < existing.timeSpent)) {
                userBestAttempts.set(userId, entry);
            }
        }
        const leaderboard = Array.from(userBestAttempts.values())
            .sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return a.timeSpent - b.timeSpent;
        })
            .slice(0, limit)
            .map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));
        await this.cacheService.setJson(cacheKey, leaderboard, this.LEADERBOARD_CACHE_TTL);
        return leaderboard;
    }
    async generateQuestionsFromGrammar(grammarFocus, questionCount) {
        const verses = await this.selectRandomVerses(questionCount * 3);
        const questions = [];
        for (const verse of verses) {
            if (questions.length >= questionCount)
                break;
            try {
                let generatedExercise;
                switch (grammarFocus) {
                    case 'aspect': {
                        const verbWord = verse.words.find((w) => w.posType === 'V');
                        if (!verbWord)
                            continue;
                        generatedExercise = await this.exerciseGenerator.generateVerbAspectExercise(verse.surahNumber, verse.verseNumber, verbWord.position);
                        break;
                    }
                    case 'case': {
                        const nounWord = verse.words.find((w) => ['N', 'PN', 'ADJ'].includes(w.posType) && w.irabCase);
                        if (!nounWord)
                            continue;
                        generatedExercise = await this.exerciseGenerator.generateNounCaseExercise(verse.surahNumber, verse.verseNumber, nounWord.position);
                        break;
                    }
                    case 'root': {
                        const rootWord = verse.words.find((w) => w.root);
                        if (!rootWord)
                            continue;
                        generatedExercise = await this.exerciseGenerator.generateRootExtractionExercise(verse.surahNumber, verse.verseNumber, rootWord.position);
                        break;
                    }
                    case 'morpheme': {
                        const morphemeWord = verse.words.find((w) => w.grammarData?.rawFeatures);
                        if (!morphemeWord)
                            continue;
                        generatedExercise = await this.exerciseGenerator.generateMorphemeIdentificationExercise(verse.surahNumber, verse.verseNumber, morphemeWord.position);
                        break;
                    }
                    case 'sentence_type': {
                        generatedExercise = await this.exerciseGenerator.generateSentenceTypeExercise(verse.surahNumber, verse.verseNumber);
                        break;
                    }
                    case 'syntactic_role': {
                        const syntaxWord = verse.words.find((w) => w.syntacticRole);
                        if (!syntaxWord)
                            continue;
                        generatedExercise = await this.exerciseGenerator.generateSyntacticRoleExercise(verse.surahNumber, verse.verseNumber, syntaxWord.position);
                        break;
                    }
                    case 'agreement': {
                        const agreementWord = verse.words.find((w) => w.posType === 'ADJ' || w.posType === 'N');
                        if (!agreementWord)
                            continue;
                        generatedExercise = await this.exerciseGenerator.generateAgreementCheckingExercise(verse.surahNumber, verse.verseNumber, agreementWord.position);
                        break;
                    }
                    default:
                        continue;
                }
                if (generatedExercise) {
                    const question = {
                        question: generatedExercise.question,
                        questionArabic: generatedExercise.questionArabic,
                        type: generatedExercise.type,
                        options: generatedExercise.options,
                        correctAnswer: generatedExercise.correctAnswer,
                        explanation: generatedExercise.explanation,
                        grammarFocus: generatedExercise.metadata?.grammarFocus,
                        verseReference: generatedExercise.metadata?.verseSource,
                        wordPosition: generatedExercise.metadata?.wordPosition ?? undefined,
                    };
                    questions.push(question);
                }
            }
            catch (error) {
                continue;
            }
        }
        return questions;
    }
    async selectRandomVerses(count) {
        const totalCount = await this.prisma.quranVerse.count();
        if (totalCount === 0) {
            return [];
        }
        const offsets = [];
        for (let i = 0; i < Math.min(count, totalCount); i++) {
            const randomOffset = Math.floor(Math.random() * totalCount);
            offsets.push(randomOffset);
        }
        const verses = await Promise.all(offsets.map(async (offset) => {
            const verse = await this.prisma.quranVerse.findMany({
                skip: offset,
                take: 1,
                include: {
                    words: {
                        orderBy: { position: 'asc' },
                    },
                },
            });
            return verse[0];
        }));
        return verses.filter((v) => v !== undefined);
    }
    checkAnswer(userAnswer, correctAnswer) {
        const normalizeAnswer = (answer) => {
            return answer.trim().toLowerCase().replace(/\s+/g, ' ');
        };
        const normalizedUser = normalizeAnswer(userAnswer);
        const normalizedCorrect = normalizeAnswer(correctAnswer);
        if (correctAnswer.includes(',') || Array.isArray(correctAnswer)) {
            const correctArray = Array.isArray(correctAnswer)
                ? correctAnswer
                : correctAnswer.split(',').map((s) => s.trim());
            const userArray = Array.isArray(userAnswer)
                ? userAnswer
                : userAnswer.split(',').map((s) => s.trim());
            return (correctArray.length === userArray.length && correctArray.every((c) => userArray.includes(c)));
        }
        return normalizedUser === normalizedCorrect;
    }
    async updateUserProgress(userId, xpEarned, timeSpent) {
        await this.prisma.userProgress.update({
            where: { userId },
            data: {
                currentXP: { increment: xpEarned },
                totalTimeSpent: { increment: timeSpent },
            },
        });
    }
    mapToQuizDetailDto(quiz) {
        const totalPoints = quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
        return {
            id: quiz.id,
            title: quiz.title,
            titleArabic: quiz.titleArabic ?? undefined,
            description: quiz.description ?? undefined,
            type: quiz.type,
            lessonId: quiz.lessonId ?? undefined,
            stage: quiz.stage ?? undefined,
            track: quiz.track ?? undefined,
            minPassScore: quiz.minPassScore,
            timeLimit: quiz.timeLimit ?? undefined,
            xpReward: quiz.xpReward,
            isPublished: quiz.isPublished,
            questions: quiz.questions?.map((q) => this.mapToQuizQuestionDto(q, true)) || [],
            totalQuestions: quiz.questions?.length || 0,
            totalPoints,
            createdAt: quiz.createdAt,
            updatedAt: quiz.updatedAt,
        };
    }
    mapToQuizListDto(quiz, userId) {
        const totalPoints = quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
        const bestScore = userId && quiz.attempts?.length > 0
            ? Math.max(...quiz.attempts.map((a) => a.score))
            : undefined;
        const attemptCount = userId ? (quiz.attempts?.length ?? 0) : undefined;
        return {
            id: quiz.id,
            title: quiz.title,
            titleArabic: quiz.titleArabic ?? undefined,
            description: quiz.description ?? undefined,
            type: quiz.type,
            lessonId: quiz.lessonId ?? undefined,
            stage: quiz.stage ?? undefined,
            track: quiz.track ?? undefined,
            minPassScore: quiz.minPassScore,
            timeLimit: quiz.timeLimit ?? undefined,
            xpReward: quiz.xpReward,
            isPublished: quiz.isPublished,
            totalQuestions: quiz.questions?.length || 0,
            totalPoints,
            bestScore,
            attemptCount,
            createdAt: quiz.createdAt,
        };
    }
    mapToQuizQuestionDto(question, includeAnswer) {
        const dto = {
            id: question.id,
            question: question.question,
            questionArabic: question.questionArabic ?? undefined,
            type: question.type,
            options: question.options ?? undefined,
            explanation: question.explanation ?? undefined,
            grammarFocus: question.grammarFocus ?? undefined,
            verseReference: question.verseReference ?? undefined,
            wordPosition: question.wordPosition ?? undefined,
            order: question.order,
            points: question.points,
        };
        if (includeAnswer) {
            dto.correctAnswer = question.correctAnswer;
        }
        return dto;
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        exercise_generator_service_1.ExerciseGeneratorService,
        cache_service_1.CacheService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map