import { SurahMetadata, Verse } from '../types/quran-api.types';
export declare class QuranAPIFetcher {
    private http;
    private storage;
    private rateLimiter;
    constructor();
    fetchChapters(useCache?: boolean): Promise<SurahMetadata[]>;
    fetchChapterVerses(chapterNumber: number, useCache?: boolean): Promise<Verse[]>;
    fetchAllSurahs(useCache?: boolean): Promise<Map<number, Verse[]>>;
    getStats(surahsData: Map<number, Verse[]>): {
        totalSurahs: number;
        totalVerses: number;
        totalWords: number;
        surahDetails: Array<{
            surah: number;
            verses: number;
            words: number;
        }>;
    };
    private buildVersesURL;
    private normalizeWord;
    getRateLimiterStats(): {
        requestsLastSecond: number;
        requestsLastMinute: number;
        utilizationPercent: number;
    };
}
