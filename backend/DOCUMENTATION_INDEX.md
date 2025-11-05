# arQ Backend Documentation Index

**Master reference for all backend documentation and data systems**

Last Updated: 2025-11-04

---

## Quick Links

| Document | Purpose | Use When |
|----------|---------|----------|
| **[QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md)** | Complete Quran data guide | Building UI, querying data, understanding structure |
| **[PROJECT_CONSTRAINTS.md](./PROJECT_CONSTRAINTS.md)** | Development rules & constraints | Writing any code, making architectural decisions |
| **[QURAN_API_ASSESSMENT.md](./QURAN_API_ASSESSMENT.md)** | Technical API analysis | Debugging fetchers, understanding data sources |
| **[FETCHING_STRATEGY_SUMMARY.md](./FETCHING_STRATEGY_SUMMARY.md)** | Pipeline overview | Re-running data fetch, understanding workflow |

---

## For Different Roles

### 🎨 Frontend/UI Developers

**Read First:**
1. [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) - Section: "UI Integration Guide"
2. [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) - Section: "Data Structure Examples"

**Key Information:**
- Database schema and field definitions
- API endpoint recommendations
- React component examples
- Query examples (Prisma)

**Quick Start:**
```typescript
// Get a verse with all words
const verse = await prisma.quranVerse.findFirst({
  where: { surahNumber: 1, verseNumber: 1 },
  include: { words: { orderBy: { position: 'asc' } } }
});

// Display in UI
<div className="verse">
  <p className="arabic">{verse.textArabic}</p>
  <p className="translation">{verse.translation}</p>
  {verse.words.map(word => (
    <WordPopover word={word} />
  ))}
</div>
```

---

### 🔧 Backend/API Developers

**Read First:**
1. [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) - Section: "Database Schema"
2. [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) - Section: "Querying Data"
3. [PROJECT_CONSTRAINTS.md](./PROJECT_CONSTRAINTS.md) - Section 10

**Key Information:**
- Complete database schema (Prisma)
- Query examples and patterns
- API endpoint structure
- Data integrity rules

**Quick Start:**
```typescript
// API route example
router.get('/api/verses/:surah/:verse', async (req, res) => {
  const verse = await prisma.quranVerse.findFirst({
    where: {
      surahNumber: parseInt(req.params.surah),
      verseNumber: parseInt(req.params.verse)
    },
    include: { words: true }
  });
  res.json(verse);
});
```

---

### 📊 Data Engineers

**Read First:**
1. [FETCHING_STRATEGY_SUMMARY.md](./FETCHING_STRATEGY_SUMMARY.md)
2. [QURAN_API_ASSESSMENT.md](./QURAN_API_ASSESSMENT.md)
3. [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) - Section: "Data Processing Pipeline"

**Key Information:**
- Complete data pipeline workflow
- Source APIs and rate limits
- Data transformation logic
- Import scripts location

**Quick Start:**
```bash
# Re-run complete data pipeline
cd backend

# 1. Fetch text from quran.com
npx ts-node src/scripts/fetchers/quran-api-fetcher.ts

# 2. Parse morphology from corpus
npx ts-node src/scripts/fetchers/corpus-morphology-parser.ts

# 3. Merge data
npx ts-node src/scripts/fetchers/data-merger.ts

# 4. Import to database
npx ts-node src/scripts/run-import.ts
```

---

### 🎓 Product/Content Designers

**Read First:**
1. [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) - Section: "Overview"
2. [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) - Section: "Field Definitions"

**Key Information:**
- What data is available
- Field meanings and examples
- Arabic grammar terminology
- Data attribution requirements

**Available Data:**
- ✅ Complete Arabic text (114 surahs, 6,236 verses)
- ✅ Word-by-word English translation
- ✅ Phonetic transliteration
- ✅ Full grammar analysis (POS, gender, number, case, root)
- ✅ 100% coverage (all 77,429 words analyzed)

---

## System Architecture

### Data Flow Diagram

