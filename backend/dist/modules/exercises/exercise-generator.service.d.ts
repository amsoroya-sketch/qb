import { PrismaService } from '../../prisma/prisma.service';
export declare class ExerciseGeneratorService {
    private prisma;
    constructor(prisma: PrismaService);
    generateVerbAspectExercise(surahNumber: number, verseNumber: number, wordPosition: number): Promise<{
        type: "VERB_CONJUGATION";
        title: string;
        question: string;
        questionArabic: string;
        options: {
            value: string;
            label: string;
            labelAr: string;
        }[];
        correctAnswer: any;
        explanation: string;
        metadata: {
            grammarFocus: string;
            verseSource: string;
            wordPosition: number;
            wordId: string;
        };
    }>;
    generateNounCaseExercise(surahNumber: number, verseNumber: number, wordPosition: number): Promise<{
        type: "NOUN_DECLENSION";
        title: string;
        question: string;
        questionArabic: string;
        options: {
            value: string;
            label: string;
            labelAr: string;
        }[];
        correctAnswer: string;
        explanation: string;
        metadata: {
            grammarFocus: string;
            verseSource: string;
            wordPosition: number;
            wordId: string;
        };
    }>;
    generateRootExtractionExercise(surahNumber: number, verseNumber: number, wordPosition: number): Promise<{
        type: "ROOT_EXTRACTION";
        title: string;
        question: string;
        questionArabic: string;
        options: {
            value: string;
            label: string;
        }[];
        correctAnswer: string;
        explanation: string;
        metadata: {
            grammarFocus: string;
            verseSource: string;
            wordPosition: number;
            wordId: string;
        };
    }>;
    generateMorphemeIdentificationExercise(surahNumber: number, verseNumber: number, wordPosition: number): Promise<{
        type: "MORPHEME_IDENTIFICATION";
        title: string;
        question: string;
        questionArabic: string;
        options: {
            value: string;
            label: string;
            labelAr: string;
        }[];
        correctAnswer: string;
        explanation: string;
        metadata: {
            grammarFocus: string;
            verseSource: string;
            wordPosition: number;
            wordId: string;
            morphemes: {
                type: string;
                text: string;
            }[];
        };
    }>;
    generateSentenceTypeExercise(surahNumber: number, verseNumber: number): Promise<{
        type: "SENTENCE_TYPE";
        title: string;
        question: string;
        questionArabic: string;
        options: {
            value: string;
            label: string;
            labelAr: string;
        }[];
        correctAnswer: string;
        explanation: string;
        metadata: {
            grammarFocus: string;
            verseSource: string;
            verseId: string;
        };
    }>;
    generateSyntacticRoleExercise(surahNumber: number, verseNumber: number, wordPosition: number): Promise<{
        type: "SYNTACTIC_ROLE";
        title: string;
        question: string;
        questionArabic: string;
        options: {
            value: string;
            label: string;
            labelAr: string;
        }[];
        correctAnswer: string;
        explanation: string;
        metadata: {
            grammarFocus: string;
            verseSource: string;
            wordPosition: number;
            wordId: string;
        };
    }>;
    generateAgreementCheckingExercise(surahNumber: number, verseNumber: number, wordPosition: number): Promise<{
        type: "AGREEMENT_CHECKING";
        title: string;
        question: string;
        questionArabic: string;
        options: {
            value: string;
            label: string;
        }[];
        correctAnswer: string[];
        explanation: string;
        metadata: {
            grammarFocus: string;
            verseSource: string;
            wordPosition: number;
            wordId: string;
            relatedWordId: any;
        };
    }>;
    private getVerse;
    private getVerseWord;
    private parseMorphemes;
    private generateRootDistractors;
    private findRelatedWordForAgreement;
}
