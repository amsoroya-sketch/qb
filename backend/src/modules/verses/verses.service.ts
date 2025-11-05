import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FindVersesDto, SearchVersesDto } from './dto';

@Injectable()
export class VersesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindVersesDto) {
    const { page = 1, limit = 20, surahNumber } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (surahNumber) where.surahNumber = surahNumber;

    const [verses, total] = await Promise.all([
      this.prisma.quranVerse.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
        include: {
          words: {
            orderBy: { position: 'asc' },
          },
        },
      }),
      this.prisma.quranVerse.count({ where }),
    ]);

    return {
      data: verses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(surahNumber: number, verseNumber: number) {
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

  async getWordAnalysis(wordId: string) {
    const word = await this.prisma.verseWord.findUnique({
      where: { id: wordId },
      include: {
        verse: {
          select: {
            surahNumber: true,
            verseNumber: true,
            textArabic: true,
          },
        },
      },
    });

    if (!word) {
      throw new NotFoundException(`Word with ID ${wordId} not found`);
    }

    return {
      ...word,
      grammaticalAnalysis: {
        partOfSpeech: word.posType,
        gender: word.gender,
        number: word.number,
        definiteness: word.definiteness,
        case: word.irabCase,
        caseSign: word.caseSign,
        structure: word.structureType,
      },
    };
  }

  async search(dto: SearchVersesDto) {
    const { query, searchType = 'text', page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (searchType === 'text') {
      // Search in Arabic text or translation
      where = {
        OR: [
          { textArabic: { contains: query, mode: 'insensitive' } },
          { translation: { contains: query, mode: 'insensitive' } },
          { transliteration: { contains: query, mode: 'insensitive' } },
        ],
      };
    } else if (searchType === 'root') {
      // Search by Arabic root
      where = {
        words: {
          some: {
            root: { equals: query },
          },
        },
      };
    }

    const [verses, total] = await Promise.all([
      this.prisma.quranVerse.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
        include: {
          words: {
            where: searchType === 'root' ? { root: query } : undefined,
            orderBy: { position: 'asc' },
          },
        },
      }),
      this.prisma.quranVerse.count({ where }),
    ]);

    return {
      data: verses,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        query,
        searchType,
      },
    };
  }

  async getVersesByGrammar(posType?: string, irabCase?: string) {
    const where: any = {};

    if (posType || irabCase) {
      where.words = {
        some: {
          ...(posType && { posType }),
          ...(irabCase && { irabCase }),
        },
      };
    }

    const verses = await this.prisma.quranVerse.findMany({
      where,
      take: 50,
      include: {
        words: {
          where: {
            ...(posType && { posType }),
            ...(irabCase && { irabCase }),
          },
          orderBy: { position: 'asc' },
        },
      },
      orderBy: [{ surahNumber: 'asc' }, { verseNumber: 'asc' }],
    });

    return verses;
  }

  async createBookmark(userId: string, surahNumber: number, verseNumber: number) {
    const verse = await this.findOne(surahNumber, verseNumber);

    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        verseId: verse.id,
      },
    });

    return bookmark;
  }

  async removeBookmark(userId: string, surahNumber: number, verseNumber: number) {
    const verse = await this.findOne(surahNumber, verseNumber);

    await this.prisma.bookmark.deleteMany({
      where: {
        userId,
        verseId: verse.id,
      },
    });

    return { message: 'Bookmark removed successfully' };
  }

  async getUserBookmarks(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        verse: {
          include: {
            words: {
              orderBy: { position: 'asc' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookmarks.map((b) => b.verse);
  }

  /**
   * Feature 11: Sentence Type Detection
   * Determines if verse is Nominal (جملة اسمية) or Verbal (جملة فعلية)
   */
  async getVerseAnalysis(surahNumber: number, verseNumber: number) {
    const verse = await this.findOne(surahNumber, verseNumber);

    if (!verse.words || verse.words.length === 0) {
      throw new NotFoundException(`No words found for verse ${surahNumber}:${verseNumber}`);
    }

    const firstWord = verse.words[0];
    const sentenceType = this.detectSentenceType(firstWord);

    // Find key components
    const components = this.findSentenceComponents(verse.words, sentenceType.type);

    return {
      sentenceType: sentenceType.type,
      sentenceTypeAr: sentenceType.typeAr,
      structure: sentenceType.structure,
      structureAr: sentenceType.structureAr,
      description: sentenceType.description,
      verseExample: components,
    };
  }

  private detectSentenceType(firstWord: any) {
    if (firstWord.posType === 'V') {
      return {
        type: 'verbal',
        typeAr: 'جملة فعلية',
        structure: 'Verb + Subject (+ Object)',
        structureAr: 'فعل + فاعل (+ مفعول)',
        description: 'Begins with a verb, emphasizes the action',
      };
    } else {
      return {
        type: 'nominal',
        typeAr: 'جملة اسمية',
        structure: 'Subject + Predicate',
        structureAr: 'مبتدأ + خبر',
        description: 'Begins with a noun, emphasizes the state or description',
      };
    }
  }

  private findSentenceComponents(words: any[], sentenceType: string) {
    const components: any = {};

    if (sentenceType === 'verbal') {
      // Find verb (should be first word)
      const verb = words.find((w) => w.posType === 'V');
      if (verb) {
        components.verb = {
          word: verb.arabicText,
          position: verb.position,
          translation: verb.translation,
        };
      }

      // Find subject (typically after verb with nominative case or syntactic role)
      const subject = words.find(
        (w, idx) => idx > 0 && (w.irabCase === 'Nominative' || w.syntacticRole === 'subject'),
      );
      if (subject) {
        components.subject = {
          word: subject.arabicText,
          position: subject.position,
          translation: subject.translation,
        };
      }

      // Find object (accusative case)
      const object = words.find((w) => w.irabCase === 'Accusative');
      if (object) {
        components.object = {
          word: object.arabicText,
          position: object.position,
          translation: object.translation,
        };
      }
    } else {
      // Nominal sentence: find subject (mubtada) and predicate (khabar)
      const subject = words.find(
        (w, idx) =>
          idx === 0 || w.syntacticRole === 'subject_nominal' || w.irabCase === 'Nominative',
      );
      if (subject) {
        components.subject = {
          word: subject.arabicText,
          position: subject.position,
          translation: subject.translation,
          role: 'مبتدأ',
        };
      }

      // Predicate is typically the second element or marked explicitly
      const predicate = words.find(
        (w) => w.syntacticRole === 'predicate' || (w.position > 0 && w !== subject),
      );
      if (predicate) {
        components.predicate = {
          word: predicate.arabicText,
          position: predicate.position,
          translation: predicate.translation,
          role: 'خبر',
        };
      }
    }

    return components;
  }

  /**
   * Feature 12: Phrase Groupings
   * Detects Idafa and Prepositional phrases
   */
  async getPhraseGroupings(surahNumber: number, verseNumber: number) {
    const verse = await this.findOne(surahNumber, verseNumber);
    const phrases: any[] = [];

    // Detect Idafa constructions (genitive case sequence)
    for (let i = 0; i < verse.words.length - 1; i++) {
      const current = verse.words[i];
      const next = verse.words[i + 1];

      // Idafa: Noun followed by noun/proper noun in genitive
      if (
        (current.posType === 'N' || current.posType === 'PN') &&
        next.irabCase === 'Genitive' &&
        (next.posType === 'N' || next.posType === 'PN')
      ) {
        phrases.push({
          type: 'idafa',
          typeAr: 'إضافة',
          startPosition: current.position,
          endPosition: next.position,
          words: [
            {
              word: current.arabicText,
              position: current.position,
              role: 'mudaf',
              roleAr: 'مضاف',
              translation: current.translation,
            },
            {
              word: next.arabicText,
              position: next.position,
              role: 'mudaf_ilayh',
              roleAr: 'مضاف إليه',
              translation: next.translation,
            },
          ],
        });
      }
    }

    // Detect prepositional phrases (P + N in genitive)
    for (let i = 0; i < verse.words.length - 1; i++) {
      const current = verse.words[i];
      const next = verse.words[i + 1];

      if (current.posType === 'P' && next.irabCase === 'Genitive') {
        phrases.push({
          type: 'prepositional',
          typeAr: 'شبه جملة جار ومجرور',
          startPosition: current.position,
          endPosition: next.position,
          words: [
            {
              word: current.arabicText,
              position: current.position,
              role: 'preposition',
              roleAr: 'حرف جر',
              translation: current.translation,
            },
            {
              word: next.arabicText,
              position: next.position,
              role: 'object',
              roleAr: 'اسم مجرور',
              translation: next.translation,
            },
          ],
        });
      }
    }

    return { phrases };
  }

  /**
   * Feature 13: Agreement Patterns
   * Checks grammatical agreement between related words
   */
  async getWordAgreements(surahNumber: number, verseNumber: number, position: number) {
    const verse = await this.findOne(surahNumber, verseNumber);
    const word = verse.words.find((w) => w.position === position);

    if (!word) {
      throw new NotFoundException(`Word at position ${position} not found`);
    }

    // Find related word for agreement checking
    const relatedWord = this.findRelatedWord(word, verse.words);

    if (!relatedWord) {
      return {
        word: {
          arabicText: word.arabicText,
          position: word.position,
          translation: word.translation,
        },
        agreements: [],
      };
    }

    // Check agreements
    const agreements = [];

    // Gender agreement
    if (word.gender && relatedWord.gender) {
      agreements.push({
        type: 'gender',
        typeAr: 'الجنس',
        agreesWith: relatedWord.arabicText,
        agreementValue: word.gender.toLowerCase(),
        agreementValueAr: word.genderArabic,
        isCorrect: word.gender === relatedWord.gender,
      });
    }

    // Number agreement
    if (word.number && relatedWord.number) {
      agreements.push({
        type: 'number',
        typeAr: 'العدد',
        agreesWith: relatedWord.arabicText,
        agreementValue: word.number.toLowerCase(),
        agreementValueAr: word.numberArabic,
        isCorrect: word.number === relatedWord.number,
      });
    }

    // Case agreement (for adjectives)
    if (word.irabCase && relatedWord.irabCase) {
      agreements.push({
        type: 'case',
        typeAr: 'الإعراب',
        agreesWith: relatedWord.arabicText,
        agreementValue: word.irabCase.toLowerCase(),
        agreementValueAr: word.irabCaseArabic,
        isCorrect: word.irabCase === relatedWord.irabCase,
      });
    }

    // Definiteness agreement
    if (word.definiteness && relatedWord.definiteness) {
      agreements.push({
        type: 'definiteness',
        typeAr: 'التعريف',
        agreesWith: relatedWord.arabicText,
        agreementValue: word.definiteness.toLowerCase(),
        agreementValueAr: word.definitenessArabic,
        isCorrect: word.definiteness === relatedWord.definiteness,
      });
    }

    return {
      word: {
        arabicText: word.arabicText,
        position: word.position,
        translation: word.translation,
        posType: word.posType,
      },
      agreementsWith: {
        word: relatedWord.arabicText,
        wordId: relatedWord.id,
        position: relatedWord.position,
        role: this.inferAgreementRole(word, relatedWord),
      },
      agreements,
    };
  }

  private findRelatedWord(word: any, allWords: any[]): any | null {
    // Adjectives agree with preceding noun
    if (word.posType === 'ADJ') {
      // Look for previous noun
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

  private inferAgreementRole(word: any, relatedWord: any): string {
    if (word.posType === 'ADJ' && (relatedWord.posType === 'N' || relatedWord.posType === 'PN')) {
      return 'adjective_of_noun';
    }
    if (word.posType === 'N' && relatedWord.posType === 'ADJ') {
      return 'noun_of_adjective';
    }
    return 'related_word';
  }
}
