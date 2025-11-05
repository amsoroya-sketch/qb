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
exports.LeaderboardEntryDto = exports.FindQuizzesDto = exports.GenerateQuizDto = exports.QuizAttemptDto = exports.CompleteQuizDto = exports.QuizResultDto = exports.SubmitQuizAnswerDto = exports.StartQuizDto = exports.QuizListDto = exports.QuizDetailDto = exports.QuizQuestionDto = exports.UpdateQuizDto = exports.CreateQuizDto = exports.CreateQuizQuestionDto = exports.ExerciseTypeEnum = exports.TrackEnum = exports.QuizTypeEnum = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var QuizTypeEnum;
(function (QuizTypeEnum) {
    QuizTypeEnum["TOPIC"] = "TOPIC";
    QuizTypeEnum["COMPREHENSIVE"] = "COMPREHENSIVE";
    QuizTypeEnum["DIAGNOSTIC"] = "DIAGNOSTIC";
    QuizTypeEnum["PRACTICE"] = "PRACTICE";
})(QuizTypeEnum || (exports.QuizTypeEnum = QuizTypeEnum = {}));
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
class CreateQuizQuestionDto {
}
exports.CreateQuizQuestionDto = CreateQuizQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What is the aspect of this verb?' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizQuestionDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ما هو زمن هذا الفعل؟' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizQuestionDto.prototype, "questionArabic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExerciseTypeEnum, example: ExerciseTypeEnum.VERB_CONJUGATION }),
    (0, class_validator_1.IsEnum)(ExerciseTypeEnum),
    __metadata("design:type", String)
], CreateQuizQuestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: [
            { value: 'PERF', label: 'Perfect (ماضي)' },
            { value: 'IMPF', label: 'Imperfect (مضارع)' },
        ],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateQuizQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PERF' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizQuestionDto.prototype, "correctAnswer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'This verb is in the perfect aspect...' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizQuestionDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'aspect' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizQuestionDto.prototype, "grammarFocus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1:1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizQuestionDto.prototype, "verseReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateQuizQuestionDto.prototype, "wordPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateQuizQuestionDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateQuizQuestionDto.prototype, "points", void 0);
