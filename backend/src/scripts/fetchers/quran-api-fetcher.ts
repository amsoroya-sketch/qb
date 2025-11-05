/**
 * Quran.com API v4 Fetcher
 *
 * ✅ AUTHORIZED SOURCE: quran.com (per PROJECT_CONSTRAINTS.md Section 10.2)
 *
 * Features:
 * - Rate limiting (10 req/sec, 600 req/min)
 * - Retry logic with exponential backoff
 * - Progress tracking
 * - File caching
 * - Error handling
 * - Zero modifications to fetched data (only Unicode NFC normalization)
 *
 * Data Attribution:
 * - Source: quran.com API
 * - Must attribute in UI
 */

import * as fs from 'fs';
import * as path from 'path';
import { RateLimiter } from '../utils/rate-limiter';
import {
  ChaptersResponse,
  VersesResponse,
  FetchVersesOptions,
  SurahMetadata,
  Verse,
  Word,
} from '../types/quran-api.types';

/**
 * Configuration
 */
const CONFIG = {
  // API settings
  BASE_URL: 'https://api.quran.com/api/v4',

  // Rate limiting (conservative)
  MAX_REQUESTS_PER_SECOND: 10,
  MAX_REQUESTS_PER_MINUTE: 600,
  SAFETY_BUFFER_MS: 100,

  // Retry settings
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY_MS: 1000,
  RETRY_BACKOFF_MULTIPLIER: 2,

  // Fetch settings
  DEFAULT_PER_PAGE: 50, // Max allowed
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

  // Storage paths
  RAW_DATA_DIR: path.join(__dirname, '../../../data/raw/quran-text'),
  CACHE_DIR: path.join(__dirname, '../../../data/raw/quran-text/cache'),
};

/**
 * Logger utility
 */
class Logger {
  private startTime: number = Date.now();

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
    console.error(`[${elapsed}s] ✗ ${message}`);
    if (error) {
      console.error(`  Error: ${error.message}`);
    }
  }

  warn(message: string): void {
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.warn(`[${elapsed}s] ⚠ ${message}`);
  }

  progress(current: number, total: number, item: string): void {
    const percentage = ((current / total) * 100).toFixed(1);
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
  }
}

const logger = new Logger();

/**
 * File storage utility
 */
class FileStorage {
  ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`Created directory: ${dirPath}`);
    }
  }

  saveJSON(filePath: string, data: any): void {
    const dirPath = path.dirname(filePath);
    this.ensureDirectoryExists(dirPath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  loadJSON<T>(filePath: string): T | null {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }

  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}

const fileStorage = new FileStorage();

/**
 * HTTP Client with retry logic and rate limiting
 */
class HttpClient {
  private rateLimiter: RateLimiter;

  constructor(rateLimiter: RateLimiter) {
    this.rateLimiter = rateLimiter;
  }

  async get<T>(url: string, retries: number = CONFIG.MAX_RETRIES): Promise<T> {
    // Apply rate limiting
    await this.rateLimiter.throttle();

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url);

        // Handle rate limiting (429)
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
          logger.warn(`Rate limited (429). Waiting ${waitTime / 1000}s before retry...`);
          await this.sleep(waitTime);
          continue;
        }

        // Handle server errors (5xx)
        if (response.status >= 500) {
          if (attempt === retries) {
            throw new Error(`Server error ${response.status}: ${response.statusText}`);
          }
          const delay =
            CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(CONFIG.RETRY_BACKOFF_MULTIPLIER, attempt - 1);
          logger.warn(
            `Server error ${response.status}. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`,
          );
          await this.sleep(delay);
          continue;
        }

        // Handle client errors (4xx)
        if (response.status >= 400) {
          throw new Error(`Client error ${response.status}: ${response.statusText}`);
        }

        // Success
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data as T;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }

        const delay =
          CONFIG.INITIAL_RETRY_DELAY_MS * Math.pow(CONFIG.RETRY_BACKOFF_MULTIPLIER, attempt - 1);
        logger.warn(`Request failed. Retrying in ${delay}ms... (Attempt ${attempt}/${retries})`);
        logger.error(`Error details: ${(error as Error).message}`);
        await this.sleep(delay);
      }
    }

    throw new Error('Max retries exceeded');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Main Quran.com API Fetcher
 */
