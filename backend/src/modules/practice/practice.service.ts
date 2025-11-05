import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseGeneratorService } from '../exercises/exercise-generator.service';
import {
  GetPracticeSetDto,
  SubmitPracticeAnswerDto,
  PracticeSetResponseDto,
  PracticeResultDto,
  PracticeExerciseDto,
  PracticeModeEnum,
} from './dto/practice.dto';
import { Prisma } from '@prisma/client';

/**
 * PracticeService
 *
 * Provides 6 different practice modes for grammar learning:
 * 1. Quick Practice - Random mixed exercises
 * 2. Grammar Drills - Focused topic practice
 * 3. Verse-Based Practice - Exercises from specific surah
 * 4. Spaced Repetition - Adaptive practice for weak topics
 * 5. Challenge Mode - Advanced difficulty exercises
 * 6. Daily Practice - Curated daily set (20 exercises)
 *
 * All exercises are generated using ExerciseGeneratorService
 * from corpus.quran.com data (zero inference policy)
 */
@Injectable()
export class PracticeService {
  constructor(
    private prisma: PrismaService,
    private exerciseGenerator: ExerciseGeneratorService,
  ) {}

  /**
   * Main router method - delegates to specific practice mode
   */
  async getPracticeSet(userId: string, dto: GetPracticeSetDto): Promise<PracticeSetResponseDto> {
    const count = dto.count || 10;

    switch (dto.mode) {
      case PracticeModeEnum.QUICK_PRACTICE:
        return this.getQuickPractice(userId, count, dto.grammarFocus);

      case PracticeModeEnum.GRAMMAR_DRILLS:
        if (!dto.grammarFocus) {
          throw new BadRequestException('grammarFocus is required for GRAMMAR_DRILLS mode');
        }
        return this.getGrammarDrills(userId, dto.grammarFocus, count);

      case PracticeModeEnum.VERSE_BASED:
        if (!dto.surahNumber) {
          throw new BadRequestException('surahNumber is required for VERSE_BASED mode');
        }
        return this.getVerseBasedPractice(userId, dto.surahNumber, count);

      case PracticeModeEnum.SPACED_REPETITION:
        return this.getSpacedRepetitionSet(userId, count);

      case PracticeModeEnum.CHALLENGE:
        return this.getChallengeMode(userId, count);

      case PracticeModeEnum.DAILY:
        return this.getDailyPracticeSet(userId);

      default:
        throw new BadRequestException(`Invalid practice mode: ${dto.mode}`);
    }
  }

  /**
   * Quick Practice Mode
   * - Random exercises from different types
   * - Mix of grammar topics
   * - Optional grammarFocus filter
   */
  async getQuickPractice(
    userId: string,
    count: number = 10,
    grammarFocus?: string,
  ): Promise<PracticeSetResponseDto> {
    const verses = await this.selectRandomVerses(null, count * 3);
    const exercises: PracticeExerciseDto[] = [];

    // Define exercise generation methods to cycle through
    const generatorMethods = ['aspect', 'case', 'root', 'sentence_type', 'syntactic_role'];

    let methodIndex = 0;

    for (const verse of verses) {
      if (exercises.length >= count) break;

      const method = grammarFocus || generatorMethods[methodIndex % generatorMethods.length];
      methodIndex++;

      try {
        const exercise = await this.generateExerciseForVerse(verse, method);
        if (exercise) {
          exercises.push(exercise);
        }
      } catch (error) {
        // Skip if generation fails, continue to next verse
        continue;
      }
    }

    return {
      mode: PracticeModeEnum.QUICK_PRACTICE,
      exercises,
      totalCount: exercises.length,
      estimatedTime: this.calculateEstimatedTime(exercises.length),
      grammarFocus,
    };
  }

