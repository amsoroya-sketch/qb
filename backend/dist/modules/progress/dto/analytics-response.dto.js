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
exports.AnalyticsResponseDto = exports.WeeklyStatsComparison = exports.WeeklyStatsItem = exports.LevelMilestone = exports.XpHistoryItem = void 0;
const swagger_1 = require("@nestjs/swagger");
class XpHistoryItem {
}
exports.XpHistoryItem = XpHistoryItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date in ISO format (YYYY-MM-DD)', example: '2025-11-01' }),
    __metadata("design:type", String)
], XpHistoryItem.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total XP at this date', example: 150 }),
    __metadata("design:type", Number)
], XpHistoryItem.prototype, "xp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Level at this date', example: 2 }),
    __metadata("design:type", Number)
], XpHistoryItem.prototype, "level", void 0);
class LevelMilestone {
}
exports.LevelMilestone = LevelMilestone;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Level number', example: 3 }),
    __metadata("design:type", Number)
], LevelMilestone.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'XP required to reach this level', example: 250 }),
    __metadata("design:type", Number)
], LevelMilestone.prototype, "xpRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when user achieved this level (null if not achieved)',
        example: '2025-11-03T10:30:00Z',
        nullable: true,
    }),
    __metadata("design:type", Object)
], LevelMilestone.prototype, "achievedDate", void 0);
class WeeklyStatsItem {
}
exports.WeeklyStatsItem = WeeklyStatsItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'XP gained in this period', example: 120 }),
    __metadata("design:type", Number)
], WeeklyStatsItem.prototype, "xpGained", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Lessons completed in this period', example: 3 }),
    __metadata("design:type", Number)
], WeeklyStatsItem.prototype, "lessonsCompleted", void 0);
class WeeklyStatsComparison {
}
exports.WeeklyStatsComparison = WeeklyStatsComparison;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current week statistics' }),
    __metadata("design:type", WeeklyStatsItem)
], WeeklyStatsComparison.prototype, "currentWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last week statistics' }),
    __metadata("design:type", WeeklyStatsItem)
], WeeklyStatsComparison.prototype, "lastWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage change (positive or negative)', example: 25.5 }),
    __metadata("design:type", Number)
], WeeklyStatsComparison.prototype, "change", void 0);
class AnalyticsResponseDto {
}
exports.AnalyticsResponseDto = AnalyticsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'XP and level history for the past 30 days',
        type: [XpHistoryItem],
    }),
    __metadata("design:type", Array)
], AnalyticsResponseDto.prototype, "xpHistory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Level milestones with achievement dates',
        type: [LevelMilestone],
    }),
    __metadata("design:type", Array)
], AnalyticsResponseDto.prototype, "levelMilestones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Weekly statistics comparison',
        type: WeeklyStatsComparison,
    }),
    __metadata("design:type", WeeklyStatsComparison)
], AnalyticsResponseDto.prototype, "weeklyStats", void 0);
//# sourceMappingURL=analytics-response.dto.js.map