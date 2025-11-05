# Quran Data Sources Assessment

**Date:** 2025-11-04
**Purpose:** Comprehensive analysis of authorized data sources for arQ project
**Status:** Production-ready assessment

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [quran.com API v4 (Primary Text Source)](#qurancom-api-v4)
3. [corpus.quran.com (Grammar Source)](#corpusqurancom)
4. [Dual-Source Fetching Strategy](#dual-source-strategy)
5. [Rate Limiting & Best Practices](#rate-limiting)
6. [Implementation Recommendations](#implementation)

---

## Executive Summary

### Data Sources (Per PROJECT_CONSTRAINTS.md Section 10.2)

| Source | Purpose | Data Provided | Authentication | Morphology |
|--------|---------|---------------|----------------|------------|
| **quran.com API v4** | Arabic text, translations | ✅ Complete | OAuth2 required | ❌ No |
| **corpus.quran.com** | Grammatical analysis | ❌ Text limited | None | ✅ Yes |

### Strategy

**Two-Step Fetch Process:**
1. Fetch all verses + words from quran.com API v4 (text, translation, transliteration)
2. Fetch morphological analysis from corpus.quran.com (POS, gender, case, etc.)
3. Merge both datasets using location matching (surah:verse:word)

---

## quran.com API v4

### Base Information

**Base URLs:**
- Production: `https://api.quran.com/api/v4/`
- Alternative: `https://apis.quran.foundation/content/api/v4/`

**Authentication:**
- Method: OAuth2 Client Credentials
- Token Lifetime: 1 hour (3600 seconds)
- Headers Required:
  ```
  x-auth-token: <access_token>
  x-client-id: <client_id>
  ```

**Note:** Currently the public endpoint `https://api.quran.com/api/v4/` works WITHOUT authentication for read-only access. This may change.

---

### Key Endpoints

#### 1. Get Chapters (Surahs) Metadata

```http
GET /chapters
```

**Response:**
```json
{
  "chapters": [
    {
      "id": 1,
      "revelation_place": "makkah",
      "revelation_order": 5,
      "bismillah_pre": true,
      "name_simple": "Al-Fatihah",
      "name_arabic": "الفاتحة",
      "verses_count": 7,
      "pages": [1, 1],
      "translated_name": {
        "name": "The Opening",
        "language_name": "english"
      }
    }
  ]
}
```

---

#### 2. Get Verses by Chapter (PRIMARY ENDPOINT)

```http
GET /verses/by_chapter/{chapter_number}
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `language` | string | 'en' | Language code |
| `words` | boolean | true | Include word-by-word data |
| `translations` | string | - | Translation IDs (comma-separated) |
| `word_fields` | string | all | Fields to include (comma-separated) |
| `page` | int | 1 | Page number |
| `per_page` | int | 10 | Results per page (max: 50) |

**Available Word Fields:**
- `id` - Unique word ID
- `position` - Position in verse (1-indexed)
- `text_uthmani` - Uthmani script with diacritics
- `text_indopak` - Indo-Pak script
- `text_imlaei` - Imlaei script (simple)
- `audio_url` - Word audio file path
- `location` - Format: "surah:verse:word" (e.g., "1:1:1")
- `char_type_name` - "word" or "end" (verse marker)
| `translation` - Word translation object
- `transliteration` - Word transliteration object
- `page_number` - Mushaf page number
- `line_number` - Line number on page
- `code_v1`, `code_v2` - Font rendering codes (not morphology)
- `v1_page`, `v2_page` - Page numbers for different Mushaf versions

---

### Example Request

```bash
curl "https://api.quran.com/api/v4/verses/by_chapter/1?\
language=en&\
words=true&\
word_fields=text_uthmani,location,translation,transliteration&\
per_page=50"
```

**Response Structure:**
```json
{
  "verses": [
    {
      "id": 1,
      "verse_number": 1,
      "verse_key": "1:1",
      "words": [
        {
          "id": 1,
          "position": 1,
          "text_uthmani": "بِسْمِ",
          "location": "1:1:1",
          "translation": {
            "text": "In (the) name",
            "language_name": "english"
          },
          "transliteration": {
            "text": "bis'mi",
            "language_name": "english"
          }
        }
      ]
    }
  ],
  "pagination": {
    "per_page": 50,
    "current_page": 1,
    "next_page": 2,
    "total_pages": 5,
    "total_records": 286
  }
}
```

---

### What quran.com API Provides

✅ **Available:**
- Arabic text (multiple scripts: Uthmani, Indo-Pak, Imlaei)
- Word-by-word translation
- Word-by-word transliteration
- Audio files for each word
- Verse metadata (page, juz, ruku, etc.)
- Location identifiers for each word

❌ **NOT Available:**
- Morphological analysis (POS, gender, number, case)
- Root and lemma information
- Grammatical relationships
- Syntax tree data

---

### Rate Limiting

**Official Limits:** Not explicitly documented

**Conservative Approach (Recommended):**
- **10 requests/second** - Safe baseline
- **600 requests/minute** - Conservative limit
- **Implement exponential backoff** on errors
- **Add 100ms delay between requests** to be respectful

**Error Handling:**
- 429 Too Many Requests → Wait 60 seconds, retry
- 5xx Server Errors → Wait 5 seconds, retry (max 3 attempts)
- 4xx Client Errors → Log and skip

---

## corpus.quran.com

### Overview

**URL:** http://corpus.quran.com
**Authority:** University of Leeds, Language Research Group
**Data:** Morphological and syntactic analysis of all 77,429 words
**License:** GNU GPL (must attribute, cannot modify)

---

### Access Methods

#### Method 1: Web Scraping (NOT RECOMMENDED)

```
http://corpus.quran.com/wordbyword.jsp?chapter=1&verse=1
```

**Problems:**
- HTML parsing required
- Fragile (layout changes break parser)
- No official API
- Rate limiting unclear
- Violates best practices

#### Method 2: Download Database (RECOMMENDED ✅)

**Access:**
1. Visit: http://corpus.quran.com/download/
2. Requires email verification
3. Download v0.4 (latest stable version)
4. Format: Plain text or XML

**Advantages:**
- One-time download
- Offline processing
- No rate limit concerns
- Complete dataset
- Stable format

---

### Morphological Data Structure

**Example from corpus.quran.com for "بِسْمِ" (1:1:1):**

```
Location: (1:1:1)
Arabic: بِسْمِ
Translation: In the name

Morphology:
- POS: Noun (N)
- Root: س م و
- Lemma: اسم
- Gender: Masculine
- Number: Singular
- Case: Genitive
- Case Sign: Kasra
- Definiteness: Definite
- Structure: Prepositional Phrase (جار ومجرور)
```

---

### Data Format

**Plain Text Format:**
```
LOCATION:(1:1:1)
PREFIX:bi
STEM:POS:N|ROOT:smw|LEM:ism|GEN:M|NUM:S|CASE:GEN
```

**Field Mappings:**
- `POS` → Part of Speech (N=Noun, V=Verb, P=Particle)
- `ROOT` → Arabic root (3-4 letters)
- `LEM` → Lemma (dictionary form)
- `GEN` → Gender (M=Masculine, F=Feminine)
- `NUM` → Number (S=Singular, D=Dual, P=Plural)
- `CASE` → I'rab case (NOM=Nominative, ACC=Accusative, GEN=Genitive)

---

## Dual-Source Strategy

### Workflow

```
Step 1: Fetch from quran.com API
    ↓
  For each surah (1-114):
    For each verse page (max 50 verses):
      GET /verses/by_chapter/{surah}?page={n}&per_page=50&words=true
      Extract: text, translation, transliteration, location
      Save to: backend/data/raw/quran-text/surah_{n}.json

Step 2: Load corpus.quran.com data
    ↓
  Download once: corpus-morphology-v0.4.txt
  Parse morphological data
  Index by location (surah:verse:word)
  Save to: backend/data/raw/corpus-morphology/morphology.json

Step 3: Merge datasets
    ↓
  For each word:
    text_data = quran_api[location]
    morphology_data = corpus[location]
    merged = {
      ...text_data,
      ...morphology_data,
      source_text: "quran.com",
      source_morphology: "corpus.quran.com"
    }

Step 4: Import to database
    ↓
  Batch insert to PostgreSQL
  Verify data integrity
```

---

### Location Matching

**Key:** Use `location` field as primary key

**Format:** `"surah:verse:word"` (e.g., `"1:1:1"`)

**Matching Logic:**
```typescript
const quranData = quranAPI.getWord("1:1:1");
const morphology = corpusData.getWord("1:1:1");

const completeWord = {
  // From quran.com
  arabicText: quranData.text_uthmani,
  translation: quranData.translation.text,
  transliteration: quranData.transliteration.text,

  // From corpus.quran.com
  posType: morphology.pos,
  gender: morphology.gender,
  number: morphology.number,
  irabCase: morphology.case,
  root: morphology.root,
  lemma: morphology.lemma,
};
```

---

## Rate Limiting

### quran.com API Rate Limiter

```typescript
class RateLimiter {
  private requestTimes: number[] = [];
  private readonly maxRequestsPerSecond = 10;
  private readonly maxRequestsPerMinute = 600;

  async throttle(): Promise<void> {
    const now = Date.now();

    // Remove requests older than 1 minute
    this.requestTimes = this.requestTimes.filter(
      time => now - time < 60000
    );

    // Check minute limit
    if (this.requestTimes.length >= this.maxRequestsPerMinute) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = 60000 - (now - oldestRequest);
      await this.sleep(waitTime);
    }

    // Check second limit (last 10 requests)
    const recentRequests = this.requestTimes.slice(-this.maxRequestsPerSecond);
    if (recentRequests.length >= this.maxRequestsPerSecond) {
      const oldestRecent = recentRequests[0];
      const waitTime = 1000 - (now - oldestRecent);
      if (waitTime > 0) {
        await this.sleep(waitTime);
      }
    }

    // Add safety buffer
    await this.sleep(100);

    this.requestTimes.push(Date.now());
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

---

## Implementation

### Fetch Script Architecture

```
backend/src/scripts/
├── fetchers/
│   ├── quran-api-fetcher.ts          # quran.com API client
│   ├── corpus-parser.ts              # Parse downloaded corpus data
│   └── data-merger.ts                # Merge both sources
├── types/
│   └── quran-data.types.ts           # TypeScript interfaces
├── utils/
│   └── rate-limiter.ts               # Rate limiting utility
└── fetch-complete-quran.ts           # Main orchestrator
```

---

### Estimated Fetch Times

**quran.com API (6,236 verses):**
- Verses per request: 50
- Total requests: ~125 requests (for all 114 surahs)
- Rate limit: 10 req/sec
- **Estimated time: ~13 seconds** (with rate limiting)

**corpus.quran.com:**
- Method: One-time download
- File size: ~5-10 MB
- **Estimated time: <5 seconds**

**Total Data Fetch: ~20 seconds**

---

### Storage Structure

```
backend/data/
├── raw/
│   ├── quran-text/
│   │   ├── surah_001.json  # From quran.com API
│   │   ├── surah_002.json
│   │   └── ...
│   ├── corpus-morphology/
│   │   └── quranic-corpus-morphology-0.4.txt  # Downloaded once
│   └── merged/
│       ├── complete_data.json  # Merged dataset
│       └── index.json          # Location index
└── processed/
    └── import-ready.json       # Formatted for database
```

---

### Data Attribution (Required)

**In all UIs and documentation:**

```html
<footer>
  <p>Quranic text from <a href="https://quran.com">quran.com</a></p>
  <p>Morphological analysis from
    <a href="http://corpus.quran.com">Quranic Arabic Corpus</a>
    (University of Leeds)
  </p>
  <p>English translation: Sahih International</p>
</footer>
```

**License Compliance:**
- quran.com: Must attribute
- corpus.quran.com: GNU GPL (must link, cannot modify original)

---

## Next Steps

1. ✅ Implement `quran-api-fetcher.ts` with rate limiting
2. ✅ Download corpus.quran.com morphology database
3. ✅ Implement `corpus-parser.ts` to parse morphology file
4. ✅ Implement `data-merger.ts` to combine datasets
5. ✅ Test with Surah Al-Fatiha (7 verses)
6. ✅ Run full fetch for all 114 surahs
7. ✅ Import to PostgreSQL database
8. ✅ Verify data integrity

---

**Last Updated:** 2025-11-04
**Version:** 1.0
**Status:** Production-Ready Assessment
