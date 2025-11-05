/**
 * Quran Data Merger
 *
 * ✅ AUTHORIZED SOURCES (per PROJECT_CONSTRAINTS.md Section 10.2):
 * - Text: quran.com API
 * - Morphology: corpus.quran.com
 *
 * Combines both datasets using location matching
 * Zero modifications to source data (per constraints)
 */

import * as fs from 'fs';
import * as path from 'path';
import { Verse, Word } from '../types/quran-api.types';
import { CorpusWord } from '../types/corpus-morphology.types';

/**
 * Configuration
 */
const CONFIG = {
  QURAN_TEXT_DIR: path.join(__dirname, '../../../data/raw/quran-text'),
  MORPHOLOGY_FILE: path.join(
    __dirname,
    '../../../data/raw/corpus-morphology/parsed-morphology.json',
  ),
  OUTPUT_DIR: path.join(__dirname, '../../../data/processed'),
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
    if (current % 10 === 0 || current === total) {
      const percentage = ((current / total) * 100).toFixed(1);
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
    }
  }
}

const logger = new Logger();

/**
 * Merged word data (text + morphology)
 */
export interface MergedWord {
  // Location
  location: string; // "surah:verse:word"
  surah: number;
  verse: number;
  wordPosition: number;

  // Text data from quran.com
  arabicUthmani: string;
  arabicImlaei?: string;
  translation: string;
  transliteration: string;
  audioUrl: string | null;

  // Page/Line info
  pageNumber: number;
  lineNumber: number;

  // Morphology from corpus.quran.com
  pos?: string;
  posFullName?: string;
  root?: string;
  lemma?: string;
  gender?: 'M' | 'F';
  number?: 'S' | 'D' | 'P';
  case?: 'NOM' | 'ACC' | 'GEN';
  aspect?: 'PERF' | 'IMPF' | 'IMPV';
  voice?: 'ACT' | 'PASS';
  person?: '1' | '2' | '3';

  // Raw features for debugging
  rawMorphologyFeatures?: string;

  // Source attribution
  sources: {
    text: 'quran.com';
    morphology: 'corpus.quran.com';
  };
}

/**
 * Complete verse with merged words
 */
export interface MergedVerse {
  verseKey: string; // "surah:verse"
  verseNumber: number;
  surah: number;
  pageNumber: number;
  juzNumber: number;
  words: MergedWord[];
}

/**
 * Data Merger
 */
export class DataMerger {
  /**
   * Load morphology data from parsed file
   */
  private loadMorphologyData(): Map<string, CorpusWord> {
    logger.info(`Loading morphology data from: ${CONFIG.MORPHOLOGY_FILE}`);

    const content = fs.readFileSync(CONFIG.MORPHOLOGY_FILE, 'utf-8');
    const parsed = JSON.parse(content);

    const morphologyMap = new Map<string, CorpusWord>();

    Object.entries(parsed.words).forEach(([location, word]) => {
      morphologyMap.set(location, word as CorpusWord);
    });

    logger.success(`Loaded ${morphologyMap.size.toLocaleString()} morphology entries`);

    return morphologyMap;
  }

