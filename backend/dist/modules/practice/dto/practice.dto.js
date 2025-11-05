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
exports.PracticeResultDto = exports.PracticeSetResponseDto = exports.PracticeExerciseDto = exports.SubmitPracticeAnswerDto = exports.GetPracticeSetDto = exports.PracticeModeEnum = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PracticeModeEnum;
(function (PracticeModeEnum) {
    PracticeModeEnum["QUICK_PRACTICE"] = "quick_practice";
    PracticeModeEnum["GRAMMAR_DRILLS"] = "grammar_drills";
    PracticeModeEnum["VERSE_BASED"] = "verse_based";
    PracticeModeEnum["SPACED_REPETITION"] = "spaced_repetition";
    PracticeModeEnum["CHALLENGE"] = "challenge";
    PracticeModeEnum["DAILY"] = "daily";
})(PracticeModeEnum || (exports.PracticeModeEnum = PracticeModeEnum = {}));
class GetPracticeSetDto {
}
exports.GetPracticeSetDto = GetPracticeSetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PracticeModeEnum, example: PracticeModeEnum.QUICK_PRACTICE }),
    (0, class_validator_1.IsEnum)(PracticeModeEnum),
    __metadata("design:type", String)
], GetPracticeSetDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, minimum: 1, maximum: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], GetPracticeSetDto.prototype, "count", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'aspect', description: 'Grammar focus area for drills' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPracticeSetDto.prototype, "grammarFocus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1, description: 'Surah number for verse-based practice' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(114),
    __metadata("design:type", Number)
], GetPracticeSetDto.prototype, "surahNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetPracticeSetDto.prototype, "difficulty", void 0);
class SubmitPracticeAnswerDto {
}
exports.SubmitPracticeAnswerDto = SubmitPracticeAnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'exercise-uuid' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitPracticeAnswerDto.prototype, "exerciseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PERF' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitPracticeAnswerDto.prototype, "userAnswer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'Time spent in seconds' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SubmitPracticeAnswerDto.prototype, "timeSpent", void 0);
class PracticeExerciseDto {
}
exports.PracticeExerciseDto = PracticeExerciseDto;
class PracticeSetResponseDto {
}
exports.PracticeSetResponseDto = PracticeSetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PracticeModeEnum }),
    __metadata("design:type", String)
], PracticeSetResponseDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PracticeExerciseDto] }),
    __metadata("design:type", Array)
], PracticeSetResponseDto.prototype, "exercises", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PracticeSetResponseDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15, description: 'Estimated time in minutes' }),
    __metadata("design:type", Number)
], PracticeSetResponseDto.prototype, "estimatedTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'aspect' }),
    __metadata("design:type", String)
], PracticeSetResponseDto.prototype, "grammarFocus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    __metadata("design:type", Number)
], PracticeSetResponseDto.prototype, "surahNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], example: ['aspect', 'case', 'gender'] }),
    __metadata("design:type", Array)
], PracticeSetResponseDto.prototype, "weakTopics", void 0);
class PracticeResultDto {
}
exports.PracticeResultDto = PracticeResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], PracticeResultDto.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PracticeResultDto.prototype, "correctAnswer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PracticeResultDto.prototype, "explanation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PracticeResultDto.prototype, "xpEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PracticeResultDto.prototype, "timeBonus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PracticeResultDto.prototype, "totalXP", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PracticeResultDto.prototype, "accuracy", void 0);
//# sourceMappingURL=practice.dto.js.map