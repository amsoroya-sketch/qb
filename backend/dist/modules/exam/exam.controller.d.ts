import { ExamService } from './exam.service';
import { CreateExamDto, UpdateExamDto, ExamDetailDto, ExamListDto, StartExamDto, SubmitExamDto, ExamResultDto, ExamAttemptDto, FindExamsDto, CreateExamQuestionDto, CanRetakeExamDto } from './dto/exam.dto';
export declare class ExamController {
    private readonly examService;
    constructor(examService: ExamService);
    create(dto: CreateExamDto): Promise<ExamDetailDto>;
    update(id: string, dto: UpdateExamDto): Promise<ExamDetailDto>;
    delete(id: string): Promise<void>;
    addQuestion(id: string, dto: CreateExamQuestionDto): Promise<import("./dto/exam.dto").ExamQuestionDto>;
    findAll(userId: string, filters: FindExamsDto): Promise<ExamListDto[]>;
    getAttempts(userId: string, examId?: string): Promise<ExamAttemptDto[]>;
    findOne(id: string, userId: string): Promise<ExamDetailDto>;
    startExam(id: string, userId: string): Promise<StartExamDto>;
    submitExam(attemptId: string, userId: string, dto: SubmitExamDto): Promise<ExamResultDto>;
    canRetake(id: string, userId: string): Promise<CanRetakeExamDto>;
}
