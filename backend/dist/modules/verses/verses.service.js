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
exports.VersesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
let VersesService = class VersesService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
        this.VERSE_CACHE_TTL = 3600;
        this.LIST_CACHE_TTL = 300;
    }
    async findAll(query) {
        const { page = 1, limit = 20, surahNumber } = query;
        const skip = (page - 1) * limit;
        const cacheKey = `verses:list:${surahNumber || 'all'}:${page}:${limit}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const where = {};
        if (surahNumber)
            where.surahNumber = surahNumber;
        const [verses, total] = await Promise.all([
            this.prisma.quranVerse.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
                include: {
                    words: {
                        orderBy: { position: 'asc' },
                    },
                },
            }),
            this.prisma.quranVerse.count({ where }),
        ]);
        const result = {
            data: verses,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
        await this.cache.set(cacheKey, JSON.stringify(result), this.LIST_CACHE_TTL);
        return result;
    }
    async findOne(surahNumber, verseNumber) {
        const cacheKey = `verse:${surahNumber}:${verseNumber}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const verse = await this.prisma.quranVerse.findUnique({
            where: {
                surahNumber_verseNumber: {
                    surahNumber,
                    verseNumber,
                },
            },
            include: {
                words: {
                    orderBy: { position: 'asc' },
                },
            },
        });
        if (!verse) {
            throw new common_1.NotFoundException(`Verse ${surahNumber}:${verseNumber} not found`);
        }
        await this.cache.set(cacheKey, JSON.stringify(verse), this.VERSE_CACHE_TTL);
        return verse;
    }
    async getWordAnalysis(wordId) {
        const cacheKey = `word:analysis:${wordId}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const word = await this.prisma.verseWord.findUnique({
            where: { id: wordId },
            include: {
                verse: {
                    select: {
                        surahNumber: true,
                        verseNumber: true,
                        textArabic: true,
                    },
                },
            },
        });
        if (!word) {
            throw new common_1.NotFoundException(`Word with ID ${wordId} not found`);
        }
        const result = {
            ...word,
            grammaticalAnalysis: {
                partOfSpeech: word.posType,
                gender: word.gender,
                number: word.number,
                definiteness: word.definiteness,
                case: word.irabCase,
                caseSign: word.caseSign,
                structure: word.structureType,
            },
        };
        await this.cache.set(cacheKey, JSON.stringify(result), this.VERSE_CACHE_TTL);
        return result;
    }
    async search(dto) {
        const { query, searchType = 'text', page = 1, limit = 20 } = dto;
        const skip = (page - 1) * limit;
        let where = {};
        if (searchType === 'text') {
            where = {
                OR: [
                    { textArabic: { contains: query, mode: 'insensitive' } },
                    { translation: { contains: query, mode: 'insensitive' } },
                    { transliteration: { contains: query, mode: 'insensitive' } },
                ],
            };
        }
        else if (searchType === 'root') {
            where = {
                words: {
                    some: {
                        root: { equals: query },
                    },
                },
            };
        }
        const [verses, total] = await Promise.all([
            this.prisma.quranVerse.findMany({
                where,
                skip,
                take: limit,
                orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
                include: {
                    words: {
                        where: searchType === 'root' ? { root: query } : undefined,
                        orderBy: { position: 'asc' },
                    },
                },
            }),
            this.prisma.quranVerse.count({ where }),
        ]);
        return {
            data: verses,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                query,
                searchType,
            },
        };
    }
    async getVersesByGrammar(posType, irabCase) {
        const where = {};
        if (posType || irabCase) {
            where.words = {
                some: {
                    ...(posType && { posType }),
                    ...(irabCase && { irabCase }),
                },
            };
        }
        const verses = await this.prisma.quranVerse.findMany({
            where,
            take: 50,
            include: {
                words: {
                    where: {
                        ...(posType && { posType }),
                        ...(irabCase && { irabCase }),
                    },
                    orderBy: { position: 'asc' },
                },
            },
            orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
        });
        return verses;
    }
    async createBookmark(userId, surahNumber, verseNumber) {
        const verse = await this.findOne(surahNumber, verseNumber);
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                verseId: verse.id,
            },
        });
        return bookmark;
    }
    async removeBookmark(userId, surahNumber, verseNumber) {
        const verse = await this.findOne(surahNumber, verseNumber);
        await this.prisma.bookmark.deleteMany({
            where: {
                userId,
                verseId: verse.id,
            },
        });
        return { message: 'Bookmark removed successfully' };
    }
    async getUserBookmarks(userId) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: { userId },
            include: {
                verse: {
                    include: {
                        words: {
                            orderBy: { position: 'asc' },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return bookmarks.map((b) => b.verse);
    }
    async getVerseAnalysis(surahNumber, verseNumber) {
        const verse = await this.findOne(surahNumber, verseNumber);
        if (!verse.words || verse.words.length === 0) {
            throw new common_1.NotFoundException(`No words found for verse ${surahNumber}:${verseNumber}`);
        }
        const firstWord = verse.words[0];
        const sentenceType = this.detectSentenceType(firstWord);
        const components = this.findSentenceComponents(verse.words, sentenceType.type);
        return {
            sentenceType: sentenceType.type,
            sentenceTypeAr: sentenceType.typeAr,
            structure: sentenceType.structure,
            structureAr: sentenceType.structureAr,
            description: sentenceType.description,
            verseExample: components,
        };
    }
    detectSentenceType(firstWord) {
        if (firstWord.posType === 'V') {
            return {
                type: 'verbal',
                typeAr: 'جملة فعلية',
                structure: 'Verb + Subject (+ Object)',
                structureAr: 'فعل + فاعل (+ مفعول)',
                description: 'Begins with a verb, emphasizes the action',
            };
        }
        else {
            return {
                type: 'nominal',
                typeAr: 'جملة اسمية',
                structure: 'Subject + Predicate',
                structureAr: 'مبتدأ + خبر',
                description: 'Begins with a noun, emphasizes the state or description',
            };
        }
    }
    findSentenceComponents(words, sentenceType) {
        const components = {};
        if (sentenceType === 'verbal') {
            const verb = words.find((w) => w.posType === 'V');
            if (verb) {
                components.verb = {
                    word: verb.arabicText,
                    position: verb.position,
                    translation: verb.translation,
                };
            }
            const subject = words.find((w, idx) => idx > 0 && (w.irabCase === 'Nominative' || w.syntacticRole === 'subject'));
            if (subject) {
                components.subject = {
                    word: subject.arabicText,
                    position: subject.position,
                    translation: subject.translation,
                };
            }
            const object = words.find((w) => w.irabCase === 'Accusative');
            if (object) {
                components.object = {
                    word: object.arabicText,
                    position: object.position,
                    translation: object.translation,
                };
            }
        }
        else {
            const subject = words.find((w, idx) => idx === 0 || w.syntacticRole === 'subject_nominal' || w.irabCase === 'Nominative');
            if (subject) {
                components.subject = {
                    word: subject.arabicText,
                    position: subject.position,
                    translation: subject.translation,
                    role: 'مبتدأ',
                };
            }
            const predicate = words.find((w) => w.syntacticRole === 'predicate' || (w.position > 0 && w !== subject));
            if (predicate) {
                components.predicate = {
                    word: predicate.arabicText,
                    position: predicate.position,
                    translation: predicate.translation,
                    role: 'خبر',
                };
            }
        }
        return components;
    }
    async getPhraseGroupings(surahNumber, verseNumber) {
        const verse = await this.findOne(surahNumber, verseNumber);
        const phrases = [];
        for (let i = 0; i < verse.words.length - 1; i++) {
            const current = verse.words[i];
            const next = verse.words[i + 1];
            if ((current.posType === 'N' || current.posType === 'PN') &&
                next.irabCase === 'Genitive' &&
                (next.posType === 'N' || next.posType === 'PN')) {
                phrases.push({
                    type: 'idafa',
                    typeAr: 'إضافة',
                    startPosition: current.position,
                    endPosition: next.position,
                    words: [
                        {
                            word: current.arabicText,
                            position: current.position,
                            role: 'mudaf',
                            roleAr: 'مضاف',
                            translation: current.translation,
                        },
                        {
                            word: next.arabicText,
                            position: next.position,
                            role: 'mudaf_ilayh',
                            roleAr: 'مضاف إليه',
                            translation: next.translation,
                        },
                    ],
                });
            }
        }
        for (let i = 0; i < verse.words.length - 1; i++) {
            const current = verse.words[i];
            const next = verse.words[i + 1];
            if (current.posType === 'P' && next.irabCase === 'Genitive') {
                phrases.push({
                    type: 'prepositional',
                    typeAr: 'شبه جملة جار ومجرور',
                    startPosition: current.position,
                    endPosition: next.position,
                    words: [
                        {
                            word: current.arabicText,
                            position: current.position,
                            role: 'preposition',
                            roleAr: 'حرف جر',
                            translation: current.translation,
                        },
                        {
                            word: next.arabicText,
                            position: next.position,
                            role: 'object',
                            roleAr: 'اسم مجرور',
                            translation: next.translation,
                        },
                    ],
                });
            }
        }
        return { phrases };
    }
    async getWordAgreements(surahNumber, verseNumber, position) {
        const verse = await this.findOne(surahNumber, verseNumber);
        const word = verse.words.find((w) => w.position === position);
        if (!word) {
            throw new common_1.NotFoundException(`Word at position ${position} not found`);
        }
        const relatedWord = this.findRelatedWord(word, verse.words);
        if (!relatedWord) {
            return {
                word: {
                    arabicText: word.arabicText,
                    position: word.position,
                    translation: word.translation,
                },
                agreements: [],
            };
        }
        const agreements = [];
        if (word.gender && relatedWord.gender) {
            agreements.push({
                type: 'gender',
                typeAr: 'الجنس',
                agreesWith: relatedWord.arabicText,
                agreementValue: word.gender.toLowerCase(),
                agreementValueAr: word.genderArabic,
                isCorrect: word.gender === relatedWord.gender,
            });
        }
        if (word.number && relatedWord.number) {
            agreements.push({
                type: 'number',
                typeAr: 'العدد',
                agreesWith: relatedWord.arabicText,
                agreementValue: word.number.toLowerCase(),
                agreementValueAr: word.numberArabic,
                isCorrect: word.number === relatedWord.number,
            });
        }
        if (word.irabCase && relatedWord.irabCase) {
            agreements.push({
                type: 'case',
                typeAr: 'الإعراب',
                agreesWith: relatedWord.arabicText,
                agreementValue: word.irabCase.toLowerCase(),
                agreementValueAr: word.irabCaseArabic,
                isCorrect: word.irabCase === relatedWord.irabCase,
            });
        }
        if (word.definiteness && relatedWord.definiteness) {
            agreements.push({
                type: 'definiteness',
                typeAr: 'التعريف',
                agreesWith: relatedWord.arabicText,
                agreementValue: word.definiteness.toLowerCase(),
                agreementValueAr: word.definitenessArabic,
                isCorrect: word.definiteness === relatedWord.definiteness,
            });
        }
        return {
            word: {
                arabicText: word.arabicText,
                position: word.position,
                translation: word.translation,
                posType: word.posType,
            },
            agreementsWith: {
                word: relatedWord.arabicText,
                wordId: relatedWord.id,
                position: relatedWord.position,
                role: this.inferAgreementRole(word, relatedWord),
            },
            agreements,
        };
    }
    findRelatedWord(word, allWords) {
        if (word.posType === 'ADJ') {
            for (let i = word.position - 1; i >= 0; i--) {
                const prevWord = allWords.find((w) => w.position === i);
                if (prevWord && (prevWord.posType === 'N' || prevWord.posType === 'PN')) {
                    return prevWord;
                }
            }
        }
        if (word.parentWordId) {
            return allWords.find((w) => w.id === word.parentWordId) || null;
        }
        if (word.posType === 'N' || word.posType === 'PN') {
            const nextWord = allWords.find((w) => w.position === word.position + 1);
            if (nextWord && nextWord.posType === 'ADJ') {
                return nextWord;
            }
        }
        return null;
    }
    inferAgreementRole(word, relatedWord) {
        if (word.posType === 'ADJ' && (relatedWord.posType === 'N' || relatedWord.posType === 'PN')) {
            return 'adjective_of_noun';
        }
        if (word.posType === 'N' && relatedWord.posType === 'ADJ') {
            return 'noun_of_adjective';
        }
        return 'related_word';
    }
};
exports.VersesService = VersesService;
exports.VersesService = VersesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], VersesService);
//# sourceMappingURL=verses.service.js.map