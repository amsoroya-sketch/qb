/**
 * Quranic Corpus Morphology Parser
 *
 * ✅ AUTHORIZED SOURCE: corpus.quran.com (per PROJECT_CONSTRAINTS.md Section 10.2)
 *
 * Parses the Quranic Corpus morphology file (v0.4)
 * License: GNU GPL
 * Source: University of Leeds
 *
 * IMPORTANT: Zero modifications to morphological data (per constraints)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  CorpusMorphemeSegment,
  MorphologicalFeatures,
  CorpusWord,
  CorpusData,
  POS_TAGS,
} from '../types/corpus-morphology.types';

/**
 * Configuration
 */
const CONFIG = {
  MORPHOLOGY_FILE:
    '/home/dev/Development/arQ/quran-morphology-data/quranic-corpus-morphology-0.4.txt',
  OUTPUT_DIR: path.join(__dirname, '../../../data/raw/corpus-morphology'),
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

  progress(current: number, total: number, item: string): void {
    if (current % 1000 === 0 || current === total) {
      const percentage = ((current / total) * 100).toFixed(1);
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
    }
  }
}

const logger = new Logger();

/**
 * Corpus Morphology Parser
 */
export class CorpusMorphologyParser {
  /**
   * Parse the entire morphology file
   */
  async parseFile(filePath: string): Promise<CorpusData> {
    logger.info(`Reading morphology file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    logger.info(`Total lines in file: ${lines.length.toLocaleString()}`);

    // Parse segments
    const segments = this.parseSegments(lines);
    logger.success(`Parsed ${segments.length.toLocaleString()} morpheme segments`);

    // Group by word
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

  /**
   * Parse raw segments from file lines
   */
  private parseSegments(lines: string[]): CorpusMorphemeSegment[] {
    const segments: CorpusMorphemeSegment[] = [];
    let lineNumber = 0;

    for (const line of lines) {
      lineNumber++;

      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '' || line.startsWith('LOCATION')) {
        continue;
      }

      try {
        const segment = this.parseSegmentLine(line);
        if (segment) {
          segments.push(segment);
        }
      } catch (error) {
        logger.error(`Error parsing line ${lineNumber}: ${line}`, error as Error);
      }

      // Progress tracking
      if (lineNumber % 10000 === 0) {
        logger.progress(lineNumber, lines.length, 'parsing segments');
      }
    }

    return segments;
  }

  /**
   * Parse a single segment line
   * Format: (1:1:1:1)	bi	P	PREFIX|bi+
   */
  private parseSegmentLine(line: string): CorpusMorphemeSegment | null {
    const parts = line.split('\t');
    if (parts.length < 4) {
      return null;
    }

    const [locationStr, form, tag, features] = parts;

    // Parse location: (1:1:1:1) → [1, 1, 1, 1]
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

  /**
   * Group segments by word location (surah:verse:word)
   */
  private groupByWord(segments: CorpusMorphemeSegment[]): Map<string, CorpusWord> {
    const wordMap = new Map<string, CorpusMorphemeSegment[]>();

    // Group segments by word
    for (const segment of segments) {
      const wordLocation = `${segment.surah}:${segment.verse}:${segment.word}`;

      if (!wordMap.has(wordLocation)) {
        wordMap.set(wordLocation, []);
      }

      wordMap.get(wordLocation)!.push(segment);
    }

    // Convert to CorpusWord objects
    const words = new Map<string, CorpusWord>();
    let processedWords = 0;

    wordMap.forEach((segmentList, location) => {
      const word = this.buildWordFromSegments(location, segmentList);
      words.set(location, word);

      processedWords++;
      logger.progress(processedWords, wordMap.size, 'building words');
    });

    return words;
  }

  /**
   * Build a complete word from its segments
   */
  private buildWordFromSegments(location: string, segments: CorpusMorphemeSegment[]): CorpusWord {
    const [surah, verse, wordPosition] = location.split(':').map(Number);

    // Sort segments by segment number
    const sortedSegments = segments.sort((a, b) => a.segment - b.segment);

    // Reconstruct Arabic text from segments
    const arabicText = sortedSegments.map((s) => s.form).join('');

    // Extract morphological features
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

  /**
   * Extract morphological features from segments
   * Focuses on the STEM segment for main features
   */
  private extractMorphology(segments: CorpusMorphemeSegment[]): MorphologicalFeatures {
    // Find the STEM segment (contains main morphological info)
    const stemSegment = segments.find((s) => s.features.includes('STEM'));

    if (!stemSegment) {
      // If no STEM, use first segment
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
      posFullName: pos ? POS_TAGS[pos] || pos : undefined,
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

  /**
   * Parse feature string into key-value pairs
   * Example: "STEM|POS:N|LEM:{som|ROOT:smw|M|GEN"
   */
  private parseFeatures(featuresStr: string): Record<string, string | boolean> {
    const result: Record<string, string | boolean> = {};
    // Clean up the string - remove carriage returns and extra whitespace
    const cleanStr = featuresStr.replace(/\r/g, '').trim();
    const parts = cleanStr.split('|');

    for (const part of parts) {
      const cleanPart = part.trim();
      if (!cleanPart) continue;

      if (cleanPart.includes(':')) {
        // Key-value pair (e.g., "POS:N")
        const [key, value] = cleanPart.split(':');
        result[key.trim()] = value.trim();
      } else {
        // Boolean flag (e.g., "M", "GEN")
        result[cleanPart] = true;
      }
    }

    return result;
  }

  /**
   * Save parsed data to JSON file
   */
  async saveToFile(data: CorpusData, outputPath: string): Promise<void> {
    const dirPath = path.dirname(outputPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Convert Map to object for JSON serialization
    const wordsObj: Record<string, CorpusWord> = {};
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

  /**
   * Get statistics about parsed data
   */
  getStats(data: CorpusData): {
    totalWords: number;
    totalVerses: number;
    totalSurahs: number;
    posDistribution: Record<string, number>;
  } {
    const surahs = new Set<number>();
    const verses = new Set<string>();
    const posDistribution: Record<string, number> = {};

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

/**
 * CLI Usage
 */
if (require.main === module) {
  (async () => {
    try {
      logger.info('Starting Quranic Corpus Morphology Parser...\\n');

      const parser = new CorpusMorphologyParser();

      // Parse morphology file
      const data = await parser.parseFile(CONFIG.MORPHOLOGY_FILE);

      // Display statistics
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
        const posName = POS_TAGS[pos] || pos;
        logger.info(`  ${posName} (${pos}): ${count.toLocaleString()}`);
      });

      // Save to JSON
      const outputPath = path.join(CONFIG.OUTPUT_DIR, 'parsed-morphology.json');
      await parser.saveToFile(data, outputPath);

      logger.success('\\n✓ Parsing completed successfully!');
      logger.info(`\\n⚠️ Attribution Required (GNU GPL):`);
      logger.info('  Source: Quranic Arabic Corpus');
      logger.info('  URL: http://corpus.quran.com');
      logger.info('  Authority: University of Leeds');
      logger.info('  License: GNU General Public License');

      process.exit(0);
    } catch (error) {
      logger.error('Parsing failed', error as Error);
      process.exit(1);
    }
  })();
}
