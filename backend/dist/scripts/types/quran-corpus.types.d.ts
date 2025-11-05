export interface CorpusVerseData {
    surah: number;
    ayah: number;
    text: string;
    textWithoutDiacritics: string;
    translation?: string;
    transliteration?: string;
    words: CorpusWordData[];
}
export interface CorpusWordData {
    position: number;
    segment: string;
    segmentWithoutDiacritics: string;
    translation: string;
    transliteration?: string;
    morphology: {
        lemma?: string;
        root?: string;
        partOfSpeech: string;
        features: MorphologicalFeatures;
    };
    syntax?: {
        role: string;
        parent?: number;
    };
}
export interface MorphologicalFeatures {
    pos?: string;
    posDetail?: string;
    gender?: 'masculine' | 'feminine';
    number?: 'singular' | 'dual' | 'plural';
    definiteness?: 'definite' | 'indefinite';
    definitenessType?: 'article' | 'proper_noun' | 'pronoun' | 'demonstrative' | 'relative';
    case?: 'nominative' | 'accusative' | 'genitive' | 'jussive';
    caseState?: 'declinable' | 'indeclinable';
    caseReason?: string;
    caseSign?: 'damma' | 'fatha' | 'kasra' | 'sukun' | 'alif' | 'ya' | 'waw';
    hasTanween?: boolean;
    structureType?: 'simple' | 'idafa' | 'prep_phrase' | 'adjective_phrase';
    structureRole?: 'mudaf' | 'mudaf_ilayh' | 'jar' | 'majrur';
    tense?: 'past' | 'present' | 'imperative';
    mood?: 'indicative' | 'subjunctive' | 'jussive';
    voice?: 'active' | 'passive';
    person?: 'first' | 'second' | 'third';
}
export interface VerseInput {
    surahNumber: number;
    verseNumber: number;
    textArabic: string;
    textWithoutDiacritics: string;
    translation: string;
    transliteration?: string;
    searchVectorAr?: string;
    searchVectorEn?: string;
}
export interface VerseWordInput {
    position: number;
    arabicText: string;
    textWithoutDiacritics: string;
    translation: string;
    transliteration?: string;
    posType: string;
    posArabic?: string;
    gender?: string;
    genderArabic?: string;
    number?: string;
    numberArabic?: string;
    definiteness?: string;
    definitenessArabic?: string;
    irabCase?: string;
    irabCaseArabic?: string;
    caseSign?: string;
    caseSignArabic?: string;
    caseSignSymbol?: string;
    structureType?: string;
    structureTypeArabic?: string;
    root?: string;
    lemma?: string;
    grammarData?: Record<string, any>;
}
export interface SurahMetadata {
    number: number;
    name: string;
    nameArabic: string;
    englishName: string;
    revelationType: 'meccan' | 'medinan';
    totalVerses: number;
}
export declare const MVP_SURAHS: SurahMetadata[];
export declare const GRAMMAR_TRANSLATIONS: {
    noun: string;
    verb: string;
    particle: string;
    masculine: string;
    feminine: string;
    singular: string;
    dual: string;
    plural: string;
    definite: string;
    indefinite: string;
    nominative: string;
    accusative: string;
    genitive: string;
    jussive: string;
    indeclinable: string;
    damma: string;
    fatha: string;
    kasra: string;
    sukun: string;
    alif: string;
    ya: string;
    waw: string;
    simple: string;
    idafa: string;
    prep_phrase: string;
    adjective_phrase: string;
};
export declare const CASE_SIGN_SYMBOLS: {
    damma: string;
    fatha: string;
    kasra: string;
    sukun: string;
    dammatain: string;
    fathatain: string;
    kasratain: string;
};
export declare class QuranDataError extends Error {
    constructor(message: string);
}
export declare class QuranTextMismatchError extends QuranDataError {
    constructor(surah: number, ayah: number, expected: string, received: string);
}
export declare class QuranDataValidationError extends QuranDataError {
    field: string;
    value: any;
    constructor(message: string, field: string, value: any);
}