export class QuranAPIFetcher {
  private http: HttpClient;
  private storage = fileStorage;
  private rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = new RateLimiter(
      CONFIG.MAX_REQUESTS_PER_SECOND,
      CONFIG.MAX_REQUESTS_PER_MINUTE,
      CONFIG.SAFETY_BUFFER_MS,
    );
    this.http = new HttpClient(this.rateLimiter);
  }

  /**
   * Fetch all chapters (surahs) metadata
   */
  async fetchChapters(useCache: boolean = true): Promise<SurahMetadata[]> {
    const cacheFile = path.join(CONFIG.CACHE_DIR, 'chapters.json');

    // Check cache
    if (useCache && this.storage.fileExists(cacheFile)) {
      logger.info('Loading chapters from cache...');
      const cached = this.storage.loadJSON<SurahMetadata[]>(cacheFile);
      if (cached) {
        logger.success(`Loaded ${cached.length} chapters from cache`);
        return cached;
      }
    }

    // Fetch from API
    logger.info('Fetching chapters from quran.com API...');
    const url = `${CONFIG.BASE_URL}/chapters`;
    const response = await this.http.get<ChaptersResponse>(url);

    // Map to our format
    const surahs: SurahMetadata[] = response.chapters.map((chapter) => ({
      number: chapter.id,
      name: chapter.name_simple,
      nameArabic: chapter.name_arabic,
      englishName: chapter.translated_name.name,
      revelationType: chapter.revelation_place === 'makkah' ? 'meccan' : 'medinan',
      totalVerses: chapter.verses_count,
      revelationOrder: chapter.revelation_order,
    }));

    // Save to cache
    this.storage.saveJSON(cacheFile, surahs);
    logger.success(`Fetched ${surahs.length} chapters`);

    return surahs;
  }

  /**
   * Fetch all verses for a chapter with pagination
   */
  async fetchChapterVerses(chapterNumber: number, useCache: boolean = true): Promise<Verse[]> {
    const cacheFile = path.join(
      CONFIG.RAW_DATA_DIR,
      `surah_${chapterNumber.toString().padStart(3, '0')}.json`,
    );

    // Check cache
    if (useCache && this.storage.fileExists(cacheFile)) {
      logger.info(`Loading Surah ${chapterNumber} from cache...`);
      const cached = this.storage.loadJSON<Verse[]>(cacheFile);
      if (cached) {
        logger.success(`Loaded Surah ${chapterNumber} from cache (${cached.length} verses)`);
        return cached;
      }
    }

    // Fetch from API with pagination
    logger.info(`Fetching Surah ${chapterNumber} from quran.com API...`);
    const allVerses: Verse[] = [];
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

      const response = await this.http.get<VersesResponse>(url);

      // Add verses to collection
      allVerses.push(...response.verses);

      // Check if more pages exist
      hasMore = response.pagination.next_page !== null;
      currentPage = response.pagination.next_page || currentPage;

      logger.progress(
        allVerses.length,
        response.pagination.total_records,
        `Surah ${chapterNumber}`,
      );
    }

    // Normalize text (Unicode NFC - ONLY permitted modification)
    const normalizedVerses = allVerses.map((verse) => ({
      ...verse,
      words: verse.words.map((word) => this.normalizeWord(word)),
    }));

    // Save to cache
    this.storage.saveJSON(cacheFile, normalizedVerses);
    logger.success(`Fetched Surah ${chapterNumber} (${normalizedVerses.length} verses)`);

    return normalizedVerses;
  }

  /**
   * Fetch all 114 surahs
   */
  async fetchAllSurahs(useCache: boolean = true): Promise<Map<number, Verse[]>> {
    logger.info('Fetching metadata for all 114 surahs...');
    const chapters = await this.fetchChapters(useCache);

    const surahsData = new Map<number, Verse[]>();

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      logger.info(
        `\n=== Fetching Surah ${i + 1}/${chapters.length}: ${chapter.name} (${chapter.nameArabic}) ===`,
      );

      try {
        const verses = await this.fetchChapterVerses(chapter.number, useCache);
        surahsData.set(chapter.number, verses);

        const totalWords = verses.reduce(
          (sum, v) => sum + v.words.filter((w) => w.char_type_name === 'word').length,
          0,
        );
        logger.success(
          `✓ Completed Surah ${chapter.number}: ${verses.length} verses, ${totalWords} words`,
        );
      } catch (error) {
        logger.error(`Failed to fetch Surah ${chapter.number}`, error as Error);
        throw error;
      }
    }

    logger.success(`\n✓ Successfully fetched all 114 surahs`);
    return surahsData;
  }

  /**
   * Get statistics about fetched data
   */
  getStats(surahsData: Map<number, Verse[]>): {
    totalSurahs: number;
    totalVerses: number;
    totalWords: number;
    surahDetails: Array<{ surah: number; verses: number; words: number }>;
  } {
    let totalVerses = 0;
    let totalWords = 0;
    const surahDetails: Array<{ surah: number; verses: number; words: number }> = [];

    surahsData.forEach((verses, surahNumber) => {
      const verseCount = verses.length;
      const wordCount = verses.reduce(
        (sum, v) => sum + v.words.filter((w) => w.char_type_name === 'word').length,
        0,
      );

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

  /**
   * Build verses endpoint URL with query parameters
   */
  private buildVersesURL(options: FetchVersesOptions): string {
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

  /**
   * Normalize word text (Unicode NFC)
   * This is the ONLY permitted modification per PROJECT_CONSTRAINTS.md Section 10.4
   */
  private normalizeWord(word: Word): Word {
    return {
      ...word,
      text_uthmani: word.text_uthmani.normalize('NFC').trim(),
      text: word.text.normalize('NFC').trim(),
      text_imlaei: word.text_imlaei?.normalize('NFC').trim(),
      text_indopak: word.text_indopak?.normalize('NFC').trim(),
    };
  }

  /**
   * Get rate limiter statistics
   */
  getRateLimiterStats() {
    return this.rateLimiter.getStats();
  }
}

/**
 * CLI Usage
 */
if (require.main === module) {
  (async () => {
    try {
      logger.info('Starting Quran.com API Data Fetch...\n');

      const fetcher = new QuranAPIFetcher();

      // Fetch all surahs
      const surahsData = await fetcher.fetchAllSurahs(true);

      // Display statistics
      const stats = fetcher.getStats(surahsData);
      logger.success('\n=== FETCH STATISTICS ===');
      logger.info(`Total Surahs: ${stats.totalSurahs}`);
      logger.info(`Total Verses: ${stats.totalVerses}`);
      logger.info(`Total Words: ${stats.totalWords}`);
      logger.info(`\nExpected: 6,236 verses, ~77,429 words`);
      logger.info(`Fetched: ${stats.totalVerses} verses, ${stats.totalWords} words`);

      // Rate limiter stats
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
    } catch (error) {
      logger.error('Fetch failed', error as Error);
      process.exit(1);
    }
  })();
}
