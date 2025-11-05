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
exports.PracticeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const exercise_generator_service_1 = require("../exercises/exercise-generator.service");
const cache_service_1 = require("../../common/cache/cache.service");
const practice_dto_1 = require("./dto/practice.dto");
let PracticeService = class PracticeService {
    constructor(prisma, exerciseGenerator, cacheService) {
        this.prisma = prisma;
        this.exerciseGenerator = exerciseGenerator;
        this.cacheService = cacheService;
        this.VERSE_CACHE_TTL = 3600;
        this.EXERCISE_CACHE_TTL = 1800;
    }
    async getPracticeSet(userId, dto) {
        const count = dto.count || 10;
        switch (dto.mode) {
            case practice_dto_1.PracticeModeEnum.QUICK_PRACTICE:
                return this.getQuickPractice(userId, count, dto.grammarFocus);
            case practice_dto_1.PracticeModeEnum.GRAMMAR_DRILLS:
                if (!dto.grammarFocus) {
                    throw new common_1.BadRequestException('grammarFocus is required for GRAMMAR_DRILLS mode');
                }
                return this.getGrammarDrills(userId, dto.grammarFocus, count);
            case practice_dto_1.PracticeModeEnum.VERSE_BASED:
                if (!dto.surahNumber) {
                    throw new common_1.BadRequestException('surahNumber is required for VERSE_BASED mode');
                }
                return this.getVerseBasedPractice(userId, dto.surahNumber, count);
            case practice_dto_1.PracticeModeEnum.SPACED_REPETITION:
                return this.getSpacedRepetitionSet(userId, count);
            case practice_dto_1.PracticeModeEnum.CHALLENGE:
                return this.getChallengeMode(userId, count);
            case practice_dto_1.PracticeModeEnum.DAILY:
                return this.getDailyPracticeSet(userId);
            default:
                throw new common_1.BadRequestException(`Invalid practice mode: ${dto.mode}`);
        }
    }
    async getQuickPractice(userId, count = 10, grammarFocus) {
        const verses = await this.selectRandomVerses(null, count * 3);
        const exercises = [];
        const generatorMethods = ['aspect', 'case', 'root', 'sentence_type', 'syntactic_role'];
        const exercisePromises = verses.map((verse, index) => {
            const method = grammarFocus || generatorMethods[index % generatorMethods.length];
            return this.generateExerciseForVerse(verse, method).catch(() => null);
        });
        const generatedExercises = await Promise.all(exercisePromises);
        const validExercises = generatedExercises.filter((ex) => ex !== null);
        exercises.push(...validExercises.slice(0, count));
        return {
            mode: practice_dto_1.PracticeModeEnum.QUICK_PRACTICE,
            exercises,
            totalCount: exercises.length,
            estimatedTime: this.calculateEstimatedTime(exercises.length),
            grammarFocus,
        };
    }
    async getGrammarDrills(userId, grammarFocus, count = 10) {
        const validTopics = [
            'aspect',
            'case',
            'root',
            'morpheme',
            'sentence_type',
            'syntactic_role',
            'agreement',
        ];
        if (!validTopics.includes(grammarFocus)) {
            throw new common_1.BadRequestException(`Invalid grammar focus: ${grammarFocus}. Valid options: ${validTopics.join(', ')}`);
        }
        const verses = await this.selectRandomVerses(null, count * 4);
        const exercisePromises = verses.map((verse) => this.generateExerciseForVerse(verse, grammarFocus).catch(() => null));
        const generatedExercises = await Promise.all(exercisePromises);
        const exercises = generatedExercises
            .filter((ex) => ex !== null)
            .slice(0, count);
        if (exercises.length === 0) {
            throw new common_1.NotFoundException(`Could not generate exercises for grammar focus: ${grammarFocus}`);
        }
        return {
            mode: practice_dto_1.PracticeModeEnum.GRAMMAR_DRILLS,
            exercises,
            totalCount: exercises.length,
            estimatedTime: this.calculateEstimatedTime(exercises.length),
            grammarFocus,
        };
    }
    async getVerseBasedPractice(userId, surahNumber, count = 10) {
        if (surahNumber < 1 || surahNumber > 114) {
            throw new common_1.BadRequestException('surahNumber must be between 1 and 114');
        }
        const verses = await this.selectRandomVerses(surahNumber, count * 2);
        if (verses.length === 0) {
            throw new common_1.NotFoundException(`No verses found for Surah ${surahNumber}`);
        }
        const grammarTopics = ['aspect', 'case', 'root', 'sentence_type'];
        const exercisePromises = verses.map((verse, index) => {
            const topic = grammarTopics[index % grammarTopics.length];
            return this.generateExerciseForVerse(verse, topic).catch(() => null);
        });
        const generatedExercises = await Promise.all(exercisePromises);
        const exercises = generatedExercises
            .filter((ex) => ex !== null)
            .slice(0, count);
        return {
            mode: practice_dto_1.PracticeModeEnum.VERSE_BASED,
            exercises,
            totalCount: exercises.length,
            estimatedTime: this.calculateEstimatedTime(exercises.length),
            surahNumber,
        };
    }
    async getSpacedRepetitionSet(userId, count = 10) {
        const weakTopics = await this.getUserWeakTopics(userId, 3);
        if (weakTopics.length === 0) {
            return this.getQuickPractice(userId, count);
        }
        const verses = await this.selectRandomVerses(null, count * 3);
        const exercisePromises = verses.map((verse, index) => {
            const topic = weakTopics[index % weakTopics.length];
            return this.generateExerciseForVerse(verse, topic).catch(() => null);
        });
        const generatedExercises = await Promise.all(exercisePromises);
        const exercises = generatedExercises
            .filter((ex) => ex !== null)
            .slice(0, count);
        return {
            mode: practice_dto_1.PracticeModeEnum.SPACED_REPETITION,
            exercises,
            totalCount: exercises.length,
            estimatedTime: this.calculateEstimatedTime(exercises.length),
            weakTopics,
        };
    }
    async getChallengeMode(userId, count = 10) {
        const verses = await this.selectRandomVerses(null, count * 4);
        const advancedTopics = ['morpheme', 'agreement', 'syntactic_role'];
        const exercisePromises = verses.map((verse, index) => {
            const topic = advancedTopics[index % advancedTopics.length];
            return this.generateExerciseForVerse(verse, topic).catch(() => null);
        });
        const generatedExercises = await Promise.all(exercisePromises);
        const validExercises = generatedExercises.filter((ex) => ex !== null);
        const exercises = validExercises.slice(0, count).map((exercise) => ({
            ...exercise,
            xpReward: Math.floor(exercise.xpReward * 1.5),
            difficulty: 'ADVANCED',
        }));
        return {
            mode: practice_dto_1.PracticeModeEnum.CHALLENGE,
            exercises,
            totalCount: exercises.length,
            estimatedTime: this.calculateEstimatedTime(exercises.length),
        };
    }
    async getDailyPracticeSet(userId) {
        const totalCount = 20;
        const weakTopics = await this.getUserWeakTopics(userId, 3);
        const weakCount = 6;
        const randomCount = 8;
        const reviewCount = 6;
        const exercises = [];
        if (weakTopics.length > 0) {
            const weakVerses = await this.selectRandomVerses(null, weakCount * 2);
            const weakPromises = weakVerses.map((verse, index) => {
                const topic = weakTopics[index % weakTopics.length];
                return this.generateExerciseForVerse(verse, topic).catch(() => null);
            });
            const weakExercises = await Promise.all(weakPromises);
            exercises.push(...weakExercises.filter((ex) => ex !== null).slice(0, weakCount));
        }
        const randomVerses = await this.selectRandomVerses(null, randomCount * 2);
        const allTopics = ['aspect', 'case', 'root', 'sentence_type', 'syntactic_role'];
        const randomPromises = randomVerses.map((verse, index) => {
            const topic = allTopics[index % allTopics.length];
            return this.generateExerciseForVerse(verse, topic).catch(() => null);
        });
        const randomExercises = await Promise.all(randomPromises);
        exercises.push(...randomExercises
            .filter((ex) => ex !== null)
            .slice(0, randomCount));
        const reviewVerses = await this.selectRandomVerses(null, reviewCount * 2);
        const reviewPromises = reviewVerses.map((verse, index) => {
            const topic = weakTopics.length > 0
                ? weakTopics[index % weakTopics.length]
                : allTopics[index % allTopics.length];
            return this.generateExerciseForVerse(verse, topic).catch(() => null);
        });
        const reviewExercises = await Promise.all(reviewPromises);
        exercises.push(...reviewExercises
            .filter((ex) => ex !== null)
            .slice(0, reviewCount));
        const shuffledExercises = this.shuffleArray(exercises);
        return {
            mode: practice_dto_1.PracticeModeEnum.DAILY,
            exercises: shuffledExercises.slice(0, totalCount),
            totalCount: Math.min(shuffledExercises.length, totalCount),
            estimatedTime: this.calculateEstimatedTime(Math.min(shuffledExercises.length, totalCount)),
            weakTopics: weakTopics.length > 0 ? weakTopics : undefined,
        };
    }
    async submitPracticeAnswer(userId, dto) {
        const parts = dto.exerciseId.split('_');
        const grammarFocus = parts[parts.length - 1];
        const isCorrect = this.validateAnswer();
        const baseXP = isCorrect ? 10 : 0;
        const timeBonus = dto.timeSpent < 30 && isCorrect ? Math.floor(baseXP * 0.2) : 0;
        const totalXP = baseXP + timeBonus;
        if (grammarFocus) {
            await this.updateGrammarStats(userId, grammarFocus, isCorrect);
        }
        if (isCorrect) {
            await this.prisma.userProgress.update({
                where: { userId },
                data: {
                    exercisesCompleted: { increment: 1 },
                    currentXP: { increment: totalXP },
                    totalTimeSpent: { increment: dto.timeSpent },
                },
            });
        }
        const stats = await this.prisma.userGrammarStats.findUnique({
            where: {
                userId_grammarFocus: {
                    userId,
                    grammarFocus: grammarFocus || 'general',
                },
            },
        });
        const accuracy = stats ? Number(stats.accuracy) : isCorrect ? 100 : 0;
        return {
            isCorrect,
            correctAnswer: 'Answer varies by exercise',
            explanation: 'Explanation varies by exercise',
            xpEarned: baseXP,
            timeBonus,
            totalXP,
            accuracy,
        };
    }
    async selectRandomVerses(surahNumber, count) {
        const where = surahNumber ? { surahNumber } : {};
        const totalCount = await this.prisma.quranVerse.count({ where });
        if (totalCount === 0) {
            return [];
        }
        const offsets = [];
        for (let i = 0; i < Math.min(count, totalCount); i++) {
            const randomOffset = Math.floor(Math.random() * totalCount);
            offsets.push(randomOffset);
        }
        const verseIds = await Promise.all(offsets.map(async (offset) => {
            const result = await this.prisma.quranVerse.findMany({
                where,
                skip: offset,
                take: 1,
                select: { id: true },
            });
            return result[0]?.id;
        }));
        const validIds = verseIds.filter((id) => id !== undefined);
        const verses = await this.prisma.quranVerse.findMany({
            where: {
                id: { in: validIds },
            },
            include: {
                words: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        return verses;
    }
    async getUserWeakTopics(userId, limit = 3) {
        const stats = await this.prisma.userGrammarStats.findMany({
            where: {
                userId,
                totalAttempts: { gte: 3 },
            },
            orderBy: [
                { accuracy: 'asc' },
                { lastPracticed: 'asc' },
            ],
            take: limit,
        });
        return stats.map((s) => s.grammarFocus);
    }
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    calculateEstimatedTime(exerciseCount) {
        return Math.ceil(exerciseCount * 1.5);
    }
    async generateExerciseForVerse(verse, grammarFocus) {
        const cacheKey = `exercise:${verse.id}:${grammarFocus}`;
        const cached = await this.cacheService.getJson(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            let generatorOutput;
            switch (grammarFocus) {
                case 'aspect': {
                    const verbWord = verse.words.find((w) => w.posType === 'V');
                    if (!verbWord)
                        return null;
                    generatorOutput = await this.exerciseGenerator.generateVerbAspectExercise(verse.surahNumber, verse.verseNumber, verbWord.position);
                    break;
                }
                case 'case': {
                    const nounWord = verse.words.find((w) => ['N', 'PN', 'ADJ'].includes(w.posType) && w.irabCase);
                    if (!nounWord)
                        return null;
                    generatorOutput = await this.exerciseGenerator.generateNounCaseExercise(verse.surahNumber, verse.verseNumber, nounWord.position);
                    break;
                }
                case 'root': {
                    const rootWord = verse.words.find((w) => w.root);
                    if (!rootWord)
                        return null;
                    generatorOutput = await this.exerciseGenerator.generateRootExtractionExercise(verse.surahNumber, verse.verseNumber, rootWord.position);
                    break;
                }
                case 'morpheme': {
                    const morphemeWord = verse.words.find((w) => w.grammarData?.rawFeatures);
                    if (!morphemeWord)
                        return null;
                    generatorOutput = await this.exerciseGenerator.generateMorphemeIdentificationExercise(verse.surahNumber, verse.verseNumber, morphemeWord.position);
                    break;
                }
                case 'sentence_type': {
                    generatorOutput = await this.exerciseGenerator.generateSentenceTypeExercise(verse.surahNumber, verse.verseNumber);
                    break;
                }
                case 'syntactic_role': {
                    const syntaxWord = verse.words.find((w) => w.syntacticRole);
                    if (!syntaxWord)
                        return null;
                    generatorOutput = await this.exerciseGenerator.generateSyntacticRoleExercise(verse.surahNumber, verse.verseNumber, syntaxWord.position);
                    break;
                }
                case 'agreement': {
                    const agreementWord = verse.words.find((w) => w.posType === 'ADJ' || w.posType === 'N');
                    if (!agreementWord)
                        return null;
                    generatorOutput = await this.exerciseGenerator.generateAgreementCheckingExercise(verse.surahNumber, verse.verseNumber, agreementWord.position);
                    break;
                }
                default:
                    return null;
            }
            const exercise = this.mapGeneratorOutputToDto(generatorOutput, grammarFocus);
            if (exercise) {
                await this.cacheService.setJson(cacheKey, exercise, this.EXERCISE_CACHE_TTL);
            }
            return exercise;
        }
        catch (error) {
            return null;
        }
    }
    mapGeneratorOutputToDto(generatorOutput, grammarFocus) {
        const exerciseId = `practice_${generatorOutput.type}_${generatorOutput.metadata?.verseSource}_${generatorOutput.metadata?.wordPosition || 0}_${grammarFocus}`;
        return {
            id: exerciseId,
            type: generatorOutput.type,
            title: generatorOutput.title,
            question: generatorOutput.question,
            questionArabic: generatorOutput.questionArabic,
            options: generatorOutput.options,
            xpReward: 10,
            difficulty: 'INTERMEDIATE',
            metadata: {
                ...generatorOutput.metadata,
                correctAnswer: generatorOutput.correctAnswer,
                explanation: generatorOutput.explanation,
            },
        };
    }
    validateAnswer() {
        return Math.random() > 0.3;
    }
    async updateGrammarStats(userId, grammarFocus, isCorrect) {
        const existing = await this.prisma.userGrammarStats.findUnique({
            where: {
                userId_grammarFocus: {
                    userId,
                    grammarFocus,
                },
            },
        });
        if (existing) {
            const newTotal = existing.totalAttempts + 1;
            const newCorrect = existing.correctAttempts + (isCorrect ? 1 : 0);
            const newAccuracy = (newCorrect / newTotal) * 100;
            await this.prisma.userGrammarStats.update({
                where: {
                    userId_grammarFocus: {
                        userId,
                        grammarFocus,
                    },
                },
                data: {
                    totalAttempts: newTotal,
                    correctAttempts: newCorrect,
                    accuracy: newAccuracy,
                    lastPracticed: new Date(),
                },
            });
        }
        else {
            await this.prisma.userGrammarStats.create({
                data: {
                    userId,
                    grammarFocus,
                    totalAttempts: 1,
                    correctAttempts: isCorrect ? 1 : 0,
                    accuracy: isCorrect ? 100 : 0,
                    lastPracticed: new Date(),
                },
            });
        }
    }
};
exports.PracticeService = PracticeService;
exports.PracticeService = PracticeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        exercise_generator_service_1.ExerciseGeneratorService,
        cache_service_1.CacheService])
], PracticeService);
//# sourceMappingURL=practice.service.js.map