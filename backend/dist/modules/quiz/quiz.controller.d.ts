import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto, QuizDetailDto, QuizListDto, StartQuizDto, SubmitQuizAnswerDto, QuizResultDto, CompleteQuizDto, QuizAttemptDto, GenerateQuizDto, FindQuizzesDto, LeaderboardEntryDto, CreateQuizQuestionDto } from './dto/quiz.dto';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    create(dto: CreateQuizDto): Promise<QuizDetailDto>;
    update(id: string, dto: UpdateQuizDto): Promise<QuizDetailDto>;
    delete(id: string): Promise<void>;
    addQuestion(id: string, dto: CreateQuizQuestionDto): Promise<import("./dto/quiz.dto").QuizQuestionDto>;
    generateQuiz(dto: GenerateQuizDto): Promise<QuizDetailDto>;
    findAll(userId: string, filters: FindQuizzesDto): Promise<QuizListDto[]>;
    getAttempts(userId: string, quizId?: string): Promise<QuizAttemptDto[]>;
    findOne(id: string, userId: string): Promise<QuizDetailDto>;
    startQuiz(id: string, userId: string): Promise<StartQuizDto>;
    submitAnswer(attemptId: string, userId: string, dto: SubmitQuizAnswerDto): Promise<QuizResultDto>;
    completeQuiz(attemptId: string, userId: string): Promise<CompleteQuizDto>;
    getLeaderboard(id: string, limit?: string): Promise<LeaderboardEntryDto[]>;
}
