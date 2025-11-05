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
exports.LessonsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const lessons_service_1 = require("./lessons.service");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const update_lesson_dto_1 = require("./dto/update-lesson.dto");
const find_lessons_dto_1 = require("./dto/find-lessons.dto");
const complete_lesson_dto_1 = require("./dto/complete-lesson.dto");
let LessonsController = class LessonsController {
    constructor(lessonsService) {
        this.lessonsService = lessonsService;
    }
    async findAll(query) {
        const result = await this.lessonsService.findAll(query);
        return {
            success: true,
            ...result,
        };
    }
    async findOne(id) {
        const lesson = await this.lessonsService.findOne(id);
        return {
            success: true,
            data: lesson,
        };
    }
    async getProgress(lessonId, userId) {
        const progress = await this.lessonsService.getUserLessonProgress(userId, lessonId);
        return {
            success: true,
            data: progress,
        };
    }
    async startLesson(lessonId, userId) {
        const progress = await this.lessonsService.startLesson(userId, lessonId);
        return {
            success: true,
            data: progress,
        };
    }
    async completeLesson(lessonId, dto, userId) {
        const progress = await this.lessonsService.completeLesson(userId, lessonId, dto.timeSpent);
        return {
            success: true,
            data: progress,
        };
    }
    async create(dto) {
        const lesson = await this.lessonsService.create(dto);
        return {
            success: true,
            data: lesson,
        };
    }
    async update(id, dto) {
        const lesson = await this.lessonsService.update(id, dto);
        return {
            success: true,
            data: lesson,
        };
    }
    async remove(id) {
        const result = await this.lessonsService.remove(id);
        return {
            success: true,
            ...result,
        };
    }
};
exports.LessonsController = LessonsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lessons with pagination and filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lessons retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_lessons_dto_1.FindLessonsDto]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lesson by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Lesson not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user progress for lesson' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Progress retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start a lesson' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson started' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "startLesson", null);
__decorate([
    (0, common_1.Post)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Complete a lesson' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson completed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, complete_lesson_dto_1.CompleteLessonDto, String]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "completeLesson", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new lesson (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Lesson created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Update lesson (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lesson_dto_1.UpdateLessonDto]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete lesson (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lesson deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LessonsController.prototype, "remove", null);
exports.LessonsController = LessonsController = __decorate([
    (0, swagger_1.ApiTags)('lessons'),
    (0, common_1.Controller)('lessons'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [lessons_service_1.LessonsService])
], LessonsController);
//# sourceMappingURL=lessons.controller.js.map