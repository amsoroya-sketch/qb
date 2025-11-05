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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quiz_service_1 = require("./quiz.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const quiz_dto_1 = require("./dto/quiz.dto");
let QuizController = class QuizController {
    constructor(quizService) {
        this.quizService = quizService;
    }
    async create(dto) {
        return this.quizService.create(dto);
    }
    async update(id, dto) {
        return this.quizService.update(id, dto);
    }
    async delete(id) {
        return this.quizService.delete(id);
    }
    async addQuestion(id, dto) {
        return this.quizService.addQuestion(id, dto);
    }
    async generateQuiz(dto) {
        return this.quizService.generateQuizFromGrammar(dto);
    }
    async findAll(userId, filters) {
        return this.quizService.findAll(userId, filters);
    }
    async getAttempts(userId, quizId) {
        return this.quizService.getAttempts(userId, quizId);
    }
    async findOne(id, userId) {
        return this.quizService.findOne(id, userId);
    }
    async startQuiz(id, userId) {
        return this.quizService.startQuiz(id, userId);
    }
    async submitAnswer(attemptId, userId, dto) {
        return this.quizService.submitAnswer(attemptId, userId, dto);
    }
    async completeQuiz(attemptId, userId) {
        return this.quizService.completeQuiz(attemptId, userId);
    }
    async getLeaderboard(id, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.quizService.getLeaderboard(id, limitNum);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Create quiz (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quiz created successfully',
        type: quiz_dto_1.QuizDetailDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid quiz data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quiz_dto_1.CreateQuizDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update quiz (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quiz updated successfully',
        type: quiz_dto_1.QuizDetailDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid quiz data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quiz not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quiz_dto_1.UpdateQuizDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete quiz (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 204,
        description: 'Quiz deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quiz not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/questions'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add question to quiz (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question added successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid question data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quiz not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quiz_dto_1.CreateQuizQuestionDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "addQuestion", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Auto-generate quiz from grammar focus (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quiz generated successfully',
        type: quiz_dto_1.QuizDetailDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid generation parameters or insufficient data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Admin only' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [quiz_dto_1.GenerateQuizDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "generateQuiz", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all published quizzes' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns list of quizzes',
        type: [quiz_dto_1.QuizListDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, quiz_dto_1.FindQuizzesDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('attempts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user quiz attempt history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user quiz attempts',
        type: [quiz_dto_1.QuizAttemptDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('quizId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "getAttempts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quiz details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns quiz details',
        type: quiz_dto_1.QuizDetailDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Quiz is not published' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quiz not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    (0, swagger_1.ApiOperation)({ summary: 'Start quiz session' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quiz session started',
        type: quiz_dto_1.StartQuizDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Quiz has no questions or attempt already in progress' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Quiz is not published' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quiz not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "startQuiz", null);
__decorate([
    (0, common_1.Post)('attempt/:attemptId/answer'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit answer during quiz' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Answer submitted and graded',
        type: quiz_dto_1.QuizResultDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Quiz attempt expired or invalid answer' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Attempt does not belong to user' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attempt or question not found' }),
    __param(0, (0, common_1.Param)('attemptId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, quiz_dto_1.SubmitQuizAnswerDto]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)('attempt/:attemptId/complete'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Complete quiz and get final score' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Quiz completed successfully',
        type: quiz_dto_1.CompleteQuizDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Not all questions answered' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Attempt does not belong to user' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Attempt not found' }),
    __param(0, (0, common_1.Param)('attemptId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "completeQuiz", null);
__decorate([
    (0, common_1.Get)(':id/leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get leaderboard for quiz' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns quiz leaderboard',
        type: [quiz_dto_1.LeaderboardEntryDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Quiz not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "getLeaderboard", null);
exports.QuizController = QuizController = __decorate([
    (0, swagger_1.ApiTags)('quiz'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('quiz'),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map