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
exports.ExamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ExamService = class ExamService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const examData = {
            title: dto.title,
            titleArabic: dto.titleArabic,
            description: dto.description,
            type: dto.type,
            stage: dto.stage,
            track: dto.track,
            minPassScore: dto.minPassScore ?? 85,
            timeLimit: dto.timeLimit,
            xpReward: dto.xpReward ?? 150,
            certificateTemplate: dto.certificateTemplate,
            retakeCooldown: dto.retakeCooldown ?? 86400,
            isPublished: dto.isPublished ?? false,
        };
        const exam = await this.prisma.exam.create({
            data: examData,
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (dto.questions && dto.questions.length > 0) {
            for (const questionDto of dto.questions) {
                await this.addQuestion(exam.id, questionDto);
            }
            const examWithQuestions = await this.prisma.exam.findUnique({
                where: { id: exam.id },
                include: {
                    questions: {
                        orderBy: { order: 'asc' },
                    },
                },
            });
            return this.mapToExamDetailDto(examWithQuestions);
        }
        return this.mapToExamDetailDto(exam);
    }
    async update(id, dto) {
        const existing = await this.prisma.exam.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Exam ${id} not found`);
        }
        const updateData = {
            title: dto.title,
            titleArabic: dto.titleArabic,
            description: dto.description,
            type: dto.type,
            stage: dto.stage,
            track: dto.track,
            minPassScore: dto.minPassScore,
            timeLimit: dto.timeLimit,
            xpReward: dto.xpReward,
            certificateTemplate: dto.certificateTemplate,
            retakeCooldown: dto.retakeCooldown,
            isPublished: dto.isPublished,
        };
        const exam = await this.prisma.exam.update({
            where: { id },
            data: updateData,
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        return this.mapToExamDetailDto(exam);
    }
    async delete(id) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: {
                attempts: true,
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException(`Exam ${id} not found`);
        }
        if (exam.attempts.length > 0) {
            await this.prisma.exam.update({
                where: { id },
                data: { isPublished: false },
            });
        }
        else {
            await this.prisma.exam.delete({
                where: { id },
            });
        }
    }
    async addQuestion(examId, question) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
        });
        if (!exam) {
            throw new common_1.NotFoundException(`Exam ${examId} not found`);
        }
        const createdQuestion = await this.prisma.examQuestion.create({
            data: {
                examId,
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
        return this.mapToExamQuestionDto(createdQuestion, false);
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
        const exams = await this.prisma.exam.findMany({
            where,
            include: {
                questions: {
                    select: { id: true, points: true },
                },
                attempts: userId
                    ? {
                        where: { userId, completedAt: { not: null } },
                        select: { score: true, completedAt: true },
                    }
                    : false,
            },
            orderBy: [{ stage: 'asc' }, { type: 'asc' }, { createdAt: 'desc' }],
        });
        const examsWithRetakeInfo = await Promise.all(exams.map(async (exam) => {
            let canRetake = true;
            if (userId) {
                const retakeCheck = await this.canRetakeExam(userId, exam.id);
                canRetake = retakeCheck.canRetake;
            }
            return { ...exam, canRetake };
        }));
        return examsWithRetakeInfo.map((exam) => this.mapToExamListDto(exam, userId));
    }
    async findOne(id, userId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException(`Exam ${id} not found`);
        }
        if (!exam.isPublished && !userId) {
            throw new common_1.ForbiddenException('Exam is not published');
        }
        return this.mapToExamDetailDto(exam);
    }
    async startExam(examId, userId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
            include: {
                questions: {
                    orderBy: { order: 'asc' },
                },
            },
        });
        if (!exam) {
            throw new common_1.NotFoundException(`Exam ${examId} not found`);
        }
        if (!exam.isPublished) {
            throw new common_1.ForbiddenException('Exam is not published');
        }
        if (exam.questions.length === 0) {
            throw new common_1.BadRequestException('Exam has no questions');
        }
        const retakeCheck = await this.canRetakeExam(userId, examId);
        if (!retakeCheck.canRetake) {
            throw new common_1.BadRequestException(`You must wait ${Math.ceil(retakeCheck.secondsUntilRetake / 3600)} hours before retaking this exam`);
        }
        const existingAttempt = await this.prisma.examAttempt.findFirst({
            where: {
                userId,
                examId,
                completedAt: null,
                startedAt: {
                    gte: new Date(Date.now() - 3600000),
                },
            },
        });
        if (existingAttempt) {
            throw new common_1.BadRequestException('You have an in-progress exam attempt. Please complete or abandon it first.');
        }
        const attempt = await this.prisma.examAttempt.create({
            data: {
                userId,
                examId,
                score: 0,
                answers: {},
                timeSpent: 0,
                xpEarned: 0,
                passed: false,
                startedAt: new Date(),
                completedAt: null,
            },
        });
        const questionsWithoutAnswers = exam.questions.map((q) => this.mapToExamQuestionDto(q, false));
        const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
        return {
            examId: exam.id,
            attemptId: attempt.id,
            questions: questionsWithoutAnswers,
            timeLimit: exam.timeLimit,
            totalQuestions: exam.questions.length,
            totalPoints,
            startedAt: attempt.startedAt,
        };
    }
    async submitExam(attemptId, userId, dto) {
        const attempt = await this.prisma.examAttempt.findUnique({
            where: { id: attemptId },
            include: {
                exam: {
                    include: {
                        questions: {
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (!attempt) {
            throw new common_1.NotFoundException(`Exam attempt ${attemptId} not found`);
        }
        if (attempt.userId !== userId) {
            throw new common_1.ForbiddenException('This attempt does not belong to you');
        }
        if (attempt.completedAt !== null) {
            throw new common_1.BadRequestException('This exam attempt has already been completed');
        }
        const now = new Date();
        const timeSpent = Math.round((now.getTime() - attempt.startedAt.getTime()) / 1000);
        if (timeSpent > attempt.exam.timeLimit + 300) {
            throw new common_1.BadRequestException('Time limit exceeded');
        }
        const totalQuestions = attempt.exam.questions.length;
        const answeredCount = Object.keys(dto.answers).length;
        if (answeredCount < totalQuestions) {
            throw new common_1.BadRequestException(`You must answer all questions. Answered: ${answeredCount}/${totalQuestions}`);
        }
        const scoredAnswers = {};
        let pointsEarned = 0;
        let correctCount = 0;
        for (const question of attempt.exam.questions) {
            const userAnswer = dto.answers[question.id];
            if (!userAnswer) {
                throw new common_1.BadRequestException(`Missing answer for question ${question.id}`);
            }
            const isCorrect = this.checkAnswer(userAnswer, question.correctAnswer);
            const points = isCorrect ? question.points : 0;
            scoredAnswers[question.id] = {
                userAnswer,
                isCorrect,
                pointsEarned: points,
            };
            pointsEarned += points;
            if (isCorrect)
                correctCount++;
        }
        const totalPoints = attempt.exam.questions.reduce((sum, q) => sum + q.points, 0);
        const score = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
        const passed = score >= attempt.exam.minPassScore;
        const xpEarned = passed ? attempt.exam.xpReward : 0;
        let certificateUrl;
        if (passed && attempt.exam.certificateTemplate) {
            certificateUrl = await this.generateCertificate(attemptId, userId, attempt.exam);
        }
        await this.prisma.examAttempt.update({
            where: { id: attemptId },
            data: {
                score,
                answers: scoredAnswers,
                timeSpent,
                xpEarned,
                passed,
                certificateUrl,
                completedAt: now,
            },
        });
        if (passed) {
            await this.updateUserProgress(userId, xpEarned, timeSpent);
        }
        const detailedAnswers = attempt.exam.questions.map((question) => {
            const answerData = scoredAnswers[question.id];
            return {
                questionId: question.id,
                question: question.question,
                userAnswer: answerData.userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect: answerData.isCorrect,
                pointsEarned: answerData.pointsEarned,
                explanation: question.explanation ?? undefined,
            };
        });
        return {
            attemptId: attempt.id,
            examId: attempt.exam.id,
            score,
            passed,
            xpEarned,
            timeSpent,
            totalQuestions,
            correctAnswers: correctCount,
            totalPoints,
            pointsEarned,
            certificateUrl,
            completedAt: now,
            answers: detailedAnswers,
        };
    }
    async getAttempts(userId, examId) {
        const where = {
            userId,
            completedAt: { not: null },
        };
        if (examId) {
            where.examId = examId;
        }
        const attempts = await this.prisma.examAttempt.findMany({
            where,
            include: {
                exam: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { completedAt: 'desc' },
        });
        return attempts.map((attempt) => ({
            id: attempt.id,
            examId: attempt.examId,
            examTitle: attempt.exam.title,
            score: attempt.score,
            passed: attempt.passed,
            xpEarned: attempt.xpEarned,
            timeSpent: attempt.timeSpent,
            certificateUrl: attempt.certificateUrl ?? undefined,
            startedAt: attempt.startedAt,
            completedAt: attempt.completedAt ?? undefined,
        }));
    }
    async canRetakeExam(userId, examId) {
        const exam = await this.prisma.exam.findUnique({
            where: { id: examId },
        });
        if (!exam) {
            throw new common_1.NotFoundException(`Exam ${examId} not found`);
        }
        const latestAttempt = await this.prisma.examAttempt.findFirst({
            where: {
                userId,
                examId,
                completedAt: { not: null },
            },
            orderBy: { completedAt: 'desc' },
        });
        if (!latestAttempt) {
            return {
                canRetake: true,
            };
        }
        const now = new Date();
        const lastAttemptTime = latestAttempt.completedAt.getTime();
        const timeSinceLastAttempt = (now.getTime() - lastAttemptTime) / 1000;
        if (timeSinceLastAttempt < exam.retakeCooldown) {
            const secondsUntilRetake = exam.retakeCooldown - timeSinceLastAttempt;
            const nextAvailableDate = new Date(lastAttemptTime + exam.retakeCooldown * 1000);
            return {
                canRetake: false,
                secondsUntilRetake: Math.ceil(secondsUntilRetake),
                lastAttemptDate: latestAttempt.completedAt,
                nextAvailableDate,
            };
        }
        return {
            canRetake: true,
            lastAttemptDate: latestAttempt.completedAt,
        };
    }
    async generateCertificate(attemptId, userId, exam) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        });
        return `https://example.com/certificates/${attemptId}.pdf?user=${user?.name}&exam=${exam.title}`;
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
        const existingProgress = await this.prisma.userProgress.findUnique({
            where: { userId },
        });
        if (!existingProgress) {
            await this.prisma.userProgress.create({
                data: {
                    userId,
                    currentXP: xpEarned,
                    totalTimeSpent: timeSpent,
                },
            });
        }
        else {
            await this.prisma.userProgress.update({
                where: { userId },
                data: {
                    currentXP: { increment: xpEarned },
                    totalTimeSpent: { increment: timeSpent },
                },
            });
        }
    }
    mapToExamDetailDto(exam) {
        const totalPoints = exam.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
        return {
            id: exam.id,
            title: exam.title,
            titleArabic: exam.titleArabic ?? undefined,
            description: exam.description ?? undefined,
            type: exam.type,
            stage: exam.stage,
            track: exam.track,
            minPassScore: exam.minPassScore,
            timeLimit: exam.timeLimit,
            xpReward: exam.xpReward,
            certificateTemplate: exam.certificateTemplate ?? undefined,
            retakeCooldown: exam.retakeCooldown,
            isPublished: exam.isPublished,
            questions: exam.questions?.map((q) => this.mapToExamQuestionDto(q, true)) || [],
            totalQuestions: exam.questions?.length || 0,
            totalPoints,
            createdAt: exam.createdAt,
            updatedAt: exam.updatedAt,
        };
    }
    mapToExamListDto(exam, userId) {
        const totalPoints = exam.questions?.reduce((sum, q) => sum + q.points, 0) || 0;
        const bestScore = userId && exam.attempts?.length > 0
            ? Math.max(...exam.attempts.map((a) => a.score))
            : undefined;
        const attemptCount = userId ? (exam.attempts?.length ?? 0) : undefined;
        const canRetake = exam.canRetake ?? true;
        return {
            id: exam.id,
            title: exam.title,
            titleArabic: exam.titleArabic ?? undefined,
            description: exam.description ?? undefined,
            type: exam.type,
            stage: exam.stage,
            track: exam.track,
            minPassScore: exam.minPassScore,
            timeLimit: exam.timeLimit,
            xpReward: exam.xpReward,
            retakeCooldown: exam.retakeCooldown,
            isPublished: exam.isPublished,
            totalQuestions: exam.questions?.length || 0,
            totalPoints,
            bestScore,
            attemptCount,
            canRetake,
            createdAt: exam.createdAt,
        };
    }
    mapToExamQuestionDto(question, includeAnswer) {
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
exports.ExamService = ExamService;
exports.ExamService = ExamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamService);
//# sourceMappingURL=exam.service.js.map