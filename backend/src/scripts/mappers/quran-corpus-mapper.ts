/**
 * Quranic Corpus Data Mapper
 *
 * Maps data from Quranic Corpus format to our Prisma database schema.
 * Handles:
 * - Normalizing Arabic text (Unicode NFC normalization)
 * - Mapping POS tags to standardized values
 * - Extracting and mapping the 7 essential grammatical properties
 * - Converting morphological features to our schema
 * - Handling missing/null values gracefully
 */

import {
  CorpusVerseData,
  CorpusWordData,
  VerseInput,
  VerseWordInput,
  GRAMMAR_TRANSLATIONS,
  CASE_SIGN_SYMBOLS,
  QuranDataValidationError,
} from '../types/quran-corpus.types';

/**
 * Main Mapper Class
 */
export class QuranCorpusMapper {
  /**
   * Map a complete verse from Corpus format to our schema
   */
  mapVerse(corpusVerse: CorpusVerseData): VerseInput {
    // Validate required fields
    this.validateVerse(corpusVerse);

    // Normalize Arabic text (Unicode NFC)
    const normalizedText = this.normalizeArabicText(corpusVerse.text);
    const normalizedTextWithoutDiacritics = this.normalizeArabicText(
      corpusVerse.textWithoutDiacritics,
    );

    return {
      surahNumber: corpusVerse.surah,
      verseNumber: corpusVerse.ayah,
      textArabic: normalizedText,
      textWithoutDiacritics: normalizedTextWithoutDiacritics,
      translation: corpusVerse.translation || '',
      transliteration: corpusVerse.transliteration,
      searchVectorAr: this.createSearchVector(normalizedTextWithoutDiacritics),
      searchVectorEn: this.createSearchVector(corpusVerse.translation || ''),
    };
  }

  /**
   * Map verse words from Corpus format to our schema
   */
  mapVerseWords(corpusVerse: CorpusVerseData): VerseWordInput[] {
    return corpusVerse.words.map((word) => this.mapWord(word));
  }

  /**
   * Map a single word from Corpus format to our schema
   */
  private mapWord(corpusWord: CorpusWordData): VerseWordInput {
    const features = corpusWord.morphology?.features || {};

    // Normalize Arabic text
    const arabicText = this.normalizeArabicText(corpusWord.segment);
    const textWithoutDiacritics = this.normalizeArabicText(corpusWord.segmentWithoutDiacritics);

    // Map POS (Part of Speech) - REQUIRED
    const posType = this.mapPOSType(corpusWord.morphology?.partOfSpeech, features.pos);

    // Map Gender
    const gender = this.mapGender(features.gender);

    // Map Number (singular/dual/plural)
    const number = this.mapNumber(features.number);

    // Map Definiteness
    const definiteness = this.mapDefiniteness(features.definiteness, features.definitenessType);

    // Map I'rab Case
    const irabCase = this.mapIrabCase(features.case, features.caseState, posType);

    // Map Case Sign
    const caseSign = this.mapCaseSign(features.caseSign, features.hasTanween);

    // Map Structure Type
    const structureType = this.mapStructureType(features.structureType, features.structureRole);

    return {
      position: corpusWord.position,
      arabicText,
      textWithoutDiacritics,
      translation: corpusWord.translation || `[Word ${corpusWord.position}]`,
      transliteration: corpusWord.transliteration,

      // 7 Essential Grammatical Properties
      posType: posType.english,
      posArabic: posType.arabic,

      gender: gender?.english,
      genderArabic: gender?.arabic,

      number: number?.english,
      numberArabic: number?.arabic,

      definiteness: definiteness?.english,
      definitenessArabic: definiteness?.arabic,

      irabCase: irabCase?.english,
      irabCaseArabic: irabCase?.arabic,

      caseSign: caseSign?.english,
      caseSignArabic: caseSign?.arabic,
      caseSignSymbol: caseSign?.symbol,

      structureType: structureType?.english,
      structureTypeArabic: structureType?.arabic,

      // Additional data
      root: corpusWord.morphology?.root,
      lemma: corpusWord.morphology?.lemma,

      // Store complete morphology data as JSON
      grammarData: {
        originalFeatures: features,
        syntax: corpusWord.syntax,
        pos: corpusWord.morphology?.partOfSpeech,
      },
    };
  }

  /**
   * Validate verse data
   */
  private validateVerse(verse: CorpusVerseData): void {
    if (!verse.surah || verse.surah < 1 || verse.surah > 114) {
      throw new QuranDataValidationError('Invalid surah number', 'surah', verse.surah);
    }

    if (!verse.ayah || verse.ayah < 1) {
      throw new QuranDataValidationError('Invalid ayah number', 'ayah', verse.ayah);
    }

    if (!verse.text || verse.text.trim().length === 0) {
      throw new QuranDataValidationError('Empty verse text', 'text', verse.text);
    }

    if (!verse.words || verse.words.length === 0) {
      throw new QuranDataValidationError('No words in verse', 'words', verse.words);
    }
  }

