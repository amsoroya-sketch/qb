"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuranAPIFetcher = void 0;
const fs = require("fs");
const path = require("path");
const rate_limiter_1 = require("../utils/rate-limiter");
const CONFIG = {
    BASE_URL: 'https://api.quran.com/api/v4',
    MAX_REQUESTS_PER_SECOND: 10,
    MAX_REQUESTS_PER_MINUTE: 600,
    SAFETY_BUFFER_MS: 100,
    MAX_RETRIES: 3,
    INITIAL_RETRY_DELAY_MS: 1000,
    RETRY_BACKOFF_MULTIPLIER: 2,
    DEFAULT_PER_PAGE: 50,
    DEFAULT_LANGUAGE: 'en',
    DEFAULT_WORD_FIELDS: [
        'text_uthmani',
        'text_imlaei',
        'location',
        'audio_url',
        'translation',
        'transliteration',
        'char_type_name',
        'page_number',
        'line_number',
    ],
    RAW_DATA_DIR: path.join(__dirname, '../../../data/raw/quran-text'),
    CACHE_DIR: path.join(__dirname, '../../../data/raw/quran-text/cache'),
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
        const percentage = ((current / total) * 100).toFixed(1);
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
    }
}
const logger = new Logger();
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
class HttpClient {
    constructor(rateLimiter) {
        this.rateLimiter = rateLimiter;
    }
    async get(url, retries = CONFIG.MAX_RETRIES) {
        await this.rateLimiter.throttle();
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url);
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After');
                    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
                    logger.warn(`Rate limited (429). Waiting ${waitTime / 1000}s before retry...`);
                    await this.sleep(waitTime);
                    continue;
                }
                if (response.status >= 500) {
                    if (attempt === retries) {
                        throw new Error(`Server error ${response.status}: ${response.statusText}`);
                    }
                    const delay = CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(CONFIG.RETRY_BACKOFF_MULTIPLIER, attempt - 1);
                    logger.warn(`Server error ${response.status}. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`);
                    await this.sleep(delay);
                    continue;
                }
                if (response.status >= 400) {
                    throw new Error(`Client error ${response.status}: ${response.statusText}`);
                }
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
                logger.warn(`Request failed. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`);
                logger.error(`Error details: ${error.message}`);
                await this.sleep(delay);
            }
        }
        throw new Error('Max retries exceeded');
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
class QuranAPIFetcher {
    constructor() {
        this.storage = fileStorage;
        this.rateLimiter = new rate_limiter_1.RateLimiter(CONFIG.MAX_REQUESTS_PER_SECOND, CONFIG.MAX_REQUESTS_PER_MINUTE, CONFIG.SAFETY_BUFFER_MS);
        this.http = new HttpClient(this.rateLimiter);
    }
    async fetchChapters(useCache = true) {
        const cacheFile = path.join(CONFIG.CACHE_DIR, 'chapters.json');
        if (useCache && this.storage.fileExists(cacheFile)) {
            logger.info('Loading chapters from cache...');
            const cached = this.storage.loadJSON(cacheFile);
            if (cached) {
                logger.success(`Loaded ${cached.length} chapters from cache`);
                return cached;
            }
        }
        logger.info('Fetching chapters from quran.com API...');
        const url = `${CONFIG.BASE_URL}/chapters`;
        const response = await this.http.get(url);
        const surahs = response.chapters.map((chapter) => ({
            number: chapter.id,
            name: chapter.name_simple,
            nameArabic: chapter.name_arabic,
            englishName: chapter.translated_name.name,
            revelationType: chapter.revelation_place === 'makkah' ? 'meccan' : 'medinan',
            totalVerses: chapter.verses_count,
            revelationOrder: chapter.revelation_order,
        }));
        this.storage.saveJSON(cacheFile, surahs);
        logger.success(`Fetched ${surahs.length} chapters`);
        return surahs;
    }
    async fetchChapterVerses(chapterNumber, useCache = true) {
        const cacheFile = path.join(CONFIG.RAW_DATA_DIR, `surah_${chapterNumber.toString().padStart(3, '0')}.json`);
        if (useCache && this.storage.fileExists(cacheFile)) {
            logger.info(`Loading Surah ${chapterNumber} from cache...`);
            const cached = this.storage.loadJSON(cacheFile);
            if (cached) {
                logger.success(`Loaded Surah ${chapterNumber} from cache (${cached.length} verses)`);
                return cached;
            }
        }
        logger.info(`Fetching Surah ${chapterNumber} from quran.com API...`);
        const allVerses = [];
        let currentPage = 1;
        let hasMore = true;
        while (hasMore) {
            const url = this.buildVersesURL({
                chapter: chapterNumber,
                page: currentPage,
                perPage: CONFIG.DEFAULT_PER_PAGE,
                language: CONFIG.DEFAULT_LANGUAGE,
                words: true,
                wordFields: CONFIG.DEFAULT_WORD_FIELDS,
            });
            const response = await this.http.get(url);
            allVerses.push(...response.verses);
            hasMore = response.pagination.next_page !== null;
            currentPage = response.pagination.next_page || currentPage;
            logger.progress(allVerses.length, response.pagination.total_records, `Surah ${chapterNumber}`);
        }
        const normalizedVerses = allVerses.map((verse) => ({
            ...verse,
            words: verse.words.map((word) => this.normalizeWord(word)),
        }));
        this.storage.saveJSON(cacheFile, normalizedVerses);
        logger.success(`Fetched Surah ${chapterNumber} (${normalizedVerses.length} verses)`);
        return normalizedVerses;
    }
    async fetchAllSurahs(useCache = true) {
        logger.info('Fetching metadata for all 114 surahs...');
        const chapters = await this.fetchChapters(useCache);
        const surahsData = new Map();
        for (let i = 0; i < chapters.length; i++) {
            const chapter = chapters[i];
            logger.info(`\n=== Fetching Surah ${i + 1}/${chapters.length}: ${chapter.name} (${chapter.nameArabic}) ===`);
            try {
                const verses = await this.fetchChapterVerses(chapter.number, useCache);
                surahsData.set(chapter.number, verses);
                const totalWords = verses.reduce((sum, v) => sum + v.words.filter((w) => w.char_type_name === 'word').length, 0);
                logger.success(`✓ Completed Surah ${chapter.number}: ${verses.length} verses, ${totalWords} words`);
            }
            catch (error) {
                logger.error(`Failed to fetch Surah ${chapter.number}`, error);
                throw error;
            }
        }
        logger.success(`\n✓ Successfully fetched all 114 surahs`);
        return surahsData;
    }
    getStats(surahsData) {
        let totalVerses = 0;
        let totalWords = 0;
        const surahDetails = [];
        surahsData.forEach((verses, surahNumber) => {
            const verseCount = verses.length;
            const wordCount = verses.reduce((sum, v) => sum + v.words.filter((w) => w.char_type_name === 'word').length, 0);
            totalVerses += verseCount;
            totalWords += wordCount;
            surahDetails.push({
                surah: surahNumber,
                verses: verseCount,
                words: wordCount,
            });
        });
        return {
            totalSurahs: surahsData.size,
            totalVerses,
            totalWords,
            surahDetails,
        };
    }
    buildVersesURL(options) {
        const params = new URLSearchParams();
        params.append('language', options.language || CONFIG.DEFAULT_LANGUAGE);
        params.append('words', String(options.words !== false));
        params.append('page', String(options.page || 1));
        params.append('per_page', String(options.perPage || CONFIG.DEFAULT_PER_PAGE));
        if (options.wordFields && options.wordFields.length > 0) {
            params.append('word_fields', options.wordFields.join(','));
        }
        if (options.translations) {
            params.append('translations', options.translations);
        }
        return `${CONFIG.BASE_URL}/verses/by_chapter/${options.chapter}?${params.toString()}`;
    }
    normalizeWord(word) {
        return {
            ...word,
            text_uthmani: word.text_uthmani.normalize('NFC').trim(),
            text: word.text.normalize('NFC').trim(),
            text_imlaei: word.text_imlaei?.normalize('NFC').trim(),
            text_indopak: word.text_indopak?.normalize('NFC').trim(),
        };
    }
    getRateLimiterStats() {
        return this.rateLimiter.getStats();
    }
}
exports.QuranAPIFetcher = QuranAPIFetcher;
if (require.main === module) {
    (async () => {
        try {
            logger.info('Starting Quran.com API Data Fetch...\n');
            const fetcher = new QuranAPIFetcher();
            const surahsData = await fetcher.fetchAllSurahs(true);
            const stats = fetcher.getStats(surahsData);
            logger.success('\n=== FETCH STATISTICS ===');
            logger.info(`Total Surahs: ${stats.totalSurahs}`);
            logger.info(`Total Verses: ${stats.totalVerses}`);
            logger.info(`Total Words: ${stats.totalWords}`);
            logger.info(`\nExpected: 6,236 verses, ~77,429 words`);
            logger.info(`Fetched: ${stats.totalVerses} verses, ${stats.totalWords} words`);
            const rateStats = fetcher.getRateLimiterStats();
            logger.info('\n=== RATE LIMITER STATS ===');
            logger.info(`Requests in last second: ${rateStats.requestsLastSecond}`);
            logger.info(`Requests in last minute: ${rateStats.requestsLastMinute}`);
            logger.info(`Utilization: ${rateStats.utilizationPercent.toFixed(1)}%`);
            logger.success('\n✓ Fetch completed successfully!');
            logger.success('✓ Data cached to: backend/data/raw/quran-text/');
            logger.info('\n⚠️ Attribution Required:');
            logger.info('  Source: quran.com API');
            logger.info('  Must include attribution in UI footer');
            process.exit(0);
        }
        catch (error) {
            logger.error('Fetch failed', error);
            process.exit(1);
        }
    })();
}
//# sourceMappingURL=quran-api-fetcher.js.map