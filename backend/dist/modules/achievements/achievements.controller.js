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
exports.AchievementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const achievements_service_1 = require("./achievements.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let AchievementsController = class AchievementsController {
    constructor(achievementsService) {
        this.achievementsService = achievementsService;
    }
    async findAll() {
        return this.achievementsService.findAll();
    }
    async getStats() {
        return this.achievementsService.getAchievementStats();
    }
    async getCategories() {
        return this.achievementsService.getAchievementCategories();
    }
    async getAchievementsByCategory(category) {
        return this.achievementsService.getAchievementsByCategory(category);
    }
    async findOne(id) {
        return this.achievementsService.findOne(id);
    }
    async getMyStats(userId) {
        return this.achievementsService.getUserStats(userId);
    }
    async getMyAchievements(userId) {
        return this.achievementsService.getUserAchievements(userId);
    }
    async checkAchievements(userId) {
        return this.achievementsService.checkAndUnlockAchievements(userId);
    }
};
exports.AchievementsController = AchievementsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all achievements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns all achievements' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get achievement statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns achievement stats with category breakdown' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all achievement categories' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns list of achievement categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('categories/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get achievements by category' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns achievements in the specified category' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Category not found or no achievements in category' }),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getAchievementsByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single achievement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns achievement details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Achievement not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('me/stats'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user achievement statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user achievement stats with rarity breakdown' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getMyStats", null);
__decorate([
    (0, common_1.Get)('me/unlocked'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user unlocked achievements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user achievements' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getMyAchievements", null);
__decorate([
    (0, common_1.Post)('me/check'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Check and unlock new achievements' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns newly unlocked achievements' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "checkAchievements", null);
exports.AchievementsController = AchievementsController = __decorate([
    (0, swagger_1.ApiTags)('achievements'),
    (0, common_1.Controller)('achievements'),
    __metadata("design:paramtypes", [achievements_service_1.AchievementsService])
], AchievementsController);
//# sourceMappingURL=achievements.controller.js.map