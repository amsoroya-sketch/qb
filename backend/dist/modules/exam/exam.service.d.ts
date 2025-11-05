import { PrismaService } from '../../prisma/prisma.service';
import { CreateExamDto, UpdateExamDto, ExamDetailDto, ExamListDto, StartExamDto, SubmitExamDto, ExamResultDto, ExamAttemptDto, ExamQuestionDto, FindExamsDto, CreateExamQuestionDto, CanRetakeExamDto } from './dto/exam.dto';
export declare class ExamService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateExamDto): Promise<ExamDetailDto>;
    update(id: string, dto: UpdateExamDto): Promise<ExamDetailDto>;
    delete(id: string): Promise<void>;
    addQuestion(examId: string, question: CreateExamQuestionDto): Promise<ExamQuestionDto>;
    findAll(userId?: string, filters?: FindExamsDto): Promise<ExamListDto[]>;
    findOne(id: string, userId?: string): Promise<ExamDetailDto>;
    startExam(examId: string, userId: string): Promise<StartExamDto>;
    submitExam(attemptId: string, userId: string, dto: SubmitExamDto): Promise<ExamResultDto>;
    getAttempts(userId: string, examId?: string): Promise<ExamAttemptDto[]>;
    canRetakeExam(userId: string, examId: string): Promise<CanRetakeExamDto>;
    generateCertificate(attemptId: string, userId: string, exam: any): Promise<string | undefined>;
    private checkAnswer;
    private updateUserProgress;
    private mapToExamDetailDto;
    private mapToExamListDto;
    private mapToExamQuestionDto;
}
