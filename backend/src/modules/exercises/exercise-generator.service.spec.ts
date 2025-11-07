import { Test, TestingModule } from '@nestjs/testing';
import { ExerciseGeneratorService } from './exercise-generator.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseType } from '@prisma/client';

describe('ExerciseGeneratorService', () => {
  let service: ExerciseGeneratorService;

  const mockPrismaService = {
    quranVerse: {
      findUnique: jest.fn(),
    },
    verseWord: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExerciseGeneratorService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ExerciseGeneratorService>(ExerciseGeneratorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateVerbAspectExercise', () => {
    it('should generate a perfect verb aspect exercise', async () => {
      const mockVerse = {
        id: 'verse-1',
        surahNumber: 1,
        verseNumber: 1,
        words: [
          {
            id: 'word-1',
            position: 1,
            arabicText: 'قَالَ',
            translation: 'he said',
            posType: 'V',
            grammarData: {
              aspect: 'PERF',
              person: '3MS',
            },
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateVerbAspectExercise(1, 1, 1);

      expect(result).toEqual(
        expect.objectContaining({
          type: ExerciseType.VERB_CONJUGATION,
          question: expect.stringContaining('What is the aspect of the verb'),
          questionArabic: expect.stringContaining('ما هو زمن الفعل'),
          options: expect.arrayContaining([
            expect.objectContaining({ value: 'PERF' }),
            expect.objectContaining({ value: 'IMPF' }),
            expect.objectContaining({ value: 'IMPV' }),
          ]),
          correctAnswer: 'PERF',
          metadata: expect.objectContaining({
            grammarFocus: 'aspect',
            verseSource: '1:1',
            wordPosition: 1,
          }),
        }),
      );
    });

    it('should generate an imperfect verb aspect exercise', async () => {
      const mockVerse = {
        id: 'verse-2',
        words: [
          {
            id: 'word-2',
            position: 2,
            arabicText: 'يَقُولُ',
            posType: 'V',
            grammarData: {
              aspect: 'IMPF',
            },
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateVerbAspectExercise(2, 5, 2);

      expect(result.correctAnswer).toBe('IMPF');
      expect(result.metadata.grammarFocus).toBe('aspect');
    });

    it('should throw error if word is not a verb', async () => {
      const mockVerse = {
        id: 'verse-3',
        words: [
          {
            id: 'word-3',
            position: 3,
            posType: 'N', // Noun, not verb
            arabicText: 'كِتَابٌ',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      await expect(service.generateVerbAspectExercise(1, 1, 3)).rejects.toThrow('is not a verb');
    });

    it('should throw error if aspect data is missing', async () => {
      const mockVerse = {
        id: 'verse-4',
        words: [
          {
            id: 'word-4',
            position: 1,
            posType: 'V',
            arabicText: 'verb',
            grammarData: {}, // No aspect
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      await expect(service.generateVerbAspectExercise(1, 1, 1)).rejects.toThrow(
        'No aspect data available',
      );
    });

    it('should throw error if word not found', async () => {
      const mockVerse = {
        id: 'verse-5',
        words: [],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      await expect(service.generateVerbAspectExercise(1, 1, 999)).rejects.toThrow('not found');
    });
  });

  describe('generateNounCaseExercise', () => {
    it('should generate a nominative noun case exercise', async () => {
      const mockVerse = {
        id: 'verse-6',
        words: [
          {
            id: 'word-5',
            position: 1,
            arabicText: 'الْكِتَابُ',
            translation: 'the book',
            posType: 'N',
            irabCase: 'Nominative',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateNounCaseExercise(1, 2, 1);

      expect(result.type).toBe(ExerciseType.NOUN_DECLENSION);
      expect(result.question).toContain('grammatical case');
      expect(result.options).toHaveLength(3);
      expect(result.correctAnswer).toBe('Nominative');
      expect(result.metadata.grammarFocus).toBe('case');
    });

    it('should generate a genitive noun case exercise', async () => {
      const mockVerse = {
        id: 'verse-7',
        words: [
          {
            id: 'word-6',
            position: 2,
            arabicText: 'الْكِتَابِ',
            posType: 'N',
            irabCase: 'Genitive',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateNounCaseExercise(1, 1, 2);

      expect(result.correctAnswer).toBe('Genitive');
    });

    it('should work with adjectives', async () => {
      const mockVerse = {
        id: 'verse-8',
        words: [
          {
            id: 'word-7',
            position: 3,
            arabicText: 'كَبِيرٌ',
            posType: 'ADJ',
            irabCase: 'Nominative',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateNounCaseExercise(1, 1, 3);

      expect(result.type).toBe(ExerciseType.NOUN_DECLENSION);
      expect(result.correctAnswer).toBe('Nominative');
    });

    it('should throw error if word is not a noun/adjective', async () => {
      const mockVerse = {
        id: 'verse-9',
        words: [
          {
            id: 'word-8',
            position: 1,
            posType: 'V', // Verb, not noun
            arabicText: 'يَكْتُبُ',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      await expect(service.generateNounCaseExercise(1, 1, 1)).rejects.toThrow(
        'not a noun/adjective',
      );
    });
  });

  describe('generateRootExtractionExercise', () => {
    it('should generate root extraction exercise with distractors', async () => {
      const mockVerse = {
        id: 'verse-10',
        words: [
          {
            id: 'word-9',
            position: 1,
            arabicText: 'كَاتِبٌ',
            translation: 'writer',
            root: 'كتب',
          },
        ],
      };

      const mockRoots = [{ root: 'قرأ' }, { root: 'علم' }, { root: 'فهم' }];

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);
      mockPrismaService.verseWord.findMany.mockResolvedValue(mockRoots);

      const result = await service.generateRootExtractionExercise(1, 1, 1);

      expect(result.type).toBe(ExerciseType.ROOT_EXTRACTION);
      expect(result.question).toContain('root');
      expect(result.options).toHaveLength(4);
      expect(result.options.map((o: any) => o.value)).toContain('كتب');
      expect(result.correctAnswer).toBe('كتب');
      expect(result.metadata.grammarFocus).toBe('root');
    });

    it('should generate unique distractors', async () => {
      const mockVerse = {
        id: 'verse-11',
        words: [
          {
            id: 'word-10',
            position: 2,
            arabicText: 'مَكْتُوبٌ',
            root: 'كتب',
          },
        ],
      };

      const mockRoots = [{ root: 'درس' }, { root: 'فعل' }, { root: 'سمع' }];

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);
      mockPrismaService.verseWord.findMany.mockResolvedValue(mockRoots);

      const result = await service.generateRootExtractionExercise(1, 1, 2);

      const rootValues = result.options.map((o: any) => o.value);
      const uniqueRoots = new Set(rootValues);

      // All options should be unique
      expect(uniqueRoots.size).toBe(4);
      // Correct root should be in options
      expect(rootValues).toContain('كتب');
    });

    it('should throw error if root data is missing', async () => {
      const mockVerse = {
        id: 'verse-12',
        words: [
          {
            id: 'word-11',
            position: 1,
            arabicText: 'word',
            root: null,
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      await expect(service.generateRootExtractionExercise(1, 1, 1)).rejects.toThrow(
        'No root data available',
      );
    });
  });

  describe('generateMorphemeIdentificationExercise', () => {
    it('should generate morpheme identification exercise with PREFIX|STEM|SUFFIX', async () => {
      const mockVerseWithWord = {
        id: 'verse-1',
        surahNumber: 1,
        verseNumber: 1,
        words: [
          {
            id: 'word-12',
            position: 1,
            arabicText: 'وَكَاتِبٌ',
            translation: 'and writer',
            grammarData: {
              rawFeatures: 'PREFIX | w:CONJ+ | STEM | POS:N | SUFFIX | CASE:NOM',
            },
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerseWithWord);

      const result = await service.generateMorphemeIdentificationExercise(1, 1, 1);

      expect(result.type).toBe(ExerciseType.MORPHEME_IDENTIFICATION);
      expect(result.question).toContain('morphemes');
      expect(result.metadata.grammarFocus).toBe('morphemes');
      expect(result.metadata.morphemes).toBeDefined();
      expect(result.metadata.morphemes.length).toBeGreaterThan(1);
    });

    it('should throw error if word has simple structure (no affixes)', async () => {
      const mockVerseWithWord = {
        id: 'verse-1',
        words: [
          {
            id: 'word-13',
            position: 1,
            arabicText: 'كتاب',
            grammarData: {
              rawFeatures: 'STEM | كتاب',
            },
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerseWithWord);

      await expect(service.generateMorphemeIdentificationExercise(1, 1, 1)).rejects.toThrow(
        'has no affixes',
      );
    });

    it('should throw error if rawFeatures is missing', async () => {
      const mockVerseWithWord = {
        id: 'verse-1',
        words: [
          {
            id: 'word-14',
            position: 1,
            arabicText: 'word',
            grammarData: {},
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerseWithWord);

      await expect(service.generateMorphemeIdentificationExercise(1, 1, 1)).rejects.toThrow(
        'No morpheme data available',
      );
    });
  });

  describe('generateSentenceTypeExercise', () => {
    it('should identify verbal sentence (starts with verb)', async () => {
      const mockVerse = {
        id: 'verse-1',
        surahNumber: 1,
        verseNumber: 1,
        textArabic: 'قَالَ اللَّهُ',
        words: [
          { id: 'w1', position: 1, posType: 'V', arabicText: 'قَالَ' },
          { id: 'w2', position: 2, posType: 'N', arabicText: 'اللَّهُ' },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateSentenceTypeExercise(1, 1);

      expect(result.type).toBe(ExerciseType.SENTENCE_TYPE);
      expect(result.question).toContain('type of sentence');
      expect(result.correctAnswer).toBe('verbal');
      expect(result.options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: 'verbal' }),
          expect.objectContaining({ value: 'nominal' }),
        ]),
      );
    });

    it('should identify nominal sentence (starts with noun)', async () => {
      const mockVerse = {
        id: 'verse-2',
        surahNumber: 1,
        verseNumber: 2,
        textArabic: 'اللَّهُ رَحِيمٌ',
        words: [
          { id: 'w3', position: 1, posType: 'N', arabicText: 'اللَّهُ' },
          { id: 'w4', position: 2, posType: 'ADJ', arabicText: 'رَحِيمٌ' },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateSentenceTypeExercise(1, 2);

      expect(result.correctAnswer).toBe('nominal');
    });

    it('should throw error if verse not found', async () => {
      mockPrismaService.quranVerse.findUnique.mockResolvedValue(null);

      await expect(service.generateSentenceTypeExercise(1, 999)).rejects.toThrow(
        'Verse 1:999 not found',
      );
    });

    it('should throw error if verse has no words', async () => {
      const mockVerse = {
        id: 'verse-3',
        surahNumber: 1,
        verseNumber: 1,
        textArabic: '',
        words: [],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      await expect(service.generateSentenceTypeExercise(1, 1)).rejects.toThrow(
        'No words found for verse',
      );
    });
  });

  describe('generateSyntacticRoleExercise', () => {
    it('should generate syntactic role exercise for subject', async () => {
      const mockVerse = {
        id: 'verse-15',
        words: [
          {
            id: 'word-15',
            position: 1,
            arabicText: 'مُحَمَّدٌ',
            translation: 'Muhammad',
            syntacticRole: 'subject',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.generateSyntacticRoleExercise(1, 1, 1);

      expect(result.type).toBe(ExerciseType.SYNTACTIC_ROLE);
      expect(result.question).toContain('syntactic role');
      expect(result.correctAnswer).toBe('subject');
      expect(result.options.map((o: any) => o.value)).toContain('subject');
      expect(result.options.map((o: any) => o.value)).toContain('object');
      expect(result.options.map((o: any) => o.value)).toContain('predicate');
    });

    it('should throw error if syntactic role is missing', async () => {
      const mockVerse = {
        id: 'verse-16',
        words: [
          {
            id: 'word-16',
            position: 1,
            arabicText: 'word',
            syntacticRole: null,
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      await expect(service.generateSyntacticRoleExercise(1, 1, 1)).rejects.toThrow(
        'No syntactic role data available',
      );
    });
  });

  describe('generateAgreementCheckingExercise', () => {
    it('should generate agreement exercise with matching properties', async () => {
      const mockVerse = {
        id: 'verse-1',
        surahNumber: 1,
        verseNumber: 1,
        words: [
          {
            id: 'word-17',
            position: 1,
            arabicText: 'الْكِتَابُ',
            translation: 'the book',
            posType: 'N',
            gender: 'M',
            number: 'S',
            irabCase: 'Nominative',
            definiteness: 'DEF',
          },
          {
            id: 'word-18',
            position: 2,
            arabicText: 'جَمِيلٌ',
            translation: 'beautiful',
            posType: 'ADJ',
            gender: 'M',
            number: 'S',
            irabCase: 'Nominative',
            definiteness: 'INDEF',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique
        .mockResolvedValueOnce(mockVerse) // First call for getVerseWord
        .mockResolvedValueOnce(mockVerse); // Second call for getVerse

      const result = await service.generateAgreementCheckingExercise(1, 1, 1);

      expect(result.type).toBe(ExerciseType.AGREEMENT_CHECKING);
      expect(result.question).toContain('agree');
      expect(Array.isArray(result.correctAnswer)).toBe(true);
      expect(result.correctAnswer).toContain('gender');
      expect(result.correctAnswer).toContain('number');
      expect(result.correctAnswer).toContain('case');
    });

    it('should throw error if no related word found for agreement', async () => {
      const mockVerse = {
        id: 'verse-1',
        words: [
          {
            id: 'word-19',
            position: 1,
            arabicText: 'word',
            posType: 'N',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique
        .mockResolvedValueOnce(mockVerse)
        .mockResolvedValueOnce(mockVerse);

      await expect(service.generateAgreementCheckingExercise(1, 1, 1)).rejects.toThrow(
        'No related word found',
      );
    });

    it('should throw error if no agreement properties found', async () => {
      const mockVerse = {
        id: 'verse-1',
        words: [
          {
            id: 'word-20',
            position: 1,
            arabicText: 'word1',
            posType: 'N',
            parentWordId: 'word-21',
          },
          {
            id: 'word-21',
            position: 2,
            arabicText: 'word2',
            posType: 'ADJ',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique
        .mockResolvedValueOnce(mockVerse)
        .mockResolvedValueOnce(mockVerse);

      await expect(service.generateAgreementCheckingExercise(1, 1, 1)).rejects.toThrow(
        'No agreement properties found',
      );
    });
  });

  describe('Helper Methods', () => {
    describe('parseMorphemes', () => {
      it('should parse PREFIX|STEM|SUFFIX format', () => {
        const result = service['parseMorphemes'](
          'PREFIX | w:CONJ+ | STEM | POS:N | SUFFIX | CASE:NOM',
        );

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty('type');
        expect(result[0]).toHaveProperty('text');
      });

      it('should handle stem only', () => {
        const result = service['parseMorphemes']('STEM | كتاب');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0].type).toBe('STEM');
      });

      it('should handle multiple morphemes', () => {
        const result = service['parseMorphemes']('PREFIX | bi | STEM | kitab | SUFFIX | un');

        expect(result.length).toBe(3);
        expect(result.some((m) => m.type === 'PREFIX')).toBe(true);
        expect(result.some((m) => m.type === 'STEM')).toBe(true);
        expect(result.some((m) => m.type === 'SUFFIX')).toBe(true);
      });

      it('should return empty array for invalid format', () => {
        const result = service['parseMorphemes']('invalid format');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });
    });

    describe('generateRootDistractors', () => {
      it('should generate 3 unique distractor roots', async () => {
        const mockRoots = [
          { root: 'قرأ' },
          { root: 'علم' },
          { root: 'فهم' },
          { root: 'درس' },
          { root: 'سمع' },
        ];

        mockPrismaService.verseWord.findMany.mockResolvedValue(mockRoots);

        const distractors = await service['generateRootDistractors']('كتب');

        expect(distractors).toHaveLength(3);
        expect(distractors).not.toContain('كتب'); // Should not include correct root
        expect(new Set(distractors).size).toBe(3); // All unique
      });

      it('should handle limited available roots', async () => {
        const mockRoots = [{ root: 'قرأ' }, { root: 'علم' }];

        mockPrismaService.verseWord.findMany.mockResolvedValue(mockRoots);

        const distractors = await service['generateRootDistractors']('كتب');

        expect(distractors.length).toBeLessThanOrEqual(2);
      });
    });
  });
});