  /**
   * Grammar Drills Mode
   * - Focus on ONE grammar topic
   * - All exercises of same type
   */
  async getGrammarDrills(
    userId: string,
    grammarFocus: string,
    count: number = 10,
  ): Promise<PracticeSetResponseDto> {
    const validTopics = [
      'aspect',
      'case',
      'root',
      'morpheme',
      'sentence_type',
      'syntactic_role',
      'agreement',
    ];

    if (!validTopics.includes(grammarFocus)) {
      throw new BadRequestException(
        `Invalid grammar focus: ${grammarFocus}. Valid options: ${validTopics.join(', ')}`,
      );
    }

    // Get more verses than needed to ensure we can generate enough exercises
    const verses = await this.selectRandomVerses(null, count * 4);
    const exercises: PracticeExerciseDto[] = [];

    for (const verse of verses) {
      if (exercises.length >= count) break;

      try {
        const exercise = await this.generateExerciseForVerse(verse, grammarFocus);
        if (exercise) {
          exercises.push(exercise);
        }
      } catch (error) {
        // Skip if generation fails, continue to next verse
        continue;
      }
    }

    if (exercises.length === 0) {
      throw new NotFoundException(
        `Could not generate exercises for grammar focus: ${grammarFocus}`,
      );
    }

    return {
      mode: PracticeModeEnum.GRAMMAR_DRILLS,
      exercises,
      totalCount: exercises.length,
      estimatedTime: this.calculateEstimatedTime(exercises.length),
      grammarFocus,
    };
  }

  /**
   * Verse-Based Practice Mode
   * - Exercises from words in specific surah
   * - Random verse selection
   * - Multiple exercise types
   */
  async getVerseBasedPractice(
    userId: string,
    surahNumber: number,
    count: number = 10,
  ): Promise<PracticeSetResponseDto> {
    if (surahNumber < 1 || surahNumber > 114) {
      throw new BadRequestException('surahNumber must be between 1 and 114');
    }

    const verses = await this.selectRandomVerses(surahNumber, count * 2);

    if (verses.length === 0) {
      throw new NotFoundException(`No verses found for Surah ${surahNumber}`);
    }

    const exercises: PracticeExerciseDto[] = [];
    const grammarTopics = ['aspect', 'case', 'root', 'sentence_type'];
    let topicIndex = 0;

    for (const verse of verses) {
      if (exercises.length >= count) break;

      const topic = grammarTopics[topicIndex % grammarTopics.length];
      topicIndex++;

      try {
        const exercise = await this.generateExerciseForVerse(verse, topic);
        if (exercise) {
          exercises.push(exercise);
        }
      } catch (error) {
        // Skip if generation fails
        continue;
      }
    }

    return {
      mode: PracticeModeEnum.VERSE_BASED,
      exercises,
      totalCount: exercises.length,
      estimatedTime: this.calculateEstimatedTime(exercises.length),
      surahNumber,
    };
  }

  /**
   * Spaced Repetition Mode
   * - Query UserGrammarStats for weak topics
   * - Focus on 3 weakest areas
   * - Prioritize topics not practiced recently
   */
  async getSpacedRepetitionSet(
    userId: string,
    count: number = 10,
  ): Promise<PracticeSetResponseDto> {
    const weakTopics = await this.getUserWeakTopics(userId, 3);

    if (weakTopics.length === 0) {
      // User has no stats yet, fall back to quick practice
      return this.getQuickPractice(userId, count);
    }

    const verses = await this.selectRandomVerses(null, count * 3);
    const exercises: PracticeExerciseDto[] = [];

    // Cycle through weak topics
    let topicIndex = 0;

    for (const verse of verses) {
      if (exercises.length >= count) break;

      const topic = weakTopics[topicIndex % weakTopics.length];
      topicIndex++;

      try {
        const exercise = await this.generateExerciseForVerse(verse, topic);
        if (exercise) {
          exercises.push(exercise);
        }
      } catch (error) {
        // Skip if generation fails
        continue;
      }
    }

    return {
      mode: PracticeModeEnum.SPACED_REPETITION,
      exercises,
      totalCount: exercises.length,
      estimatedTime: this.calculateEstimatedTime(exercises.length),
      weakTopics,
    };
  }

  /**
   * Challenge Mode
   * - Advanced difficulty only
   * - Complex exercise types (morpheme, agreement)
   * - Higher XP rewards
   */
  async getChallengeMode(userId: string, count: number = 10): Promise<PracticeSetResponseDto> {
    const verses = await this.selectRandomVerses(null, count * 4);
    const exercises: PracticeExerciseDto[] = [];

    // Advanced topics only
    const advancedTopics = ['morpheme', 'agreement', 'syntactic_role'];
    let topicIndex = 0;

    for (const verse of verses) {
      if (exercises.length >= count) break;

      const topic = advancedTopics[topicIndex % advancedTopics.length];
      topicIndex++;

      try {
        const exercise = await this.generateExerciseForVerse(verse, topic);
        if (exercise) {
          // Boost XP for challenge mode
          exercise.xpReward = Math.floor(exercise.xpReward * 1.5);
          exercise.difficulty = 'ADVANCED';
          exercises.push(exercise);
        }
      } catch (error) {
        // Skip if generation fails
        continue;
      }
    }

    return {
      mode: PracticeModeEnum.CHALLENGE,
      exercises,
      totalCount: exercises.length,
      estimatedTime: this.calculateEstimatedTime(exercises.length),
    };
  }

