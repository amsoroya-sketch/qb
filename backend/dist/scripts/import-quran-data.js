"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuranDataImporter = void 0;
const client_1 = require("@prisma/client");
const path = require("path");
const quran_corpus_mapper_1 = require("./mappers/quran-corpus-mapper");
const quran_corpus_fetcher_1 = require("./fetchers/quran-corpus-fetcher");
const quran_corpus_types_1 = require("./types/quran-corpus.types");
class QuranTextMismatchError extends Error {
    constructor(surah, ayah, expected, actual) {
        super(`Quran text mismatch at ${surah}:${ayah} - Expected: ${expected}, Got: ${actual}`);
        this.name = 'QuranTextMismatchError';
    }
}
const prisma = new client_1.PrismaClient();
const CONFIG = {
    MERGED_DATA_FILE: path.join(__dirname, '../../data/processed/quran-complete-merged.json'),
};
class ImportLogger {
    constructor() {
        this.startTime = Date.now();
        this.errors = [];
        this.warnings = [];
    }
    info(message) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log(`[${elapsed}s] ℹ ${message}`);
    }
    success(message) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log(`[${elapsed}s] ✓ ${message}`);
    }
    error(message, error) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const errorMsg = `[${elapsed}s] ✗ ${message}`;
        console.error(errorMsg);
        this.errors.push(errorMsg);
        if (error) {
            console.error(`  ${error.message}`);
            this.errors.push(`  ${error.message}`);
        }
    }
    warn(message) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const warnMsg = `[${elapsed}s] ⚠ ${message}`;
        console.warn(warnMsg);
        this.warnings.push(warnMsg);
    }
    progress(current, total, item) {
        const percentage = ((current / total) * 100).toFixed(1);
        console.log(`⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
    }
    getSummary() {
        return {
            errors: this.errors,
            warnings: this.warnings,
            duration: (Date.now() - this.startTime) / 1000,
        };
    }
}
const logger = new ImportLogger();
class QuranDataImporter {
    constructor() {
        this.prisma = prisma;
        this.mapper = new quran_corpus_mapper_1.QuranCorpusMapper();
    }
    async importMVPSurahs(options = {}) {
        const { force = false, validate = true } = options;
        logger.info('Starting Quranic data import...\n');
        if (force) {
            logger.warn('Force mode enabled - existing data will be deleted');
            await this.clearExistingData();
        }
        const fetcher = new quran_corpus_fetcher_1.QuranCorpusFetcher();
        const surahsData = await fetcher.fetchMVPSurahs(true);
        let totalVerses = 0;
        let totalWords = 0;
        for (let i = 0; i < quran_corpus_types_1.MVP_SURAHS.length; i++) {
            const surah = quran_corpus_types_1.MVP_SURAHS[i];
            const verses = surahsData.get(surah.number);
            if (!verses) {
                logger.error(`No data found for Surah ${surah.number}`);
                continue;
            }
            logger.info(`\n=== Importing Surah ${i + 1}/${quran_corpus_types_1.MVP_SURAHS.length}: ${surah.name} ===`);
            try {
                const stats = await this.importSurah(surah.number, verses, validate);
                totalVerses += stats.versesImported;
                totalWords += stats.wordsImported;
                logger.success(`✓ Imported Surah ${surah.number}: ${stats.versesImported} verses, ${stats.wordsImported} words`);
            }
            catch (error) {
                logger.error(`Failed to import Surah ${surah.number}`, error);
                throw error;
            }
        }
        logger.success(`\n✓ Import completed successfully!`);
        logger.info(`Total: ${totalVerses} verses, ${totalWords} words`);
    }
    async importSurah(surahNumber, corpusVerses, validate) {
        let versesImported = 0;
        let wordsImported = 0;
        await this.prisma.$transaction(async (tx) => {
            for (const corpusVerse of corpusVerses) {
                const verse = this.mapper.mapVerse(corpusVerse);
                const words = this.mapper.mapVerseWords(corpusVerse);
                if (validate) {
                    await this.validateVerse(verse.surahNumber, verse.verseNumber, verse.textArabic);
                }
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
                const createdVerse = await tx.quranVerse.create({
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
                            create: words.map((word) => ({
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
                                grammarData: word.grammarData,
                            })),
                        },
                    },
                });
                versesImported++;
                wordsImported += words.length;
                logger.progress(versesImported, corpusVerses.length, `Verse ${verse.surahNumber}:${verse.verseNumber}`);
            }
        });
        return { versesImported, wordsImported };
    }
    async validateVerse(surah, ayah, text) {
        if (!text || text.trim().length === 0) {
            throw new QuranTextMismatchError(surah, ayah, '[non-empty text]', text);
        }
        return;
    }
    async clearExistingData() {
        logger.warn('Deleting existing Quranic data...');
        await this.prisma.$transaction([
            this.prisma.verseWord.deleteMany(),
            this.prisma.quranVerse.deleteMany(),
        ]);
        logger.success('Existing data cleared');
    }
    async getImportStats() {
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
        const surahStats = await Promise.all(surahCounts.map(async (sc) => {
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
        }));
        return {
            totalVerses,
            totalWords,
            surahCounts: surahStats,
        };
    }
    async disconnect() {
        await this.prisma.$disconnect();
    }
}
exports.QuranDataImporter = QuranDataImporter;
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
                quran_corpus_types_1.MVP_SURAHS.forEach((s) => {
                    logger.info(`  - Surah ${s.number}: ${s.name} (${s.totalVerses} verses)`);
                });
                process.exit(0);
            }
            await importer.importMVPSurahs({
                force,
                validate: !noValidate,
            });
            logger.info('\n=== FINAL STATISTICS ===');
            const stats = await importer.getImportStats();
            logger.info(`Total Verses: ${stats.totalVerses}`);
            logger.info(`Total Words: ${stats.totalWords}`);
            logger.info('\nPer-Surah:');
            stats.surahCounts.forEach((sc) => {
                const surah = quran_corpus_types_1.MVP_SURAHS.find((s) => s.number === sc.surah);
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
        }
        catch (error) {
            logger.error('Import failed', error);
            process.exit(1);
        }
        finally {
            await importer.disconnect();
        }
    })();
}
//# sourceMappingURL=import-quran-data.js.map