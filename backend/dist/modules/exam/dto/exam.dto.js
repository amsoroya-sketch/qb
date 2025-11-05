"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanRetakeExamDto = exports.FindExamsDto = exports.ExamAttemptDto = exports.ExamResultDto = exports.SubmitExamDto = exports.StartExamDto = exports.ExamListDto = exports.ExamDetailDto = exports.ExamQuestionDto = exports.UpdateExamDto = exports.CreateExamDto = exports.CreateExamQuestionDto = exports.ExerciseTypeEnum = exports.TrackEnum = exports.ExamTypeEnum = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var ExamTypeEnum;
(function (ExamTypeEnum) {
    ExamTypeEnum["STAGE_COMPLETION"] = "STAGE_COMPLETION";
    ExamTypeEnum["FINAL_ASSESSMENT"] = "FINAL_ASSESSMENT";
    ExamTypeEnum["CERTIFICATION"] = "CERTIFICATION";
})(ExamTypeEnum || (exports.ExamTypeEnum = ExamTypeEnum = {}));
var TrackEnum;
(function (TrackEnum) {
    TrackEnum["A"] = "A";
    TrackEnum["B"] = "B";
})(TrackEnum || (exports.TrackEnum = TrackEnum = {}));
var ExerciseTypeEnum;
(function (ExerciseTypeEnum) {
    ExerciseTypeEnum["MULTIPLE_CHOICE"] = "MULTIPLE_CHOICE";
    ExerciseTypeEnum["FILL_IN_BLANK"] = "FILL_IN_BLANK";
    ExerciseTypeEnum["TRUE_FALSE"] = "TRUE_FALSE";
    ExerciseTypeEnum["MATCHING"] = "MATCHING";
    ExerciseTypeEnum["DRAG_DROP"] = "DRAG_DROP";
    ExerciseTypeEnum["WORD_ANALYSIS"] = "WORD_ANALYSIS";
    ExerciseTypeEnum["MORPHEME_IDENTIFICATION"] = "MORPHEME_IDENTIFICATION";
    ExerciseTypeEnum["VERB_CONJUGATION"] = "VERB_CONJUGATION";
    ExerciseTypeEnum["NOUN_DECLENSION"] = "NOUN_DECLENSION";
    ExerciseTypeEnum["ROOT_EXTRACTION"] = "ROOT_EXTRACTION";
    ExerciseTypeEnum["SENTENCE_TYPE"] = "SENTENCE_TYPE";
    ExerciseTypeEnum["SYNTACTIC_ROLE"] = "SYNTACTIC_ROLE";
    ExerciseTypeEnum["PHRASE_GROUPING"] = "PHRASE_GROUPING";
    ExerciseTypeEnum["AGREEMENT_CHECKING"] = "AGREEMENT_CHECKING";
    ExerciseTypeEnum["I3RAB_ANALYSIS"] = "I3RAB_ANALYSIS";
    ExerciseTypeEnum["MORPHEME_SEGMENTATION"] = "MORPHEME_SEGMENTATION";
    ExerciseTypeEnum["DEPENDENCY_TREE"] = "DEPENDENCY_TREE";
})(ExerciseTypeEnum || (exports.ExerciseTypeEnum = ExerciseTypeEnum = {}));
class CreateExamQuestionDto {
}
exports.CreateExamQuestionDto = CreateExamQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What is the case of this noun?' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamQuestionDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ما هو إعراب هذا الاسم؟' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamQuestionDto.prototype, "questionArabic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExerciseTypeEnum, example: ExerciseTypeEnum.NOUN_DECLENSION }),
    (0, class_validator_1.IsEnum)(ExerciseTypeEnum),
    __metadata("design:type", String)
], CreateExamQuestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: [
            { value: 'NOM', label: 'Nominative (مرفوع)' },
            { value: 'ACC', label: 'Accusative (منصوب)' },
            { value: 'GEN', label: 'Genitive (مجرور)' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateExamQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'NOM' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamQuestionDto.prototype, "correctAnswer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'This noun is nominative because it is the subject of the sentence.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamQuestionDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'case' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamQuestionDto.prototype, "grammarFocus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2:255' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamQuestionDto.prototype, "verseReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateExamQuestionDto.prototype, "wordPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateExamQuestionDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateExamQuestionDto.prototype, "points", void 0);
class CreateExamDto {
}
exports.CreateExamDto = CreateExamDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Stage 1 Completion Exam' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'اختبار إكمال المرحلة الأولى' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "titleArabic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Comprehensive exam covering all Stage 1 topics' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExamTypeEnum, example: ExamTypeEnum.STAGE_COMPLETION }),
    (0, class_validator_1.IsEnum)(ExamTypeEnum),
    __metadata("design:type", String)
], CreateExamDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, minimum: 1, maximum: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TrackEnum, example: TrackEnum.A }),
    (0, class_validator_1.IsEnum)(TrackEnum),
    __metadata("design:type", String)
], CreateExamDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 85, minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "minPassScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3600, description: 'Time limit in seconds (REQUIRED for exams)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(300),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 150 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "xpReward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '<svg>...</svg>',
        description: 'Certificate template (SVG or HTML)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExamDto.prototype, "certificateTemplate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 86400,
        description: 'Retake cooldown in seconds (default 24hrs)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateExamDto.prototype, "retakeCooldown", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateExamDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateExamQuestionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateExamQuestionDto),
    __metadata("design:type", Array)
], CreateExamDto.prototype, "questions", void 0);
class UpdateExamDto extends (0, swagger_1.PartialType)(CreateExamDto) {
}
exports.UpdateExamDto = UpdateExamDto;
class ExamQuestionDto {
}
exports.ExamQuestionDto = ExamQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "questionArabic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExerciseTypeEnum }),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], ExamQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "grammarFocus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "verseReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], ExamQuestionDto.prototype, "wordPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamQuestionDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamQuestionDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamQuestionDto.prototype, "correctAnswer", void 0);
class ExamDetailDto {
}
exports.ExamDetailDto = ExamDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamDetailDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamDetailDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamDetailDto.prototype, "titleArabic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamDetailDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExamTypeEnum }),
    __metadata("design:type", String)
], ExamDetailDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamDetailDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TrackEnum }),
    __metadata("design:type", String)
], ExamDetailDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamDetailDto.prototype, "minPassScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamDetailDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamDetailDto.prototype, "xpReward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamDetailDto.prototype, "certificateTemplate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamDetailDto.prototype, "retakeCooldown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ExamDetailDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExamQuestionDto] }),
    __metadata("design:type", Array)
], ExamDetailDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamDetailDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamDetailDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ExamDetailDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ExamDetailDto.prototype, "updatedAt", void 0);
class ExamListDto {
}
exports.ExamListDto = ExamListDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamListDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamListDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamListDto.prototype, "titleArabic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamListDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExamTypeEnum }),
    __metadata("design:type", String)
], ExamListDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamListDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: TrackEnum }),
    __metadata("design:type", String)
], ExamListDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamListDto.prototype, "minPassScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamListDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamListDto.prototype, "xpReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamListDto.prototype, "retakeCooldown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ExamListDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamListDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamListDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User best score if userId provided' }),
    __metadata("design:type", Number)
], ExamListDto.prototype, "bestScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User attempt count if userId provided' }),
    __metadata("design:type", Number)
], ExamListDto.prototype, "attemptCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can user retake exam (respects cooldown)' }),
    __metadata("design:type", Boolean)
], ExamListDto.prototype, "canRetake", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ExamListDto.prototype, "createdAt", void 0);
class StartExamDto {
}
exports.StartExamDto = StartExamDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StartExamDto.prototype, "examId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StartExamDto.prototype, "attemptId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ExamQuestionDto] }),
    __metadata("design:type", Array)
], StartExamDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time limit in seconds' }),
    __metadata("design:type", Number)
], StartExamDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StartExamDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StartExamDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], StartExamDto.prototype, "startedAt", void 0);
class SubmitExamDto {
}
exports.SubmitExamDto = SubmitExamDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            'question-uuid-1': 'answer1',
            'question-uuid-2': 'answer2',
            'question-uuid-3': 'answer3',
        },
        description: 'Map of questionId -> userAnswer',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SubmitExamDto.prototype, "answers", void 0);
