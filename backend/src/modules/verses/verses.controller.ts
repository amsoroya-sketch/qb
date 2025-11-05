import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VersesService } from './verses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FindVersesDto, SearchVersesDto } from './dto';

@ApiTags('verses')
@Controller('verses')
export class VersesController {
  constructor(private readonly versesService: VersesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all verses with optional filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated verses' })
  async findAll(@Query() query: FindVersesDto) {
    return this.versesService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search verses by text or root' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async search(@Query() dto: SearchVersesDto) {
    return this.versesService.search(dto);
  }

  @Get('grammar')
  @ApiOperation({ summary: 'Find verses by grammatical properties' })
  @ApiResponse({ status: 200, description: 'Returns verses matching criteria' })
  async findByGrammar(@Query('posType') posType?: string, @Query('irabCase') irabCase?: string) {
    return this.versesService.getVersesByGrammar(posType, irabCase);
  }

  @Get(':surahNumber/:verseNumber')
  @ApiOperation({ summary: 'Get single verse with word analysis' })
  @ApiResponse({ status: 200, description: 'Returns verse details' })
  @ApiResponse({ status: 404, description: 'Verse not found' })
  async findOne(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
  ) {
    return this.versesService.findOne(surahNumber, verseNumber);
  }

  @Get('words/:wordId')
  @ApiOperation({ summary: 'Get detailed word analysis' })
  @ApiResponse({ status: 200, description: 'Returns word grammatical analysis' })
  @ApiResponse({ status: 404, description: 'Word not found' })
  async getWordAnalysis(@Param('wordId') wordId: string) {
    return this.versesService.getWordAnalysis(wordId);
  }

  @Post(':surahNumber/:verseNumber/bookmark')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Bookmark a verse' })
  @ApiResponse({ status: 201, description: 'Verse bookmarked' })
  async createBookmark(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
    @CurrentUser('sub') userId: string,
  ) {
    return this.versesService.createBookmark(userId, surahNumber, verseNumber);
  }

  @Delete(':surahNumber/:verseNumber/bookmark')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove verse bookmark' })
  @ApiResponse({ status: 200, description: 'Bookmark removed' })
  async removeBookmark(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
    @CurrentUser('sub') userId: string,
  ) {
    return this.versesService.removeBookmark(userId, surahNumber, verseNumber);
  }

  @Get('bookmarks/me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user bookmarked verses' })
  @ApiResponse({ status: 200, description: 'Returns bookmarked verses' })
  async getMyBookmarks(@CurrentUser('sub') userId: string) {
    return this.versesService.getUserBookmarks(userId);
  }

  /**
   * Feature 11: Sentence Type Detection
   */
  @Get(':surahNumber/:verseNumber/analysis')
  @ApiOperation({ summary: 'Get verse sentence type analysis (nominal vs verbal)' })
  @ApiResponse({ status: 200, description: 'Returns sentence type and structure' })
  @ApiResponse({ status: 404, description: 'Verse not found' })
  async getVerseAnalysis(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
  ) {
    return this.versesService.getVerseAnalysis(surahNumber, verseNumber);
  }

  /**
   * Feature 12: Phrase Groupings
   */
  @Get(':surahNumber/:verseNumber/phrases')
  @ApiOperation({ summary: 'Get phrase groupings (Idafa, Prepositional)' })
  @ApiResponse({ status: 200, description: 'Returns detected phrases in the verse' })
  @ApiResponse({ status: 404, description: 'Verse not found' })
  async getPhraseGroupings(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
  ) {
    return this.versesService.getPhraseGroupings(surahNumber, verseNumber);
  }

  /**
   * Feature 13: Agreement Patterns
   */
  @Get(':surahNumber/:verseNumber/words/:position/agreements')
  @ApiOperation({ summary: 'Get word agreement patterns with related words' })
  @ApiResponse({ status: 200, description: 'Returns agreement analysis' })
  @ApiResponse({ status: 404, description: 'Word not found' })
  async getWordAgreements(
    @Param('surahNumber', ParseIntPipe) surahNumber: number,
    @Param('verseNumber', ParseIntPipe) verseNumber: number,
    @Param('position', ParseIntPipe) position: number,
  ) {
    return this.versesService.getWordAgreements(surahNumber, verseNumber, position);
  }
}