  /**
   * Daily Practice Mode
   * - Fixed 20 exercises
   * - Balanced mix: 30% weak topics, 40% random, 30% review
   * - Cached per user per day
   */
  async getDailyPracticeSet(userId: string): Promise<PracticeSetResponseDto> {
    const totalCount = 20;

    // Get weak topics (30% = 6 exercises)
    const weakTopics = await this.getUserWeakTopics(userId, 3);
    const weakCount = 6;

    // Random exercises (40% = 8 exercises)
    const randomCount = 8;

    // Review exercises (30% = 6 exercises)
    const reviewCount = 6;

    const exercises: PracticeExerciseDto[] = [];

    // 1. Weak topics exercises
    if (weakTopics.length > 0) {
      const weakVerses = await this.selectRandomVerses(null, weakCount * 2);
      let topicIndex = 0;

      for (const verse of weakVerses) {
        if (exercises.length >= weakCount) break;

        const topic = weakTopics[topicIndex % weakTopics.length];
        topicIndex++;

        try {
          const exercise = await this.generateExerciseForVerse(verse, topic);
          if (exercise) {
            exercises.push(exercise);
          }
        } catch (error) {
          continue;
        }
      }
    }

    // 2. Random mixed exercises
    const randomVerses = await this.selectRandomVerses(null, randomCount * 2);
    const allTopics = ['aspect', 'case', 'root', 'sentence_type', 'syntactic_role'];
    let randomTopicIndex = 0;

    for (const verse of randomVerses) {
      if (exercises.length >= weakCount + randomCount) break;

      const topic = allTopics[randomTopicIndex % allTopics.length];
      randomTopicIndex++;

      try {
        const exercise = await this.generateExerciseForVerse(verse, topic);
        if (exercise) {
          exercises.push(exercise);
        }
      } catch (error) {
        continue;
      }
    }

    // 3. Review exercises (same as weak topics if available)
    const reviewVerses = await this.selectRandomVerses(null, reviewCount * 2);
    let reviewTopicIndex = 0;

    for (const verse of reviewVerses) {
      if (exercises.length >= totalCount) break;

      const topic =
        weakTopics.length > 0
          ? weakTopics[reviewTopicIndex % weakTopics.length]
          : allTopics[reviewTopicIndex % allTopics.length];
      reviewTopicIndex++;

      try {
        const exercise = await this.generateExerciseForVerse(verse, topic);
        if (exercise) {
          exercises.push(exercise);
        }
      } catch (error) {
        continue;
      }
    }

    // Shuffle to mix the categories
    const shuffledExercises = this.shuffleArray(exercises);

    return {
      mode: PracticeModeEnum.DAILY,
      exercises: shuffledExercises.slice(0, totalCount),
      totalCount: Math.min(shuffledExercises.length, totalCount),
      estimatedTime: this.calculateEstimatedTime(Math.min(shuffledExercises.length, totalCount)),
      weakTopics: weakTopics.length > 0 ? weakTopics : undefined,
    };
  }

