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
exports.PracticeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const practice_service_1 = require("./practice.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const practice_dto_1 = require("./dto/practice.dto");
let PracticeController = class PracticeController {
    constructor(practiceService) {
        this.practiceService = practiceService;
    }
    async getPracticeSet(userId, mode, grammarFocus, difficulty, count, surahNumber) {
        const dto = {
            mode,
            grammarFocus,
            difficulty,
            count: count ? parseInt(count, 10) : undefined,
            surahNumber: surahNumber ? parseInt(surahNumber, 10) : undefined,
        };
        return this.practiceService.getPracticeSet(userId, dto);
    }
    async submitAnswer(userId, dto) {
        return this.practiceService.submitPracticeAnswer(userId, dto);
    }
};
exports.PracticeController = PracticeController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get practice exercise set' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns practice set',
        type: practice_dto_1.PracticeSetResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid parameters' }),
    (0, swagger_1.ApiQuery)({ name: 'mode', enum: practice_dto_1.PracticeModeEnum, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'count', type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'grammarFocus', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'difficulty', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'surahNumber', type: Number, required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Query)('mode')),
    __param(2, (0, common_1.Query)('grammarFocus')),
    __param(3, (0, common_1.Query)('difficulty')),
    __param(4, (0, common_1.Query)('count')),
    __param(5, (0, common_1.Query)('surahNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PracticeController.prototype, "getPracticeSet", null);
__decorate([
    (0, common_1.Post)('submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit practice answer' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns answer result',
        type: practice_dto_1.PracticeResultDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid answer data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, practice_dto_1.SubmitPracticeAnswerDto]),
    __metadata("design:returntype", Promise)
], PracticeController.prototype, "submitAnswer", null);
exports.PracticeController = PracticeController = __decorate([
    (0, swagger_1.ApiTags)('practice'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('practice'),
    __metadata("design:paramtypes", [practice_service_1.PracticeService])
], PracticeController);
//# sourceMappingURL=practice.controller.js.map