class CreateQuizDto {
}
exports.CreateQuizDto = CreateQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Verb Aspect Quiz' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'اختبار زمن الفعل' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "titleArabic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Test your knowledge of verb aspects' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: QuizTypeEnum, example: QuizTypeEnum.TOPIC }),
    (0, class_validator_1.IsEnum)(QuizTypeEnum),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'lesson-uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "lessonId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateQuizDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TrackEnum, example: TrackEnum.A }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TrackEnum),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 80, minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateQuizDto.prototype, "minPassScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 600, description: 'Time limit in seconds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(60),
    __metadata("design:type", Number)
], CreateQuizDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateQuizDto.prototype, "xpReward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateQuizDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateQuizQuestionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateQuizQuestionDto),
    __metadata("design:type", Array)
], CreateQuizDto.prototype, "questions", void 0);
class UpdateQuizDto extends (0, swagger_1.PartialType)(CreateQuizDto) {
}
exports.UpdateQuizDto = UpdateQuizDto;
class QuizQuestionDto {
}
exports.QuizQuestionDto = QuizQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "questionArabic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExerciseTypeEnum }),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Array)
], QuizQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "grammarFocus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "verseReference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], QuizQuestionDto.prototype, "wordPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizQuestionDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizQuestionDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "correctAnswer", void 0);
class QuizDetailDto {
}
exports.QuizDetailDto = QuizDetailDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizDetailDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizDetailDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizDetailDto.prototype, "titleArabic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizDetailDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: QuizTypeEnum }),
    __metadata("design:type", String)
], QuizDetailDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizDetailDto.prototype, "lessonId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], QuizDetailDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TrackEnum }),
    __metadata("design:type", String)
], QuizDetailDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizDetailDto.prototype, "minPassScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], QuizDetailDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizDetailDto.prototype, "xpReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], QuizDetailDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [QuizQuestionDto] }),
    __metadata("design:type", Array)
], QuizDetailDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizDetailDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizDetailDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuizDetailDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuizDetailDto.prototype, "updatedAt", void 0);
class QuizListDto {
}
exports.QuizListDto = QuizListDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizListDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizListDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizListDto.prototype, "titleArabic", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizListDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: QuizTypeEnum }),
    __metadata("design:type", String)
], QuizListDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizListDto.prototype, "lessonId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], QuizListDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TrackEnum }),
    __metadata("design:type", String)
], QuizListDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizListDto.prototype, "minPassScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Number)
], QuizListDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizListDto.prototype, "xpReward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], QuizListDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizListDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizListDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User best score if userId provided' }),
    __metadata("design:type", Number)
], QuizListDto.prototype, "bestScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User attempt count if userId provided' }),
    __metadata("design:type", Number)
], QuizListDto.prototype, "attemptCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuizListDto.prototype, "createdAt", void 0);
class StartQuizDto {
}
exports.StartQuizDto = StartQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StartQuizDto.prototype, "quizId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], StartQuizDto.prototype, "attemptId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [QuizQuestionDto] }),
    __metadata("design:type", Array)
], StartQuizDto.prototype, "questions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Time limit in seconds' }),
    __metadata("design:type", Number)
], StartQuizDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StartQuizDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], StartQuizDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], StartQuizDto.prototype, "startedAt", void 0);
class SubmitQuizAnswerDto {
}
exports.SubmitQuizAnswerDto = SubmitQuizAnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'attempt-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitQuizAnswerDto.prototype, "attemptId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'question-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitQuizAnswerDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PERF' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitQuizAnswerDto.prototype, "userAnswer", void 0);
class QuizResultDto {
}
exports.QuizResultDto = QuizResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizResultDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], QuizResultDto.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizResultDto.prototype, "correctAnswer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], QuizResultDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizResultDto.prototype, "pointsEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current total score so far' }),
    __metadata("design:type", Number)
], QuizResultDto.prototype, "currentScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Questions answered so far' }),
    __metadata("design:type", Number)
], QuizResultDto.prototype, "questionsAnswered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total questions in quiz' }),
    __metadata("design:type", Number)
], QuizResultDto.prototype, "totalQuestions", void 0);
class CompleteQuizDto {
}
exports.CompleteQuizDto = CompleteQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CompleteQuizDto.prototype, "attemptId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CompleteQuizDto.prototype, "quizId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Final score 0-100' }),
    __metadata("design:type", Number)
], CompleteQuizDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CompleteQuizDto.prototype, "passed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompleteQuizDto.prototype, "xpEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompleteQuizDto.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompleteQuizDto.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompleteQuizDto.prototype, "correctAnswers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompleteQuizDto.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CompleteQuizDto.prototype, "pointsEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], CompleteQuizDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detailed answers with correctness' }),
    __metadata("design:type", Array)
], CompleteQuizDto.prototype, "answers", void 0);
class QuizAttemptDto {
}
exports.QuizAttemptDto = QuizAttemptDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizAttemptDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizAttemptDto.prototype, "quizId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], QuizAttemptDto.prototype, "quizTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Score 0-100' }),
    __metadata("design:type", Number)
], QuizAttemptDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], QuizAttemptDto.prototype, "passed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], QuizAttemptDto.prototype, "xpEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time spent in seconds' }),
    __metadata("design:type", Number)
], QuizAttemptDto.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], QuizAttemptDto.prototype, "completedAt", void 0);
class GenerateQuizDto {
}
exports.GenerateQuizDto = GenerateQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'aspect', description: 'Grammar focus area' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizDto.prototype, "grammarFocus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, minimum: 5, maximum: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], GenerateQuizDto.prototype, "questionCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Verb Aspect Practice Quiz' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 80, minimum: 0, maximum: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GenerateQuizDto.prototype, "minPassScore", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 600, description: 'Time limit in seconds' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(60),
    __metadata("design:type", Number)
], GenerateQuizDto.prototype, "timeLimit", void 0);
class FindQuizzesDto {
}
exports.FindQuizzesDto = FindQuizzesDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: QuizTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(QuizTypeEnum),
    __metadata("design:type", String)
], FindQuizzesDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, minimum: 1, maximum: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], FindQuizzesDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: TrackEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TrackEnum),
    __metadata("design:type", String)
], FindQuizzesDto.prototype, "track", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'lesson-uuid' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FindQuizzesDto.prototype, "lessonId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true, description: 'Only published quizzes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], FindQuizzesDto.prototype, "isPublished", void 0);
class LeaderboardEntryDto {
}
exports.LeaderboardEntryDto = LeaderboardEntryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeaderboardEntryDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeaderboardEntryDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LeaderboardEntryDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LeaderboardEntryDto.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], LeaderboardEntryDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LeaderboardEntryDto.prototype, "rank", void 0);
//# sourceMappingURL=quiz.dto.js.map