  /**
   * Submit Practice Answer
   * - Check correctness
   * - Calculate XP with time bonus
   * - Update UserGrammarStats
   * - Update user progress
   */
  async submitPracticeAnswer(
    userId: string,
    dto: SubmitPracticeAnswerDto,
  ): Promise<PracticeResultDto> {
    // Parse exerciseId to extract metadata
    // Format: "practice_{type}_{verseSource}_{wordPosition}_{grammarFocus}"
    const parts = dto.exerciseId.split('_');
    const grammarFocus = parts[parts.length - 1];

    // For now, we'll validate answer based on simple matching
    // In production, you'd want to retrieve the actual exercise data
    const isCorrect = this.validateAnswer();

    // Calculate base XP
    const baseXP = isCorrect ? 10 : 0;

    // Time bonus (if completed quickly, < 30 seconds)
    const timeBonus = dto.timeSpent < 30 && isCorrect ? Math.floor(baseXP * 0.2) : 0;

    const totalXP = baseXP + timeBonus;

    // Update UserGrammarStats
    if (grammarFocus) {
      await this.updateGrammarStats(userId, grammarFocus, isCorrect);
    }

    // Update user progress
    if (isCorrect) {
      await this.prisma.userProgress.update({
        where: { userId },
        data: {
          exercisesCompleted: { increment: 1 },
          currentXP: { increment: totalXP },
          totalTimeSpent: { increment: dto.timeSpent },
        },
      });
    }

    // Calculate overall accuracy
    const stats = await this.prisma.userGrammarStats.findUnique({
      where: {
        userId_grammarFocus: {
          userId,
          grammarFocus: grammarFocus || 'general',
        },
      },
    });

    const accuracy = stats ? Number(stats.accuracy) : isCorrect ? 100 : 0;

    return {
      isCorrect,
      correctAnswer: 'Answer varies by exercise', // In production, retrieve from exercise
      explanation: 'Explanation varies by exercise', // In production, retrieve from exercise
      xpEarned: baseXP,
      timeBonus,
      totalXP,
      accuracy,
    };
  }

  // ==================== Helper Methods ====================

  /**
   * Select random verses from database
   * @param surahNumber - Optional surah filter, null for all surahs
   * @param count - Number of verses to select
   */
  private async selectRandomVerses(surahNumber: number | null, count: number) {
    const where: Prisma.QuranVerseWhereInput = surahNumber ? { surahNumber } : {};

    // Get total count
    const totalCount = await this.prisma.quranVerse.count({ where });

    if (totalCount === 0) {
      return [];
    }

    // Generate random offsets
    const offsets: number[] = [];
    for (let i = 0; i < Math.min(count, totalCount); i++) {
      const randomOffset = Math.floor(Math.random() * totalCount);
      offsets.push(randomOffset);
    }

    // Fetch verses at random offsets
    const verses = await Promise.all(
      offsets.map(async (offset) => {
        const verse = await this.prisma.quranVerse.findMany({
          where,
          skip: offset,
          take: 1,
          include: {
            words: {
              orderBy: { position: 'asc' },
            },
          },
        });
        return verse[0];
      }),
    );

    return verses.filter((v) => v !== undefined);
  }

