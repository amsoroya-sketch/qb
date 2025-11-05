export interface MergedWord {
    location: string;
    surah: number;
    verse: number;
    wordPosition: number;
    arabicUthmani: string;
    arabicImlaei?: string;
    translation: string;
    transliteration: string;
    audioUrl: string | null;
    pageNumber: number;
    lineNumber: number;
    pos?: string;
    posFullName?: string;
    root?: string;
    lemma?: string;
    gender?: 'M' | 'F';
    number?: 'S' | 'D' | 'P';
    case?: 'NOM' | 'ACC' | 'GEN';
    aspect?: 'PERF' | 'IMPF' | 'IMPV';
    voice?: 'ACT' | 'PASS';
    person?: '1' | '2' | '3';
    rawMorphologyFeatures?: string;
    sources: {
        text: 'quran.com';
        morphology: 'corpus.quran.com';
    };
}
export interface MergedVerse {
    verseKey: string;
    verseNumber: number;
    surah: number;
    pageNumber: number;
    juzNumber: number;
    words: MergedWord[];
}
export declare class DataMerger {
    private loadMorphologyData;
    private loadSurahFiles;
    private mergeWord;
    mergeAll(): Promise<MergedVerse[]>;
    save(verses: MergedVerse[], outputPath: string): Promise<void>;
    getStats(verses: MergedVerse[]): {
        totalVerses: number;
        totalWords: number;
        totalSurahs: number;
        posDistribution: Record<string, number>;
        genderDistribution: Record<string, number>;
        numberDistribution: Record<string, number>;
    };
}
