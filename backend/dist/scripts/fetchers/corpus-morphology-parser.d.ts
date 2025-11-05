import { CorpusData } from '../types/corpus-morphology.types';
export declare class CorpusMorphologyParser {
    parseFile(filePath: string): Promise<CorpusData>;
    private parseSegments;
    private parseSegmentLine;
    private groupByWord;
    private buildWordFromSegments;
    private extractMorphology;
    private parseFeatures;
    saveToFile(data: CorpusData, outputPath: string): Promise<void>;
    getStats(data: CorpusData): {
        totalWords: number;
        totalVerses: number;
        totalSurahs: number;
        posDistribution: Record<string, number>;
    };
}
