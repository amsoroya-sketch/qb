"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuranCorpusFetcher = void 0;
const fs = require("fs");
const path = require("path");
const quran_corpus_types_1 = require("../types/quran-corpus.types");
const CONFIG = {
    ALQURAN_API: 'https://api.alquran.cloud/v1',
    TANZIL_API: 'https://api.tanzil.net',
    MAX_REQUESTS_PER_SECOND: 10,
    REQUEST_INTERVAL_MS: 100,
    MAX_RETRIES: 3,
    INITIAL_RETRY_DELAY_MS: 1000,
    RETRY_BACKOFF_MULTIPLIER: 2,
    RAW_DATA_DIR: path.join(__dirname, '../../../data/raw'),
    PROCESSED_DATA_DIR: path.join(__dirname, '../../../data/processed'),
    ARABIC_EDITION: 'quran-uthmani',
    ARABIC_SIMPLE: 'quran-simple',
    TRANSLATION_EDITION: 'en.sahih',
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
            console.error(`  ${error.message}`);
            if (error.stack) {
                console.error(`  ${error.stack.split('\n').slice(0, 3).join('\n  ')}`);
            }
        }
    }
    warn(message) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.warn(`[${elapsed}s] ⚠ ${message}`);
    }
    progress(current, total, item) {
        const percentage = ((current / total) * 100).toFixed(1);
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
    }
}
const logger = new Logger();
class RateLimiter {
    constructor() {
        this.lastRequestTime = 0;
        this.requestQueue = [];
        this.isProcessing = false;
    }
    async throttle() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < CONFIG.REQUEST_INTERVAL_MS) {
            const waitTime = CONFIG.REQUEST_INTERVAL_MS - timeSinceLastRequest;
            await this.sleep(waitTime);
        }
        this.lastRequestTime = Date.now();
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
const rateLimiter = new RateLimiter();
class HttpClient {
    async get(url, retries = CONFIG.MAX_RETRIES) {
        await rateLimiter.throttle();
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                return data;
            }
            catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                const delay = CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(CONFIG.RETRY_BACKOFF_MULTIPLIER, attempt - 1);
                logger.warn(`Attempt ${attempt}/${retries} failed for ${url}. Retrying in ${delay}ms...`);
                await this.sleep(delay);
            }
        }
        throw new Error('Max retries exceeded');
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
const httpClient = new HttpClient();
class FileStorage {
    ensureDirectoryExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            logger.info(`Created directory: ${dirPath}`);
        }
    }
    saveJSON(filePath, data) {
        const dirPath = path.dirname(filePath);
        this.ensureDirectoryExists(dirPath);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        logger.success(`Saved data to: ${filePath}`);
    }
    loadJSON(filePath) {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    }
    fileExists(filePath) {
        return fs.existsSync(filePath);
    }
}
const fileStorage = new FileStorage();
class QuranCorpusFetcher {
    constructor() {
        this.storage = fileStorage;
        this.http = httpClient;
    }
    async fetchSurah(surahNumber, useCache = true) {
        logger.info(`Fetching Surah ${surahNumber}...`);
        const cacheFile = path.join(CONFIG.RAW_DATA_DIR, `surah_${surahNumber}.json`);
        if (useCache && this.storage.fileExists(cacheFile)) {
            logger.info(`Loading Surah ${surahNumber} from cache...`);
            const cached = this.storage.loadJSON(cacheFile);
            if (cached) {
                logger.success(`Loaded Surah ${surahNumber} from cache`);
                return cached;
            }
        }
        const surahMetadata = quran_corpus_types_1.MVP_SURAHS.find((s) => s.number === surahNumber);
        if (!surahMetadata) {
            throw new Error(`Surah ${surahNumber} not found in MVP list`);
        }
        const verses = [];
        for (let verseNumber = 1; verseNumber <= surahMetadata.totalVerses; verseNumber++) {
            logger.progress(verseNumber, surahMetadata.totalVerses, `Verse ${surahNumber}:${verseNumber}`);
            const verseData = await this.fetchVerse(surahNumber, verseNumber);
            verses.push(verseData);
        }
        this.storage.saveJSON(cacheFile, verses);
        logger.success(`Fetched Surah ${surahNumber} (${verses.length} verses)`);
        return verses;
    }
    async fetchVerse(surahNumber, verseNumber) {
        const arabicUrl = `${CONFIG.ALQURAN_API}/ayah/${surahNumber}:${verseNumber}/${CONFIG.ARABIC_EDITION}`;
        const arabicResponse = await this.http.get(arabicUrl);
        const arabicData = arabicResponse.data;
        const simpleUrl = `${CONFIG.ALQURAN_API}/ayah/${surahNumber}:${verseNumber}/${CONFIG.ARABIC_SIMPLE}`;
        const simpleResponse = await this.http.get(simpleUrl);
        const simpleData = simpleResponse.data;
        const translationUrl = `${CONFIG.ALQURAN_API}/ayah/${surahNumber}:${verseNumber}/${CONFIG.TRANSLATION_EDITION}`;
        const translationResponse = await this.http.get(translationUrl);
        const translationData = translationResponse.data;
        const words = await this.fetchVerseWords(surahNumber, verseNumber, arabicData.text);
        return {
            surah: surahNumber,
            ayah: verseNumber,
            text: arabicData.text,
            textWithoutDiacritics: simpleData.text,
            translation: translationData.text,
            transliteration: undefined,
            words,
        };
    }
    async fetchVerseWords(surahNumber, verseNumber, verseText) {
        const arabicWords = verseText.split(/\s+/).filter((w) => w.length > 0);
        const words = arabicWords.map((word, index) => {
            const wordWithoutDiacritics = this.removeDiacritics(word);
            return {
                position: index + 1,
                segment: word,
                segmentWithoutDiacritics: wordWithoutDiacritics,
                translation: `[Word ${index + 1}]`,
                transliteration: undefined,
                morphology: {
                    lemma: undefined,
                    root: undefined,
                    partOfSpeech: this.inferPOS(word),
                    features: this.inferMorphology(word),
                },
                syntax: undefined,
            };
        });
        return words;
    }
    removeDiacritics(text) {
        return text.replace(/[\u064B-\u065F\u0670]/g, '');
    }
    inferPOS(word) {
        const clean = this.removeDiacritics(word);
        const particles = ['و', 'ف', 'ب', 'ل', 'من', 'إلى', 'على', 'في', 'أن', 'إن', 'لا'];
        if (particles.includes(clean)) {
            return 'particle';
        }
        if (particles.some((p) => clean.startsWith(p) && clean.length > p.length)) {
            return 'noun';
        }
        return 'noun';
    }
    inferMorphology(word) {
        return {
            pos: this.inferPOS(word),
            gender: 'masculine',
            number: 'singular',
            definiteness: word.includes('ال') ? 'definite' : 'indefinite',
            case: 'nominative',
            caseSign: 'damma',
            structureType: 'simple',
        };
    }
    async fetchMVPSurahs(useCache = true) {
        logger.info(`Fetching ${quran_corpus_types_1.MVP_SURAHS.length} MVP surahs...`);
        const surahsData = new Map();
        for (let i = 0; i < quran_corpus_types_1.MVP_SURAHS.length; i++) {
            const surah = quran_corpus_types_1.MVP_SURAHS[i];
            logger.info(`\n=== Fetching Surah ${i + 1}/${quran_corpus_types_1.MVP_SURAHS.length}: ${surah.name} (${surah.nameArabic}) ===`);
            try {
                const verses = await this.fetchSurah(surah.number, useCache);
                surahsData.set(surah.number, verses);
                logger.success(`✓ Completed Surah ${surah.number}`);
            }
            catch (error) {
                logger.error(`Failed to fetch Surah ${surah.number}`, error);
                throw error;
            }
        }
        logger.success(`\n✓ Successfully fetched all ${quran_corpus_types_1.MVP_SURAHS.length} MVP surahs`);
        return surahsData;
    }
    getStats(surahsData) {
        let totalVerses = 0;
        let totalWords = 0;
        const surahDetails = [];
        for (const [surahNumber, verses] of surahsData.entries()) {
            const verseCount = verses.length;
            const wordCount = verses.reduce((sum, v) => sum + v.words.length, 0);
            totalVerses += verseCount;
            totalWords += wordCount;
            surahDetails.push({
                surah: surahNumber,
                verses: verseCount,
                words: wordCount,
            });
        }
        return {
            totalSurahs: surahsData.size,
            totalVerses,
            totalWords,
            surahDetails,
        };
    }
}
exports.QuranCorpusFetcher = QuranCorpusFetcher;
if (require.main === module) {
    (async () => {
        try {
            logger.info('Starting Quranic Corpus Data Fetch...\n');
            const fetcher = new QuranCorpusFetcher();
            const surahsData = await fetcher.fetchMVPSurahs(true);
            const stats = fetcher.getStats(surahsData);
            logger.success('\n=== FETCH STATISTICS ===');
            logger.info(`Total Surahs: ${stats.totalSurahs}`);
            logger.info(`Total Verses: ${stats.totalVerses}`);
            logger.info(`Total Words: ${stats.totalWords}`);
            logger.info('\nPer-Surah Details:');
            stats.surahDetails.forEach((detail) => {
                const surah = quran_corpus_types_1.MVP_SURAHS.find((s) => s.number === detail.surah);
                logger.info(`  Surah ${detail.surah} (${surah?.name}): ${detail.verses} verses, ${detail.words} words`);
            });
            logger.success('\n✓ Fetch completed successfully!');
            process.exit(0);
        }
        catch (error) {
            logger.error('Fetch failed', error);
            process.exit(1);
        }
    })();
}
//# sourceMappingURL=quran-corpus-fetcher.js.map