  /**
   * Load all surah text files
   */
  private loadSurahFiles(): Map<number, Verse[]> {
    logger.info(`Loading surah text files from: ${CONFIG.QURAN_TEXT_DIR}`);

    const surahsData = new Map<number, Verse[]>();
    const files = fs.readdirSync(CONFIG.QURAN_TEXT_DIR);

    const surahFiles = files.filter((f) => f.match(/^surah_\d{3}\.json$/));

    for (const file of surahFiles) {
      const surahNumber = parseInt(file.match(/surah_(\d{3})\.json/)![1]);
      const filePath = path.join(CONFIG.QURAN_TEXT_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const verses: Verse[] = JSON.parse(content);

      surahsData.set(surahNumber, verses);
    }

    logger.success(`Loaded ${surahsData.size} surah files`);

    return surahsData;
  }

  /**
   * Merge a single word
   */
  private mergeWord(
    quranWord: Word,
    surahNumber: number,
    verseNumber: number,
    morphologyMap: Map<string, CorpusWord>,
  ): MergedWord {
    // Build location key: "surah:verse:word"
    const location = `${surahNumber}:${verseNumber}:${quranWord.position}`;

    // Get morphology data
    const morphology = morphologyMap.get(location);

    // Merged word
    const merged: MergedWord = {
      location,
      surah: surahNumber,
      verse: verseNumber,
      wordPosition: quranWord.position,

      // Text data from quran.com
      arabicUthmani: quranWord.text_uthmani,
      arabicImlaei: quranWord.text_imlaei,
      translation: quranWord.translation?.text || '',
      transliteration: quranWord.transliteration?.text || '',
      audioUrl: quranWord.audio_url,

      // Page/Line info
      pageNumber: quranWord.page_number,
      lineNumber: quranWord.line_number,

      // Morphology (if found)
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

      // Source attribution
      sources: {
        text: 'quran.com',
        morphology: 'corpus.quran.com',
      },
    };

    return merged;
  }

  /**
   * Merge all data
   */
  async mergeAll(): Promise<MergedVerse[]> {
    logger.info('Starting data merge process...\\n');

    // Load morphology
    const morphologyMap = this.loadMorphologyData();

    // Load surah files
    const surahsData = this.loadSurahFiles();

    // Merge data
    const mergedVerses: MergedVerse[] = [];
    let totalWords = 0;
    let matchedWords = 0;
    let unmatchedWords = 0;

    logger.info('\\nMerging text + morphology data...');

    surahsData.forEach((verses, surahNumber) => {
      for (const verse of verses) {
        const mergedWords: MergedWord[] = [];

        // Only process actual words (exclude verse markers)
        const actualWords = verse.words.filter((w) => w.char_type_name === 'word');

        for (const word of actualWords) {
          totalWords++;

          const merged = this.mergeWord(word, surahNumber, verse.verse_number, morphologyMap);

          mergedWords.push(merged);

          // Track matching
          if (merged.pos) {
            matchedWords++;
          } else {
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

  /**
   * Save merged data to file
   */
  async save(verses: MergedVerse[], outputPath: string): Promise<void> {
    const dirPath = path.dirname(outputPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(verses, null, 2), 'utf-8');
    logger.success(`Saved merged data to: ${outputPath}`);
  }

  /**
   * Get statistics
   */
  getStats(verses: MergedVerse[]): {
    totalVerses: number;
    totalWords: number;
    totalSurahs: number;
    posDistribution: Record<string, number>;
    genderDistribution: Record<string, number>;
    numberDistribution: Record<string, number>;
  } {
    const surahs = new Set<number>();
    const posDistribution: Record<string, number> = {};
    const genderDistribution: Record<string, number> = {};
    const numberDistribution: Record<string, number> = {};

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

/**
 * CLI Usage
 */
if (require.main === module) {
  (async () => {
    try {
      logger.info('Starting Quran Data Merger...\\n');

      const merger = new DataMerger();

      // Merge all data
      const mergedVerses = await merger.mergeAll();

      // Display statistics
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

      // Save merged data
      const outputPath = path.join(CONFIG.OUTPUT_DIR, 'quran-complete-merged.json');
      await merger.save(mergedVerses, outputPath);

      logger.success('\\n✓ Data merge completed successfully!');
      logger.info(`\\n⚠️ Attribution Required:`);
      logger.info('  Text source: quran.com API');
      logger.info('  Morphology source: corpus.quran.com (University of Leeds)');
      logger.info('  Both must be credited in UI');

      process.exit(0);
    } catch (error) {
      logger.error('Merge failed', error as Error);
      process.exit(1);
    }
  })();
}
