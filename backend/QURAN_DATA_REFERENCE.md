# Quran Data Reference Guide

**Complete Documentation for arQ Quran Database**

**Version:** 1.0
**Last Updated:** 2025-11-04
**Status:** Production-Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Data Sources & Attribution](#data-sources--attribution)
3. [Database Schema](#database-schema)
4. [Data Structure Examples](#data-structure-examples)
5. [Querying Data](#querying-data)
6. [UI Integration Guide](#ui-integration-guide)
7. [Data Processing Pipeline](#data-processing-pipeline)
8. [Field Definitions](#field-definitions)
9. [API Examples](#api-examples)
10. [Constraints & Rules](#constraints--rules)

---

## Overview

### What We Have

The arQ backend contains the **complete Quran dataset** with full grammatical analysis:

| Metric | Count | Source |
|--------|-------|--------|
| **Surahs** | 114 | quran.com API |
| **Verses** | 6,236 | quran.com API |
| **Words** | 77,429 | quran.com API + corpus.quran.com |
| **Morphology Coverage** | 100% | corpus.quran.com |

### Key Features

✅ **Complete Text**: All 114 surahs in Arabic (Uthmani script)
✅ **Word-by-Word Translation**: English translation for each word
✅ **Transliteration**: Romanized pronunciation for each word
✅ **Full Grammar Analysis**: POS, gender, number, case, root, lemma
✅ **Zero Modifications**: Data preserved exactly as provided by sources
✅ **Production-Ready**: All data validated and imported to PostgreSQL

---

## Data Sources & Attribution

### Primary Sources (Authorized Only)

Per **PROJECT_CONSTRAINTS.md Section 10.2**, we use ONLY these sources:

#### 1. quran.com API v4 (Text Data)

**Purpose:** Arabic text, translation, transliteration
**URL:** https://api.quran.com/api/v4/
**License:** Attribution required
**Data Fetched:**
- Arabic text (Uthmani script with diacritics)
- Word-by-word English translation
- Phonetic transliteration
- Audio URLs
- Page/line numbers

**Attribution Required:**
```html
<p>Quranic text from <a href="https://quran.com">quran.com</a></p>
```

#### 2. corpus.quran.com (Morphology Data)

**Purpose:** Grammatical analysis
**URL:** http://corpus.quran.com
**Authority:** University of Leeds, Language Research Group
**License:** GNU GPL
**Data Fetched:**
- Part of speech (POS) tags
- Gender, number, case
- Root and lemma
- Verb aspects and voice
- Complete morphological features

**Attribution Required:**
```html
<p>Morphological analysis from
  <a href="http://corpus.quran.com">Quranic Arabic Corpus</a>
  (University of Leeds)
</p>
```

### Data Fetching Scripts

Located in: `backend/src/scripts/fetchers/`

| Script | Purpose | Runtime |
|--------|---------|---------|
| `quran-api-fetcher.ts` | Fetch text from quran.com | ~120s |
| `corpus-morphology-parser.ts` | Parse morphology file | <1s |
| `data-merger.ts` | Combine text + morphology | <1s |
| `run-import.ts` | Import to database | ~variable |

---

## Database Schema

### Tables

#### `quran_verses`

Stores complete verses with full text.

```typescript
interface QuranVerse {
  id: string;                    // UUID
  surahNumber: number;           // 1-114
  verseNumber: number;           // Verse within surah
  textArabic: string;            // Complete verse in Arabic
  textWithoutDiacritics: string; // Arabic without diacritics
  translation: string;           // Full English translation
  transliteration: string;       // Full transliteration
  searchVectorAr?: string;       // For Arabic search (future)
  searchVectorEn?: string;       // For English search (future)
  createdAt: Date;

  // Relations
  words: VerseWord[];            // Array of word objects
}
```

**Primary Key:** `id`
**Unique Index:** `(surahNumber, verseNumber)`
**Indexes:** `surahNumber`

#### `verse_words`

Stores individual words with complete grammatical analysis.

```typescript
interface VerseWord {
  id: string;                    // UUID
  verseId: string;               // Foreign key → quran_verses.id

  // Position
  position: number;              // Word position in verse (1-indexed)

  // Text
  arabicText: string;            // Arabic word with diacritics
  textWithoutDiacritics: string; // Arabic word without diacritics
  translation: string;           // English translation
  transliteration: string;       // Romanized pronunciation

  // Part of Speech
  posType: string;               // e.g., "N" (Noun), "V" (Verb)
  posArabic?: string;            // Arabic POS name (e.g., "اسم")

  // Gender
  gender?: string;               // "Masculine" | "Feminine"
  genderArabic?: string;         // "مذكر" | "مؤنث"

  // Number
  number?: string;               // "Singular" | "Dual" | "Plural"
  numberArabic?: string;         // "مفرد" | "مثنى" | "جمع"

  // Definiteness (future use)
  definiteness?: string;
  definitenessArabic?: string;

  // Case (I'rab)
  irabCase?: string;             // "Nominative" | "Accusative" | "Genitive"
  irabCaseArabic?: string;       // "مرفوع" | "منصوب" | "مجرور"
  caseSign?: string;             // Case ending
  caseSignArabic?: string;
  caseSignSymbol?: string;       // Diacritic symbol

  // Structure (future use)
  structureType?: string;
  structureTypeArabic?: string;

  // Morphology
  root?: string;                 // Arabic root (3-4 letters)
  lemma?: string;                // Dictionary form

  // Additional grammar (JSONB)
  grammarData?: {
    aspect?: string;             // "PERF" | "IMPF" | "IMPV"
    voice?: string;              // "ACT" | "PASS"
    person?: string;             // "1" | "2" | "3"
    rawFeatures?: string;        // Raw morphology string
    sources?: {
      text: string;              // "quran.com"
      morphology: string;        // "corpus.quran.com"
    }
  };

  createdAt: Date;
}
```

**Primary Key:** `id`
**Foreign Key:** `verseId` → `quran_verses.id`
**Indexes:** `(verseId, position)`, `root`, `posType`

---

## Data Structure Examples

### Example 1: Complete Verse (Al-Fatiha 1:1 - Bismillah)

**Database Query:**
```typescript
const verse = await prisma.quranVerse.findUnique({
  where: {
    surahNumber_verseNumber: { surahNumber: 1, verseNumber: 1 }
  },
  include: {
    words: { orderBy: { position: 'asc' } }
  }
});
```

**Result:**
```json
{
  "id": "uuid-here",
  "surahNumber": 1,
  "verseNumber": 1,
  "textArabic": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  "textWithoutDiacritics": "بسم الله الرحمن الرحيم",
  "translation": "In (the) name (of) Allah the Most Gracious the Most Merciful",
  "transliteration": "bis'mi allahi alrrahmani alrrahimi",
  "words": [
    {
      "position": 1,
      "arabicText": "بِسْمِ",
      "translation": "In (the) name",
      "transliteration": "bis'mi",
      "posType": "N",
      "posArabic": "اسم",
      "gender": "Masculine",
      "number": "Singular",
      "irabCase": "Genitive",
      "root": "smw",
      "lemma": "ism"
    },
    {
      "position": 2,
      "arabicText": "ٱللَّهِ",
      "translation": "Allah",
      "transliteration": "allahi",
      "posType": "PN",
      "posArabic": "اسم علم",
      "irabCase": "Genitive",
      "root": "Alh",
      "lemma": "Allah"
    }
    // ... 2 more words
  ]
}
```

### Example 2: Word-Level Detail

**Query a specific word:**
```typescript
const word = await prisma.verseWord.findFirst({
  where: {
    verse: { surahNumber: 1, verseNumber: 1 },
    position: 1
  },
  include: { verse: true }
});
```

**Result:**
```json
{
  "id": "uuid",
  "position": 1,
  "arabicText": "بِسْمِ",
  "textWithoutDiacritics": "بسم",
  "translation": "In (the) name",
  "transliteration": "bis'mi",
  "posType": "N",
  "posArabic": "اسم",
  "gender": "Masculine",
  "genderArabic": "مذكر",
  "number": "Singular",
  "numberArabic": "مفرد",
  "irabCase": "Genitive",
  "irabCaseArabic": "مجرور",
  "root": "smw",
  "lemma": "ism",
  "grammarData": {
    "sources": {
      "text": "quran.com",
      "morphology": "corpus.quran.com"
    }
  }
}
```

---

## Querying Data

### Common Queries with Prisma

#### 1. Get a Specific Verse

```typescript
const verse = await prisma.quranVerse.findFirst({
  where: {
    surahNumber: 1,
    verseNumber: 7
  },
  include: {
    words: {
      orderBy: { position: 'asc' }
    }
  }
});
```

#### 2. Get All Verses from a Surah

```typescript
const surahVerses = await prisma.quranVerse.findMany({
  where: { surahNumber: 112 }, // Surah Al-Ikhlas
  orderBy: { verseNumber: 'asc' },
  include: {
    words: {
      orderBy: { position: 'asc' }
    }
  }
});
```

#### 3. Search by Arabic Root

```typescript
const wordsWithRoot = await prisma.verseWord.findMany({
  where: {
    root: 'qwl' // Root ق و ل (to say/speak)
  },
  include: {
    verse: {
      select: {
        surahNumber: true,
        verseNumber: true,
        textArabic: true
      }
    }
  },
  take: 20
});
```

#### 4. Get Words by Part of Speech

```typescript
const nouns = await prisma.verseWord.findMany({
  where: { posType: 'N' },
  take: 100
});

const verbs = await prisma.verseWord.findMany({
  where: { posType: 'V' },
  take: 100
});
```

#### 5. Find Words with Specific Grammar

```typescript
const feminineNouns = await prisma.verseWord.findMany({
  where: {
    posType: 'N',
    gender: 'Feminine'
  },
  include: {
    verse: {
      select: { surahNumber: true, verseNumber: true }
    }
  }
});
```

#### 6. Get Statistics

```typescript
// Count words by POS type
const posDistribution = await prisma.verseWord.groupBy({
  by: ['posType'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } }
});

// Words with roots
const wordsWithRoots = await prisma.verseWord.count({
  where: { root: { not: null } }
});
```

---

## UI Integration Guide

### For Frontend Developers

#### Fetching Verse for Display

```typescript
// API Endpoint: GET /api/verses/:surahNumber/:verseNumber

interface VerseDisplayData {
  arabic: string;
  translation: string;
  transliteration: string;
  surah: { number: number; name: string };
  verseNumber: number;
  words: Array<{
    arabic: string;
    translation: string;
    transliteration: string;
    grammar: {
      pos: string;
      gender?: string;
      number?: string;
      case?: string;
      root?: string;
    }
  }>;
}

// Example usage in React component
function VerseDisplay({ surahNumber, verseNumber }) {
  const { data: verse } = useQuery(['verse', surahNumber, verseNumber],
    () => fetch(`/api/verses/${surahNumber}/${verseNumber}`).then(r => r.json())
  );

  return (
    <div className="verse">
      <div className="arabic" dir="rtl">{verse.arabic}</div>
      <div className="translation">{verse.translation}</div>
      <div className="words">
        {verse.words.map((word, i) => (
          <WordPopover key={i} word={word} />
        ))}
      </div>
    </div>
  );
}
```

#### Word-by-Word Interactive Display

```typescript
function WordPopover({ word }) {
  return (
    <Popover>
      <PopoverTrigger>
        <span className="arabic-word">{word.arabic}</span>
      </PopoverTrigger>
      <PopoverContent>
        <div className="word-details">
          <p><strong>Arabic:</strong> {word.arabic}</p>
          <p><strong>Translation:</strong> {word.translation}</p>
          <p><strong>Transliteration:</strong> {word.transliteration}</p>
          <hr />
          <p><strong>Part of Speech:</strong> {word.grammar.pos}</p>
          {word.grammar.root && (
            <p><strong>Root:</strong> {word.grammar.root}</p>
          )}
          {word.grammar.gender && (
            <p><strong>Gender:</strong> {word.grammar.gender}</p>
          )}
          {word.grammar.number && (
            <p><strong>Number:</strong> {word.grammar.number}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

#### Search by Root

```typescript
// API Endpoint: GET /api/words/by-root/:root

async function searchByRoot(root: string) {
  const response = await fetch(`/api/words/by-root/${root}`);
  const words = await response.json();

  return words.map(w => ({
    location: `${w.verse.surahNumber}:${w.verse.verseNumber}`,
    arabic: w.arabicText,
    translation: w.translation,
    verseContext: w.verse.textArabic
  }));
}
```

### Backend API Endpoints (Recommended)

```typescript
// backend/src/routes/quran.routes.ts

router.get('/verses/:surahNumber/:verseNumber', async (req, res) => {
  const { surahNumber, verseNumber } = req.params;

  const verse = await prisma.quranVerse.findFirst({
    where: {
      surahNumber: parseInt(surahNumber),
      verseNumber: parseInt(verseNumber)
    },
    include: {
      words: { orderBy: { position: 'asc' } }
    }
  });

  res.json(verse);
});

router.get('/surahs/:number', async (req, res) => {
  const verses = await prisma.quranVerse.findMany({
    where: { surahNumber: parseInt(req.params.number) },
    include: { words: true },
    orderBy: { verseNumber: 'asc' }
  });

  res.json(verses);
});

router.get('/words/by-root/:root', async (req, res) => {
  const words = await prisma.verseWord.findMany({
    where: { root: req.params.root },
    include: {
      verse: {
        select: {
          surahNumber: true,
          verseNumber: true,
          textArabic: true
        }
      }
    }
  });

  res.json(words);
});
```

---

## Data Processing Pipeline

### Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Fetch Text from quran.com API                      │
├─────────────────────────────────────────────────────────────┤
│ Script: src/scripts/fetchers/quran-api-fetcher.ts          │
│ Runtime: ~120 seconds                                       │
│ Output: backend/data/raw/quran-text/surah_XXX.json (114)   │
│ Rate Limiting: 10 req/sec, 600 req/min                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Parse Morphology from corpus.quran.com             │
├─────────────────────────────────────────────────────────────┤
│ Script: src/scripts/fetchers/corpus-morphology-parser.ts   │
│ Runtime: <1 second                                          │
│ Input: quranic-corpus-morphology-0.4.txt (128K segments)   │
│ Output: data/raw/corpus-morphology/parsed-morphology.json  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Merge Text + Morphology                            │
├─────────────────────────────────────────────────────────────┤
│ Script: src/scripts/fetchers/data-merger.ts                │
│ Runtime: <1 second                                          │
│ Matching: By location (surah:verse:word)                   │
│ Match Rate: 100% (77,429 / 77,429)                         │
│ Output: data/processed/quran-complete-merged.json          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Import to PostgreSQL                               │
├─────────────────────────────────────────────────────────────┤
│ Script: src/scripts/run-import.ts                          │
│ Runtime: Variable                                           │
│ Tables: quran_verses (6,236), verse_words (77,429)         │
│ Verification: Count check, sample queries                  │
└─────────────────────────────────────────────────────────────┘
```

### Running the Pipeline

```bash
# Step 1: Fetch text (if not already cached)
cd backend
npx ts-node src/scripts/fetchers/quran-api-fetcher.ts

# Step 2: Parse morphology (if not already parsed)
npx ts-node src/scripts/fetchers/corpus-morphology-parser.ts

# Step 3: Merge data
npx ts-node src/scripts/fetchers/data-merger.ts

# Step 4: Import to database
npx ts-node src/scripts/run-import.ts

# Optional: Verify data
npx prisma studio  # Open at localhost:5555
```

---

## Field Definitions

### POS (Part of Speech) Types

| Code | English | Arabic | Count |
|------|---------|--------|-------|
| N | Noun | اسم | 25,135 |
| V | Verb | فعل | 19,356 |
| P | Preposition | حرف جر | 7,679 |
| PN | Proper Noun | اسم علم | 3,911 |
| REL | Relative Pronoun | اسم موصول | 3,321 |
| PRON | Pronoun | ضمير | 3,301 |
| NEG | Negative Particle | حرف نفي | 2,643 |
| ACC | Accusative Particle | حرف نصب | 2,283 |
| ADJ | Adjective | صفة | 1,961 |
| T | Particle | حرف | 1,166 |

### Gender

| Code | English | Arabic |
|------|---------|--------|
| M | Masculine | مذكر |
| F | Feminine | مؤنث |

### Number

| Code | English | Arabic |
|------|---------|--------|
| S | Singular | مفرد |
| D | Dual | مثنى |
| P | Plural | جمع |

### Case (I'rab)

| Code | English | Arabic |
|------|---------|--------|
| NOM | Nominative | مرفوع |
| ACC | Accusative | منصوب |
| GEN | Genitive | مجرور |

### Verb Aspects

| Code | Meaning |
|------|---------|
| PERF | Perfect (past tense) |
| IMPF | Imperfect (present/future) |
| IMPV | Imperative (command) |

### Voice

| Code | Meaning |
|------|---------|
| ACT | Active voice |
| PASS | Passive voice |

---

## API Examples

### REST API Structure (Recommended)

```
GET  /api/verses                    # Get all verses (paginated)
GET  /api/verses/:surah/:verse      # Get specific verse
GET  /api/surahs                    # Get all surah metadata
GET  /api/surahs/:number            # Get all verses from surah
GET  /api/words/by-root/:root       # Search words by root
GET  /api/words/by-pos/:pos         # Search words by POS type
GET  /api/search?q=:query           # Full-text search
POST /api/bookmarks                 # Add bookmark
GET  /api/bookmarks                 # Get user bookmarks
```

### GraphQL Schema (Alternative)

```graphql
type Query {
  verse(surahNumber: Int!, verseNumber: Int!): Verse
  surah(number: Int!): Surah
  wordsByRoot(root: String!): [Word!]!
  wordsByPOS(pos: String!): [Word!]!
  searchVerses(query: String!): [Verse!]!
}

type Verse {
  id: ID!
  surahNumber: Int!
  verseNumber: Int!
  textArabic: String!
  translation: String!
  transliteration: String!
  words: [Word!]!
}

type Word {
  id: ID!
  position: Int!
  arabicText: String!
  translation: String!
  transliteration: String!
  posType: String!
  gender: String
  number: String
  irabCase: String
  root: String
  lemma: String
  grammarData: JSON
}

type Surah {
  number: Int!
  verses: [Verse!]!
  totalVerses: Int!
}
```

---

## Constraints & Rules

### PROJECT_CONSTRAINTS.md Section 10 Compliance

**CRITICAL RULES:**

1. ❌ **NEVER modify Quranic data**
   - Only permitted: Unicode NFC normalization, whitespace trim
   - No inference, no guessing, no defaults

2. ✅ **Only use authorized sources**
   - quran.com API (text)
   - corpus.quran.com (morphology)
   - NO third-party sources (GitHub mirrors, random APIs)

3. ✅ **Always attribute sources**
   - Display attribution in UI footer
   - Link back to source websites

4. ✅ **Preserve authenticity**
   - Store raw morphology features
   - Never modify grammatical analysis
   - Zero interpretation by us

### Data Integrity Checks

```typescript
// Verify counts
const verses = await prisma.quranVerse.count();
const words = await prisma.verseWord.count();

assert(verses === 6236, 'Expected 6,236 verses');
assert(words === 77429, 'Expected 77,429 words');

// Verify no missing data
const wordsWithoutVerse = await prisma.verseWord.count({
  where: { verseId: null }
});
assert(wordsWithoutVerse === 0, 'All words must have verse');

// Verify morphology coverage
const wordsWithMorphology = await prisma.verseWord.count({
  where: { posType: { not: 'UNKNOWN' } }
});
const coverage = (wordsWithMorphology / words) * 100;
assert(coverage === 100, 'Expected 100% morphology coverage');
```

---

## File Locations

### Data Files

```
backend/
├── data/
│   ├── raw/
│   │   ├── quran-text/
│   │   │   ├── cache/
│   │   │   │   └── chapters.json          # Surah metadata
│   │   │   ├── surah_001.json             # Al-Fatiha
│   │   │   ├── surah_002.json             # Al-Baqarah
│   │   │   └── ...                        # All 114 surahs
│   │   └── corpus-morphology/
│   │       └── parsed-morphology.json     # Parsed morphology
│   └── processed/
│       └── quran-complete-merged.json     # Merged text + morphology
```

### Scripts

```
backend/src/scripts/
├── fetchers/
│   ├── quran-api-fetcher.ts               # Fetch from quran.com
│   ├── corpus-morphology-parser.ts        # Parse corpus data
│   └── data-merger.ts                     # Merge text + morphology
├── types/
│   ├── quran-api.types.ts                 # API response types
│   └── corpus-morphology.types.ts         # Morphology types
├── utils/
│   └── rate-limiter.ts                    # Rate limiting utility
├── run-import.ts                          # Database import script
└── verify-data.ts                         # Data verification
```

### Documentation

```
backend/
├── QURAN_API_ASSESSMENT.md                # API analysis
├── FETCHING_STRATEGY_SUMMARY.md           # Pipeline summary
├── QURAN_DATA_REFERENCE.md                # This file
└── PROJECT_CONSTRAINTS.md                 # Section 10: Data rules
```

---

## Quick Reference

### Essential Commands

```bash
# Fetch all data (one-time setup)
npx ts-node src/scripts/fetchers/quran-api-fetcher.ts
npx ts-node src/scripts/fetchers/corpus-morphology-parser.ts
npx ts-node src/scripts/fetchers/data-merger.ts

# Import to database
npx ts-node src/scripts/run-import.ts

# View data
npx prisma studio  # Open at http://localhost:5555

# Database migrations
npx prisma migrate dev
npx prisma generate
```

### Key Numbers

- **Total Surahs:** 114
- **Total Verses:** 6,236
- **Total Words:** 77,429
- **Morphology Coverage:** 100%
- **Data Sources:** 2 (quran.com, corpus.quran.com)
- **Processing Time:** ~2 minutes (total pipeline)

---

## Support & Maintenance

### Re-running Data Pipeline

If you need to refresh the data:

```bash
# 1. Delete existing data
rm -rf backend/data/raw/quran-text/
rm -rf backend/data/raw/corpus-morphology/
rm -rf backend/data/processed/

# 2. Re-fetch everything
npx ts-node src/scripts/fetchers/quran-api-fetcher.ts
npx ts-node src/scripts/fetchers/corpus-morphology-parser.ts
npx ts-node src/scripts/fetchers/data-merger.ts

# 3. Re-import to database
npx ts-node src/scripts/run-import.ts --force
```

### Troubleshooting

**Problem:** Import fails with "data already exists"
**Solution:** Add `--force` flag or manually clear database

**Problem:** Missing morphology for some words
**Solution:** Verify `quran-morphology-data/` directory contains `quranic-corpus-morphology-0.4.txt`

**Problem:** Rate limit errors from quran.com
**Solution:** Rate limiter already configured (10 req/sec). If still occurring, increase delay in `rate-limiter.ts`

---

**Last Updated:** 2025-11-04
**Maintained By:** arQ Development Team
**Questions?** Refer to PROJECT_CONSTRAINTS.md Section 10 or QURAN_API_ASSESSMENT.md
