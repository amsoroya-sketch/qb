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
exports.ActivityCalendarResponseDto = exports.ActivityStats = exports.CalendarDayItem = void 0;
const swagger_1 = require("@nestjs/swagger");
class CalendarDayItem {
}
exports.CalendarDayItem = CalendarDayItem;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date in ISO format (YYYY-MM-DD)', example: '2025-11-05' }),
    __metadata("design:type", String)
], CalendarDayItem.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of exercises completed', example: 12 }),
    __metadata("design:type", Number)
], CalendarDayItem.prototype, "exercisesCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of lessons completed', example: 2 }),
    __metadata("design:type", Number)
], CalendarDayItem.prototype, "lessonsCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'XP earned on this day', example: 150 }),
    __metadata("design:type", Number)
], CalendarDayItem.prototype, "xpEarned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Time spent in minutes', example: 45 }),
    __metadata("design:type", Number)
], CalendarDayItem.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity level for heatmap visualization',
        enum: ['none', 'low', 'medium', 'high'],
        example: 'medium',
    }),
    __metadata("design:type", String)
], CalendarDayItem.prototype, "activityLevel", void 0);
class ActivityStats {
}
exports.ActivityStats = ActivityStats;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of active days', example: 85 }),
    __metadata("design:type", Number)
], ActivityStats.prototype, "totalActiveDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longest streak of consecutive days', example: 15 }),
    __metadata("design:type", Number)
], ActivityStats.prototype, "longestStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current active streak', example: 5 }),
    __metadata("design:type", Number)
], ActivityStats.prototype, "currentStreak", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average XP per active day', example: 125.5 }),
    __metadata("design:type", Number)
], ActivityStats.prototype, "averagePerDay", void 0);
class ActivityCalendarResponseDto {
}
exports.ActivityCalendarResponseDto = ActivityCalendarResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Daily activity data for the requested period',
        type: [CalendarDayItem],
    }),
    __metadata("design:type", Array)
], ActivityCalendarResponseDto.prototype, "calendar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Activity statistics summary',
        type: ActivityStats,
    }),
    __metadata("design:type", ActivityStats)
], ActivityCalendarResponseDto.prototype, "stats", void 0);
//# sourceMappingURL=activity-calendar-response.dto.js.map