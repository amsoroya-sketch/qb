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
exports.VersesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const verses_service_1 = require("./verses.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const dto_1 = require("./dto");
let VersesController = class VersesController {
    constructor(versesService) {
        this.versesService = versesService;
    }
    async findAll(query) {
        return this.versesService.findAll(query);
    }
    async search(dto) {
        return this.versesService.search(dto);
    }
    async findByGrammar(posType, irabCase) {
        return this.versesService.getVersesByGrammar(posType, irabCase);
    }
    async findOne(surahNumber, verseNumber) {
        return this.versesService.findOne(surahNumber, verseNumber);
    }
    async getWordAnalysis(wordId) {
        return this.versesService.getWordAnalysis(wordId);
    }
    async createBookmark(surahNumber, verseNumber, userId) {
        return this.versesService.createBookmark(userId, surahNumber, verseNumber);
    }
    async removeBookmark(surahNumber, verseNumber, userId) {
        return this.versesService.removeBookmark(userId, surahNumber, verseNumber);
    }
    async getMyBookmarks(userId) {
        return this.versesService.getUserBookmarks(userId);
    }
    async getVerseAnalysis(surahNumber, verseNumber) {
        return this.versesService.getVerseAnalysis(surahNumber, verseNumber);
    }
    async getPhraseGroupings(surahNumber, verseNumber) {
        return this.versesService.getPhraseGroupings(surahNumber, verseNumber);
    }
    async getWordAgreements(surahNumber, verseNumber, position) {
        return this.versesService.getWordAgreements(surahNumber, verseNumber, position);
    }
};
exports.VersesController = VersesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all verses with optional filters' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns paginated verses' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.FindVersesDto]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search verses by text or root' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns search results' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SearchVersesDto]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('grammar'),
    (0, swagger_1.ApiOperation)({ summary: 'Find verses by grammatical properties' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns verses matching criteria' }),
    __param(0, (0, common_1.Query)('posType')),
    __param(1, (0, common_1.Query)('irabCase')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "findByGrammar", null);
__decorate([
    (0, common_1.Get)(':surahNumber/:verseNumber'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single verse with word analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns verse details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Verse not found' }),
    __param(0, (0, common_1.Param)('surahNumber', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('verseNumber', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('words/:wordId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed word analysis' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns word grammatical analysis' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Word not found' }),
    __param(0, (0, common_1.Param)('wordId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "getWordAnalysis", null);
__decorate([
    (0, common_1.Post)(':surahNumber/:verseNumber/bookmark'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Bookmark a verse' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Verse bookmarked' }),
    __param(0, (0, common_1.Param)('surahNumber', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('verseNumber', common_1.ParseIntPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "createBookmark", null);
__decorate([
    (0, common_1.Delete)(':surahNumber/:verseNumber/bookmark'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove verse bookmark' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Bookmark removed' }),
    __param(0, (0, common_1.Param)('surahNumber', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('verseNumber', common_1.ParseIntPipe)),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "removeBookmark", null);
__decorate([
    (0, common_1.Get)('bookmarks/me'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user bookmarked verses' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns bookmarked verses' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "getMyBookmarks", null);
__decorate([
    (0, common_1.Get)(':surahNumber/:verseNumber/analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Get verse sentence type analysis (nominal vs verbal)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns sentence type and structure' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Verse not found' }),
    __param(0, (0, common_1.Param)('surahNumber', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('verseNumber', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "getVerseAnalysis", null);
__decorate([
    (0, common_1.Get)(':surahNumber/:verseNumber/phrases'),
    (0, swagger_1.ApiOperation)({ summary: 'Get phrase groupings (Idafa, Prepositional)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns detected phrases in the verse' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Verse not found' }),
    __param(0, (0, common_1.Param)('surahNumber', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('verseNumber', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "getPhraseGroupings", null);
__decorate([
    (0, common_1.Get)(':surahNumber/:verseNumber/words/:position/agreements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get word agreement patterns with related words' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns agreement analysis' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Word not found' }),
    __param(0, (0, common_1.Param)('surahNumber', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('verseNumber', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('position', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VersesController.prototype, "getWordAgreements", null);
exports.VersesController = VersesController = __decorate([
    (0, swagger_1.ApiTags)('verses'),
    (0, common_1.Controller)('verses'),
    __metadata("design:paramtypes", [verses_service_1.VersesService])
], VersesController);
//# sourceMappingURL=verses.controller.js.map