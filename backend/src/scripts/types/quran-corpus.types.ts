/**
 * Type definitions for Quranic Corpus data structures
 *
 * These types represent the data format from corpus.quran.com
 * and our internal database schema.
 */

/**
 * Quranic Corpus API Response Types
 */
export interface CorpusVerseData {
  surah: number;
  ayah: number;
  text: string;
  textWithoutDiacritics: string;
  translation?: string;
  transliteration?: string;
  words: CorpusWordData[];
}

export interface CorpusWordData {
  position: number;
  segment: string; // Arabic text with diacritics
  segmentWithoutDiacritics: string;
  translation: string;
  transliteration?: string;

  // Morphological features
  morphology: {
    lemma?: string;
    root?: string;
    partOfSpeech: string; // Primary POS tag
    features: MorphologicalFeatures;
  };

  // Syntactic information
  syntax?: {
    role: string;
    parent?: number;
  };
}

export interface MorphologicalFeatures {
  // Part of Speech
  pos?: string; // noun, verb, particle
  posDetail?: string; // proper_noun, past_tense, preposition, etc.

  // Gender
  gender?: 'masculine' | 'feminine';

  // Number
  number?: 'singular' | 'dual' | 'plural';

  // Definiteness
  definiteness?: 'definite' | 'indefinite';
  definitenessType?: 'article' | 'proper_noun' | 'pronoun' | 'demonstrative' | 'relative';

  // I'rab (Case)
  case?: 'nominative' | 'accusative' | 'genitive' | 'jussive';
  caseState?: 'declinable' | 'indeclinable'; // mu'rab or mabni
  caseReason?: string; // Grammatical reason for case

  // Case Sign
  caseSign?: 'damma' | 'fatha' | 'kasra' | 'sukun' | 'alif' | 'ya' | 'waw';
  hasTanween?: boolean;

  // Structure Type
  structureType?: 'simple' | 'idafa' | 'prep_phrase' | 'adjective_phrase';
  structureRole?: 'mudaf' | 'mudaf_ilayh' | 'jar' | 'majrur';

  // Verb-specific
  tense?: 'past' | 'present' | 'imperative';
  mood?: 'indicative' | 'subjunctive' | 'jussive';
  voice?: 'active' | 'passive';

  // Pronoun-specific
  person?: 'first' | 'second' | 'third';
}

/**
 * Our Database Schema Types (matching Prisma)
 */
export interface VerseInput {
  surahNumber: number;
  verseNumber: number;
  textArabic: string;
  textWithoutDiacritics: string;
  translation: string;
  transliteration?: string;
  searchVectorAr?: string;
  searchVectorEn?: string;
}

export interface VerseWordInput {
  position: number;
  arabicText: string;
  textWithoutDiacritics: string;
  translation: string;
  transliteration?: string;

  // 7 Essential Grammatical Properties
  posType: string;
  posArabic?: string;
  gender?: string;
  genderArabic?: string;
  number?: string;
  numberArabic?: string;
  definiteness?: string;
  definitenessArabic?: string;
  irabCase?: string;
  irabCaseArabic?: string;
  caseSign?: string;
  caseSignArabic?: string;
  caseSignSymbol?: string;
  structureType?: string;
  structureTypeArabic?: string;

  // Additional data
  root?: string;
  lemma?: string;
  grammarData?: Record<string, any>;
}

/**
 * Surah metadata
 */
export interface SurahMetadata {
  number: number;
  name: string;
  nameArabic: string;
  englishName: string;
  revelationType: 'meccan' | 'medinan';
  totalVerses: number;
}

/**
 * MVP Surahs for initial import
 */
export const MVP_SURAHS: SurahMetadata[] = [
  {
    number: 1,
    name: 'Al-Fatiha',
    nameArabic: 'الفاتحة',
    englishName: 'The Opening',
    revelationType: 'meccan',
    totalVerses: 7,
  },
  {
    number: 108,
    name: 'Al-Kawthar',
    nameArabic: 'الكوثر',
    englishName: 'Abundance',
    revelationType: 'meccan',
    totalVerses: 3,
  },
  {
    number: 112,
    name: 'Al-Ikhlas',
    nameArabic: 'الإخلاص',
    englishName: 'Sincerity',
    revelationType: 'meccan',
    totalVerses: 4,
  },
  {
    number: 113,
    name: 'Al-Falaq',
    nameArabic: 'الفلق',
    englishName: 'The Daybreak',
    revelationType: 'meccan',
    totalVerses: 5,
  },
  {
    number: 114,
    name: 'An-Nas',
    nameArabic: 'الناس',
    englishName: 'Mankind',
    revelationType: 'meccan',
    totalVerses: 6,
  },
];

/**
 * Arabic translations for grammatical terms
 */
export const GRAMMAR_TRANSLATIONS = {
  // Part of Speech
  noun: 'اسم',
  verb: 'فعل',
  particle: 'حرف',

  // Gender
  masculine: 'مذكر',
  feminine: 'مؤنث',

  // Number
  singular: 'مفرد',
  dual: 'مثنى',
  plural: 'جمع',

  // Definiteness
  definite: 'معرفة',
  indefinite: 'نكرة',

  // I'rab
  nominative: 'مرفوع',
  accusative: 'منصوب',
  genitive: 'مجرور',
  jussive: 'مجزوم',
  indeclinable: 'مبني',

  // Case Signs
  damma: 'ضمة',
  fatha: 'فتحة',
  kasra: 'كسرة',
  sukun: 'سكون',
  alif: 'ألف',
  ya: 'ياء',
  waw: 'واو',

  // Structure Types
  simple: 'مفرد',
  idafa: 'إضافة',
  prep_phrase: 'جار ومجرور',
  adjective_phrase: 'نعت ومنعوت',
};

/**
 * Case sign symbols
 */
export const CASE_SIGN_SYMBOLS = {
  damma: 'ُ',
  fatha: 'َ',
  kasra: 'ِ',
  sukun: 'ْ',
  dammatain: 'ٌ',
  fathatain: 'ً',
  kasratain: 'ٍ',
};

/**
 * Error types for data validation
 */
export class QuranDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuranDataError';
  }
}

export class QuranTextMismatchError extends QuranDataError {
  constructor(surah: number, ayah: number, expected: string, received: string) {
    super(`Text mismatch for ${surah}:${ayah}. Expected: ${expected}, Received: ${received}`);
    this.name = 'QuranTextMismatchError';
  }
}

export class QuranDataValidationError extends QuranDataError {
  constructor(
    message: string,
    public field: string,
    public value: any,
  ) {
    super(`Validation failed for ${field}: ${message} (value: ${value})`);
    this.name = 'QuranDataValidationError';
  }
}
