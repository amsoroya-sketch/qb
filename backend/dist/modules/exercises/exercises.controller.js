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
exports.ExercisesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const exercises_service_1 = require("./exercises.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const dto_1 = require("./dto");
let ExercisesController = class ExercisesController {
    constructor(exercisesService) {
        this.exercisesService = exercisesService;
    }
    async findAll(query) {
        return this.exercisesService.findAll(query);
    }
    async findOne(id) {
        return this.exercisesService.findOne(id);
    }
    async findByLesson(lessonId) {
        return this.exercisesService.findByLesson(lessonId);
    }
    async submit(exerciseId, dto, userId) {
        return this.exercisesService.submit(userId, exerciseId, dto);
    }
    async getUserAttempts(exerciseId, userId) {
        return this.exercisesService.getUserExercises(userId, exerciseId);
    }
    async getStats(exerciseId) {
        return this.exercisesService.getExerciseStats(exerciseId);
    }
};
exports.ExercisesController = ExercisesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all exercises with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated exercises' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindExercisesDto]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single exercise by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns exercise details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exercise not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('lesson/:lessonId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all exercises for a lesson' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns exercises for lesson' }),
    __param(0, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "findByLesson", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit exercise answer' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Exercise submitted and graded' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exercise not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.SubmitExerciseDto, String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(':id/attempts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user attempts for an exercise' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns user exercise attempts' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "getUserAttempts", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get exercise statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns exercise statistics' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExercisesController.prototype, "getStats", null);
exports.ExercisesController = ExercisesController = __decorate([
    (0, swagger_1.ApiTags)('exercises'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('exercises'),
    __metadata("design:paramtypes", [exercises_service_1.ExercisesService])
], ExercisesController);
//# sourceMappingURL=exercises.controller.js.map