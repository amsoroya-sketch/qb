export declare class QuranDataImporter {
    private prisma;
    private mapper;
    constructor();
    importMVPSurahs(options?: {
        force?: boolean;
        validate?: boolean;
    }): Promise<void>;
    private importSurah;
    private validateVerse;
    private clearExistingData;
    getImportStats(): Promise<{
        totalVerses: number;
        totalWords: number;
        surahCounts: Array<{
            surah: number;
            verses: number;
            words: number;
        }>;
    }>;
    disconnect(): Promise<void>;
}
