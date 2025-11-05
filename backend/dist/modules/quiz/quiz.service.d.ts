import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseGeneratorService } from '../exercises/exercise-generator.service';
import { CreateQuizDto, UpdateQuizDto, QuizDetailDto, QuizListDto, StartQuizDto, SubmitQuizAnswerDto, QuizResultDto, CompleteQuizDto, QuizAttemptDto, QuizQuestionDto, GenerateQuizDto, FindQuizzesDto, LeaderboardEntryDto, CreateQuizQuestionDto } from './dto/quiz.dto';
export declare class QuizService {
    private prisma;
    private exerciseGenerator;
    constructor(prisma: PrismaService, exerciseGenerator: ExerciseGeneratorService);
    create(dto: CreateQuizDto): Promise<QuizDetailDto>;
    update(id: string, dto: UpdateQuizDto): Promise<QuizDetailDto>;
    delete(id: string): Promise<void>;
    addQuestion(quizId: string, question: CreateQuizQuestionDto): Promise<QuizQuestionDto>;
    generateQuizFromGrammar(dto: GenerateQuizDto): Promise<QuizDetailDto>;
    findAll(userId?: string, filters?: FindQuizzesDto): Promise<QuizListDto[]>;
    findOne(id: string, userId?: string): Promise<QuizDetailDto>;
    startQuiz(quizId: string, userId: string): Promise<StartQuizDto>;
    submitAnswer(attemptId: string, userId: string, dto: SubmitQuizAnswerDto): Promise<QuizResultDto>;
    completeQuiz(attemptId: string, userId: string): Promise<CompleteQuizDto>;
    getAttempts(userId: string, quizId?: string): Promise<QuizAttemptDto[]>;
    getLeaderboard(quizId: string, limit?: number): Promise<LeaderboardEntryDto[]>;
    private generateQuestionsFromGrammar;
    private selectRandomVerses;
    private checkAnswer;
    private updateUserProgress;
    private mapToQuizDetailDto;
    private mapToQuizListDto;
    private mapToQuizQuestionDto;
}
