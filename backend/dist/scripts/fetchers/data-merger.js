"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataMerger = void 0;
const fs = require("fs");
const path = require("path");
const CONFIG = {
    QURAN_TEXT_DIR: path.join(__dirname, '../../../data/raw/quran-text'),
    MORPHOLOGY_FILE: path.join(__dirname, '../../../data/raw/corpus-morphology/parsed-morphology.json'),
    OUTPUT_DIR: path.join(__dirname, '../../../data/processed'),
};
class Logger {
    constructor() {
        this.startTime = Date.now();
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
        console.error(`[${elapsed}s] ✗ ${message}`);
        if (error) {
            console.error(`  Error: ${error.message}`);
        }
    }
    warn(message) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.warn(`[${elapsed}s] ⚠ ${message}`);
    }
    progress(current, total, item) {
        if (current % 10 === 0 || current === total) {
            const percentage = ((current / total) * 100).toFixed(1);
            const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
            console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
        }
    }
}
const logger = new Logger();
class DataMerger {
    loadMorphologyData() {
        logger.info(`Loading morphology data from: ${CONFIG.MORPHOLOGY_FILE}`);
        const content = fs.readFileSync(CONFIG.MORPHOLOGY_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        const morphologyMap = new Map();
        Object.entries(parsed.words).forEach(([location, word]) => {
            morphologyMap.set(location, word);
        });
        logger.success(`Loaded ${morphologyMap.size.toLocaleString()} morphology entries`);
        return morphologyMap;
    }
    loadSurahFiles() {
        logger.info(`Loading surah text files from: ${CONFIG.QURAN_TEXT_DIR}`);
        const surahsData = new Map();
        const files = fs.readdirSync(CONFIG.QURAN_TEXT_DIR);
        const surahFiles = files.filter((f) => f.match(/^surah_\d{3}\.json$/));
        for (const file of surahFiles) {
            const surahNumber = parseInt(file.match(/surah_(\d{3})\.json/)[1]);
            const filePath = path.join(CONFIG.QURAN_TEXT_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const verses = JSON.parse(content);
            surahsData.set(surahNumber, verses);
        }
        logger.success(`Loaded ${surahsData.size} surah files`);
        return surahsData;
    }
    mergeWord(quranWord, surahNumber, verseNumber, morphologyMap) {
        const location = `${surahNumber}:${verseNumber}:${quranWord.position}`;
        const morphology = morphologyMap.get(location);
        const merged = {
            location,
            surah: surahNumber,
            verse: verseNumber,
            wordPosition: quranWord.position,
            arabicUthmani: quranWord.text_uthmani,
            arabicImlaei: quranWord.text_imlaei,
            translation: quranWord.translation?.text || '',
            transliteration: quranWord.transliteration?.text || '',
            audioUrl: quranWord.audio_url,
            pageNumber: quranWord.page_number,
            lineNumber: quranWord.line_number,
            pos: morphology?.morphology.pos,
            posFullName: morphology?.morphology.posFullName,
            root: morphology?.morphology.root,
            lemma: morphology?.morphology.lemma,
            gender: morphology?.morphology.gender,
            number: morphology?.morphology.number,
            case: morphology?.morphology.case,
            aspect: morphology?.morphology.aspect,
            voice: morphology?.morphology.voice,
            person: morphology?.morphology.person,
            rawMorphologyFeatures: morphology?.morphology.rawFeatures,
            sources: {
                text: 'quran.com',
                morphology: 'corpus.quran.com',
            },
        };
        return merged;
    }
    async mergeAll() {
        logger.info('Starting data merge process...\\n');
        const morphologyMap = this.loadMorphologyData();
        const surahsData = this.loadSurahFiles();
        const mergedVerses = [];
        let totalWords = 0;
        let matchedWords = 0;
        let unmatchedWords = 0;
        logger.info('\\nMerging text + morphology data...');
        surahsData.forEach((verses, surahNumber) => {
            for (const verse of verses) {
                const mergedWords = [];
                const actualWords = verse.words.filter((w) => w.char_type_name === 'word');
                for (const word of actualWords) {
                    totalWords++;
                    const merged = this.mergeWord(word, surahNumber, verse.verse_number, morphologyMap);
                    mergedWords.push(merged);
                    if (merged.pos) {
                        matchedWords++;
                    }
                    else {
                        unmatchedWords++;
                        logger.warn(`No morphology found for: ${merged.location} (${merged.arabicUthmani})`);
                    }
                }
                mergedVerses.push({
                    verseKey: verse.verse_key,
                    verseNumber: verse.verse_number,
                    surah: surahNumber,
                    pageNumber: verse.page_number,
                    juzNumber: verse.juz_number,
                    words: mergedWords,
                });
            }
            logger.progress(surahNumber, 114, `Surah ${surahNumber}`);
        });
        logger.success('\\n=== MERGE STATISTICS ===');
        logger.info(`Total words processed: ${totalWords.toLocaleString()}`);
        logger.info(`Matched with morphology: ${matchedWords.toLocaleString()}`);
        logger.info(`Unmatched: ${unmatchedWords.toLocaleString()}`);
        logger.info(`Match rate: ${((matchedWords / totalWords) * 100).toFixed(2)}%`);
        return mergedVerses;
    }
    async save(verses, outputPath) {
        const dirPath = path.dirname(outputPath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        fs.writeFileSync(outputPath, JSON.stringify(verses, null, 2), 'utf-8');
        logger.success(`Saved merged data to: ${outputPath}`);
    }
    getStats(verses) {
        const surahs = new Set();
        const posDistribution = {};
        const genderDistribution = {};
        const numberDistribution = {};
        let totalWords = 0;
        for (const verse of verses) {
            surahs.add(verse.surah);
            for (const word of verse.words) {
                totalWords++;
                if (word.pos) {
                    const posName = word.posFullName || word.pos;
                    posDistribution[posName] = (posDistribution[posName] || 0) + 1;
                }
                if (word.gender) {
                    genderDistribution[word.gender] = (genderDistribution[word.gender] || 0) + 1;
                }
                if (word.number) {
                    numberDistribution[word.number] = (numberDistribution[word.number] || 0) + 1;
                }
            }
        }
        return {
            totalVerses: verses.length,
            totalWords,
            totalSurahs: surahs.size,
            posDistribution,
            genderDistribution,
            numberDistribution,
        };
    }
}
exports.DataMerger = DataMerger;
if (require.main === module) {
    (async () => {
        try {
            logger.info('Starting Quran Data Merger...\\n');
            const merger = new DataMerger();
            const mergedVerses = await merger.mergeAll();
            const stats = merger.getStats(mergedVerses);
            logger.success('\\n=== FINAL STATISTICS ===');
            logger.info(`Total Surahs: ${stats.totalSurahs}`);
            logger.info(`Total Verses: ${stats.totalVerses.toLocaleString()}`);
            logger.info(`Total Words: ${stats.totalWords.toLocaleString()}`);
            logger.info('\\n=== POS DISTRIBUTION (Top 10) ===');
            const sortedPOS = Object.entries(stats.posDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);
            sortedPOS.forEach(([pos, count]) => {
                logger.info(`  ${pos}: ${count.toLocaleString()}`);
            });
            logger.info('\\n=== GENDER DISTRIBUTION ===');
            Object.entries(stats.genderDistribution).forEach(([gender, count]) => {
                const genderName = gender === 'M' ? 'Masculine' : 'Feminine';
                logger.info(`  ${genderName}: ${count.toLocaleString()}`);
            });
            logger.info('\\n=== NUMBER DISTRIBUTION ===');
            Object.entries(stats.numberDistribution).forEach(([num, count]) => {
                const numName = num === 'S' ? 'Singular' : num === 'D' ? 'Dual' : 'Plural';
                logger.info(`  ${numName}: ${count.toLocaleString()}`);
            });
            const outputPath = path.join(CONFIG.OUTPUT_DIR, 'quran-complete-merged.json');
            await merger.save(mergedVerses, outputPath);
            logger.success('\\n✓ Data merge completed successfully!');
            logger.info(`\\n⚠️ Attribution Required:`);
            logger.info('  Text source: quran.com API');
            logger.info('  Morphology source: corpus.quran.com (University of Leeds)');
            logger.info('  Both must be credited in UI');
            process.exit(0);
        }
        catch (error) {
            logger.error('Merge failed', error);
            process.exit(1);
        }
    })();
}
//# sourceMappingURL=data-merger.js.map