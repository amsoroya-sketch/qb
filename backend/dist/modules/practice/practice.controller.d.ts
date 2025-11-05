import { PracticeService } from './practice.service';
import { SubmitPracticeAnswerDto, PracticeSetResponseDto, PracticeResultDto, PracticeModeEnum } from './dto/practice.dto';
export declare class PracticeController {
    private readonly practiceService;
    constructor(practiceService: PracticeService);
    getPracticeSet(userId: string, mode: PracticeModeEnum, grammarFocus?: string, difficulty?: string, count?: string, surahNumber?: string): Promise<PracticeSetResponseDto>;
    submitAnswer(userId: string, dto: SubmitPracticeAnswerDto): Promise<PracticeResultDto>;
}
