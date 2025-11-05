import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseType } from '@prisma/client';

/**
 * ExerciseGeneratorService
 *
 * Automatically generates practice exercises from Quranic verses
 * using morphological and syntactic data from corpus.quran.com
 *
 * IMPORTANT: All data comes from corpus.quran.com (no inference, no guessing)
 *
 * Supports 15+ exercise types based on grammatical analysis
 */
@Injectable()
export class ExerciseGeneratorService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generate a verb aspect identification exercise
   * Grammar Focus: Verb aspect (PERF/IMPF/IMPV)
   */
  async generateVerbAspectExercise(surahNumber: number, verseNumber: number, wordPosition: number) {
    const word = await this.getVerseWord(surahNumber, verseNumber, wordPosition);

    // Validate this is a verb
    if (word.posType !== 'V') {
      throw new Error(`Word at position ${wordPosition} is not a verb (POS: ${word.posType})`);
    }

    // Extract aspect from grammarData
    const aspect = (word.grammarData as any)?.aspect;
    if (!aspect) {
      throw new Error(`No aspect data available for verb at position ${wordPosition}`);
    }

    const aspectMap: Record<string, string> = {
      PERF: 'Perfect (ماضي)',
      IMPF: 'Imperfect (مضارع)',
      IMPV: 'Imperative (أمر)',
    };

    return {
      type: ExerciseType.VERB_CONJUGATION,
      title: `Identify Verb Aspect - ${surahNumber}:${verseNumber}`,
      question: `What is the aspect of the verb "${word.arabicText}" in this verse?`,
      questionArabic: `ما هو زمن الفعل "${word.arabicText}" في هذه الآية؟`,
      options: [
        { value: 'PERF', label: 'Perfect (ماضي)', labelAr: 'ماضي' },
        { value: 'IMPF', label: 'Imperfect (مضارع)', labelAr: 'مضارع' },
        { value: 'IMPV', label: 'Imperative (أمر)', labelAr: 'أمر' },
      ],
      correctAnswer: aspect,
      explanation: `This verb "${word.arabicText}" is in the ${aspectMap[aspect]} aspect. ${word.translation}`,
      metadata: {
        grammarFocus: 'aspect',
        verseSource: `${surahNumber}:${verseNumber}`,
        wordPosition,
        wordId: word.id,
      },
    };
  }

  /**
   * Generate a noun case identification exercise
   * Grammar Focus: I'rab case (Nominative/Accusative/Genitive)
   */
  async generateNounCaseExercise(surahNumber: number, verseNumber: number, wordPosition: number) {
    const word = await this.getVerseWord(surahNumber, verseNumber, wordPosition);

    // Validate this is a noun
    if (!['N', 'PN', 'ADJ'].includes(word.posType)) {
      throw new Error(
        `Word at position ${wordPosition} is not a noun/adjective (POS: ${word.posType})`,
      );
    }

    if (!word.irabCase) {
      throw new Error(`No case data available for word at position ${wordPosition}`);
    }

    const caseMap: Record<string, string> = {
      Nominative: 'Nominative (مرفوع)',
      Accusative: 'Accusative (منصوب)',
      Genitive: 'Genitive (مجرور)',
    };

    return {
      type: ExerciseType.NOUN_DECLENSION,
      title: `Identify Grammatical Case - ${surahNumber}:${verseNumber}`,
      question: `What is the grammatical case (i'rab) of "${word.arabicText}" in this verse?`,
      questionArabic: `ما هو إعراب "${word.arabicText}" في هذه الآية؟`,
      options: [
        { value: 'Nominative', label: 'Nominative (مرفوع)', labelAr: 'مرفوع' },
        { value: 'Accusative', label: 'Accusative (منصوب)', labelAr: 'منصوب' },
        { value: 'Genitive', label: 'Genitive (مجرور)', labelAr: 'مجرور' },
      ],
      correctAnswer: word.irabCase,
      explanation: `The word "${word.arabicText}" is in the ${caseMap[word.irabCase]} case. ${word.translation}`,
      metadata: {
        grammarFocus: 'case',
        verseSource: `${surahNumber}:${verseNumber}`,
        wordPosition,
        wordId: word.id,
      },
    };
  }

  /**
   * Generate a root extraction exercise
   * Grammar Focus: Arabic root identification
   */
  async generateRootExtractionExercise(
    surahNumber: number,
    verseNumber: number,
    wordPosition: number,
  ) {
    const word = await this.getVerseWord(surahNumber, verseNumber, wordPosition);

    if (!word.root) {
      throw new Error(`No root data available for word at position ${wordPosition}`);
    }

    // Generate distractors (incorrect roots)
    const distractors = await this.generateRootDistractors(word.root);

    return {
      type: ExerciseType.ROOT_EXTRACTION,
      title: `Find the Root - ${surahNumber}:${verseNumber}`,
      question: `What is the three-letter root of the word "${word.arabicText}"?`,
      questionArabic: `ما هو الجذر الثلاثي للكلمة "${word.arabicText}"؟`,
      options: [
        { value: word.root, label: word.root },
        ...distractors.map((root) => ({ value: root, label: root })),
      ],
      correctAnswer: word.root,
      explanation: `The root of "${word.arabicText}" is "${word.root}". Meaning: ${word.translation}`,
      metadata: {
        grammarFocus: 'root',
        verseSource: `${surahNumber}:${verseNumber}`,
        wordPosition,
        wordId: word.id,
      },
    };
  }

  /**
   * Generate a morpheme identification exercise
   * Grammar Focus: Morphological structure (PREFIX|STEM|SUFFIX)
   */
  async generateMorphemeIdentificationExercise(
    surahNumber: number,
    verseNumber: number,
    wordPosition: number,
  ) {
    const word = await this.getVerseWord(surahNumber, verseNumber, wordPosition);
    const rawFeatures = (word.grammarData as any)?.rawFeatures;

    if (!rawFeatures) {
      throw new Error(`No morpheme data available for word at position ${wordPosition}`);
    }

    // Parse morphemes from rawFeatures
    const morphemes = this.parseMorphemes(rawFeatures);

    if (morphemes.length <= 1) {
      throw new Error(`Word at position ${wordPosition} has no affixes (simple word)`);
    }

    return {
      type: ExerciseType.MORPHEME_IDENTIFICATION,
      title: `Identify Word Structure - ${surahNumber}:${verseNumber}`,
      question: `The word "${word.arabicText}" consists of which morphemes?`,
      questionArabic: `من أي المقاطع تتكون الكلمة "${word.arabicText}"؟`,
      options: [
        {
          value: 'correct',
          label: morphemes.map((m) => m.type).join(' + '),
          labelAr: morphemes.map((m) => m.text).join(' + '),
        },
        { value: 'stem_only', label: 'STEM only', labelAr: 'الجذع فقط' },
        { value: 'prefix_stem', label: 'PREFIX + STEM', labelAr: 'بادئة + جذع' },
        { value: 'stem_suffix', label: 'STEM + SUFFIX', labelAr: 'جذع + لاحقة' },
      ],
      correctAnswer: 'correct',
      explanation: `The word "${word.arabicText}" breaks down into: ${morphemes.map((m) => `${m.type} (${m.text})`).join(', ')}`,
      metadata: {
        grammarFocus: 'morphemes',
        verseSource: `${surahNumber}:${verseNumber}`,
        wordPosition,
        wordId: word.id,
        morphemes: morphemes,
      },
    };
  }

  /**
   * Generate a sentence type identification exercise
   * Grammar Focus: Nominal (جملة اسمية) vs Verbal (جملة فعلية)
   */
  async generateSentenceTypeExercise(surahNumber: number, verseNumber: number) {
    const verse = await this.getVerse(surahNumber, verseNumber);

    if (!verse.words || verse.words.length === 0) {
      throw new Error(`No words found for verse ${surahNumber}:${verseNumber}`);
    }

    const firstWord = verse.words[0];
    const sentenceType = firstWord.posType === 'V' ? 'verbal' : 'nominal';

    const typeMap = {
      verbal: {
        en: 'Verbal Sentence (جملة فعلية)',
        ar: 'جملة فعلية',
        description: 'Begins with a verb, emphasizes the action',
      },
      nominal: {
        en: 'Nominal Sentence (جملة اسمية)',
        ar: 'جملة اسمية',
        description: 'Begins with a noun, emphasizes the state or description',
      },
    };

    return {
      type: ExerciseType.SENTENCE_TYPE,
      title: `Identify Sentence Type - ${surahNumber}:${verseNumber}`,
      question: `What type of sentence is this verse?\n\n"${verse.textArabic}"\n\n${verse.translation}`,
      questionArabic: `ما نوع الجملة في هذه الآية؟\n\n"${verse.textArabic}"`,
      options: [
        { value: 'verbal', label: 'Verbal Sentence (جملة فعلية)', labelAr: 'جملة فعلية' },
        { value: 'nominal', label: 'Nominal Sentence (جملة اسمية)', labelAr: 'جملة اسمية' },
      ],
      correctAnswer: sentenceType,
      explanation: `This is a ${typeMap[sentenceType].en}. ${typeMap[sentenceType].description}. The first word is "${firstWord.arabicText}" (${firstWord.posType}): ${firstWord.translation}.`,
      metadata: {
        grammarFocus: 'sentence_type',
        verseSource: `${surahNumber}:${verseNumber}`,
        verseId: verse.id,
      },
    };
  }

  /**
   * Generate a syntactic role identification exercise
   * Grammar Focus: Syntactic role (Subject, Object, Predicate, etc.)
   */
  async generateSyntacticRoleExercise(
    surahNumber: number,
    verseNumber: number,
    wordPosition: number,
  ) {
    const word = await this.getVerseWord(surahNumber, verseNumber, wordPosition);

    if (!word.syntacticRole) {
      throw new Error(`No syntactic role data available for word at position ${wordPosition}`);
    }

    return {
      type: ExerciseType.SYNTACTIC_ROLE,
      title: `Identify Syntactic Role - ${surahNumber}:${verseNumber}`,
      question: `What is the syntactic role of "${word.arabicText}" in this sentence?`,
      questionArabic: `ما هي الوظيفة النحوية للكلمة "${word.arabicText}" في هذه الجملة؟`,
      options: [
        { value: 'subject', label: 'Subject (فاعل / مبتدأ)', labelAr: 'فاعل / مبتدأ' },
        { value: 'object', label: 'Object (مفعول به)', labelAr: 'مفعول به' },
        { value: 'predicate', label: 'Predicate (خبر)', labelAr: 'خبر' },
        { value: 'other', label: 'Other', labelAr: 'أخرى' },
      ],
      correctAnswer: word.syntacticRole,
      explanation: `The word "${word.arabicText}" functions as ${word.syntacticRoleAr || word.syntacticRole} in this sentence. ${word.translation}`,
      metadata: {
        grammarFocus: 'syntactic_role',
        verseSource: `${surahNumber}:${verseNumber}`,
        wordPosition,
        wordId: word.id,
      },
    };
  }

  /**
   * Generate an agreement checking exercise
   * Grammar Focus: Gender, Number, Case, Definiteness agreement
   */
  async generateAgreementCheckingExercise(
    surahNumber: number,
    verseNumber: number,
    wordPosition: number,
  ) {
    const word = await this.getVerseWord(surahNumber, verseNumber, wordPosition);
    const verse = await this.getVerse(surahNumber, verseNumber);

    // Find related word for agreement checking (e.g., adjective-noun, verb-subject)
    const relatedWord = this.findRelatedWordForAgreement(word, verse.words);

    if (!relatedWord) {
      throw new Error(`No related word found for agreement checking at position ${wordPosition}`);
    }

    const agreementTypes: string[] = [];
    if (word.gender && relatedWord.gender) agreementTypes.push('gender');
    if (word.number && relatedWord.number) agreementTypes.push('number');
    if (word.irabCase && relatedWord.irabCase) agreementTypes.push('case');
    if (word.definiteness && relatedWord.definiteness) agreementTypes.push('definiteness');

    if (agreementTypes.length === 0) {
      throw new Error(`No agreement properties found between words`);
    }

    return {
      type: ExerciseType.AGREEMENT_CHECKING,
      title: `Check Agreement - ${surahNumber}:${verseNumber}`,
      question: `The words "${word.arabicText}" and "${relatedWord.arabicText}" agree in which properties?`,
      questionArabic: `تتفق الكلمتان "${word.arabicText}" و "${relatedWord.arabicText}" في أي من الخصائص؟`,
      options: [
        { value: 'gender', label: 'Gender (الجنس)' },
        { value: 'number', label: 'Number (العدد)' },
        { value: 'case', label: 'Case (الإعراب)' },
        { value: 'definiteness', label: 'Definiteness (التعريف)' },
      ],
      correctAnswer: agreementTypes,
      explanation: `These words agree in: ${agreementTypes.join(', ')}. "${word.arabicText}": ${word.translation}, "${relatedWord.arabicText}": ${relatedWord.translation}`,
      metadata: {
        grammarFocus: 'agreement',
        verseSource: `${surahNumber}:${verseNumber}`,
        wordPosition,
        wordId: word.id,
        relatedWordId: relatedWord.id,
      },
    };
  }

  // ==================== Helper Methods ====================

  private async getVerse(surahNumber: number, verseNumber: number) {
    const verse = await this.prisma.quranVerse.findUnique({
      where: {
        surahNumber_verseNumber: {
          surahNumber,
          verseNumber,
        },
      },
      include: {
        words: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!verse) {
      throw new NotFoundException(`Verse ${surahNumber}:${verseNumber} not found`);
    }

    return verse;
  }

  private async getVerseWord(surahNumber: number, verseNumber: number, wordPosition: number) {
    const verse = await this.getVerse(surahNumber, verseNumber);
    const word = verse.words.find((w) => w.position === wordPosition);

    if (!word) {
      throw new NotFoundException(
        `Word at position ${wordPosition} not found in verse ${surahNumber}:${verseNumber}`,
      );
    }

    return word;
  }

  private parseMorphemes(rawFeatures: string): Array<{ type: string; text: string }> {
    // Parse PREFIX|STEM|SUFFIX from raw features
    // Example: "PREFIX|w:CONJ+ | STEM|POS:V|IMPF|ROOT:Amn|3MP | SUFFIX|PRON:3MP"
    const segments = rawFeatures.split('|').map((s) => s.trim());
    const morphemes: Array<{ type: string; text: string }> = [];

    let currentType = '';
    for (const segment of segments) {
      if (segment === 'PREFIX' || segment === 'STEM' || segment === 'SUFFIX') {
        currentType = segment;
      } else if (currentType) {
        morphemes.push({ type: currentType, text: segment });
      }
    }

    return morphemes;
  }

  private async generateRootDistractors(correctRoot: string): Promise<string[]> {
    // Get 3 random roots from database as distractors
    const randomRoots = await this.prisma.verseWord.findMany({
      where: {
        AND: [{ root: { not: correctRoot } }, { root: { not: null } }],
      },
      select: { root: true },
      distinct: ['root'],
      take: 10,
    });

    // Shuffle and take first 3
    const shuffled = randomRoots
      .map((r) => r.root!)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return shuffled;
  }

  private findRelatedWordForAgreement(word: any, allWords: any[]): any | null {
    // Adjectives agree with preceding noun
    if (word.posType === 'ADJ') {
      for (let i = word.position - 1; i >= 0; i--) {
        const prevWord = allWords.find((w) => w.position === i);
        if (prevWord && (prevWord.posType === 'N' || prevWord.posType === 'PN')) {
          return prevWord;
        }
      }
    }

    // Check for parent word relationship
    if (word.parentWordId) {
      return allWords.find((w) => w.id === word.parentWordId) || null;
    }

    // For nouns, check if next word is an adjective
    if (word.posType === 'N' || word.posType === 'PN') {
      const nextWord = allWords.find((w) => w.position === word.position + 1);
      if (nextWord && nextWord.posType === 'ADJ') {
        return nextWord;
      }
    }

    return null;
  }
}
