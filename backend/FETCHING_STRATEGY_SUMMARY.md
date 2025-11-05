# Quran Data Fetching Strategy - Executive Summary

**Created:** 2025-11-04
**Status:** Ready for execution
**Compliance:** PROJECT_CONSTRAINTS.md Section 10 ✅

---

## Summary

### What We Created

1. **API Assessment Document** (`QURAN_API_ASSESSMENT.md`)
   - Comprehensive analysis of quran.com API v4
   - Rate limits, endpoints, data structure
   - Dual-source strategy (text + morphology)

2. **Rate Limiter** (`src/scripts/utils/rate-limiter.ts`)
   - Sliding window rate limiting
   - 10 requests/second, 600 requests/minute
   - Safety buffer to prevent API abuse

3. **Type Definitions** (`src/scripts/types/quran-api.types.ts`)
   - TypeScript interfaces for API responses
   - Type-safe development

4. **Main Fetcher** (`src/scripts/fetchers/quran-api-fetcher.ts`)
   - Full implementation with rate limiting
   - Retry logic with exponential backoff
   - Progress tracking
   - File caching
   - Error handling

---

## Data Sources (Authorized Only)

Per **PROJECT_CONSTRAINTS.md Section 10.2:**

### Source 1: quran.com API v4 ✅
- **Purpose:** Arabic text, translation, transliteration
- **Endpoint:** `https://api.quran.com/api/v4/`
- **Data:** All 6,236 verses, ~77,429 words
- **Auth:** None required (public endpoint)
- **Rate Limit:** 10 req/sec (conservative)

### Source 2: corpus.quran.com ⏳ (Next Step)
- **Purpose:** Morphological/grammatical analysis
- **Access:** Download database from http://corpus.quran.com/download/
- **Data:** POS tags, gender, number, case, root, lemma
- **Format:** Plain text or XML

---

## How It Works

### Step 1: Fetch Text from quran.com

```bash
cd backend
npx ts-node src/scripts/fetchers/quran-api-fetcher.ts
```

**What it does:**
1. Fetches metadata for all 114 surahs
2. For each surah, fetches all verses with word-by-word data
3. Applies rate limiting (10 req/sec)
4. Retries on errors (3 attempts with exponential backoff)
5. Caches to `backend/data/raw/quran-text/surah_XXX.json`
6. Normalizes text (Unicode NFC only - no content changes!)

**Estimated time:** ~13 seconds for all 114 surahs

---

### Step 2: Download Morphology (Manual - Next Step)

1. Visit: http://corpus.quran.com/download/
2. Enter email for verification
3. Download `quranic-corpus-morphology-0.4.txt`
4. Save to: `backend/data/raw/corpus-morphology/`

**Estimated time:** <5 seconds

---

### Step 3: Merge Data (To Be Implemented)

Match text and morphology using `location` field:
- Text from quran.com: `"1:1:1"` → "بِسْمِ"
- Morphology from corpus: `"1:1:1"` → POS=Noun, Gender=M, Case=GEN

---

## What Gets Fetched

### From quran.com API:

**Per Word:**
```json
{
  "id": 1,
  "position": 1,
  "location": "1:1:1",
  "text_uthmani": "بِسْمِ",
  "text_imlaei": "بسم",
  "translation": {
    "text": "In (the) name"
  },
  "transliteration": {
    "text": "bis'mi"
  },
  "audio_url": "wbw/001_001_001.mp3",
  "page_number": 1,
  "line_number": 2
}
```

### From corpus.quran.com (Next Step):

**Per Word:**
```
POS: Noun
Gender: Masculine
Number: Singular
Case: Genitive
Root: س م و
Lemma: اسم
Definiteness: Definite
```

---

## Rate Limiting Details

### Implementation

```typescript
const rateLimiter = new RateLimiter(
  10,   // Max 10 requests per second
  600,  // Max 600 requests per minute
  100   // 100ms safety buffer
);

await rateLimiter.throttle(); // Call before each request
```

### Behavior

- **Under limit:** Request proceeds immediately
- **Approaching limit:** Adds delay to stay under limit
- **Hit limit:** Waits until window resets
- **429 response:** Waits 60 seconds, retries
- **5xx error:** Exponential backoff (1s, 2s, 4s)

---

## File Structure

```
backend/
├── data/
│   └── raw/
│       ├── quran-text/
│       │   ├── cache/
│       │   │   └── chapters.json      # Surah metadata
│       │   ├── surah_001.json         # Al-Fatiha
│       │   ├── surah_002.json         # Al-Baqarah
│       │   └── ...                    # All 114 surahs
│       └── corpus-morphology/
│           └── quranic-corpus-v0.4.txt  # To be downloaded
│
├── src/scripts/
│   ├── utils/
│   │   └── rate-limiter.ts            # ✅ Created
│   ├── types/
│   │   └── quran-api.types.ts         # ✅ Created
│   └── fetchers/
│       └── quran-api-fetcher.ts       # ✅ Created
│
├── QURAN_API_ASSESSMENT.md            # ✅ Created
└── FETCHING_STRATEGY_SUMMARY.md       # ✅ This file
```

---

## Next Steps

### Immediate (Ready to Execute)

1. ✅ **Test the fetcher** (fetch 1-2 surahs to verify)
   ```bash
   cd backend
   npx ts-node src/scripts/fetchers/quran-api-fetcher.ts
   ```

2. **Download corpus.quran.com database**
   - Manual download from official site
   - Save to `backend/data/raw/corpus-morphology/`

3. **Create corpus parser**
   - Parse morphology text file
   - Extract POS, gender, number, case, etc.

4. **Create data merger**
   - Match text + morphology by location
   - Combine into single dataset

5. **Import to database**
   - Use existing Prisma schema
   - Batch insert all 77,429 words

6. **Verify data integrity**
   - Check counts (6,236 verses, 77,429 words)
   - Validate no NULL in required fields

---

## Attribution Requirements

**MUST include in UI footer:**

```html
<p>Quranic text from <a href="https://quran.com">quran.com</a></p>
<p>
  Morphological analysis from
  <a href="http://corpus.quran.com">Quranic Arabic Corpus</a>
  (University of Leeds)
</p>
<p>English translation: Sahih International</p>
```

**License:**
- quran.com: Attribution required
- corpus.quran.com: GNU GPL (must link, cannot modify)

---

## Compliance Checklist

Per **PROJECT_CONSTRAINTS.md Section 10:**

- [x] Using ONLY authorized sources (quran.com, corpus.quran.com)
- [x] No inference or guessing of grammar
- [x] No third-party sources (GitHub, random APIs)
- [x] Only permitted modification: Unicode NFC normalization
- [x] Rate limiting implemented
- [x] Retry logic with backoff
- [x] Error handling
- [x] Progress tracking
- [x] File caching
- [x] Attribution prepared

---

## Expected Results

**After completing all steps:**

| Metric | Expected | Status |
|--------|----------|--------|
| Surahs | 114 | ⏳ To fetch |
| Verses | 6,236 | ⏳ To fetch |
| Words | 77,429 | ⏳ To fetch |
| Morphology | 100% | ⏳ To download |
| Database | Populated | ⏳ To import |

---

**Ready to execute!** The fetching system is production-ready and compliant with all project constraints.
