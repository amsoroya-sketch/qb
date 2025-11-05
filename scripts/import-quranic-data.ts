#!/usr/bin/env ts-node

/**
 * arQ Quranic Data Import Script
 * Imports verses and word-level grammatical analysis into database
 *
 * Data Source: Quranic Corpus (http://corpus.quran.com)
 * Total Words: 77,429
 * Total Verses: 6,236
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const prisma = new PrismaClient();

interface QuranVerse {
  surahNumber: number;
  verseNumber: number;
  textArabic: string;
  textWithoutDiacritics: string;
  translation: string;
  transliteration: string;
}

interface VerseWord {
  wordPosition: number;
  arabicText: string;
  textWithoutDiacritics: string;
  transliteration: string;
  translation: string;
  root?: string;
  lemma?: string;

  // 7 Essential Grammatical Properties
  posType: string;           // noun, verb, particle
  gender?: string;            // masculine, feminine
  number?: string;            // singular, dual, plural
  definiteness?: string;      // definite, indefinite
  irabCase?: string;         // nominative, accusative, genitive
  caseSign?: string;         // damma, fatha, kasra
  structureType?: string;    // simple, idafa, phrase

  // Additional properties
  person?: string;
  verbForm?: string;
  verbTense?: string;
  verbMood?: string;
  stem?: string;
  aspect?: string;
}

// ============================================
// FETCH FROM QURANIC CORPUS API
// ============================================

async function fetchVerseData(surahNumber: number, verseNumber: number): Promise<QuranVerse> {
  console.log(`Fetching ${surahNumber}:${verseNumber}...`);

  // In production, you would fetch from Quranic Corpus API
  // For now, we'll use sample data structure

  return {
    surahNumber,
    verseNumber,
    textArabic: '',
    textWithoutDiacritics: '',
    translation: '',
    transliteration: '',
  };
}

async function fetchWordAnalysis(
  surahNumber: number,
  verseNumber: number,
  wordPosition: number
): Promise<VerseWord> {
  // In production, fetch from Quranic Corpus morphological analysis
  return {
    wordPosition,
    arabicText: '',
    textWithoutDiacritics: '',
    transliteration: '',
    translation: '',
    posType: 'noun',
  };
}

// ============================================
// SAMPLE DATA FOR SURAH AL-FATIHA (1:1-7)
// ============================================

const SAMPLE_VERSES: Array<QuranVerse & { words: VerseWord[] }> = [
  {
    surahNumber: 1,
    verseNumber: 1,
    textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    textWithoutDiacritics: 'بسم الله الرحمن الرحيم',
    translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    transliteration: 'Bismillāhi r-raḥmāni r-raḥīm',
    words: [
      {
        wordPosition: 1,
        arabicText: 'بِسْمِ',
        textWithoutDiacritics: 'بسم',
        transliteration: 'bismi',
        translation: 'In the name',
        root: 'س م و',
        lemma: 'اسم',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'indefinite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'idafa',
      },
      {
        wordPosition: 2,
        arabicText: 'اللَّهِ',
        textWithoutDiacritics: 'الله',
        transliteration: 'Allāhi',
        translation: 'Allah',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'simple',
      },
      {
        wordPosition: 3,
        arabicText: 'الرَّحْمَٰنِ',
        textWithoutDiacritics: 'الرحمن',
        transliteration: 'ar-raḥmāni',
        translation: 'the Entirely Merciful',
        root: 'ر ح م',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'simple',
      },
      {
        wordPosition: 4,
        arabicText: 'الرَّحِيمِ',
        textWithoutDiacritics: 'الرحيم',
        transliteration: 'ar-raḥīm',
        translation: 'the Especially Merciful',
        root: 'ر ح م',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'simple',
      },
    ],
  },
  {
    surahNumber: 1,
    verseNumber: 2,
    textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    textWithoutDiacritics: 'الحمد لله رب العالمين',
    translation: '[All] praise is [due] to Allah, Lord of the worlds',
    transliteration: 'Al-ḥamdu lillāhi rabbi l-ʿālamīn',
    words: [
      {
        wordPosition: 1,
        arabicText: 'الْحَمْدُ',
        textWithoutDiacritics: 'الحمد',
        transliteration: 'al-ḥamdu',
        translation: 'the praise',
        root: 'ح م د',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'nominative',
        caseSign: 'damma',
        structureType: 'simple',
      },
      {
        wordPosition: 2,
        arabicText: 'لِلَّهِ',
        textWithoutDiacritics: 'لله',
        transliteration: 'lillāhi',
        translation: 'for Allah',
        posType: 'particle',
        structureType: 'phrase',
      },
      {
        wordPosition: 3,
        arabicText: 'رَبِّ',
        textWithoutDiacritics: 'رب',
        transliteration: 'rabbi',
        translation: 'Lord',
        root: 'ر ب ب',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'idafa',
      },
      {
        wordPosition: 4,
        arabicText: 'الْعَالَمِينَ',
        textWithoutDiacritics: 'العالمين',
        transliteration: 'l-ʿālamīn',
        translation: 'the worlds',
        root: 'ع ل م',
        posType: 'noun',
        gender: 'masculine',
        number: 'plural',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'simple',
      },
    ],
  },
  {
    surahNumber: 1,
    verseNumber: 3,
    textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    textWithoutDiacritics: 'الرحمن الرحيم',
    translation: 'The Entirely Merciful, the Especially Merciful',
    transliteration: 'Ar-raḥmāni r-raḥīm',
    words: [
      {
        wordPosition: 1,
        arabicText: 'الرَّحْمَٰنِ',
        textWithoutDiacritics: 'الرحمن',
        transliteration: 'ar-raḥmāni',
        translation: 'the Entirely Merciful',
        root: 'ر ح م',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'simple',
      },
      {
        wordPosition: 2,
        arabicText: 'الرَّحِيمِ',
        textWithoutDiacritics: 'الرحيم',
        transliteration: 'ar-raḥīm',
        translation: 'the Especially Merciful',
        root: 'ر ح م',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'simple',
      },
    ],
  },
  {
    surahNumber: 1,
    verseNumber: 4,
    textArabic: 'مَالِكِ يَوْمِ الدِّينِ',
    textWithoutDiacritics: 'مالك يوم الدين',
    translation: 'Master of the Day of Judgment',
    transliteration: 'Māliki yawmi d-dīn',
    words: [
      {
        wordPosition: 1,
        arabicText: 'مَالِكِ',
        textWithoutDiacritics: 'مالك',
        transliteration: 'māliki',
        translation: 'Master',
        root: 'م ل ك',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'indefinite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'idafa',
      },
      {
        wordPosition: 2,
        arabicText: 'يَوْمِ',
        textWithoutDiacritics: 'يوم',
        transliteration: 'yawmi',
        translation: 'Day',
        root: 'ي و م',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'indefinite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'idafa',
      },
      {
        wordPosition: 3,
        arabicText: 'الدِّينِ',
        textWithoutDiacritics: 'الدين',
        transliteration: 'd-dīn',
        translation: 'the Judgment',
        root: 'د ي ن',
        posType: 'noun',
        gender: 'masculine',
        number: 'singular',
        definiteness: 'definite',
        irabCase: 'genitive',
        caseSign: 'kasra',
        structureType: 'simple',
      },
    ],
  },
  {
    surahNumber: 1,
    verseNumber: 5,
    textArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    textWithoutDiacritics: 'إياك نعبد وإياك نستعين',
    translation: 'You alone we worship, and You alone we ask for help',
    transliteration: 'Iyyāka naʿbudu wa-iyyāka nastaʿīn',
    words: [
      {
        wordPosition: 1,
        arabicText: 'إِيَّاكَ',
        textWithoutDiacritics: 'إياك',
        transliteration: 'iyyāka',
        translation: 'You alone',
        posType: 'particle',
        structureType: 'simple',
      },
      {
        wordPosition: 2,
        arabicText: 'نَعْبُدُ',
        textWithoutDiacritics: 'نعبد',
        transliteration: 'naʿbudu',
        translation: 'we worship',
        root: 'ع ب د',
        posType: 'verb',
        verbTense: 'present',
        verbMood: 'indicative',
        person: 'first',
        number: 'plural',
        structureType: 'simple',
      },
      {
        wordPosition: 3,
        arabicText: 'وَإِيَّاكَ',
        textWithoutDiacritics: 'وإياك',
        transliteration: 'wa-iyyāka',
        translation: 'and You alone',
        posType: 'particle',
        structureType: 'phrase',
      },
      {
        wordPosition: 4,
        arabicText: 'نَسْتَعِينُ',
        textWithoutDiacritics: 'نستعين',
        transliteration: 'nastaʿīn',
        translation: 'we ask for help',
        root: 'ع و ن',
        posType: 'verb',
        verbTense: 'present',
        verbMood: 'indicative',
        verbForm: 'X',
        person: 'first',
        number: 'plural',
        structureType: 'simple',
      },
    ],
  },
];

// ============================================
// IMPORT FUNCTIONS
// ============================================

async function importVerse(verseData: typeof SAMPLE_VERSES[0]) {
  // Create verse
  const verse = await prisma.quranVerse.upsert({
    where: {
      surahNumber_verseNumber: {
        surahNumber: verseData.surahNumber,
        verseNumber: verseData.verseNumber,
      },
    },
    update: {},
    create: {
      surahNumber: verseData.surahNumber,
      verseNumber: verseData.verseNumber,
      textArabic: verseData.textArabic,
      textWithoutDiacritics: verseData.textWithoutDiacritics,
      translation: verseData.translation,
      transliteration: verseData.transliteration,
    },
  });

  // Create words
  for (const wordData of verseData.words) {
    await prisma.verseWord.create({
      data: {
        verseId: verse.id,
        wordPosition: wordData.wordPosition,
        arabicText: wordData.arabicText,
        textWithoutDiacritics: wordData.textWithoutDiacritics,
        transliteration: wordData.transliteration,
        translation: wordData.translation,
        root: wordData.root,
        lemma: wordData.lemma,

        // 7 Essential Properties
        posType: wordData.posType,
        gender: wordData.gender,
        number: wordData.number,
        definiteness: wordData.definiteness,
        irabCase: wordData.irabCase,
        caseSign: wordData.caseSign,
        structureType: wordData.structureType,

        // Additional properties
        person: wordData.person,
        verbForm: wordData.verbForm,
        verbTense: wordData.verbTense,
        verbMood: wordData.verbMood,
        stem: wordData.stem,
        aspect: wordData.aspect,
      },
    });
  }

  return verse;
}

async function importAllVerses() {
  console.log('📖 Importing Quranic verses and word analysis...\n');

  let totalVerses = 0;
  let totalWords = 0;

  for (const verseData of SAMPLE_VERSES) {
    const verse = await importVerse(verseData);
    totalVerses++;
    totalWords += verseData.words.length;

    console.log(
      `✓ Imported ${verse.surahNumber}:${verse.verseNumber} (${verseData.words.length} words)`
    );
  }

  console.log(`\n✅ Import complete!`);
  console.log(`  • Verses imported: ${totalVerses}`);
  console.log(`  • Words analyzed: ${totalWords}\n`);
}

// ============================================
// BULK IMPORT FROM JSON FILES
// ============================================

async function importFromJSONFiles(dataDir: string) {
  console.log(`📁 Loading data from ${dataDir}...\n`);

  // Example: Load from JSON files organized by Surah
  // Structure: data/quran/surah_001.json, surah_002.json, etc.

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`Processing ${file}...`);

    for (const verseData of data.verses) {
      await importVerse(verseData);
    }
  }
}

// ============================================
// STATISTICS
// ============================================

async function printStatistics() {
  console.log('\n📊 Database Statistics:\n');

  const verseCount = await prisma.quranVerse.count();
  const wordCount = await prisma.verseWord.count();

  // Count by POS type
  const posCounts = await prisma.verseWord.groupBy({
    by: ['posType'],
    _count: { posType: true },
  });

  // Count by case
  const caseCounts = await prisma.verseWord.groupBy({
    by: ['irabCase'],
    _count: { irabCase: true },
    where: { irabCase: { not: null } },
  });

  console.log(`Total Verses: ${verseCount}`);
  console.log(`Total Words: ${wordCount}`);
  console.log(`\nPart of Speech Distribution:`);
  posCounts.forEach((pos) => {
    console.log(`  ${pos.posType}: ${pos._count.posType}`);
  });

  console.log(`\nI'rab Case Distribution:`);
  caseCounts.forEach((c) => {
    console.log(`  ${c.irabCase}: ${c._count.irabCase}`);
  });

  console.log('');
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  console.log('🚀 arQ Quranic Data Import\n');

  try {
    // Import sample verses
    await importAllVerses();

    // Uncomment to import from JSON files
    // const dataDir = path.join(__dirname, '..', 'data', 'quran');
    // if (fs.existsSync(dataDir)) {
    //   await importFromJSONFiles(dataDir);
    // }

    // Print statistics
    await printStatistics();

    console.log('✅ Data import completed successfully!\n');
    console.log('📝 Note: This script imported sample data from Surah Al-Fatiha.');
    console.log('   To import the complete Quran (77,429 words):');
    console.log('   1. Download Quranic Corpus data');
    console.log('   2. Place JSON files in data/quran/ directory');
    console.log('   3. Uncomment the importFromJSONFiles() call above\n');
  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { importVerse, importAllVerses, importFromJSONFiles };
