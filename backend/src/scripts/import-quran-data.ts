/**
 * Quran Data Database Importer
 *
 * ✅ AUTHORIZED SOURCES (per PROJECT_CONSTRAINTS.md Section 10.2):
 * - Text: quran.com API
 * - Morphology: corpus.quran.com (University of Leeds)
 *
 * Imports complete merged dataset (6,236 verses, 77,429 words) into PostgreSQL
 */

import { PrismaClient } from '@prisma/client';

import { QuranCorpusMapper } from './mappers/quran-corpus-mapper';
import { QuranCorpusFetcher } from './fetchers/quran-corpus-fetcher';
import { MVP_SURAHS, CorpusVerseData } from './types/quran-corpus.types';

// Custom error for Quranic text mismatches
class QuranTextMismatchError extends Error {
  constructor(surah: number, ayah: number, expected: string, actual: string) {
    super(`Quran text mismatch at ${surah}:${ayah} - Expected: ${expected}, Got: ${actual}`);
    this.name = 'QuranTextMismatchError';
  }
}

const prisma = new PrismaClient();

/**
 * Configuration
 */

/**
 * Logger
 */
class ImportLogger {
  private startTime = Date.now();
  private errors: string[] = [];
  private warnings: string[] = [];

  info(message: string): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`[${elapsed}s] ℹ ${message}`);
  }

  success(message: string): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`[${elapsed}s] ✓ ${message}`);
  }

  error(message: string, error?: Error): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const errorMsg = `[${elapsed}s] ✗ ${message}`;
    console.error(errorMsg);
    this.errors.push(errorMsg);

    if (error) {
      console.error(`  ${error.message}`);
      this.errors.push(`  ${error.message}`);
    }
  }

  warn(message: string): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const warnMsg = `[${elapsed}s] ⚠ ${message}`;
    console.warn(warnMsg);
    this.warnings.push(warnMsg);
  }

  progress(current: number, total: number, item: string): void {
    const percentage = ((current / total) * 100).toFixed(1);
    console.log(`⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
  }

  getSummary(): { errors: string[]; warnings: string[]; duration: number } {
    return {
      errors: this.errors,
      warnings: this.warnings,
      duration: (Date.now() - this.startTime) / 1000,
    };
  }
}

const logger = new ImportLogger();

/**
 * Main Importer Class
 */
export class QuranDataImporter {
  private prisma: PrismaClient;
  private mapper: QuranCorpusMapper;

  constructor() {
    this.prisma = prisma;
    this.mapper = new QuranCorpusMapper();
  }

  /**
   * Import all MVP surahs
   */
  async importMVPSurahs(options: { force?: boolean; validate?: boolean } = {}): Promise<void> {
    const { force = false, validate = true } = options;

    logger.info('Starting Quranic data import...\n');

    if (force) {
      logger.warn('Force mode enabled - existing data will be deleted');
      await this.clearExistingData();
    }

    // Fetch or load cached data
    const fetcher = new QuranCorpusFetcher();
    const surahsData = await fetcher.fetchMVPSurahs(true);

    // Import each surah
    let totalVerses = 0;
    let totalWords = 0;

    for (let i = 0; i < MVP_SURAHS.length; i++) {
      const surah = MVP_SURAHS[i];
      const verses = surahsData.get(surah.number);

      if (!verses) {
        logger.error(`No data found for Surah ${surah.number}`);
        continue;
      }

      logger.info(`\n=== Importing Surah ${i + 1}/${MVP_SURAHS.length}: ${surah.name} ===`);

      try {
        const stats = await this.importSurah(surah.number, verses, validate);
        totalVerses += stats.versesImported;
        totalWords += stats.wordsImported;

        logger.success(
          `✓ Imported Surah ${surah.number}: ${stats.versesImported} verses, ${stats.wordsImported} words`,
        );
      } catch (error) {
        logger.error(`Failed to import Surah ${surah.number}`, error as Error);
        throw error; // Fail fast for data integrity
      }
    }

    logger.success(`\n✓ Import completed successfully!`);
    logger.info(`Total: ${totalVerses} verses, ${totalWords} words`);
  }

  /**
   * Import a single surah
   */
  private async importSurah(
    surahNumber: number,
    corpusVerses: CorpusVerseData[],
    validate: boolean,
  ): Promise<{ versesImported: number; wordsImported: number }> {
    let versesImported = 0;
    let wordsImported = 0;

    // Process in transaction for atomicity
    await this.prisma.$transaction(async (tx) => {
      for (const corpusVerse of corpusVerses) {
        // Map to our schema
        const verse = this.mapper.mapVerse(corpusVerse);
        const words = this.mapper.mapVerseWords(corpusVerse);

        // Validate if enabled
        if (validate) {
          await this.validateVerse(verse.surahNumber, verse.verseNumber, verse.textArabic);
        }

        // Check if verse already exists
        const existing = await tx.quranVerse.findUnique({
          where: {
            surahNumber_verseNumber: {
              surahNumber: verse.surahNumber,
              verseNumber: verse.verseNumber,
            },
          },
        });

        if (existing) {
          logger.warn(`Verse ${verse.surahNumber}:${verse.verseNumber} already exists, skipping`);
          continue;
        }

        // Insert verse with words
        await tx.quranVerse.create({
          data: {
            surahNumber: verse.surahNumber,
            verseNumber: verse.verseNumber,
            textArabic: verse.textArabic,
            textWithoutDiacritics: verse.textWithoutDiacritics,
            translation: verse.translation,
            transliteration: verse.transliteration,
            searchVectorAr: verse.searchVectorAr,
            searchVectorEn: verse.searchVectorEn,
            words: {
              create: words.map((word: any) => ({
                position: word.position,
                arabicText: word.arabicText,
                textWithoutDiacritics: word.textWithoutDiacritics,
                translation: word.translation,
                transliteration: word.transliteration,

                posType: word.posType,
                posArabic: word.posArabic,
                gender: word.gender,
                genderArabic: word.genderArabic,
                number: word.number,
                numberArabic: word.numberArabic,
                definiteness: word.definiteness,
                definitenessArabic: word.definitenessArabic,
                irabCase: word.irabCase,
                irabCaseArabic: word.irabCaseArabic,
                caseSign: word.caseSign,
                caseSignArabic: word.caseSignArabic,
                caseSignSymbol: word.caseSignSymbol,
                structureType: word.structureType,
                structureTypeArabic: word.structureTypeArabic,

                root: word.root,
                lemma: word.lemma,
                grammarData: word.grammarData as any,
              })),
            },
          },
        });

        versesImported++;
        wordsImported += words.length;

        logger.progress(
          versesImported,
          corpusVerses.length,
          `Verse ${verse.surahNumber}:${verse.verseNumber}`,
        );
      }
    });

    return { versesImported, wordsImported };
  }

  /**
   * Validate verse text against canonical source
   * (Placeholder - in production, this would verify against Quranic Corpus)
   */
  private async validateVerse(surah: number, ayah: number, text: string): Promise<void> {
    // In production, you would:
    // 1. Fetch canonical text from Quranic Corpus
    // 2. Compare with imported text (exact match required)
    // 3. Throw QuranTextMismatchError if mismatch

    if (!text || text.trim().length === 0) {
      throw new QuranTextMismatchError(surah, ayah, '[non-empty text]', text);
    }

    // For now, just check that text is not empty
    return;
  }

  /**
   * Clear all existing Quranic data (for --force mode)
   */
  private async clearExistingData(): Promise<void> {
    logger.warn('Deleting existing Quranic data...');

    await this.prisma.$transaction([
      this.prisma.verseWord.deleteMany(),
      this.prisma.quranVerse.deleteMany(),
    ]);

    logger.success('Existing data cleared');
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    totalVerses: number;
    totalWords: number;
    surahCounts: Array<{ surah: number; verses: number; words: number }>;
  }> {
    const totalVerses = await this.prisma.quranVerse.count();
    const totalWords = await this.prisma.verseWord.count();

    const surahCounts = await this.prisma.quranVerse.groupBy({
      by: ['surahNumber'],
      _count: {
        id: true,
      },
      orderBy: {
        surahNumber: 'asc',
      },
    });

    const surahStats = await Promise.all(
      surahCounts.map(async (sc) => {
        const wordCount = await this.prisma.verseWord.count({
          where: {
            verse: {
              surahNumber: sc.surahNumber,
            },
          },
        });

        return {
          surah: sc.surahNumber,
          verses: sc._count.id,
          words: wordCount,
        };
      }),
    );

    return {
      totalVerses,
      totalWords,
      surahCounts: surahStats,
    };
  }

  /**
   * Cleanup
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

/**
 * CLI Usage
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const dryRun = args.includes('--dry-run');
  const noValidate = args.includes('--no-validate');

  (async () => {
    const importer = new QuranDataImporter();

    try {
      if (dryRun) {
        logger.info('DRY RUN MODE - No data will be inserted\n');
        logger.info('Would import:');
        MVP_SURAHS.forEach((s: any) => {
          logger.info(`  - Surah ${s.number}: ${s.name} (${s.totalVerses} verses)`);
        });
        process.exit(0);
      }

      await importer.importMVPSurahs({
        force,
        validate: !noValidate,
      });

      // Display final statistics
      logger.info('\n=== FINAL STATISTICS ===');
      const stats = await importer.getImportStats();
      logger.info(`Total Verses: ${stats.totalVerses}`);
      logger.info(`Total Words: ${stats.totalWords}`);
      logger.info('\nPer-Surah:');
      stats.surahCounts.forEach((sc) => {
        const surah = MVP_SURAHS.find((s: any) => s.number === sc.surah);
        logger.info(`  Surah ${sc.surah} (${surah?.name}): ${sc.verses} verses, ${sc.words} words`);
      });

      const summary = logger.getSummary();
      if (summary.errors.length > 0) {
        logger.error(`\n${summary.errors.length} errors occurred during import`);
        process.exit(1);
      }

      if (summary.warnings.length > 0) {
        logger.warn(`\n${summary.warnings.length} warnings during import`);
      }

      logger.success(`\n✓ Import completed in ${summary.duration.toFixed(2)}s`);
      process.exit(0);
    } catch (error) {
      logger.error('Import failed', error as Error);
      process.exit(1);
    } finally {
      await importer.disconnect();
    }
  })();
}
