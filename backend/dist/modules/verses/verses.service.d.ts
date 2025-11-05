import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { FindVersesDto, SearchVersesDto } from './dto';
export declare class VersesService {
    private prisma;
    private cache;
    private readonly VERSE_CACHE_TTL;
    private readonly LIST_CACHE_TTL;
    constructor(prisma: PrismaService, cache: CacheService);
    findAll(query: FindVersesDto): Promise<any>;
    findOne(surahNumber: number, verseNumber: number): Promise<any>;
    getWordAnalysis(wordId: string): Promise<any>;
    search(dto: SearchVersesDto): Promise<{
        data: ({
            words: {
                number: string | null;
                id: string;
                createdAt: Date;
                textWithoutDiacritics: string;
                translation: string;
                transliteration: string | null;
                position: number;
                verseId: string;
                arabicText: string;
                posType: string;
                posArabic: string | null;
                gender: string | null;
                genderArabic: string | null;
                numberArabic: string | null;
                definiteness: string | null;
                definitenessArabic: string | null;
                irabCase: string | null;
                irabCaseArabic: string | null;
                caseSign: string | null;
                caseSignArabic: string | null;
                caseSignSymbol: string | null;
                structureType: string | null;
                structureTypeArabic: string | null;
                syntacticRole: string | null;
                syntacticRoleAr: string | null;
                parentWordId: string | null;
                dependencyRelation: string | null;
                grammarData: import("@prisma/client/runtime/library").JsonValue | null;
                root: string | null;
                lemma: string | null;
            }[];
        } & {
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            query: string;
            searchType: "root" | "text";
        };
    }>;
    getVersesByGrammar(posType?: string, irabCase?: string): Promise<({
        words: {
            number: string | null;
            id: string;
            createdAt: Date;
            textWithoutDiacritics: string;
            translation: string;
            transliteration: string | null;
            position: number;
            verseId: string;
            arabicText: string;
            posType: string;
            posArabic: string | null;
            gender: string | null;
            genderArabic: string | null;
            numberArabic: string | null;
            definiteness: string | null;
            definitenessArabic: string | null;
            irabCase: string | null;
            irabCaseArabic: string | null;
            caseSign: string | null;
            caseSignArabic: string | null;
            caseSignSymbol: string | null;
            structureType: string | null;
            structureTypeArabic: string | null;
            syntacticRole: string | null;
            syntacticRoleAr: string | null;
            parentWordId: string | null;
            dependencyRelation: string | null;
            grammarData: import("@prisma/client/runtime/library").JsonValue | null;
            root: string | null;
            lemma: string | null;
        }[];
    } & {
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
    })[]>;
    createBookmark(userId: string, surahNumber: number, verseNumber: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        verseId: string;
        notes: string | null;
    }>;
    removeBookmark(userId: string, surahNumber: number, verseNumber: number): Promise<{
        message: string;
    }>;
    getUserBookmarks(userId: string): Promise<({
        words: {
            number: string | null;
            id: string;
            createdAt: Date;
            textWithoutDiacritics: string;
            translation: string;
            transliteration: string | null;
            position: number;
            verseId: string;
            arabicText: string;
            posType: string;
            posArabic: string | null;
            gender: string | null;
            genderArabic: string | null;
            numberArabic: string | null;
            definiteness: string | null;
            definitenessArabic: string | null;
            irabCase: string | null;
            irabCaseArabic: string | null;
            caseSign: string | null;
            caseSignArabic: string | null;
            caseSignSymbol: string | null;
            structureType: string | null;
            structureTypeArabic: string | null;
            syntacticRole: string | null;
            syntacticRoleAr: string | null;
            parentWordId: string | null;
            dependencyRelation: string | null;
            grammarData: import("@prisma/client/runtime/library").JsonValue | null;
            root: string | null;
            lemma: string | null;
        }[];
    } & {
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
    })[]>;
    getVerseAnalysis(surahNumber: number, verseNumber: number): Promise<{
        sentenceType: string;
        sentenceTypeAr: string;
        structure: string;
        structureAr: string;
        description: string;
        verseExample: any;
    }>;
    private detectSentenceType;
    private findSentenceComponents;
    getPhraseGroupings(surahNumber: number, verseNumber: number): Promise<{
        phrases: any[];
    }>;
    getWordAgreements(surahNumber: number, verseNumber: number, position: number): Promise<{
        word: {
            arabicText: any;
            position: any;
            translation: any;
            posType?: undefined;
        };
        agreements: never[];
        agreementsWith?: undefined;
    } | {
        word: {
            arabicText: any;
            position: any;
            translation: any;
            posType: any;
        };
        agreementsWith: {
            word: any;
            wordId: any;
            position: any;
            role: string;
        };
        agreements: {
            type: string;
            typeAr: string;
            agreesWith: any;
            agreementValue: any;
            agreementValueAr: any;
            isCorrect: boolean;
        }[];
    }>;
    private findRelatedWord;
    private inferAgreementRole;
}
