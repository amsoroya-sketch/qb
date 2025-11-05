"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const quran_corpus_types_1 = require("./types/quran-corpus.types");
const prisma = new client_1.PrismaClient();
class QuranDataVerifier {
    constructor() {
        this.checks = [];
        this.prisma = prisma;
    }
    async verify() {
        console.log('🔍 Starting Quranic data verification...\n');
        await this.checkVerseCount();
        await this.checkMissingVerses();
        await this.checkWordCount();
        await this.checkGrammaticalProperties();
        await this.checkNullValues();
        await this.checkTextIntegrity();
        const statistics = await this.gatherStatistics();
        const passed = this.checks.every((check) => check.passed);
        return {
            passed,
            checks: this.checks,
            statistics,
        };
    }
    async checkVerseCount() {
        console.log('📊 Checking verse counts per surah...');
        const mismatches = [];
        for (const surah of quran_corpus_types_1.MVP_SURAHS) {
            const count = await this.prisma.quranVerse.count({
                where: { surahNumber: surah.number },
            });
            if (count !== surah.totalVerses) {
                mismatches.push({
                    surah: surah.number,
                    expected: surah.totalVerses,
                    actual: count,
                });
            }
            else {
                console.log(`  ✓ Surah ${surah.number} (${surah.name}): ${count}/${surah.totalVerses} verses`);
            }
        }
        if (mismatches.length > 0) {
            this.checks.push({
                name: 'Verse Count',
                passed: false,
                message: `${mismatches.length} surah(s) have incorrect verse counts`,
                details: mismatches,
            });
            console.error(`  ✗ FAILED: ${mismatches.length} mismatches found`);
        }
        else {
            this.checks.push({
                name: 'Verse Count',
                passed: true,
                message: 'All surahs have correct verse counts',
            });
            console.log(`  ✓ PASSED: All surahs have correct verse counts\n`);
        }
    }
    async checkMissingVerses() {
        console.log('🔢 Checking for missing verses...');
        const missingVerses = [];
        for (const surah of quran_corpus_types_1.MVP_SURAHS) {
            for (let verseNum = 1; verseNum <= surah.totalVerses; verseNum++) {
                const verse = await this.prisma.quranVerse.findUnique({
                    where: {
                        surahNumber_verseNumber: {
                            surahNumber: surah.number,
                            verseNumber: verseNum,
                        },
                    },
                });
                if (!verse) {
                    missingVerses.push({ surah: surah.number, verse: verseNum });
                }
            }
        }
        if (missingVerses.length > 0) {
            this.checks.push({
                name: 'Missing Verses',
                passed: false,
                message: `${missingVerses.length} verse(s) missing`,
                details: missingVerses,
            });
            console.error(`  ✗ FAILED: ${missingVerses.length} verses missing`);
        }
        else {
            this.checks.push({
                name: 'Missing Verses',
                passed: true,
                message: 'No missing verses',
            });
            console.log(`  ✓ PASSED: No missing verses\n`);
        }
    }
    async checkWordCount() {
        console.log('📝 Checking word counts...');
        const versesWithoutWords = await this.prisma.quranVerse.findMany({
            where: {
                words: {
                    none: {},
                },
            },
            select: {
                surahNumber: true,
                verseNumber: true,
            },
        });
        if (versesWithoutWords.length > 0) {
            this.checks.push({
                name: 'Word Count',
                passed: false,
                message: `${versesWithoutWords.length} verse(s) have no words`,
                details: versesWithoutWords,
            });
            console.error(`  ✗ FAILED: ${versesWithoutWords.length} verses without words`);
        }
        else {
            this.checks.push({
                name: 'Word Count',
                passed: true,
                message: 'All verses have words',
            });
            console.log(`  ✓ PASSED: All verses have words\n`);
        }
    }
    async checkGrammaticalProperties() {
        console.log('🔤 Checking grammatical properties coverage...');
        const totalWords = await this.prisma.verseWord.count();
        const posTypeCount = await this.prisma.verseWord.count({
            where: { posType: { not: '' } },
        });
        const coverage = {
            posType: (posTypeCount / totalWords) * 100,
        };
        const passed = posTypeCount === totalWords;
        this.checks.push({
            name: 'Grammatical Properties',
            passed,
            message: passed
                ? 'All words have POS type'
                : `${totalWords - posTypeCount} words missing POS type`,
            details: coverage,
        });
        if (passed) {
            console.log(`  ✓ PASSED: All ${totalWords} words have POS type`);
        }
        else {
            console.error(`  ✗ FAILED: ${totalWords - posTypeCount} words missing POS type`);
        }
        console.log();
    }
    async checkNullValues() {
        console.log('🔍 Checking for NULL values in required fields...');
        const nullChecks = [];
        const versesWithNullText = await this.prisma.quranVerse.count({
            where: {
                OR: [{ textArabic: '' }, { translation: '' }],
            },
        });
        if (versesWithNullText > 0) {
            nullChecks.push(`${versesWithNullText} verses with null/empty text`);
        }
        const wordsWithNullRequired = await this.prisma.verseWord.count({
            where: {
                OR: [{ arabicText: '' }, { posType: '' }],
            },
        });
        if (wordsWithNullRequired > 0) {
            nullChecks.push(`${wordsWithNullRequired} words with null/empty required fields`);
        }
        if (nullChecks.length > 0) {
            this.checks.push({
                name: 'NULL Values',
                passed: false,
                message: 'Found NULL values in required fields',
                details: nullChecks,
            });
            console.error(`  ✗ FAILED: ${nullChecks.join(', ')}`);
        }
        else {
            this.checks.push({
                name: 'NULL Values',
                passed: true,
                message: 'No NULL values in required fields',
            });
            console.log(`  ✓ PASSED: No NULL values in required fields\n`);
        }
    }
    async checkTextIntegrity() {
        console.log('🔤 Checking text integrity...');
        const verses = await this.prisma.quranVerse.findMany({
            select: {
                surahNumber: true,
                verseNumber: true,
                textArabic: true,
            },
        });
        const corruptedVerses = verses.filter((v) => {
            const text = v.textArabic;
            return (text.includes('�') ||
                text.includes('\ufffd') ||
                text.length < 5);
        });
        if (corruptedVerses.length > 0) {
            this.checks.push({
                name: 'Text Integrity',
                passed: false,
                message: `${corruptedVerses.length} verse(s) may have corrupted text`,
                details: corruptedVerses.map((v) => `${v.surahNumber}:${v.verseNumber}`),
            });
            console.error(`  ✗ FAILED: ${corruptedVerses.length} verses may be corrupted`);
        }
        else {
            this.checks.push({
                name: 'Text Integrity',
                passed: true,
                message: 'No corrupted text detected',
            });
            console.log(`  ✓ PASSED: No corrupted text detected\n`);
        }
    }
    async gatherStatistics() {
        const totalVerses = await this.prisma.quranVerse.count();
        const totalWords = await this.prisma.verseWord.count();
        const surahStats = await Promise.all(quran_corpus_types_1.MVP_SURAHS.map(async (surah) => {
            const actual = await this.prisma.quranVerse.count({
                where: { surahNumber: surah.number },
            });
            const words = await this.prisma.verseWord.count({
                where: {
                    verse: { surahNumber: surah.number },
                },
            });
            return {
                surah: surah.number,
                name: surah.name,
                expected: surah.totalVerses,
                actual,
                words,
                complete: actual === surah.totalVerses,
            };
        }));
        const grammaticalCoverage = {
            posType: await this.calculateCoverage('posType'),
            gender: await this.calculateCoverage('gender'),
            number: await this.calculateCoverage('number'),
            definiteness: await this.calculateCoverage('definiteness'),
            irabCase: await this.calculateCoverage('irabCase'),
            caseSign: await this.calculateCoverage('caseSign'),
            structureType: await this.calculateCoverage('structureType'),
        };
        return {
            totalVerses,
            totalWords,
            surahStats,
            grammaticalCoverage,
        };
    }
    async calculateCoverage(field) {
        const total = await this.prisma.verseWord.count();
        const allWords = await this.prisma.verseWord.findMany({
            select: { [field]: true },
        });
        const populated = allWords.filter((word) => word[field] != null && word[field] !== '').length;
        return (populated / total) * 100;
    }
    printReport(result) {
        console.log('\n' + '='.repeat(60));
        console.log('VERIFICATION REPORT');
        console.log('='.repeat(60) + '\n');
        if (result.passed) {
            console.log('✅ OVERALL STATUS: PASSED\n');
        }
        else {
            console.log('❌ OVERALL STATUS: FAILED\n');
        }
        console.log('CHECK RESULTS:');
        console.log('-'.repeat(60));
        result.checks.forEach((check) => {
            const icon = check.passed ? '✓' : '✗';
            console.log(`${icon} ${check.name}: ${check.message}`);
            if (!check.passed && check.details) {
                console.log(`  Details: ${JSON.stringify(check.details, null, 2)}`);
            }
        });
        console.log('\n' + '-'.repeat(60));
        console.log('STATISTICS:');
        console.log('-'.repeat(60));
        console.log(`Total Verses: ${result.statistics.totalVerses}`);
        console.log(`Total Words: ${result.statistics.totalWords}`);
        console.log('\nPer-Surah Breakdown:');
        result.statistics.surahStats.forEach((stat) => {
            const icon = stat.complete ? '✓' : '✗';
            console.log(`  ${icon} Surah ${stat.surah} (${stat.name}): ${stat.actual}/${stat.expected} verses, ${stat.words} words`);
        });
        console.log('\nGrammatical Properties Coverage:');
        console.log(`  POS Type: ${result.statistics.grammaticalCoverage.posType.toFixed(1)}%`);
        console.log(`  Gender: ${result.statistics.grammaticalCoverage.gender.toFixed(1)}%`);
        console.log(`  Number: ${result.statistics.grammaticalCoverage.number.toFixed(1)}%`);
        console.log(`  Definiteness: ${result.statistics.grammaticalCoverage.definiteness.toFixed(1)}%`);
        console.log(`  I'rab Case: ${result.statistics.grammaticalCoverage.irabCase.toFixed(1)}%`);
        console.log(`  Case Sign: ${result.statistics.grammaticalCoverage.caseSign.toFixed(1)}%`);
        console.log(`  Structure Type: ${result.statistics.grammaticalCoverage.structureType.toFixed(1)}%`);
        console.log('\n' + '='.repeat(60) + '\n');
    }
    async disconnect() {
        await this.prisma.$disconnect();
    }
}
if (require.main === module) {
    (async () => {
        const verifier = new QuranDataVerifier();
        try {
            const result = await verifier.verify();
            verifier.printReport(result);
            if (result.passed) {
                process.exit(0);
            }
            else {
                process.exit(1);
            }
        }
        catch (error) {
            console.error('❌ Verification failed with error:', error);
            process.exit(2);
        }
        finally {
            await verifier.disconnect();
        }
    })();
}
//# sourceMappingURL=verify-quran-data.js.map