  /**
   * Normalize Arabic text using Unicode NFC normalization
   */
  private normalizeArabicText(text: string): string {
    if (!text) return '';
    return text.normalize('NFC').trim();
  }

  /**
   * Create search vector (simple lowercase for now)
   */
  private createSearchVector(text: string): string {
    return text.toLowerCase().trim();
  }

  /**
   * Map POS Type (noun/verb/particle)
   */
  private mapPOSType(
    partOfSpeech?: string,
    posFeature?: string,
  ): { english: string; arabic: string } {
    const pos = (partOfSpeech || posFeature || 'noun').toLowerCase();

    // Map variations to standardized values
    if (pos.includes('noun') || pos.includes('اسم') || pos === 'n') {
      return { english: 'noun', arabic: GRAMMAR_TRANSLATIONS.noun };
    }

    if (pos.includes('verb') || pos.includes('فعل') || pos === 'v') {
      return { english: 'verb', arabic: GRAMMAR_TRANSLATIONS.verb };
    }

    if (pos.includes('particle') || pos.includes('حرف') || pos === 'p') {
      return { english: 'particle', arabic: GRAMMAR_TRANSLATIONS.particle };
    }

    // Default to noun (most common)
    return { english: 'noun', arabic: GRAMMAR_TRANSLATIONS.noun };
  }

  /**
   * Map Gender (masculine/feminine)
   */
  private mapGender(gender?: string): { english: string; arabic: string } | null {
    if (!gender) return null;

    const g = gender.toLowerCase();

    if (g.includes('masc') || g === 'm' || g.includes('مذكر')) {
      return { english: 'masculine', arabic: GRAMMAR_TRANSLATIONS.masculine };
    }

    if (g.includes('fem') || g === 'f' || g.includes('مؤنث')) {
      return { english: 'feminine', arabic: GRAMMAR_TRANSLATIONS.feminine };
    }

    return null;
  }

  /**
   * Map Number (singular/dual/plural)
   */
  private mapNumber(number?: string): { english: string; arabic: string } | null {
    if (!number) return null;

    const n = number.toLowerCase();

    if (n.includes('sing') || n === 's' || n.includes('مفرد')) {
      return { english: 'singular', arabic: GRAMMAR_TRANSLATIONS.singular };
    }

    if (n.includes('dual') || n === 'd' || n.includes('مثنى')) {
      return { english: 'dual', arabic: GRAMMAR_TRANSLATIONS.dual };
    }

    if (n.includes('plur') || n === 'p' || n.includes('جمع')) {
      return { english: 'plural', arabic: GRAMMAR_TRANSLATIONS.plural };
    }

    return null;
  }

  /**
   * Map Definiteness (definite/indefinite)
   */
  private mapDefiniteness(
    definiteness?: string,
    definitenessType?: string,
  ): { english: string; arabic: string } | null {
    if (!definiteness) return null;

    const d = definiteness.toLowerCase();

    if (d.includes('def') || d.includes('معرفة')) {
      let english = 'definite';
      if (definitenessType) {
        english += ` (${definitenessType})`;
      }
      return { english, arabic: GRAMMAR_TRANSLATIONS.definite };
    }

    if (d.includes('indef') || d.includes('نكرة')) {
      return { english: 'indefinite', arabic: GRAMMAR_TRANSLATIONS.indefinite };
    }

    return null;
  }

  /**
   * Map I'rab Case (nominative/accusative/genitive/jussive)
   */
  private mapIrabCase(
    caseValue?: string,
    caseState?: string,
    posType?: { english: string; arabic: string },
  ): { english: string; arabic: string } | null {
    // If indeclinable (mabni), return that
    if (caseState === 'indeclinable' || caseState?.includes('مبني')) {
      return { english: 'indeclinable', arabic: GRAMMAR_TRANSLATIONS.indeclinable };
    }

    // Particles are always indeclinable
    if (posType?.english === 'particle') {
      return { english: 'indeclinable', arabic: GRAMMAR_TRANSLATIONS.indeclinable };
    }

    if (!caseValue) return null;

    const c = caseValue.toLowerCase();

    if (c.includes('nom') || c.includes('مرفوع')) {
      return { english: 'nominative', arabic: GRAMMAR_TRANSLATIONS.nominative };
    }

    if (c.includes('acc') || c.includes('منصوب')) {
      return { english: 'accusative', arabic: GRAMMAR_TRANSLATIONS.accusative };
    }

    if (c.includes('gen') || c.includes('مجرور')) {
      return { english: 'genitive', arabic: GRAMMAR_TRANSLATIONS.genitive };
    }

    if (c.includes('jus') || c.includes('مجزوم')) {
      return { english: 'jussive', arabic: GRAMMAR_TRANSLATIONS.jussive };
    }

    return null;
  }

