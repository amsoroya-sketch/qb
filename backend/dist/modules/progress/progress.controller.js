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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const progress_service_1 = require("./progress.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let ProgressController = class ProgressController {
    constructor(progressService) {
        this.progressService = progressService;
    }
    async getMyProgress(userId) {
        return this.progressService.getUserProgress(userId);
    }
    async getDashboard(userId) {
        return this.progressService.getDashboardStats(userId);
    }
    async getMyLessonProgress(userId) {
        return this.progressService.getLessonProgress(userId);
    }
    async getMyAchievements(userId) {
        return this.progressService.getAchievementProgress(userId);
    }
    async updateMyStreak(userId) {
        return this.progressService.updateStreak(userId);
    }
    async getMyAnalytics(userId) {
        return this.progressService.getAnalytics(userId);
    }
    async getMyTopicMastery(userId) {
        return this.progressService.getTopicMastery(userId);
    }
    async getMyActivityCalendar(userId, days) {
        const daysNum = days ? parseInt(days, 10) : 365;
        return this.progressService.getActivityCalendar(userId, daysNum);
    }
    async getUserProgress(userId) {
        return this.progressService.getUserProgress(userId);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user progress' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user progress' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyProgress", null);
__decorate([
    (0, common_1.Get)('me/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns dashboard stats' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('me/lessons'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lesson progress for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns lesson progress' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyLessonProgress", null);
__decorate([
    (0, common_1.Get)('me/achievements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get achievement progress for current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns achievements' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyAchievements", null);
__decorate([
    (0, common_1.Post)('me/streak'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user streak (called on daily login)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Streak updated' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "updateMyStreak", null);
__decorate([
    (0, common_1.Get)('me/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get progress analytics with time-series data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns analytics data for charts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyAnalytics", null);
__decorate([
    (0, common_1.Get)('me/topic-mastery'),
    (0, swagger_1.ApiOperation)({ summary: 'Get grammar topic mastery breakdown' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns topic accuracy and skill levels' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyTopicMastery", null);
__decorate([
    (0, common_1.Get)('me/activity-calendar'),
    (0, swagger_1.ApiOperation)({ summary: 'Get daily activity calendar data' }),
    (0, swagger_1.ApiQuery)({
        name: 'days',
        required: false,
        type: Number,
        description: 'Number of days to fetch (1-730, default 365)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns activity heatmap data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getMyActivityCalendar", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get progress for specific user (admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user progress' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProgressController.prototype, "getUserProgress", null);
exports.ProgressController = ProgressController = __decorate([
    (0, swagger_1.ApiTags)('progress'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('progress'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map