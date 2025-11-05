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
exports.ExamController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const exam_service_1 = require("./exam.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const exam_dto_1 = require("./dto/exam.dto");
let ExamController = class ExamController {
    constructor(examService) {
        this.examService = examService;
    }
    async create(dto) {
        return this.examService.create(dto);
    }
    async update(id, dto) {
        return this.examService.update(id, dto);
    }
    async delete(id) {
        return this.examService.delete(id);
    }
    async addQuestion(id, dto) {
        return this.examService.addQuestion(id, dto);
    }
    async findAll(userId, filters) {
        return this.examService.findAll(userId, filters);
    }
    async getAttempts(userId, examId) {
        return this.examService.getAttempts(userId, examId);
    }
    async findOne(id, userId) {
        return this.examService.findOne(id, userId);
    }
    async startExam(id, userId) {
        return this.examService.startExam(id, userId);
    }
    async submitExam(attemptId, userId, dto) {
        return this.examService.submitExam(attemptId, userId, dto);
    }
    async canRetake(id, userId) {
        return this.examService.canRetakeExam(userId, id);
    }
};
exports.ExamController = ExamController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create exam (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Exam created successfully',
        type: exam_dto_1.ExamDetailDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid exam data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [exam_dto_1.CreateExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update exam (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Exam updated successfully',
        type: exam_dto_1.ExamDetailDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid exam data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exam_dto_1.UpdateExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete exam (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Exam deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/questions'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add question to exam (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid question data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exam_dto_1.CreateExamQuestionDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all published exams' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns list of exams',
        type: [exam_dto_1.ExamListDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, exam_dto_1.FindExamsDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('attempts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user exam attempt history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user exam attempts',
        type: [exam_dto_1.ExamAttemptDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('examId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "getAttempts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get exam details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns exam details',
        type: exam_dto_1.ExamDetailDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Exam is not published' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start exam session' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Exam session started',
        type: exam_dto_1.StartExamDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Exam has no questions, attempt already in progress, or cooldown period active',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Exam is not published' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "startExam", null);
__decorate([
    (0, common_1.Post)('attempt/:attemptId/submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit ALL exam answers at once' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Exam submitted and graded',
        type: exam_dto_1.ExamResultDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Time limit exceeded, already completed, or not all questions answered',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Attempt does not belong to user' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attempt not found' }),
    __param(0, (0, common_1.Param)('attemptId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, exam_dto_1.SubmitExamDto]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "submitExam", null);
__decorate([
    (0, common_1.Get)(':id/can-retake'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user can retake exam (respects cooldown)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns retake eligibility',
        type: exam_dto_1.CanRetakeExamDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "canRetake", null);
exports.ExamController = ExamController = __decorate([
    (0, swagger_1.ApiTags)('exam'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('exam'),
    __metadata("design:paramtypes", [exam_service_1.ExamService])
], ExamController);
//# sourceMappingURL=exam.controller.js.map