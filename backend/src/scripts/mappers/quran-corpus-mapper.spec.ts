/**
 * Unit tests for QuranCorpusMapper
 *
 * Tests the transformation of Quranic Corpus data to our Prisma schema.
 */

import { QuranCorpusMapper } from './quran-corpus-mapper';
import { CorpusVerseData, CorpusWordData } from '../types/quran-corpus.types';

describe('QuranCorpusMapper', () => {
  let mapper: QuranCorpusMapper;

  beforeEach(() => {
    mapper = new QuranCorpusMapper();
  });

  describe('mapVerse', () => {
    it('should map a valid verse correctly', () => {
      const corpusVerse: CorpusVerseData = {
        surah: 1,
        ayah: 1,
        text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        textWithoutDiacritics: 'بسم الله الرحمن الرحيم',
        translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        transliteration: 'Bismillahi ar-rahmani ar-raheem',
        words: [
          {
            position: 1,
            segment: 'بِسْمِ',
            segmentWithoutDiacritics: 'بسم',
            translation: 'In the name',
            morphology: { partOfSpeech: 'noun', features: {} },
          },
        ],
      };

      const result = mapper.mapVerse(corpusVerse);

      expect(result.surahNumber).toBe(1);
      expect(result.verseNumber).toBe(1);
      expect(result.textArabic).toBe('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
      expect(result.textWithoutDiacritics).toBe('بسم الله الرحمن الرحيم');
      expect(result.translation).toBe(corpusVerse.translation);
      expect(result.transliteration).toBe(corpusVerse.transliteration);
      expect(result.searchVectorAr).toBeDefined();
      expect(result.searchVectorEn).toBeDefined();
    });

    it('should normalize Arabic text using Unicode NFC', () => {
      const corpusVerse: CorpusVerseData = {
        surah: 1,
        ayah: 1,
        text: 'بِسْمِ',
        textWithoutDiacritics: 'بسم',
        translation: 'In the name',
        words: [
          {
            position: 1,
            segment: 'بِسْمِ',
            segmentWithoutDiacritics: 'بسم',
            translation: 'In the name',
            morphology: { partOfSpeech: 'noun', features: {} },
          },
        ],
      };

      const result = mapper.mapVerse(corpusVerse);

      // Text should be normalized
      expect(result.textArabic).toBe(corpusVerse.text.normalize('NFC'));
    });

    it('should throw error for invalid surah number', () => {
      const corpusVerse: CorpusVerseData = {
        surah: 0, // Invalid
        ayah: 1,
        text: 'test',
        textWithoutDiacritics: 'test',
        translation: 'test',
        words: [],
      };

      expect(() => mapper.mapVerse(corpusVerse)).toThrow('Invalid surah number');
    });

    it('should throw error for empty verse text', () => {
      const corpusVerse: CorpusVerseData = {
        surah: 1,
        ayah: 1,
        text: '',
        textWithoutDiacritics: '',
        translation: 'test',
        words: [],
      };

      expect(() => mapper.mapVerse(corpusVerse)).toThrow('Empty verse text');
    });

    it('should throw error for no words', () => {
      const corpusVerse: CorpusVerseData = {
        surah: 1,
        ayah: 1,
        text: 'test',
        textWithoutDiacritics: 'test',
        translation: 'test',
        words: [],
      };

      expect(() => mapper.mapVerse(corpusVerse)).toThrow('No words in verse');
    });
  });

  describe('mapVerseWords', () => {
    it('should map all words in a verse', () => {
      const corpusVerse: CorpusVerseData = {
        surah: 1,
        ayah: 1,
        text: 'بِسْمِ ٱللَّهِ',
        textWithoutDiacritics: 'بسم الله',
        translation: 'In the name of Allah',
        words: [
          {
            position: 1,
            segment: 'بِسْمِ',
            segmentWithoutDiacritics: 'بسم',
            translation: 'in the name',
            morphology: {
              lemma: 'اسم',
              root: 'سمو',
              partOfSpeech: 'noun',
              features: {
                pos: 'noun',
                gender: 'masculine',
                number: 'singular',
                definiteness: 'definite',
                case: 'genitive',
                caseSign: 'kasra',
                structureType: 'simple',
              },
            },
          },
          {
            position: 2,
            segment: 'ٱللَّهِ',
            segmentWithoutDiacritics: 'الله',
            translation: 'Allah',
            morphology: {
              lemma: 'الله',
              root: 'اله',
              partOfSpeech: 'noun',
              features: {
                pos: 'noun',
                gender: 'masculine',
                number: 'singular',
                definiteness: 'definite',
                definitenessType: 'proper_noun',
                case: 'genitive',
                caseSign: 'kasra',
                structureType: 'simple',
              },
            },
          },
        ],
      };

      const result = mapper.mapVerseWords(corpusVerse);

      expect(result).toHaveLength(2);

      // First word
      expect(result[0].position).toBe(1);
      expect(result[0].arabicText).toBe('بِسْمِ');
      expect(result[0].posType).toBe('noun');
      expect(result[0].posArabic).toBe('اسم');
      expect(result[0].gender).toBe('masculine');
      expect(result[0].genderArabic).toBe('مذكر');
      expect(result[0].number).toBe('singular');
      expect(result[0].numberArabic).toBe('مفرد');
      expect(result[0].definiteness).toBe('definite');
      expect(result[0].definitenessArabic).toBe('معرفة');
      expect(result[0].irabCase).toBe('genitive');
      expect(result[0].irabCaseArabic).toBe('مجرور');
      expect(result[0].caseSign).toBe('kasra');
      expect(result[0].caseSignArabic).toBe('كسرة');
      expect(result[0].caseSignSymbol).toBe('ِ');
      expect(result[0].structureType).toBe('simple');
      expect(result[0].structureTypeArabic).toBe('مفرد');
      expect(result[0].root).toBe('سمو');
      expect(result[0].lemma).toBe('اسم');

      // Second word
      expect(result[1].position).toBe(2);
      expect(result[1].arabicText).toBe('ٱللَّهِ');
      expect(result[1].definiteness).toBe('definite (proper_noun)');
    });

    it('should handle words with missing morphology gracefully', () => {
      const corpusVerse: CorpusVerseData = {
        surah: 1,
        ayah: 1,
        text: 'و',
        textWithoutDiacritics: 'و',
        translation: 'and',
        words: [
          {
            position: 1,
            segment: 'و',
            segmentWithoutDiacritics: 'و',
            translation: 'and',
            morphology: {
              partOfSpeech: 'particle',
              features: {}, // Empty features
            },
          },
        ],
      };

      const result = mapper.mapVerseWords(corpusVerse);

      expect(result).toHaveLength(1);
      expect(result[0].posType).toBe('particle');
      expect(result[0].posArabic).toBe('حرف');
      expect(result[0].gender).toBeUndefined(); // Particles don't have gender
      expect(result[0].number).toBeUndefined(); // Particles don't have number
      expect(result[0].irabCase).toBe('indeclinable'); // Particles are always indeclinable
    });
  });

  describe('POS mapping', () => {
    it('should map "noun" variations correctly', () => {
      const testCases = [
        { input: 'noun', expected: 'noun' },
        { input: 'NOUN', expected: 'noun' },
        { input: 'n', expected: 'noun' },
        { input: 'اسم', expected: 'noun' },
      ];

      testCases.forEach(({ input, expected }) => {
        const word: CorpusWordData = {
          position: 1,
          segment: 'test',
          segmentWithoutDiacritics: 'test',
          translation: 'test',
          morphology: {
            partOfSpeech: input,
            features: {},
          },
        };

        const result = (mapper as any).mapWord(word);
        expect(result.posType).toBe(expected);
      });
    });

    it('should map "verb" variations correctly', () => {
      const testCases = [
        { input: 'verb', expected: 'verb' },
        { input: 'VERB', expected: 'verb' },
        { input: 'v', expected: 'verb' },
        { input: 'فعل', expected: 'verb' },
      ];

      testCases.forEach(({ input, expected }) => {
        const word: CorpusWordData = {
          position: 1,
          segment: 'test',
          segmentWithoutDiacritics: 'test',
          translation: 'test',
          morphology: {
            partOfSpeech: input,
            features: {},
          },
        };

        const result = (mapper as any).mapWord(word);
        expect(result.posType).toBe(expected);
      });
    });

    it('should map "particle" variations correctly', () => {
      const testCases = [
        { input: 'particle', expected: 'particle' },
        { input: 'PARTICLE', expected: 'particle' },
        { input: 'p', expected: 'particle' },
        { input: 'حرف', expected: 'particle' },
      ];

      testCases.forEach(({ input, expected }) => {
        const word: CorpusWordData = {
          position: 1,
          segment: 'test',
          segmentWithoutDiacritics: 'test',
          translation: 'test',
          morphology: {
            partOfSpeech: input,
            features: {},
          },
        };

        const result = (mapper as any).mapWord(word);
        expect(result.posType).toBe(expected);
      });
    });
  });

  describe('Gender mapping', () => {
    it('should map masculine variations', () => {
      const variations = ['masculine', 'masc', 'm', 'مذكر'];

      variations.forEach((input) => {
        const word: CorpusWordData = {
          position: 1,
          segment: 'test',
          segmentWithoutDiacritics: 'test',
          translation: 'test',
          morphology: {
            partOfSpeech: 'noun',
            features: { gender: input as any },
          },
        };

        const result = (mapper as any).mapWord(word);
        expect(result.gender).toBe('masculine');
        expect(result.genderArabic).toBe('مذكر');
      });
    });

    it('should map feminine variations', () => {
      const variations = ['feminine', 'fem', 'f', 'مؤنث'];

      variations.forEach((input) => {
        const word: CorpusWordData = {
          position: 1,
          segment: 'test',
          segmentWithoutDiacritics: 'test',
          translation: 'test',
          morphology: {
            partOfSpeech: 'noun',
            features: { gender: input as any },
          },
        };

        const result = (mapper as any).mapWord(word);
        expect(result.gender).toBe('feminine');
        expect(result.genderArabic).toBe('مؤنث');
      });
    });

    it('should return null for missing gender', () => {
      const word: CorpusWordData = {
        position: 1,
        segment: 'test',
        segmentWithoutDiacritics: 'test',
        translation: 'test',
        morphology: {
          partOfSpeech: 'noun',
          features: {},
        },
      };

      const result = (mapper as any).mapWord(word);
      expect(result.gender).toBeUndefined();
    });
  });

  describe('Number mapping', () => {
    it('should map singular/dual/plural correctly', () => {
      const testCases = [
        { input: 'singular', expected: 'singular', arabic: 'مفرد' },
        { input: 'dual', expected: 'dual', arabic: 'مثنى' },
        { input: 'plural', expected: 'plural', arabic: 'جمع' },
        { input: 's', expected: 'singular', arabic: 'مفرد' },
        { input: 'd', expected: 'dual', arabic: 'مثنى' },
        { input: 'p', expected: 'plural', arabic: 'جمع' },
      ];

      testCases.forEach(({ input, expected, arabic }) => {
        const word: CorpusWordData = {
          position: 1,
          segment: 'test',
          segmentWithoutDiacritics: 'test',
          translation: 'test',
          morphology: {
            partOfSpeech: 'noun',
            features: { number: input as any },
          },
        };

        const result = (mapper as any).mapWord(word);
        expect(result.number).toBe(expected);
        expect(result.numberArabic).toBe(arabic);
      });
    });
  });

  describe("I'rab Case mapping", () => {
    it('should map nominative case', () => {
      const word: CorpusWordData = {
        position: 1,
        segment: 'test',
        segmentWithoutDiacritics: 'test',
        translation: 'test',
        morphology: {
          partOfSpeech: 'noun',
          features: { case: 'nominative' },
        },
      };

      const result = (mapper as any).mapWord(word);
      expect(result.irabCase).toBe('nominative');
      expect(result.irabCaseArabic).toBe('مرفوع');
    });

    it('should map particles as indeclinable', () => {
      const word: CorpusWordData = {
        position: 1,
        segment: 'و',
        segmentWithoutDiacritics: 'و',
        translation: 'and',
        morphology: {
          partOfSpeech: 'particle',
          features: {},
        },
      };

      const result = (mapper as any).mapWord(word);
      expect(result.irabCase).toBe('indeclinable');
      expect(result.irabCaseArabic).toBe('مبني');
    });
  });

  describe('Case Sign mapping', () => {
    it('should map damma without tanween', () => {
      const word: CorpusWordData = {
        position: 1,
        segment: 'test',
        segmentWithoutDiacritics: 'test',
        translation: 'test',
        morphology: {
          partOfSpeech: 'noun',
          features: { caseSign: 'damma', hasTanween: false },
        },
      };

      const result = (mapper as any).mapWord(word);
      expect(result.caseSign).toBe('damma');
      expect(result.caseSignArabic).toBe('ضمة');
      expect(result.caseSignSymbol).toBe('ُ');
    });

    it('should map damma with tanween', () => {
      const word: CorpusWordData = {
        position: 1,
        segment: 'test',
        segmentWithoutDiacritics: 'test',
        translation: 'test',
        morphology: {
          partOfSpeech: 'noun',
          features: { caseSign: 'damma', hasTanween: true },
        },
      };

      const result = (mapper as any).mapWord(word);
      expect(result.caseSign).toBe('damma');
      expect(result.caseSignArabic).toBe('تنوين ضم');
      expect(result.caseSignSymbol).toBe('ٌ');
    });
  });

  describe('Batch mapping', () => {
    it('should map multiple verses correctly', () => {
      const corpusVerses: CorpusVerseData[] = [
        {
          surah: 1,
          ayah: 1,
          text: 'test1',
          textWithoutDiacritics: 'test1',
          translation: 'test1',
          words: [
            {
              position: 1,
              segment: 'word1',
              segmentWithoutDiacritics: 'word1',
              translation: 'word1',
              morphology: { partOfSpeech: 'noun', features: {} },
            },
          ],
        },
        {
          surah: 1,
          ayah: 2,
          text: 'test2',
          textWithoutDiacritics: 'test2',
          translation: 'test2',
          words: [
            {
              position: 1,
              segment: 'word2',
              segmentWithoutDiacritics: 'word2',
              translation: 'word2',
              morphology: { partOfSpeech: 'verb', features: {} },
            },
          ],
        },
      ];

      const result = mapper.mapVerses(corpusVerses);

      expect(result.verses).toHaveLength(2);
      expect(result.words.size).toBe(2);
      expect(result.words.get('1:1')).toHaveLength(1);
      expect(result.words.get('1:2')).toHaveLength(1);
    });
  });
});
