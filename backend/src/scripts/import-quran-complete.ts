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
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Configuration
 */
const CONFIG = {
  MERGED_DATA_FILE: path.join(__dirname, '../../data/processed/quran-complete-merged.json'),
};

/**
 * Logger
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
    if (current % 100 === 0 || current === total) {
      const percentage = ((current / total) * 100).toFixed(1);
      const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
      console.log(`[${elapsed}s] ⏳ Progress: ${current}/${total} (${percentage}%) - ${item}`);
    }
  }
}

const logger = new Logger();

/**
 * Remove diacritics from Arabic text
 */
function removeDiacritics(text: string): string {
  return text.replace(/[\u064B-\u0652\u0670]/g, '');
}

/**
 * POS Mappings
 */
const POS_MAP: Record<string, { en: string; ar: string }> = {
  N: { en: 'Noun', ar: 'اسم' },
  V: { en: 'Verb', ar: 'فعل' },
  P: { en: 'Preposition', ar: 'حرف جر' },
  PN: { en: 'Proper Noun', ar: 'اسم علم' },
  PRON: { en: 'Pronoun', ar: 'ضمير' },
  REL: { en: 'Relative Pronoun', ar: 'اسم موصول' },
  ADJ: { en: 'Adjective', ar: 'صفة' },
};

const GENDER_MAP = {
  M: { en: 'Masculine', ar: 'مذكر' },
  F: { en: 'Feminine', ar: 'مؤنث' },
};

const NUMBER_MAP = {
  S: { en: 'Singular', ar: 'مفرد' },
  D: { en: 'Dual', ar: 'مثنى' },
  P: { en: 'Plural', ar: 'جمع' },
};

const CASE_MAP = {
  NOM: { en: 'Nominative', ar: 'مرفوع' },
  ACC: { en: 'Accusative', ar: 'منصوب' },
  GEN: { en: 'Genitive', ar: 'مجرور' },
};

/**
 * Import Quran data
 */
async function importQuranData() {
  try {
    logger.info('Starting Quran data import...\n');

    // Load merged data
    logger.info(`Loading data from: ${CONFIG.MERGED_DATA_FILE}`);
    const content = fs.readFileSync(CONFIG.MERGED_DATA_FILE, 'utf-8');
    const verses = JSON.parse(content);
    logger.success(`Loaded ${verses.length.toLocaleString()} verses`);

    // Clear existing data
    logger.info('\n⚠️  Clearing existing Quran data...');
    await prisma.verseWord.deleteMany({});
    await prisma.quranVerse.deleteMany({});
    logger.success('Cleared existing data');

    // Import verses
    logger.info('\nImporting verses and words...');

    let totalVerses = 0;

    for (const verse of verses) {
      // Construct full verse text
      const verseText = verse.words.map((w: any) => w.arabicUthmani).join(' ');

      // Create verse
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const createdVerse = await prisma.quranVerse.create({
        data: {
          surahNumber: verse.surah,
          verseNumber: verse.verseNumber,
          textArabic: verseText,
          textWithoutDiacritics: removeDiacritics(verseText),
          translation: verse.words.map((w: any) => w.translation).join(' '),
          transliteration: verse.words
            .map((w: any) => w.transliteration)
            .filter(Boolean)
            .join(' '),
        },
      });

      // Create words
      const wordData = verse.words.map((word: any) => ({
        verseId: createdVerse.id,
        position: word.wordPosition,
        arabicText: word.arabicUthmani,
        textWithoutDiacritics: removeDiacritics(word.arabicUthmani),
        translation: word.translation || '',
        transliteration: word.transliteration || '',

        posType: word.pos || 'UNKNOWN',
        posArabic:
          word.pos && POS_MAP[word.pos as keyof typeof POS_MAP]
            ? POS_MAP[word.pos as keyof typeof POS_MAP].ar
            : null,
        gender:
          word.gender && GENDER_MAP[word.gender as keyof typeof GENDER_MAP]
            ? GENDER_MAP[word.gender as keyof typeof GENDER_MAP].en
            : null,
        genderArabic:
          word.gender && GENDER_MAP[word.gender as keyof typeof GENDER_MAP]
            ? GENDER_MAP[word.gender as keyof typeof GENDER_MAP].ar
            : null,
        number:
          word.number && NUMBER_MAP[word.number as keyof typeof NUMBER_MAP]
            ? NUMBER_MAP[word.number as keyof typeof NUMBER_MAP].en
            : null,
        numberArabic:
          word.number && NUMBER_MAP[word.number as keyof typeof NUMBER_MAP]
            ? NUMBER_MAP[word.number as keyof typeof NUMBER_MAP].ar
            : null,
        irabCase:
          word.case && CASE_MAP[word.case as keyof typeof CASE_MAP]
            ? CASE_MAP[word.case as keyof typeof CASE_MAP].en
            : null,
        irabCaseArabic:
          word.case && CASE_MAP[word.case as keyof typeof CASE_MAP]
            ? CASE_MAP[word.case as keyof typeof CASE_MAP].ar
            : null,

        root: word.root || null,
        lemma: word.lemma || null,

        grammarData: {
          aspect: word.aspect,
          voice: word.voice,
          person: word.person,
          rawFeatures: word.rawMorphologyFeatures,
          sources: word.sources,
        },
      }));

      await prisma.verseWord.createMany({ data: wordData });

      totalVerses++;

      logger.progress(totalVerses, verses.length, `Verse ${verse.verseKey}`);
    }

    // Verify
    logger.info('\n=== IMPORT COMPLETE ===');
    const dbVerses = await prisma.quranVerse.count();
    const dbWords = await prisma.verseWord.count();

    logger.success(`Database verses: ${dbVerses.toLocaleString()}`);
    logger.success(`Database words: ${dbWords.toLocaleString()}`);

    if (dbVerses === 6236 && dbWords === 77429) {
      logger.success('\n✅ Data integrity check PASSED!');
    } else {
      logger.error('\n❌ Data integrity check FAILED!');
      logger.error(`Expected: 6,236 verses, 77,429 words`);
      logger.error(`Got: ${dbVerses} verses, ${dbWords} words`);
    }

    logger.success('\n✓ Import completed successfully!');
  } catch (error) {
    logger.error('Import failed', error as Error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  importQuranData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { importQuranData };
