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
exports.GdprController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gdpr_service_1 = require("./gdpr.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let GdprController = class GdprController {
    constructor(gdprService) {
        this.gdprService = gdprService;
    }
    async exportData(userId) {
        const data = await this.gdprService.exportUserData(userId);
        return {
            success: true,
            data,
        };
    }
    async getDataSummary(userId) {
        const summary = await this.gdprService.getUserDataSummary(userId);
        return {
            success: true,
            data: summary,
        };
    }
    async deleteAccount(userId) {
        const result = await this.gdprService.deleteUserData(userId);
        return {
            success: true,
            message: 'Account deleted successfully. All your data has been permanently removed.',
            data: result,
        };
    }
};
exports.GdprController = GdprController;
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({
        summary: 'Export all user data (GDPR Article 20 - Right to Data Portability)',
        description: 'Returns all personal data associated with the authenticated user in machine-readable JSON format. ' +
            'Includes profile, progress, exercises, achievements, lesson progress, bookmarks, and events.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User data exported successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                data: {
                    type: 'object',
                    properties: {
                        exportMetadata: {
                            type: 'object',
                            properties: {
                                userId: { type: 'string' },
                                exportedAt: { type: 'string' },
                                formatVersion: { type: 'string' },
                                dataTypes: { type: 'array', items: { type: 'string' } },
                            },
                        },
                        userData: { type: 'object' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "exportData", null);
__decorate([
    (0, common_1.Get)('export/summary'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get summary of user data before deletion',
        description: 'Returns a summary of all data associated with the user to inform deletion decision.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User data summary retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "getDataSummary", null);
__decorate([
    (0, common_1.Delete)('delete-account'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete user account and all associated data (GDPR Article 17 - Right to Erasure)',
        description: 'Permanently deletes the user account and all associated personal data. ' +
            'This action is irreversible. The user will be logged out and cannot access the system again.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User account and all data deleted successfully',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                message: { type: 'string', example: 'Account deleted successfully' },
                data: {
                    type: 'object',
                    properties: {
                        deleted: { type: 'boolean' },
                        deletedAt: { type: 'string' },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GdprController.prototype, "deleteAccount", null);
exports.GdprController = GdprController = __decorate([
    (0, swagger_1.ApiTags)('gdpr'),
    (0, common_1.Controller)('gdpr'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [gdpr_service_1.GdprService])
], GdprController);
//# sourceMappingURL=gdpr.controller.js.map