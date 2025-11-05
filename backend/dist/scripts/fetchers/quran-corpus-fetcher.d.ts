import { CorpusVerseData } from '../types/quran-corpus.types';
export declare class QuranCorpusFetcher {
    private storage;
    private http;
    fetchSurah(surahNumber: number, useCache?: boolean): Promise<CorpusVerseData[]>;
    fetchVerse(surahNumber: number, verseNumber: number): Promise<CorpusVerseData>;
    private fetchVerseWords;
    private removeDiacritics;
    private inferPOS;
    private inferMorphology;
    fetchMVPSurahs(useCache?: boolean): Promise<Map<number, CorpusVerseData[]>>;
    getStats(surahsData: Map<number, CorpusVerseData[]>): {
        totalSurahs: number;
        totalVerses: number;
        totalWords: number;
        surahDetails: Array<{
            surah: number;
            verses: number;
            words: number;
        }>;
    };
}
