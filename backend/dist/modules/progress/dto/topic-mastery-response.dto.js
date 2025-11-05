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
exports.TopicMasteryResponseDto = exports.TopicItem = void 0;
const swagger_1 = require("@nestjs/swagger");
class TopicItem {
}
exports.TopicItem = TopicItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grammar topic name', example: 'Past Tense Verbs' }),
    __metadata("design:type", String)
], TopicItem.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total exercises attempted for this topic', example: 25 }),
    __metadata("design:type", Number)
], TopicItem.prototype, "totalExercises", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of correct answers', example: 20 }),
    __metadata("design:type", Number)
], TopicItem.prototype, "correctAnswers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Accuracy percentage (0-100)', example: 80 }),
    __metadata("design:type", Number)
], TopicItem.prototype, "accuracy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last time this topic was practiced (ISO date)',
        example: '2025-11-05T14:30:00Z',
    }),
    __metadata("design:type", String)
], TopicItem.prototype, "lastPracticed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mastery level based on accuracy',
        enum: ['beginner', 'intermediate', 'advanced'],
        example: 'intermediate',
    }),
    __metadata("design:type", String)
], TopicItem.prototype, "level", void 0);
class TopicMasteryResponseDto {
}
exports.TopicMasteryResponseDto = TopicMasteryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of grammar topics with mastery data',
        type: [TopicItem],
    }),
    __metadata("design:type", Array)
], TopicMasteryResponseDto.prototype, "topics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overall mastery percentage across all topics',
        example: 75.5,
    }),
    __metadata("design:type", Number)
], TopicMasteryResponseDto.prototype, "overallMastery", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Topic with highest accuracy',
        example: 'Noun Cases',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TopicMasteryResponseDto.prototype, "strongestTopic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Topic with lowest accuracy',
        example: 'Verb Conjugation',
        nullable: true,
    }),
    __metadata("design:type", Object)
], TopicMasteryResponseDto.prototype, "weakestTopic", void 0);
//# sourceMappingURL=topic-mastery-response.dto.js.map