  /**
   * Map Case Sign (damma/fatha/kasra/sukun)
   */
  private mapCaseSign(
    caseSign?: string,
    hasTanween?: boolean,
  ): { english: string; arabic: string; symbol: string } | null {
    if (!caseSign) return null;

    const c = caseSign.toLowerCase();

    if (c.includes('damma') || c.includes('ضمة') || c === 'u') {
      const arabicName = hasTanween ? 'تنوين ضم' : GRAMMAR_TRANSLATIONS.damma;
      const symbol = hasTanween ? CASE_SIGN_SYMBOLS.dammatain : CASE_SIGN_SYMBOLS.damma;
      return { english: 'damma', arabic: arabicName, symbol };
    }

    if (c.includes('fatha') || c.includes('فتحة') || c === 'a') {
      const arabicName = hasTanween ? 'تنوين فتح' : GRAMMAR_TRANSLATIONS.fatha;
      const symbol = hasTanween ? CASE_SIGN_SYMBOLS.fathatain : CASE_SIGN_SYMBOLS.fatha;
      return { english: 'fatha', arabic: arabicName, symbol };
    }

    if (c.includes('kasra') || c.includes('كسرة') || c === 'i') {
      const arabicName = hasTanween ? 'تنوين كسر' : GRAMMAR_TRANSLATIONS.kasra;
      const symbol = hasTanween ? CASE_SIGN_SYMBOLS.kasratain : CASE_SIGN_SYMBOLS.kasra;
      return { english: 'kasra', arabic: arabicName, symbol };
    }

    if (c.includes('sukun') || c.includes('سكون')) {
      return {
        english: 'sukun',
        arabic: GRAMMAR_TRANSLATIONS.sukun,
        symbol: CASE_SIGN_SYMBOLS.sukun,
      };
    }

    if (c.includes('alif') || c.includes('ألف')) {
      return { english: 'alif', arabic: GRAMMAR_TRANSLATIONS.alif, symbol: 'ا' };
    }

    if (c.includes('ya') || c.includes('ياء')) {
      return { english: 'ya', arabic: GRAMMAR_TRANSLATIONS.ya, symbol: 'ي' };
    }

    if (c.includes('waw') || c.includes('واو')) {
      return { english: 'waw', arabic: GRAMMAR_TRANSLATIONS.waw, symbol: 'و' };
    }

    return null;
  }

  /**
   * Map Structure Type (simple/idafa/prep_phrase)
   */
  private mapStructureType(
    structureType?: string,
    structureRole?: string,
  ): { english: string; arabic: string } | null {
    if (!structureType) return null;

    const s = structureType.toLowerCase();

    if (s.includes('simple') || s.includes('مفرد')) {
      return { english: 'simple', arabic: GRAMMAR_TRANSLATIONS.simple };
    }

    if (s.includes('idafa') || s.includes('إضافة')) {
      let english = 'idafa';
      if (structureRole?.includes('mudaf_ilayh') || structureRole?.includes('مضاف إليه')) {
        english = 'mudaf_ilayh';
      } else if (structureRole?.includes('mudaf') || structureRole?.includes('مضاف')) {
        english = 'mudaf';
      }
      return { english, arabic: GRAMMAR_TRANSLATIONS.idafa };
    }

    if (s.includes('prep') || s.includes('جار')) {
      return { english: 'prep_phrase', arabic: GRAMMAR_TRANSLATIONS.prep_phrase };
    }

    if (s.includes('adj') || s.includes('نعت')) {
      return { english: 'adjective_phrase', arabic: GRAMMAR_TRANSLATIONS.adjective_phrase };
    }

    return { english: 'simple', arabic: GRAMMAR_TRANSLATIONS.simple };
  }

  /**
   * Batch map multiple verses
   */
  mapVerses(corpusVerses: CorpusVerseData[]): {
    verses: VerseInput[];
    words: Map<string, VerseWordInput[]>; // Key: "surah:ayah"
  } {
    const verses: VerseInput[] = [];
    const words = new Map<string, VerseWordInput[]>();

    for (const corpusVerse of corpusVerses) {
      const verse = this.mapVerse(corpusVerse);
      const verseWords = this.mapVerseWords(corpusVerse);

      verses.push(verse);
      words.set(`${verse.surahNumber}:${verse.verseNumber}`, verseWords);
    }

    return { verses, words };
  }
}

/**
 * Export singleton instance
 */
export const quranCorpusMapper = new QuranCorpusMapper();
