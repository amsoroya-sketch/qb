import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseGeneratorService } from '../exercises/exercise-generator.service';
import { GetPracticeSetDto, SubmitPracticeAnswerDto, PracticeSetResponseDto, PracticeResultDto } from './dto/practice.dto';
export declare class PracticeService {
    private prisma;
    private exerciseGenerator;
    constructor(prisma: PrismaService, exerciseGenerator: ExerciseGeneratorService);
    getPracticeSet(userId: string, dto: GetPracticeSetDto): Promise<PracticeSetResponseDto>;
    getQuickPractice(userId: string, count?: number, grammarFocus?: string): Promise<PracticeSetResponseDto>;
    getGrammarDrills(userId: string, grammarFocus: string, count?: number): Promise<PracticeSetResponseDto>;
    getVerseBasedPractice(userId: string, surahNumber: number, count?: number): Promise<PracticeSetResponseDto>;
    getSpacedRepetitionSet(userId: string, count?: number): Promise<PracticeSetResponseDto>;
    getChallengeMode(userId: string, count?: number): Promise<PracticeSetResponseDto>;
    getDailyPracticeSet(userId: string): Promise<PracticeSetResponseDto>;
    submitPracticeAnswer(userId: string, dto: SubmitPracticeAnswerDto): Promise<PracticeResultDto>;
    private selectRandomVerses;
    private getUserWeakTopics;
    private shuffleArray;
    private calculateEstimatedTime;
    private generateExerciseForVerse;
    private mapGeneratorOutputToDto;
    private validateAnswer;
    private updateGrammarStats;
}
