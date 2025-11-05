"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorpusMorphologyParser = void 0;
const fs = require("fs");
const path = require("path");
const corpus_morphology_types_1 = require("../types/corpus-morphology.types");
const CONFIG = {
    MORPHOLOGY_FILE: '/home/dev/Development/arQ/quran-morphology-data/quranic-corpus-morphology-0.4.txt',
    OUTPUT_DIR: path.join(__dirname, '../../../data/raw/corpus-morphology'),
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
    progress(current, total, item) {
        if (current % 1000 === 0 || current === total) {
            const percentage = ((current / total) * 100).toFixed(1);
            const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
            console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
        }
    }
}
const logger = new Logger();
class CorpusMorphologyParser {
    async parseFile(filePath) {
        logger.info(`Reading morphology file: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        logger.info(`Total lines in file: ${lines.length.toLocaleString()}`);
        const segments = this.parseSegments(lines);
        logger.success(`Parsed ${segments.length.toLocaleString()} morpheme segments`);
        const words = this.groupByWord(segments);
        logger.success(`Grouped into ${words.size.toLocaleString()} words`);
        return {
            words,
            metadata: {
                version: '0.4',
                totalWords: words.size,
                source: 'http://corpus.quran.com',
                license: 'GNU GPL',
            },
        };
    }
    parseSegments(lines) {
        const segments = [];
        let lineNumber = 0;
        for (const line of lines) {
            lineNumber++;
            if (line.trim().startsWith('#') || line.trim() === '' || line.startsWith('LOCATION')) {
                continue;
            }
            try {
                const segment = this.parseSegmentLine(line);
                if (segment) {
                    segments.push(segment);
                }
            }
            catch (error) {
                logger.error(`Error parsing line ${lineNumber}: ${line}`, error);
            }
            if (lineNumber % 10000 === 0) {
                logger.progress(lineNumber, lines.length, 'parsing segments');
            }
        }
        return segments;
    }
    parseSegmentLine(line) {
        const parts = line.split('\t');
        if (parts.length < 4) {
            return null;
        }
        const [locationStr, form, tag, features] = parts;
        const locationMatch = locationStr.match(/\((\d+):(\d+):(\d+):(\d+)\)/);
        if (!locationMatch) {
            return null;
        }
        const [, surah, verse, word, segment] = locationMatch.map(Number);
        return {
            location: locationStr,
            surah,
            verse,
            word,
            segment,
            form,
            tag,
            features,
        };
    }
    groupByWord(segments) {
        const wordMap = new Map();
        for (const segment of segments) {
            const wordLocation = `${segment.surah}:${segment.verse}:${segment.word}`;
            if (!wordMap.has(wordLocation)) {
                wordMap.set(wordLocation, []);
            }
            wordMap.get(wordLocation).push(segment);
        }
        const words = new Map();
        let processedWords = 0;
        wordMap.forEach((segmentList, location) => {
            const word = this.buildWordFromSegments(location, segmentList);
            words.set(location, word);
            processedWords++;
            logger.progress(processedWords, wordMap.size, 'building words');
        });
        return words;
    }
    buildWordFromSegments(location, segments) {
        const [surah, verse, wordPosition] = location.split(':').map(Number);
        const sortedSegments = segments.sort((a, b) => a.segment - b.segment);
        const arabicText = sortedSegments.map((s) => s.form).join('');
        const morphology = this.extractMorphology(sortedSegments);
        return {
            location,
            surah,
            verse,
            wordPosition,
            arabicText,
            morphology,
        };
    }
    extractMorphology(segments) {
        const stemSegment = segments.find((s) => s.features.includes('STEM'));
        if (!stemSegment) {
            return {
                rawFeatures: segments.map((s) => s.features).join('|'),
                segments,
            };
        }
        const features = this.parseFeatures(stemSegment.features);
        const pos = typeof features.POS === 'string' ? features.POS : undefined;
        const root = typeof features.ROOT === 'string' ? features.ROOT : undefined;
        const lemma = typeof features.LEM === 'string' ? features.LEM : undefined;
        return {
            pos,
            posFullName: pos ? corpus_morphology_types_1.POS_TAGS[pos] || pos : undefined,
            root,
            lemma,
            gender: features.M ? 'M' : features.F ? 'F' : undefined,
            number: features.S ? 'S' : features.D ? 'D' : features.P ? 'P' : undefined,
            case: features.NOM ? 'NOM' : features.ACC ? 'ACC' : features.GEN ? 'GEN' : undefined,
            aspect: features.PERF ? 'PERF' : features.IMPF ? 'IMPF' : features.IMPV ? 'IMPV' : undefined,
            voice: features.ACT ? 'ACT' : features.PASS ? 'PASS' : undefined,
            person: features['1P']
                ? '1'
                : features['2MS'] ||
                    features['2FS'] ||
                    features['2MD'] ||
                    features['2FD'] ||
                    features['2MP'] ||
                    features['2FP']
                    ? '2'
                    : features['3MS'] ||
                        features['3FS'] ||
                        features['3MD'] ||
                        features['3FD'] ||
                        features['3MP'] ||
                        features['3FP']
                        ? '3'
                        : undefined,
            rawFeatures: segments.map((s) => s.features).join(' | '),
            segments,
        };
    }
    parseFeatures(featuresStr) {
        const result = {};
        const cleanStr = featuresStr.replace(/\r/g, '').trim();
        const parts = cleanStr.split('|');
        for (const part of parts) {
            const cleanPart = part.trim();
            if (!cleanPart)
                continue;
            if (cleanPart.includes(':')) {
                const [key, value] = cleanPart.split(':');
                result[key.trim()] = value.trim();
            }
            else {
                result[cleanPart] = true;
            }
        }
        return result;
    }
    async saveToFile(data, outputPath) {
        const dirPath = path.dirname(outputPath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const wordsObj = {};
        data.words.forEach((word, location) => {
            wordsObj[location] = word;
        });
        const output = {
            metadata: data.metadata,
            words: wordsObj,
        };
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');
        logger.success(`Saved to: ${outputPath}`);
    }
    getStats(data) {
        const surahs = new Set();
        const verses = new Set();
        const posDistribution = {};
        data.words.forEach((word) => {
            surahs.add(word.surah);
            verses.add(`${word.surah}:${word.verse}`);
            const pos = word.morphology.pos || 'UNKNOWN';
            posDistribution[pos] = (posDistribution[pos] || 0) + 1;
        });
        return {
            totalWords: data.words.size,
            totalVerses: verses.size,
            totalSurahs: surahs.size,
            posDistribution,
        };
    }
}
exports.CorpusMorphologyParser = CorpusMorphologyParser;
if (require.main === module) {
    (async () => {
        try {
            logger.info('Starting Quranic Corpus Morphology Parser...\\n');
            const parser = new CorpusMorphologyParser();
            const data = await parser.parseFile(CONFIG.MORPHOLOGY_FILE);
            const stats = parser.getStats(data);
            logger.success('\\n=== PARSING STATISTICS ===');
            logger.info(`Total Surahs: ${stats.totalSurahs}`);
            logger.info(`Total Verses: ${stats.totalVerses}`);
            logger.info(`Total Words: ${stats.totalWords}`);
            logger.info('\\n=== POS DISTRIBUTION (Top 10) ===');
            const sortedPOS = Object.entries(stats.posDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10);
            sortedPOS.forEach(([pos, count]) => {
                const posName = corpus_morphology_types_1.POS_TAGS[pos] || pos;
                logger.info(`  ${posName} (${pos}): ${count.toLocaleString()}`);
            });
            const outputPath = path.join(CONFIG.OUTPUT_DIR, 'parsed-morphology.json');
            await parser.saveToFile(data, outputPath);
            logger.success('\\n✓ Parsing completed successfully!');
            logger.info(`\\n⚠️ Attribution Required (GNU GPL):`);
            logger.info('  Source: Quranic Arabic Corpus');
            logger.info('  URL: http://corpus.quran.com');
            logger.info('  Authority: University of Leeds');
            logger.info('  License: GNU General Public License');
            process.exit(0);
        }
        catch (error) {
            logger.error('Parsing failed', error);
            process.exit(1);
        }
    })();
}
//# sourceMappingURL=corpus-morphology-parser.js.map