```
┌─────────────────┐
│   quran.com     │ ──→ Text, Translation, Transliteration
│   API v4        │
└─────────────────┘
         ↓
┌─────────────────────────────────────┐
│  quran-api-fetcher.ts               │
│  - Rate limiting (10 req/sec)       │
│  - Caching (114 JSON files)         │
│  - Progress tracking                │
└─────────────────────────────────────┘
         ↓
┌────────────────────────────┐
│  data/raw/quran-text/      │
│  - surah_001.json          │
│  - surah_002.json          │
│  - ...                     │
└────────────────────────────┘
         ↓
┌─────────────────────────────┐       ┌──────────────────┐
│     data-merger.ts          │ ←───  │ corpus.quran.com │
│  - Location matching        │       │  Morphology DB   │
│  - 100% match rate          │       └──────────────────┘
└─────────────────────────────┘                ↓
         ↓                          ┌─────────────────────┐
┌────────────────────────────┐     │ corpus-morphology-  │
│  data/processed/           │     │ parser.ts           │
│  quran-complete-merged.json│ ←── │ - Parse 128K       │
└────────────────────────────┘     │   segments         │
         ↓                          └─────────────────────┘
┌─────────────────────────────┐
│     run-import.ts           │
│  - PostgreSQL import        │
│  - Data verification        │
└─────────────────────────────┘
         ↓
┌─────────────────────────────┐
│   PostgreSQL Database       │
│  - quran_verses (6,236)     │
│  - verse_words (77,429)     │
└─────────────────────────────┘
         ↓
┌─────────────────────────────┐
│    Prisma ORM Client        │
│  - Type-safe queries        │
│  - Relations              │
└─────────────────────────────┘
         ↓
┌─────────────────────────────┐
│      REST API               │
│  - GET /api/verses/:id      │
│  - GET /api/words/by-root   │
│  - POST /api/bookmarks      │
└─────────────────────────────┘
         ↓
┌─────────────────────────────┐
│    Frontend (React)         │
│  - Verse display            │
│  - Word-by-word analysis    │
│  - Interactive grammar      │
└─────────────────────────────┘
```

---

## Key Data Statistics

### Corpus Size

| Metric | Count | Source |
|--------|-------|--------|
| Surahs | 114 | quran.com |
| Verses | 6,236 | quran.com |
| Words | 77,429 | quran.com + corpus.quran.com |
| Morphological Segments | 128,219 | corpus.quran.com |
| Morphology Coverage | 100% | corpus.quran.com |

### Part of Speech Distribution

| POS Type | Count | Percentage |
|----------|-------|------------|
| Noun (N) | 25,135 | 32.5% |
| Verb (V) | 19,356 | 25.0% |
| Preposition (P) | 7,679 | 9.9% |
| Proper Noun (PN) | 3,911 | 5.1% |
| Relative Pronoun (REL) | 3,321 | 4.3% |
| Pronoun (PRON) | 3,301 | 4.3% |
| Other | 14,726 | 19.0% |

### Gender Distribution

| Gender | Count | Percentage |
|--------|-------|------------|
| Masculine | 13,195 | 17.0% |
| Feminine | 3,106 | 4.0% |
| N/A | 61,128 | 79.0% |

---

## File Structure

```
backend/
├── DOCUMENTATION_INDEX.md              # ← This file
├── QURAN_DATA_REFERENCE.md             # Complete data guide
├── PROJECT_CONSTRAINTS.md              # Development rules
├── QURAN_API_ASSESSMENT.md             # API technical analysis
├── FETCHING_STRATEGY_SUMMARY.md        # Pipeline overview
│
├── data/
│   ├── raw/
│   │   ├── quran-text/                 # Text from quran.com (114 files)
│   │   └── corpus-morphology/          # Morphology from corpus.quran.com
│   └── processed/
│       └── quran-complete-merged.json  # Merged dataset
│
├── prisma/
│   └── schema.prisma                   # Database schema
│
└── src/
    ├── scripts/
    │   ├── fetchers/
    │   │   ├── quran-api-fetcher.ts
    │   │   ├── corpus-morphology-parser.ts
    │   │   └── data-merger.ts
    │   ├── types/
    │   │   ├── quran-api.types.ts
    │   │   └── corpus-morphology.types.ts
    │   ├── utils/
    │   │   └── rate-limiter.ts
    │   └── run-import.ts
    │
    └── routes/                         # API endpoints (to be created)
        └── quran.routes.ts             # Quran data API
```

---

## Common Tasks

### Task 1: Display a Verse in UI

**Goal:** Show Surah Al-Fatiha, Verse 1 (Bismillah)

