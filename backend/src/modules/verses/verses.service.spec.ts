import { Test, TestingModule } from '@nestjs/testing';
import { VersesService } from './verses.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { NotFoundException } from '@nestjs/common';

describe('VersesService', () => {
  let service: VersesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    quranVerse: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    verseWord: {
      findUnique: jest.fn(),
    },
    bookmark: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    delPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<VersesService>(VersesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockCacheService.get.mockResolvedValue(null); // Reset cache to always miss by default
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated verses', async () => {
      const mockVerses = [
        {
          id: '1',
          surahNumber: 1,
          verseNumber: 1,
          textArabic: 'بِسْمِ ٱللَّهِ',
          translation: 'In the name of Allah',
          words: [],
        },
      ];

      mockPrismaService.quranVerse.findMany.mockResolvedValue(mockVerses);
      mockPrismaService.quranVerse.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });

      expect(result.data).toEqual(mockVerses);
      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });

    it('should filter by surah number', async () => {
      mockPrismaService.quranVerse.findMany.mockResolvedValue([]);
      mockPrismaService.quranVerse.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 20, surahNumber: 1 });

      expect(mockPrismaService.quranVerse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { surahNumber: 1 },
        }),
      );
    });

    it('should include words with correct ordering', async () => {
      mockPrismaService.quranVerse.findMany.mockResolvedValue([]);
      mockPrismaService.quranVerse.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 20 });

      expect(mockPrismaService.quranVerse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            words: {
              orderBy: { position: 'asc' },
            },
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a verse by surah and verse number', async () => {
      const mockVerse = {
        id: '1',
        surahNumber: 1,
        verseNumber: 1,
        textArabic: 'بِسْمِ ٱللَّهِ',
        translation: 'In the name of Allah',
        words: [
          {
            id: 'word-1',
            position: 1,
            arabicText: 'بِسْمِ',
            posType: 'N',
            irabCase: 'Genitive',
          },
        ],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);

      const result = await service.findOne(1, 1);

      expect(result).toEqual(mockVerse);
      expect(mockPrismaService.quranVerse.findUnique).toHaveBeenCalledWith({
        where: {
          surahNumber_verseNumber: {
            surahNumber: 1,
            verseNumber: 1,
          },
        },
        include: {
          words: {
            orderBy: { position: 'asc' },
          },
        },
      });
    });

    it('should throw NotFoundException if verse not found', async () => {
      mockPrismaService.quranVerse.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999, 999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999, 999)).rejects.toThrow('Verse 999:999 not found');
    });
  });

  describe('getWordAnalysis', () => {
    it('should return word with grammatical analysis', async () => {
      const mockWord = {
        id: 'word-1',
        arabicText: 'بِسْمِ',
        translation: 'In the name',
        posType: 'N',
        gender: 'Masculine',
        number: null,
        definiteness: null,
        irabCase: 'Genitive',
        caseSign: null,
        structureType: null,
        verse: {
          surahNumber: 1,
          verseNumber: 1,
          textArabic: 'بِسْمِ ٱللَّهِ',
        },
      };

      mockPrismaService.verseWord.findUnique.mockResolvedValue(mockWord);

      const result = await service.getWordAnalysis('word-1');

      expect(result.grammaticalAnalysis).toEqual({
        partOfSpeech: 'N',
        gender: 'Masculine',
        number: null,
        definiteness: null,
        case: 'Genitive',
        caseSign: null,
        structure: null,
      });
      expect(result.arabicText).toBe('بِسْمِ');
    });

    it('should throw NotFoundException if word not found', async () => {
      mockPrismaService.verseWord.findUnique.mockResolvedValue(null);

      await expect(service.getWordAnalysis('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('search', () => {
    it('should search verses by text', async () => {
      const mockVerses = [
        {
          id: '1',
          surahNumber: 1,
          verseNumber: 1,
          textArabic: 'بِسْمِ ٱللَّهِ',
          translation: 'In the name of Allah',
          words: [],
        },
      ];

      mockPrismaService.quranVerse.findMany.mockResolvedValue(mockVerses);
      mockPrismaService.quranVerse.count.mockResolvedValue(1);

      const result = await service.search({
        query: 'Allah',
        searchType: 'text',
        page: 1,
        limit: 20,
      });

      expect(result.data).toEqual(mockVerses);
      expect(result.meta.query).toBe('Allah');
      expect(result.meta.searchType).toBe('text');
      expect(mockPrismaService.quranVerse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { textArabic: { contains: 'Allah', mode: 'insensitive' } },
              { translation: { contains: 'Allah', mode: 'insensitive' } },
              { transliteration: { contains: 'Allah', mode: 'insensitive' } },
            ],
          },
        }),
      );
    });

    it('should search verses by root', async () => {
      const mockVerses = [
        {
          id: '1',
          surahNumber: 1,
          verseNumber: 1,
          textArabic: 'بِسْمِ ٱللَّهِ',
          words: [],
        },
      ];

      mockPrismaService.quranVerse.findMany.mockResolvedValue(mockVerses);
      mockPrismaService.quranVerse.count.mockResolvedValue(1);

      const result = await service.search({
        query: 'smw',
        searchType: 'root',
        page: 1,
        limit: 20,
      });

      expect(result.data).toEqual(mockVerses);
      expect(mockPrismaService.quranVerse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            words: {
              some: {
                root: { equals: 'smw' },
              },
            },
          },
        }),
      );
    });
  });

  describe('getVersesByGrammar', () => {
    it('should filter verses by POS type', async () => {
      const mockVerses = [
        {
          id: '1',
          surahNumber: 1,
          verseNumber: 1,
          words: [],
        },
      ];

      mockPrismaService.quranVerse.findMany.mockResolvedValue(mockVerses);

      const result = await service.getVersesByGrammar('N', undefined);

      expect(result).toEqual(mockVerses);
      expect(mockPrismaService.quranVerse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            words: {
              some: {
                posType: 'N',
              },
            },
          },
        }),
      );
    });

    it('should filter verses by case', async () => {
      mockPrismaService.quranVerse.findMany.mockResolvedValue([]);

      await service.getVersesByGrammar(undefined, 'Genitive');

      expect(mockPrismaService.quranVerse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            words: {
              some: {
                irabCase: 'Genitive',
              },
            },
          },
        }),
      );
    });

    it('should filter verses by both POS and case', async () => {
      mockPrismaService.quranVerse.findMany.mockResolvedValue([]);

      await service.getVersesByGrammar('N', 'Genitive');

      expect(mockPrismaService.quranVerse.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            words: {
              some: {
                posType: 'N',
                irabCase: 'Genitive',
              },
            },
          },
        }),
      );
    });
  });

  describe('createBookmark', () => {
    it('should create a bookmark for a verse', async () => {
      const mockVerse = {
        id: 'verse-1',
        surahNumber: 1,
        verseNumber: 1,
        words: [],
      };

      const mockBookmark = {
        id: 'bookmark-1',
        userId: 'user-1',
        verseId: 'verse-1',
        createdAt: new Date(),
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);
      mockPrismaService.bookmark.create.mockResolvedValue(mockBookmark);

      const result = await service.createBookmark('user-1', 1, 1);

      expect(result).toEqual(mockBookmark);
      expect(mockPrismaService.bookmark.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          verseId: 'verse-1',
        },
      });
    });

    it('should throw NotFoundException if verse not found', async () => {
      mockPrismaService.quranVerse.findUnique.mockResolvedValue(null);

      await expect(service.createBookmark('user-1', 999, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeBookmark', () => {
    it('should remove a bookmark', async () => {
      const mockVerse = {
        id: 'verse-1',
        surahNumber: 1,
        verseNumber: 1,
        words: [],
      };

      mockPrismaService.quranVerse.findUnique.mockResolvedValue(mockVerse);
      mockPrismaService.bookmark.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.removeBookmark('user-1', 1, 1);

      expect(result).toEqual({ message: 'Bookmark removed successfully' });
      expect(mockPrismaService.bookmark.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          verseId: 'verse-1',
        },
      });
    });
  });

  describe('getUserBookmarks', () => {
    it('should return user bookmarks with verses', async () => {
      const mockBookmarks = [
        {
          id: 'bookmark-1',
          userId: 'user-1',
          verseId: 'verse-1',
          verse: {
            id: 'verse-1',
            surahNumber: 1,
            verseNumber: 1,
            textArabic: 'بِسْمِ ٱللَّهِ',
            words: [],
          },
        },
      ];

      mockPrismaService.bookmark.findMany.mockResolvedValue(mockBookmarks);

      const result = await service.getUserBookmarks('user-1');

      expect(result).toEqual([mockBookmarks[0].verse]);
      expect(mockPrismaService.bookmark.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-1' },
          include: {
            verse: {
              include: {
                words: {
                  orderBy: { position: 'asc' },
                },
              },
            },
          },
        }),
      );
    });
  });
});