class ExamResultDto {
}
exports.ExamResultDto = ExamResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamResultDto.prototype, "attemptId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamResultDto.prototype, "examId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Final score 0-100' }),
    __metadata("design:type", Number)
], ExamResultDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ExamResultDto.prototype, "passed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamResultDto.prototype, "xpEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamResultDto.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamResultDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamResultDto.prototype, "correctAnswers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamResultDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamResultDto.prototype, "pointsEarned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamResultDto.prototype, "certificateUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ExamResultDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed answers with correctness' }),
    __metadata("design:type", Array)
], ExamResultDto.prototype, "answers", void 0);
class ExamAttemptDto {
}
exports.ExamAttemptDto = ExamAttemptDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamAttemptDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamAttemptDto.prototype, "examId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ExamAttemptDto.prototype, "examTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Score 0-100' }),
    __metadata("design:type", Number)
], ExamAttemptDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ExamAttemptDto.prototype, "passed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ExamAttemptDto.prototype, "xpEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time spent in seconds' }),
    __metadata("design:type", Number)
], ExamAttemptDto.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], ExamAttemptDto.prototype, "certificateUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], ExamAttemptDto.prototype, "startedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], ExamAttemptDto.prototype, "completedAt", void 0);
class FindExamsDto {
}
exports.FindExamsDto = FindExamsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ExamTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ExamTypeEnum),
    __metadata("design:type", String)
], FindExamsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, minimum: 1, maximum: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], FindExamsDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TrackEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TrackEnum),
    __metadata("design:type", String)
], FindExamsDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Only published exams' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], FindExamsDto.prototype, "isPublished", void 0);
class CanRetakeExamDto {
}
exports.CanRetakeExamDto = CanRetakeExamDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CanRetakeExamDto.prototype, "canRetake", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Seconds until can retake' }),
    __metadata("design:type", Number)
], CanRetakeExamDto.prototype, "secondsUntilRetake", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], CanRetakeExamDto.prototype, "lastAttemptDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], CanRetakeExamDto.prototype, "nextAvailableDate", void 0);
//# sourceMappingURL=exam.dto.js.map