**Steps:**
1. Read: [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) → "UI Integration Guide"
2. Query database:
   ```typescript
   const verse = await prisma.quranVerse.findFirst({
     where: { surahNumber: 1, verseNumber: 1 },
     include: { words: { orderBy: { position: 'asc' } } }
   });
   ```
3. Render in React (see examples in reference guide)

**Reference:** QURAN_DATA_REFERENCE.md → Section: "Data Structure Examples"

---

### Task 2: Search Words by Root

**Goal:** Find all occurrences of root "قول" (qwl - to say/speak)

**Steps:**
1. Read: [QURAN_DATA_REFERENCE.md](./QURAN_DATA_REFERENCE.md) → "Querying Data"
2. Query:
   ```typescript
   const words = await prisma.verseWord.findMany({
     where: { root: 'qwl' },
     include: {
       verse: {
         select: { surahNumber: true, verseNumber: true }
       }
     }
   });
   ```

**Reference:** QURAN_DATA_REFERENCE.md → Section: "Querying Data" → Example 3

---

### Task 3: Re-fetch All Data

**Goal:** Refresh the complete dataset from sources

**Steps:**
1. Read: [FETCHING_STRATEGY_SUMMARY.md](./FETCHING_STRATEGY_SUMMARY.md)
2. Run commands:
   ```bash
   # Delete old data
   rm -rf backend/data/raw/*
   rm -rf backend/data/processed/*

   # Re-fetch
   npx ts-node src/scripts/fetchers/quran-api-fetcher.ts
   npx ts-node src/scripts/fetchers/corpus-morphology-parser.ts
   npx ts-node src/scripts/fetchers/data-merger.ts
   npx ts-node src/scripts/run-import.ts
   ```

**Reference:** FETCHING_STRATEGY_SUMMARY.md → Section: "How It Works"

---

### Task 4: Understand Data Constraints

**Goal:** Learn what we can/cannot do with Quranic data

**Steps:**
1. Read: [PROJECT_CONSTRAINTS.md](./PROJECT_CONSTRAINTS.md) → Section 10
2. Key rules:
   - ❌ NEVER modify Quranic data
   - ❌ NEVER infer grammar (no guessing)
   - ✅ Only use quran.com and corpus.quran.com
   - ✅ Always attribute sources in UI

**Reference:** PROJECT_CONSTRAINTS.md → Section 10

---

### Task 5: Debug Data Fetcher

**Goal:** Understand API rate limits and error handling

**Steps:**
1. Read: [QURAN_API_ASSESSMENT.md](./QURAN_API_ASSESSMENT.md)
2. Check rate limiter: `src/scripts/utils/rate-limiter.ts`
3. Review logs from fetcher script

**Reference:** QURAN_API_ASSESSMENT.md → Section: "Rate Limiting"

---

## Attribution Requirements

**MUST display in all UIs:**

```html
<footer>
  <p>
    Quranic text from <a href="https://quran.com">quran.com</a>
  </p>
  <p>
    Morphological analysis from
    <a href="http://corpus.quran.com">Quranic Arabic Corpus</a>
    (University of Leeds)
  </p>
</footer>
```

**License Compliance:**
- quran.com: Attribution required
- corpus.quran.com: GNU GPL (link required, cannot modify)

---

## Need Help?

### By Topic

| Topic | See Document | Section |
|-------|--------------|---------|
| Database schema | QURAN_DATA_REFERENCE.md | Database Schema |
| Query examples | QURAN_DATA_REFERENCE.md | Querying Data |
| UI integration | QURAN_DATA_REFERENCE.md | UI Integration Guide |
| API endpoints | QURAN_DATA_REFERENCE.md | API Examples |
| Data sources | QURAN_API_ASSESSMENT.md | Data Sources |
| Re-fetch data | FETCHING_STRATEGY_SUMMARY.md | How It Works |
| Constraints | PROJECT_CONSTRAINTS.md | Section 10 |
| Field meanings | QURAN_DATA_REFERENCE.md | Field Definitions |
| Pipeline flow | QURAN_DATA_REFERENCE.md | Data Processing Pipeline |

### Quick Commands

```bash
# View data in browser
npx prisma studio

# Test a query
npx prisma db execute --stdin < query.sql

# Re-generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-04 | Initial documentation system |

---

**Maintained By:** arQ Development Team
**Last Updated:** 2025-11-04
**Status:** Production-Ready ✅
