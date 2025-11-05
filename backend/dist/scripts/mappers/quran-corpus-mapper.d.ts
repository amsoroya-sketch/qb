import { CorpusVerseData, VerseInput, VerseWordInput } from '../types/quran-corpus.types';
export declare class QuranCorpusMapper {
    mapVerse(corpusVerse: CorpusVerseData): VerseInput;
    mapVerseWords(corpusVerse: CorpusVerseData): VerseWordInput[];
    private mapWord;
    private validateVerse;
    private normalizeArabicText;
    private createSearchVector;
    private mapPOSType;
    private mapGender;
    private mapNumber;
    private mapDefiniteness;
    private mapIrabCase;
    private mapCaseSign;
    private mapStructureType;
    mapVerses(corpusVerses: CorpusVerseData[]): {
        verses: VerseInput[];
        words: Map<string, VerseWordInput[]>;
    };
}
export declare const quranCorpusMapper: QuranCorpusMapper;
