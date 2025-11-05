export interface CorpusMorphemeSegment {
    location: string;
    surah: number;
    verse: number;
    word: number;
    segment: number;
    form: string;
    tag: string;
    features: string;
}
export interface MorphologicalFeatures {
    pos?: string;
    posFullName?: string;
    root?: string;
    lemma?: string;
    gender?: 'M' | 'F';
    number?: 'S' | 'D' | 'P';
    case?: 'NOM' | 'ACC' | 'GEN';
    aspect?: 'PERF' | 'IMPF' | 'IMPV';
    voice?: 'ACT' | 'PASS';
    mood?: string;
    person?: '1' | '2' | '3';
    definiteness?: 'DEF' | 'INDEF';
    state?: string;
    rawFeatures: string;
    segments: CorpusMorphemeSegment[];
}
export interface CorpusWord {
    location: string;
    surah: number;
    verse: number;
    wordPosition: number;
    arabicText: string;
    morphology: MorphologicalFeatures;
}
export interface CorpusData {
    words: Map<string, CorpusWord>;
    metadata: {
        version: string;
        totalWords: number;
        source: string;
        license: string;
    };
}
export declare const POS_TAGS: Record<string, string>;
export interface ParsedFeatures {
    [key: string]: string | boolean;
}