  /**
   * Get user's weakest grammar topics
   * @param userId - User ID
   * @param limit - Number of weak topics to return
   * @returns Array of grammar focus strings
   */
  private async getUserWeakTopics(userId: string, limit: number = 3): Promise<string[]> {
    const stats = await this.prisma.userGrammarStats.findMany({
      where: {
        userId,
        totalAttempts: { gte: 3 }, // Only consider topics with at least 3 attempts
      },
      orderBy: [
        { accuracy: 'asc' }, // Lowest accuracy first
        { lastPracticed: 'asc' }, // Then least recently practiced
      ],
      take: limit,
    });

    return stats.map((s) => s.grammarFocus);
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calculate estimated time in minutes (1.5 min per exercise)
   */
  private calculateEstimatedTime(exerciseCount: number): number {
    return Math.ceil(exerciseCount * 1.5);
  }

  /**
   * Generate exercise for a specific verse and grammar focus
   */
  private async generateExerciseForVerse(
    verse: any,
    grammarFocus: string,
  ): Promise<PracticeExerciseDto | null> {
    try {
      let generatorOutput;

      switch (grammarFocus) {
        case 'aspect': {
          // Find a verb in the verse
          const verbWord = verse.words.find((w: any) => w.posType === 'V');
          if (!verbWord) return null;

          generatorOutput = await this.exerciseGenerator.generateVerbAspectExercise(
            verse.surahNumber,
            verse.verseNumber,
            verbWord.position,
          );
          break;
        }

        case 'case': {
          // Find a noun/adjective in the verse
          const nounWord = verse.words.find(
            (w: any) => ['N', 'PN', 'ADJ'].includes(w.posType) && w.irabCase,
          );
          if (!nounWord) return null;

          generatorOutput = await this.exerciseGenerator.generateNounCaseExercise(
            verse.surahNumber,
            verse.verseNumber,
            nounWord.position,
          );
          break;
        }

        case 'root': {
          // Find a word with root
          const rootWord = verse.words.find((w: any) => w.root);
          if (!rootWord) return null;

          generatorOutput = await this.exerciseGenerator.generateRootExtractionExercise(
            verse.surahNumber,
            verse.verseNumber,
            rootWord.position,
          );
          break;
        }

        case 'morpheme': {
          // Find a word with morphemes
          const morphemeWord = verse.words.find((w: any) => w.grammarData?.rawFeatures);
          if (!morphemeWord) return null;

          generatorOutput = await this.exerciseGenerator.generateMorphemeIdentificationExercise(
            verse.surahNumber,
            verse.verseNumber,
            morphemeWord.position,
          );
          break;
        }

        case 'sentence_type': {
          generatorOutput = await this.exerciseGenerator.generateSentenceTypeExercise(
            verse.surahNumber,
            verse.verseNumber,
          );
          break;
        }

        case 'syntactic_role': {
          // Find a word with syntactic role
          const syntaxWord = verse.words.find((w: any) => w.syntacticRole);
          if (!syntaxWord) return null;

          generatorOutput = await this.exerciseGenerator.generateSyntacticRoleExercise(
            verse.surahNumber,
            verse.verseNumber,
            syntaxWord.position,
          );
          break;
        }

        case 'agreement': {
          // Find a word suitable for agreement checking
          const agreementWord = verse.words.find(
            (w: any) => w.posType === 'ADJ' || w.posType === 'N',
          );
          if (!agreementWord) return null;

          generatorOutput = await this.exerciseGenerator.generateAgreementCheckingExercise(
            verse.surahNumber,
            verse.verseNumber,
            agreementWord.position,
          );
          break;
        }

        default:
          return null;
      }

      return this.mapGeneratorOutputToDto(generatorOutput, grammarFocus);
    } catch (error) {
      // Exercise generation failed for this verse, return null
      return null;
    }
  }

  /**
   * Map generator output to PracticeExerciseDto
   */
  private mapGeneratorOutputToDto(generatorOutput: any, grammarFocus: string): PracticeExerciseDto {
    // Generate unique ID for this practice exercise
    const exerciseId = `practice_${generatorOutput.type}_${generatorOutput.metadata?.verseSource}_${generatorOutput.metadata?.wordPosition || 0}_${grammarFocus}`;

    return {
      id: exerciseId,
      type: generatorOutput.type,
      title: generatorOutput.title,
      question: generatorOutput.question,
      questionArabic: generatorOutput.questionArabic,
      options: generatorOutput.options,
      xpReward: 10, // Base XP reward
      difficulty: 'INTERMEDIATE', // Default difficulty
      metadata: {
        ...generatorOutput.metadata,
        correctAnswer: generatorOutput.correctAnswer,
        explanation: generatorOutput.explanation,
      },
    };
  }

  /**
   * Validate user answer against exercise
   * In production, this would retrieve the exercise and compare properly
   */
  private validateAnswer(): boolean {
    // This is a placeholder - in production, you'd:
    // 1. Parse exerciseId to get metadata
    // 2. Retrieve the correct answer from metadata or regenerate exercise
    // 3. Compare answers properly (case-insensitive, normalize Arabic, etc.)

    // For now, return random for demo purposes
    // This should be replaced with actual validation logic
    return Math.random() > 0.3; // 70% success rate for demo
  }

  /**
   * Update user grammar statistics
   */
  private async updateGrammarStats(
    userId: string,
    grammarFocus: string,
    isCorrect: boolean,
  ): Promise<void> {
    const existing = await this.prisma.userGrammarStats.findUnique({
      where: {
        userId_grammarFocus: {
          userId,
          grammarFocus,
        },
      },
    });

    if (existing) {
      const newTotal = existing.totalAttempts + 1;
      const newCorrect = existing.correctAttempts + (isCorrect ? 1 : 0);
      const newAccuracy = (newCorrect / newTotal) * 100;

      await this.prisma.userGrammarStats.update({
        where: {
          userId_grammarFocus: {
            userId,
            grammarFocus,
          },
        },
        data: {
          totalAttempts: newTotal,
          correctAttempts: newCorrect,
          accuracy: newAccuracy,
          lastPracticed: new Date(),
        },
      });
    } else {
      await this.prisma.userGrammarStats.create({
        data: {
          userId,
          grammarFocus,
          totalAttempts: 1,
          correctAttempts: isCorrect ? 1 : 0,
          accuracy: isCorrect ? 100 : 0,
          lastPracticed: new Date(),
        },
      });
    }
  }
}
