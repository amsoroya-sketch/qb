import { VersesService } from './verses.service';
import { FindVersesDto, SearchVersesDto } from './dto';
export declare class VersesController {
    private readonly versesService;
    constructor(versesService: VersesService);
    findAll(query: FindVersesDto): Promise<{
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
        };
    }>;
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
    findByGrammar(posType?: string, irabCase?: string): Promise<({
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
    findOne(surahNumber: number, verseNumber: number): Promise<{
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
    }>;
    getWordAnalysis(wordId: string): Promise<{
        grammaticalAnalysis: {
            partOfSpeech: string;
            gender: string | null;
            number: string | null;
            definiteness: string | null;
            case: string | null;
            caseSign: string | null;
            structure: string | null;
        };
        verse: {
            surahNumber: number;
            verseNumber: number;
            textArabic: string;
        };
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
    }>;
    createBookmark(surahNumber: number, verseNumber: number, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        verseId: string;
        notes: string | null;
    }>;
    removeBookmark(surahNumber: number, verseNumber: number, userId: string): Promise<{
        message: string;
    }>;
    getMyBookmarks(userId: string): Promise<({
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
    getPhraseGroupings(surahNumber: number, verseNumber: number): Promise<{
        phrases: any[];
    }>;
    getWordAgreements(surahNumber: number, verseNumber: number, position: number): Promise<{
        word: {
            arabicText: string;
            position: number;
            translation: string;
            posType?: undefined;
        };
        agreements: never[];
        agreementsWith?: undefined;
    } | {
        word: {
            arabicText: string;
            position: number;
            translation: string;
            posType: string;
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
            agreementValue: string;
            agreementValueAr: string | null;
            isCorrect: boolean;
        }[];
    }>;
}
