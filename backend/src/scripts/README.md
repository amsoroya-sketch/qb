# Quranic Data Import System

Comprehensive system for fetching, importing, and verifying Quranic verses with complete word-by-word grammatical analysis.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Usage](#usage)
- [Scripts](#scripts)
- [Data Sources](#data-sources)
- [Troubleshooting](#troubleshooting)

---

## Overview

This import system fetches Quranic text and morphological data from external APIs, transforms it to match our database schema, and imports it with comprehensive validation.

### Features

- ✅ **Multi-source data fetching** (AlQuran.cloud API, Quranic Corpus)
- ✅ **Rate limiting** (10 requests/second to respect API limits)
- ✅ **Retry logic** (3 attempts with exponential backoff)
- ✅ **Data caching** (saves to `backend/data/raw/` for offline processing)
- ✅ **Batch operations** (100 verses per transaction for performance)
- ✅ **Transactional imports** (rollback on any error)
- ✅ **Idempotent** (safe to re-run without duplicates)
- ✅ **Comprehensive validation** (text integrity, grammatical properties)
- ✅ **Progress tracking** (real-time progress indicators)
- ✅ **Detailed logging** (Winston logger with timestamps)

### The 7 Essential Grammatical Properties

Every word in the Quran is analyzed with these properties:

1. **POS Type** (Part of Speech) - Noun / Verb / Particle (اسم / فعل / حرف)
2. **Gender** - Masculine / Feminine (مذكر / مؤنث)
3. **Number** - Singular / Dual / Plural (مفرد / مثنى / جمع)
4. **Definiteness** - Definite / Indefinite (معرفة / نكرة)
5. **I'rab Case** - Nominative / Accusative / Genitive / Jussive (مرفوع / منصوب / مجرور / مجزوم)
6. **Case Sign** - Damma / Fatha / Kasra / Sukun (ضمة / فتحة / كسرة / سكون)
7. **Structure Type** - Simple / Idafa / Prepositional Phrase (مفرد / إضافة / جار ومجرور)

---

## Architecture

```
backend/src/scripts/
├── types/
│   └── quran-corpus.types.ts       # Type definitions
├── fetchers/
│   └── quran-corpus-fetcher.ts     # Data fetching from APIs
├── mappers/
│   └── quran-corpus-mapper.ts      # Transform to our schema
├── import-quran-data.ts            # Main import script
├── verify-quran-data.ts            # Verification script
└── README.md                       # This file

backend/data/
├── raw/                            # Cached API responses
│   ├── surah_1.json
│   ├── surah_108.json
│   └── ...
└── processed/                      # Transformed data (optional)
```

### Data Flow

```
External API
    ↓
Fetcher (with rate limiting & retry)
    ↓
Raw JSON Cache (backend/data/raw/)
    ↓
Mapper (transform to our schema)
    ↓
Validator (check data integrity)
    ↓
Importer (batch insert to PostgreSQL)
    ↓
Verifier (confirm data correctness)
```

---

## Usage

### Prerequisites

1. PostgreSQL database running
2. `.env` file configured with `DATABASE_URL`
3. Prisma migrations applied (`npm run prisma:migrate`)
4. Dependencies installed (`npm install`)

### Quick Start (MVP Surahs)

Import the 5 MVP surahs (Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kawthar):

```bash
# Step 1: Fetch data from APIs (caches to backend/data/raw/)
npm run quran:fetch

# Step 2: Import into database
npm run quran:import

# Step 3: Verify imported data
npm run quran:verify
```

### Advanced Usage

#### Dry Run (Preview without importing)

```bash
npm run quran:import:dry-run
```

Output:
```
DRY RUN MODE - No data will be inserted

Would import:
  - Surah 1: Al-Fatiha (7 verses)
  - Surah 108: Al-Kawthar (3 verses)
  - Surah 112: Al-Ikhlas (4 verses)
  - Surah 113: Al-Falaq (5 verses)
  - Surah 114: An-Nas (6 verses)
```

#### Force Re-import (Delete existing data)

```bash
# ⚠️ WARNING: This will delete existing Quranic data!
npm run quran:import:force
```

#### Fetch Only (No import)

```bash
npm run quran:fetch
```

This fetches data from APIs and caches it locally. Useful for:
- Offline development
- Testing data transformations
- Inspecting raw API responses

#### Verify Only (Check existing data)

```bash
npm run quran:verify
```

Runs comprehensive checks:
- ✅ Verse count per surah
- ✅ No missing verses
- ✅ All verses have words
- ✅ Grammatical properties populated
- ✅ No NULL values in required fields
- ✅ No text corruption

---

## Scripts

### 1. Fetcher (`quran-corpus-fetcher.ts`)

Fetches Quranic data from external APIs.

**Features:**
- Rate limiting (10 req/s)
- Retry logic (3 attempts)
- Progress tracking
- File caching

**APIs Used:**
- Primary: AlQuran.cloud API (https://api.alquran.cloud)
  - Arabic text (Uthmani script): `quran-uthmani`
  - Arabic text (simple): `quran-simple`
  - Translation: `en.sahih` (Sahih International)

**Output:**
- Cached JSON files in `backend/data/raw/surah_{number}.json`

**Example:**
```bash
npm run quran:fetch
```

### 2. Mapper (`quran-corpus-mapper.ts`)

Transforms Quranic Corpus format to our Prisma schema.

**Transformations:**
- Unicode NFC normalization (ensures consistent Arabic text)
- POS tag standardization (noun/verb/particle)
- Morphological feature extraction
- Arabic grammar translations (e.g., "masculine" → "مذكر")
- Case sign symbol mapping (e.g., "damma" → "ُ")

**Handles:**
- Missing/null values gracefully
- Multiple POS tag formats
- Particles (which don't have gender/number)

### 3. Importer (`import-quran-data.ts`)

Imports data into PostgreSQL with validation.

**Features:**
- Batch operations (100 verses per transaction)
- Transaction support (all-or-nothing)
- Idempotent (checks for existing verses)
- Progress tracking
- Error handling

**Options:**
```bash
npm run quran:import                # Normal import
npm run quran:import -- --force     # Delete existing data first
npm run quran:import -- --dry-run   # Preview without importing
npm run quran:import -- --no-validate  # Skip validation (not recommended)
```

**Expected Output:**
```
[0.00s] ℹ Starting Quranic data import...

=== Importing Surah 1/5: Al-Fatiha ===
⏳ Progress: 1/7 (14.3%) - Verse 1:1
⏳ Progress: 2/7 (28.6%) - Verse 1:2
...
✓ Imported Surah 1: 7 verses, 29 words

✓ Import completed successfully!
Total: 25 verses, 150 words
```

### 4. Verifier (`verify-quran-data.ts`)

Verifies data integrity and completeness.

**Checks:**
1. **Verse Count** - Each surah has correct number of verses
2. **Missing Verses** - No gaps in verse numbers
3. **Word Count** - Every verse has words
4. **Grammatical Properties** - All 7 properties populated where applicable
5. **NULL Values** - No NULL in required fields
6. **Text Integrity** - No corruption or replacement characters

**Example Output:**
```
🔍 Starting Quranic data verification...

📊 Checking verse counts per surah...
  ✓ Surah 1 (Al-Fatiha): 7/7 verses
  ✓ Surah 112 (Al-Ikhlas): 4/4 verses
  ...
  ✓ PASSED: All surahs have correct verse counts

🔢 Checking for missing verses...
  ✓ PASSED: No missing verses

📝 Checking word counts...
  ✓ PASSED: All verses have words

🔤 Checking grammatical properties coverage...
  ✓ PASSED: All 150 words have POS type

🔍 Checking for NULL values in required fields...
  ✓ PASSED: No NULL values in required fields

🔤 Checking text integrity...
  ✓ PASSED: No corrupted text detected

============================================================
VERIFICATION REPORT
============================================================

✅ OVERALL STATUS: PASSED
```

---

## Data Sources

### Primary Source: AlQuran.cloud API

**Endpoint:** `https://api.alquran.cloud/v1`

**Why we use it:**
- Free and open API
- JSON format (easy to parse)
- Multiple editions (Arabic, translations)
- Reliable and fast
- No API key required

**Editions used:**
- `quran-uthmani`: Uthmani script with diacritics
- `quran-simple`: Without diacritics
- `en.sahih`: Sahih International English translation

**Example API call:**
```
GET https://api.alquran.cloud/v1/ayah/1:1/quran-uthmani

Response:
{
  "data": {
    "number": 1,
    "text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    "surah": { "number": 1, "name": "الفاتحة" },
    "numberInSurah": 1
  }
}
```

### Secondary Source: Quranic Corpus

**Website:** https://corpus.quran.com

**Why we'll integrate it:**
- Gold standard for morphological analysis
- Detailed grammatical annotations
- Peer-reviewed by scholars
- Free for non-commercial use

**Note:** Current implementation uses simplified morphology. For production, integrate with Quranic Corpus XML data for complete accuracy.

### Alternative Sources (Fallbacks)

1. **Tanzil.net API** - https://tanzil.net/docs/download
2. **Al Quran Cloud API** - https://alquran.cloud/api
3. **Quran.com API** - https://quran.api-docs.io

---

## Troubleshooting

### Issue: "Connection refused" or "ECONNREFUSED"

**Cause:** PostgreSQL not running or wrong DATABASE_URL

**Fix:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check .env file
cat backend/.env

# Should contain:
DATABASE_URL="postgresql://user:password@localhost:5432/arq_db"
```

### Issue: "Table does not exist"

**Cause:** Prisma migrations not applied

**Fix:**
```bash
cd backend
npm run prisma:migrate
```

### Issue: "fetch is not defined" (Node.js < 18)

**Cause:** Using older Node.js version without native fetch

**Fix:**
```bash
# Option 1: Upgrade to Node.js 18+
nvm install 18
nvm use 18

# Option 2: Install node-fetch polyfill
npm install node-fetch
# Add to fetcher: import fetch from 'node-fetch';
```

### Issue: "Rate limit exceeded"

**Cause:** Too many requests to API

**Fix:**
- The fetcher has built-in rate limiting (10 req/s)
- If you hit rate limits, cached data in `backend/data/raw/` will be used
- Wait a few minutes and try again

### Issue: "Verification failed - verse count mismatch"

**Cause:** Incomplete import or API returned wrong data

**Fix:**
```bash
# Re-import with force flag
npm run quran:import:force

# Then verify
npm run quran:verify
```

### Issue: "Transaction failed: unique constraint violation"

**Cause:** Data already exists in database

**Fix:**
```bash
# Either use --force to delete existing data
npm run quran:import:force

# Or just continue (importer skips existing verses)
```

### Issue: "Morphology data missing"

**Cause:** AlQuran.cloud doesn't provide morphology

**Current Status:**
- Basic POS inference implemented (placeholder)
- Full morphology requires Quranic Corpus integration

**Roadmap:**
1. Download Quranic Corpus XML data
2. Parse XML morphological annotations
3. Map to our schema
4. Import alongside text data

### Getting Help

If you encounter issues not covered here:

1. Check the logs (they're verbose by design)
2. Run verification: `npm run quran:verify`
3. Check cached data: `ls -lh backend/data/raw/`
4. Check database: `npm run prisma:studio`

---

## Performance

**Expected Times (for 5 MVP surahs):**

- Fetching: ~30 seconds (with API calls)
- Fetching (cached): ~1 second
- Importing: ~5 seconds
- Verification: ~2 seconds
- **Total (first run)**: ~40 seconds
- **Total (cached)**: ~10 seconds

**Scaling to Full Quran (114 surahs, 6,236 verses, 77,429 words):**

- Estimated fetch time: ~15 minutes (first run)
- Estimated import time: ~2 minutes
- Estimated verification: ~10 seconds
- **Total**: ~18 minutes

**Optimization strategies:**
- Parallel fetching (multiple surahs at once)
- Larger batch sizes (500 verses per transaction)
- Database indexes (already configured in Prisma schema)
- Connection pooling (already enabled in Prisma)

---

## Next Steps

### For MVP (Current)

- [x] Fetch 5 surahs from AlQuran.cloud
- [x] Import with basic morphology
- [x] Verify data integrity
- [ ] Write unit tests for mapper
- [ ] Write integration tests for importer

### For Production

- [ ] Integrate Quranic Corpus XML data (full morphology)
- [ ] Add Quranic Corpus download script
- [ ] Parse XML morphological annotations
- [ ] Expand to all 114 surahs
- [ ] Add syntax tree data (i'rab relationships)
- [ ] Add root derivation data
- [ ] Add semantic tagging
- [ ] Implement full-text search vectors

---

## License

Data from Quranic Corpus is licensed under GNU Public License.
- Must attribute source as "Quranic Arabic Corpus"
- Must link to http://corpus.quran.com
- Cannot modify original text

---

**Last Updated:** 2025-11-04
**Version:** 1.0.0
