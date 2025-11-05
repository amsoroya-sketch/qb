# DATA ARCHITECTURE & IMPLEMENTATION GUIDE

**Project:** arQ - Quranic Arabic Grammar LMS
**Version:** 1.0
**Date:** 2025-11-02
**Document Type:** Database Design & Data Integration Architecture

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Data Sourcing Strategy](#2-data-sourcing-strategy)
3. [Complete Database Schema](#3-complete-database-schema)
4. [Cross-Reference System](#4-cross-reference-system)
5. [Data Import Pipeline](#5-data-import-pipeline)
6. [API Architecture](#6-api-architecture)
7. [Caching Strategy](#7-caching-strategy)
8. [Search & Discovery](#8-search--discovery)
9. [Performance Optimization](#9-performance-optimization)
10. [Implementation Scripts](#10-implementation-scripts)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Hybrid Data Architecture

The arQ system uses a **hybrid approach** combining:

```
┌──────────────────────────────────────────────────────────────┐
│         ONE-TIME IMPORT (Initial Setup)                      │
├──────────────────────────────────────────────────────────────┤
│  Quranic Corpus API → Process → Local PostgreSQL Database   │
│  77,429 words with complete POS analysis                    │
│  One-time operation (6-8 hours)                             │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│         RUNTIME (User Requests)                              │
├──────────────────────────────────────────────────────────────┤
│  Local Database → Fast Queries (< 50ms) → User Interface    │
│  No external API calls needed                               │
│  Offline-capable                                            │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Key Benefits

✅ **Performance**: <50ms query time vs 300-500ms API calls
✅ **Reliability**: 99.9% uptime under your control
✅ **Offline Support**: PWA functionality
✅ **Customization**: Add educational enhancements
✅ **Scalability**: No external rate limits
✅ **Cost Efficiency**: No per-request API fees

### 1.3 Database Size

```
Total Database Size: ~450 MB
├── quran_verses: ~12 MB (6,236 verses)
├── verse_words: ~387 MB (77,429 words with POS)
├── arabic_roots: ~3 MB (~1,500 roots)
├── root_occurrences: ~39 MB (cross-reference)
├── lessons: ~50 MB (250+ lessons)
├── exercises: ~30 MB (500+ exercises)
└── user_progress: Variable (grows with users)

Optional Audio (if self-hosted):
├── Word-by-word: ~15 GB
└── Full verses: ~5 GB
Recommendation: Use CDN URLs
```

---

## 2. DATA SOURCING STRATEGY

### 2.1 Primary Data Sources

```javascript
const DATA_SOURCES = {
  // PRIMARY SOURCE: Quranic Arabic Corpus
  primary: {
    name: 'Quranic Arabic Corpus',
    url: 'http://corpus.quran.com',
    api_url: 'http://corpus.quran.com/download/',
    coverage: 'Complete morphological & syntactic analysis',
    format: 'XML',
    license: 'Open source (GPL)',
    authority: 'University of Leeds',
    words_analyzed: 77429,
    features: [
      'Morphological analysis',
      'Syntactic tree bank',
      'Semantic ontology',
      'Part-of-speech tagging',
      'Arabic roots',
      'Dependency relations'
    ]
  },

  // SUPPLEMENTARY SOURCES
  quran_text: {
    name: 'Tanzil.net',
    url: 'https://tanzil.net/docs/download',
    format: 'XML/Text',
    scripts: ['Uthmani', 'Simple', 'Imlaei']
  },

  translations: {
    api: 'https://api.quran.com/api/v4/translations',
    languages: ['en', 'ur', 'fr', 'id', 'tr', 'es']
  },

  audio: {
    everyayah: 'https://everyayah.com/',
    reciters: ['Mishary_Rashid_Alafasy', 'Abdul_Basit_Mujawwad'],
    format: 'MP3'
  }
};
```

### 2.2 Import Strategy

```
PHASE 1: Initial Import (One-Time)
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Step 1: Download Quranic Corpus XML                        │
│          (~200 MB compressed)                                │
│          ↓                                                   │
│  Step 2: Parse XML → Extract POS data                       │
│          (All 77,429 words)                                  │
│          ↓                                                   │
│  Step 3: Structure into JSON                                │
│          (Intermediate format)                               │
│          ↓                                                   │
│  Step 4: Import to PostgreSQL                               │
│          (Tables: quran_verses, verse_words)                │
│          ↓                                                   │
│  Step 5: Generate cross-references                          │
│          (Roots, related verses)                            │
│          ↓                                                   │
│  Step 6: Add educational enhancements                       │
│          (Custom explanations by level)                     │
│          ↓                                                   │
│  Step 7: Build search indexes                               │
│          (Full-text, root search)                           │
│          ↓                                                   │
│  ✅ COMPLETE: Ready for production use                      │
│                                                              │
│  Duration: 6-8 hours (automated)                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. COMPLETE DATABASE SCHEMA

### 3.1 Core Quranic Data Tables

#### **TABLE: quran_verses**

```sql
-- ============================================
-- Stores all 6,236 verses of the Quran
-- ============================================
CREATE TABLE quran_verses (
    verse_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Verse Reference (Unique identifier)
    surah_number INTEGER NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    ayah_number INTEGER NOT NULL CHECK (ayah_number >= 1),

    -- Surah Information
    surah_name_en VARCHAR(255) NOT NULL,
    surah_name_ar VARCHAR(255) NOT NULL,
    surah_transliteration VARCHAR(255),
    surah_revelation_place VARCHAR(20) CHECK (surah_revelation_place IN ('Meccan', 'Medinan')),
    surah_revelation_order INTEGER,
    total_ayahs_in_surah INTEGER,

    -- Verse Text (Multiple Scripts)
    verse_text_uthmani TEXT NOT NULL,      -- With full Uthmanic diacritics
    verse_text_simple TEXT NOT NULL,       -- Simplified without diacritics
    verse_text_imlaei TEXT,                 -- Modern orthography
    verse_text_indopak TEXT,                -- Indo-Pak script

    -- Transliteration
    transliteration TEXT,

    -- Translations (JSONB for flexibility - can add unlimited languages)
    translations JSONB DEFAULT '{}'::jsonb,
    -- Structure: {
    --   "en": "Translation in English",
    --   "ur": "Translation in Urdu",
    --   "fr": "Translation in French",
    --   ...
    -- }

    -- Audio
    audio_url TEXT,
    audio_reciter VARCHAR(100),
    audio_duration_ms INTEGER,

    -- Metadata for Navigation
    juz_number INTEGER CHECK (juz_number BETWEEN 1 AND 30),
    page_number INTEGER,
    hizb_number INTEGER,
    manzil_number INTEGER CHECK (manzil_number BETWEEN 1 AND 7),
    ruku_number INTEGER,

    -- Sajdah information
    has_sajdah BOOLEAN DEFAULT false,
    sajdah_type VARCHAR(20), -- 'obligatory' or 'recommended'
    sajdah_number INTEGER,

    -- Timestamps
    imported_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),

    -- Unique constraint
    UNIQUE(surah_number, ayah_number)
);

-- Indexes for fast queries
CREATE INDEX idx_verses_surah ON quran_verses(surah_number);
CREATE INDEX idx_verses_juz ON quran_verses(juz_number);
CREATE INDEX idx_verses_page ON quran_verses(page_number);
CREATE INDEX idx_verses_revelation ON quran_verses(surah_revelation_place);

-- Full-text search on translations
CREATE INDEX idx_verses_translations_en ON quran_verses
    USING gin ((translations->>'en') gin_trgm_ops);

-- Sample data
INSERT INTO quran_verses (
    surah_number, ayah_number,
    surah_name_en, surah_name_ar,
    verse_text_uthmani, verse_text_simple,
    translations,
    juz_number, page_number
) VALUES (
    1, 2,
    'Al-Fatiha', 'الفاتحة',
    'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    'الحمد لله رب العالمين',
    '{"en": "[All] praise is [due] to Allah, Lord of the worlds.", "ar": "الحمد لله رب العالمين"}'::jsonb,
    1, 1
);
```

---

#### **TABLE: verse_words** (THE CORE POS DATA)

```sql
-- ============================================
-- Stores complete grammatical analysis for all 77,429 words
-- This is the heart of the POS system!
-- ============================================
CREATE TABLE verse_words (
    word_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verse_id UUID NOT NULL REFERENCES quran_verses(verse_id) ON DELETE CASCADE,

    -- Word Identification
    word_position INTEGER NOT NULL,  -- 0-indexed position in verse
    word_text TEXT NOT NULL,         -- Full word with diacritics: ٱلْحَمْدُ
    word_simple TEXT NOT NULL,       -- Without diacritics: الحمد

    -- Basic Classification (for quick access)
    word_type VARCHAR(50) NOT NULL,  -- 'noun', 'verb', 'particle'
    word_category VARCHAR(50),       -- More specific: 'proper_noun', 'common_noun', etc.

    -- Translation
    translation_en TEXT,
    translation_ar TEXT,
    transliteration TEXT,

    -- ============================================
    -- COMPLETE GRAMMATICAL ANALYSIS (FROM CORPUS)
    -- Stored as JSONB for flexibility
    -- ============================================
    analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Complete structure documented below

    -- ============================================
    -- VISUALIZATION DATA (CUSTOM ADDITIONS)
    -- For rendering in different UI modes
    -- ============================================
    visualization JSONB DEFAULT '{}'::jsonb,
    -- Structure documented below

    -- ============================================
    -- EDUCATIONAL ENHANCEMENTS (CUSTOM)
    -- Level-specific explanations
    -- ============================================
    educational_data JSONB DEFAULT '{}'::jsonb,
    -- Structure documented below

    -- ============================================
    -- RELATED DATA
    -- Links to other content
    -- ============================================
    related_data JSONB DEFAULT '{}'::jsonb,

    -- Audio
    word_audio_url TEXT,
    audio_reciter VARCHAR(100),
    audio_duration_ms INTEGER,

    -- Timestamps
    imported_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),

    -- Unique constraint
    UNIQUE(verse_id, word_position)
);

-- Essential Indexes
CREATE INDEX idx_words_verse ON verse_words(verse_id);
CREATE INDEX idx_words_type ON verse_words(word_type);
CREATE INDEX idx_words_position ON verse_words(verse_id, word_position);

-- GIN indexes for JSONB queries (fast!)
CREATE INDEX idx_words_root ON verse_words
    USING gin ((analysis->'morphology'->'root'));
CREATE INDEX idx_words_pos_detailed ON verse_words
    USING gin ((analysis->'pos_detailed'));
CREATE INDEX idx_words_syntax ON verse_words
    USING gin ((analysis->'syntax'));

-- Full-text search
CREATE INDEX idx_words_text ON verse_words
    USING gin (to_tsvector('arabic', word_text));
```

---

#### **JSONB Structure: analysis field**

```json
{
  "pos_detailed": {
    "type": "noun",
    "subtype": "common_noun",
    "definiteness": "definite",
    "case": "nominative",
    "case_marker": "damma",
    "case_sign": "ُ",
    "number": "singular",
    "gender": "masculine",
    "state": "determined"
  },

  "morphology": {
    "root": {
      "arabic": "ح م د",
      "transliteration": "h-m-d",
      "meaning_en": "to praise, to thank",
      "meaning_ar": "حمد، شكر"
    },
    "template": "فَعْل",
    "pattern_type": "Form I noun",
    "pattern_meaning": "verbal noun (masdar)",
    "derivation": "مصدر",

    "letters": [
      {
        "position": 1,
        "letter": "ا",
        "letter_name": "alif",
        "type": "definite_article",
        "function": "definiteness marker",
        "diacritic": null,
        "is_root": false
      },
      {
        "position": 2,
        "letter": "ل",
        "letter_name": "lam",
        "type": "definite_article",
        "function": "definiteness marker",
        "diacritic": "sukun",
        "is_root": false
      },
      {
        "position": 3,
        "letter": "ح",
        "letter_name": "ha",
        "type": "root_letter",
        "root_position": "first_radical",
        "root_label": "ف",
        "diacritic": "fatha",
        "is_root": true
      },
      {
        "position": 4,
        "letter": "م",
        "letter_name": "meem",
        "type": "root_letter",
        "root_position": "second_radical",
        "root_label": "ع",
        "diacritic": "sukun",
        "is_root": true
      },
      {
        "position": 5,
        "letter": "د",
        "letter_name": "dal",
        "type": "root_letter",
        "root_position": "third_radical",
        "root_label": "ل",
        "diacritic": "damma",
        "is_root": true
      }
    ],

    "morphological_features": [
      {"feature": "definite", "value": true},
      {"feature": "declinable", "value": true}
    ]
  },

  "syntax": {
    "grammatical_role": "subject",
    "arabic_term": "مبتدأ",
    "english_term": "subject of nominal sentence",
    "sentence_type": "nominal_sentence",
    "relation_to_parent": "subject_of",
    "parent_node": "sentence",

    "irab": {
      "case": "marfoo",
      "case_arabic": "مرفوع",
      "reason": "subject_of_nominal_sentence",
      "reason_arabic": "مبتدأ",
      "sign": "damma",
      "sign_arabic": "الضمة",
      "full_irab_arabic": "مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره",
      "full_irab_english": "Subject, nominative, the sign of which is the visible damma at its end"
    },

    "dependency": {
      "parent_word_position": null,
      "relation_type": "root",
      "children_positions": [1, 2, 3]
    }
  },

  "semantic": {
    "meaning_category": "abstract_concept",
    "semantic_role": "theme",
    "named_entity": false
  },

  "quranic_corpus_data": {
    "segment_id": "1:2:1",
    "token_id": "1:2:1:1",
    "morphemes": [...],
    "features": [...]
  }
}
```

---

#### **JSONB Structure: visualization field**

```json
{
  "color_coded": {
    "primary_color": "#4169E1",
    "hover_color": "#5179F1",
    "text_color": "#FFFFFF",
    "border_color": "#3159D1"
  },

  "tree_diagram": {
    "node_type": "NP",
    "node_label": "Noun Phrase",
    "parent_node": "S",
    "children": [
      {"type": "DET", "value": "ال", "position": "prefix"},
      {"type": "N", "value": "حَمْد", "position": "root"}
    ],
    "x_position": 100,
    "y_position": 50,
    "level": 2,
    "is_terminal": true
  },

  "mind_map": {
    "central_node": false,
    "bubble_size": "medium",
    "connections": [
      {"to_word_position": 1, "relation": "predicate"}
    ],
    "radial_position": 45
  },

  "morphology_layers": [
    {
      "layer": 1,
      "name_en": "Root",
      "name_ar": "الجذر",
      "value": "ح م د",
      "color": "#9370DB",
      "order": 1
    },
    {
      "layer": 2,
      "name_en": "Template",
      "name_ar": "الوزن",
      "value": "فَعْل",
      "color": "#8B7AC7",
      "order": 2
    },
    {
      "layer": 3,
      "name_en": "Definiteness",
      "name_ar": "التعريف",
      "value": "ال",
      "color": "#7364B4",
      "order": 3
    },
    {
      "layer": 4,
      "name_en": "Case Ending",
      "name_ar": "علامة الإعراب",
      "value": "ُ (damma)",
      "color": "#5B4EA1",
      "order": 4
    }
  ],

  "card_data": {
    "front": "ٱلْحَمْدُ",
    "back_sections": [
      {"title_en": "Meaning", "title_ar": "المعنى", "content": "The praise"},
      {"title_en": "Type", "title_ar": "النوع", "content": "Noun (اسم)"},
      {"title_en": "Root", "title_ar": "الجذر", "content": "ح م د"},
      {"title_en": "Grammar", "title_ar": "القواعد", "content": "Subject (مبتدأ)"}
    ]
  },

  "timeline": {
    "show_in_timeline": true,
    "position_index": 0,
    "width_ratio": 1.0
  }
}
```

---

#### **JSONB Structure: educational_data field**

```json
{
  "beginner_explanation": {
    "en": "This is a NOUN. Nouns are words that name people, places, things, or ideas. 'الْحَمْدُ' means 'the praise' - it's naming a concept.",
    "ar": "هذا اسم. الأسماء هي كلمات تسمي الأشخاص أو الأماكن أو الأشياء أو الأفكار."
  },

  "intermediate_explanation": {
    "en": "This is a NOUN in the NOMINATIVE case (مرفوع). It's the SUBJECT (مبتدأ) of a nominal sentence. The damma (ُ) at the end shows it's nominative.",
    "ar": "هذا اسم مرفوع. إنه المبتدأ في جملة اسمية. الضمة (ُ) في النهاية تدل على أنه مرفوع."
  },

  "advanced_explanation": {
    "en": "الْحَمْدُ is a definite common noun, functioning as the subject (مبتدأ) of a nominal sentence. It's nominative (مرفوع) as indicated by the visible damma. The root ح م د means 'to praise', and this word follows the فَعْل pattern, making it a verbal noun (مصدر).",
    "ar": "الْحَمْدُ اسم معرفة، وهو المبتدأ في جملة اسمية. مرفوع بالضمة الظاهرة. الجذر ح م د يعني 'الثناء'، وهذه الكلمة على وزن فَعْل مما يجعلها مصدراً."
  },

  "expert_notes": {
    "en": "الْحَمْدُ لِلَّهِ: Classical grammarians debate whether لِلَّهِ is the predicate (خبر) directly, or whether there's an omitted predicate (خبر محذوف) with the sense of 'is established/due' (ثابت/كائن). Sibawayh considered لِلَّهِ as the predicate, while al-Zamakhshari argued for the omitted predicate interpretation. The definiteness of الْحَمْدُ implies ALL praise (not just some) belongs to Allah, a rhetorical device (استغراق) emphasizing exclusivity.",
    "ar": "في 'الْحَمْدُ لِلَّهِ': اختلف النحاة الكلاسيكيون حول ما إذا كان 'لِلَّهِ' هو الخبر مباشرة، أم أن هناك خبراً محذوفاً..."
  },

  "teaching_tips": [
    "Point out the ال prefix to show definiteness",
    "Compare with indefinite حَمْدٌ to show the difference",
    "Ask students to identify the case marker (damma)",
    "Show how the word structure: ال + root (حمد) + case marker"
  ],

  "common_mistakes": [
    {
      "mistake": "Confusing with verb حَمِدَ",
      "correction": "الْحَمْدُ is a noun (the praise), حَمِدَ is a verb (he praised)"
    },
    {
      "mistake": "Not recognizing the definiteness",
      "correction": "ال makes it definite, meaning ALL praise, not just some praise"
    }
  ],

  "practice_suggestions": [
    {
      "type": "identification",
      "instruction": "Find other nouns in this verse",
      "answer_count": 3
    },
    {
      "type": "case_analysis",
      "instruction": "Why is this word nominative?",
      "hint": "Look at its role in the sentence"
    }
  ]
}
```

---

#### **JSONB Structure: related_data field**

```json
{
  "other_verses_with_root": [
    {"surah": 1, "ayah": 1, "word_position": 2},
    {"surah": 6, "ayah": 45, "word_position": 8},
    {"surah": 17, "ayah": 111, "word_position": 1}
  ],

  "derivatives_from_same_root": [
    {"word": "حَامِد", "meaning": "one who praises"},
    {"word": "مَحْمُود", "meaning": "praiseworthy"},
    {"word": "أَحْمَد", "meaning": "more praiseworthy, Ahmad"},
    {"word": "مُحَمَّد", "meaning": "Muhammad (highly praised)"}
  ],

  "related_grammar_lessons": [
    {
      "lesson_id": "lesson_2_2_1",
      "title_en": "What is a Noun?",
      "title_ar": "ما هو الاسم؟",
      "relevance": "introduces_concept",
      "estimated_time_min": 12
    },
    {
      "lesson_id": "lesson_4_2_1",
      "title_en": "Nominative Case",
      "title_ar": "الرفع",
      "relevance": "explains_case",
      "estimated_time_min": 15
    }
  ],

  "pos_library_topics": [
    {
      "topic_id": "pos_noun",
      "title_en": "Noun (اسم)",
      "section": "2.1"
    },
    {
      "topic_id": "pos_case_nominative",
      "title_en": "Nominative Case",
      "section": "2.5.1"
    }
  ],

  "similar_grammatical_patterns": [
    {
      "pattern": "definite_noun_nominative",
      "example_verses": [
        {"surah": 2, "ayah": 2, "word": "ٱلْكِتَٰبُ"},
        {"surah": 112, "ayah": 1, "word": "ٱللَّهُ"}
      ]
    }
  ],

  "tafsir_notes": [
    {
      "scholar": "Ibn Kathir",
      "note_en": "The praise mentioned here is comprehensive, including all types of praise...",
      "reference": "Tafsir Ibn Kathir, Surah Al-Fatiha"
    }
  ]
}
```

---

### 3.2 Root & Derivative Tables

#### **TABLE: arabic_roots**

```sql
-- ============================================
-- Stores all Arabic roots found in the Quran (~1,500 roots)
-- ============================================
CREATE TABLE arabic_roots (
    root_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Root Identification
    root_arabic VARCHAR(10) NOT NULL UNIQUE,      -- e.g., "ح م د"
    root_transliteration VARCHAR(20) NOT NULL,    -- e.g., "h-m-d"
    root_pattern VARCHAR(10),                      -- e.g., "ف ع ل" (trilateral)

    -- Meanings
    base_meaning_en TEXT NOT NULL,
    base_meaning_ar TEXT NOT NULL,
    semantic_field VARCHAR(100),                   -- e.g., "praise, gratitude"

    -- Statistics
    occurrence_count INTEGER DEFAULT 0,            -- Total occurrences in Quran
    verse_count INTEGER DEFAULT 0,                 -- Number of verses containing this root
    unique_word_forms INTEGER DEFAULT 0,           -- Number of unique derivatives

    -- Derivatives (words formed from this root)
    derivatives JSONB DEFAULT '[]'::jsonb,
    -- [
    --   {"word": "حَمْد", "type": "noun", "meaning": "praise"},
    --   {"word": "حَامِد", "type": "active_participle", "meaning": "one who praises"},
    --   {"word": "مَحْمُود", "type": "passive_participle", "meaning": "praiseworthy"}
    -- ]

    -- Educational Content
    explanation_en TEXT,
    explanation_ar TEXT,
    usage_notes TEXT,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_roots_arabic ON arabic_roots(root_arabic);
CREATE INDEX idx_roots_transliteration ON arabic_roots(root_transliteration);
CREATE INDEX idx_roots_occurrence ON arabic_roots(occurrence_count DESC);
CREATE INDEX idx_derivatives ON arabic_roots USING gin (derivatives);

-- Sample data
INSERT INTO arabic_roots (
    root_arabic, root_transliteration,
    base_meaning_en, base_meaning_ar,
    occurrence_count, verse_count,
    derivatives
) VALUES (
    'ح م د', 'h-m-d',
    'to praise, to thank, to commend',
    'الحمد، الثناء، الشكر',
    63, 43,
    '[
      {"word": "حَمْد", "type": "noun", "meaning": "praise", "form": "masdar"},
      {"word": "حَامِد", "type": "active_participle", "meaning": "one who praises"},
      {"word": "مَحْمُود", "type": "passive_participle", "meaning": "praiseworthy"},
      {"word": "أَحْمَد", "type": "elative", "meaning": "more praiseworthy"},
      {"word": "مُحَمَّد", "type": "proper_noun", "meaning": "Muhammad"}
    ]'::jsonb
);
```

---

#### **TABLE: root_occurrences**

```sql
-- ============================================
-- Cross-reference table: Which roots appear in which verses
-- Enables "Show all verses with root ح م د" functionality
-- ============================================
CREATE TABLE root_occurrences (
    occurrence_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    root_id UUID NOT NULL REFERENCES arabic_roots(root_id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES verse_words(word_id) ON DELETE CASCADE,

    -- Quick reference (denormalized for performance)
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,
    word_position INTEGER NOT NULL,
    word_text TEXT NOT NULL,

    -- Derivative information
    derivative_type VARCHAR(50),  -- 'masdar', 'active_participle', etc.
    verb_form INTEGER,             -- For verbs: Form I-X

    UNIQUE(root_id, word_id)
);

-- Indexes for fast lookup
CREATE INDEX idx_occurrences_root ON root_occurrences(root_id);
CREATE INDEX idx_occurrences_verse ON root_occurrences(surah_number, ayah_number);
CREATE INDEX idx_occurrences_word ON root_occurrences(word_id);

-- Sample query: Find all verses with root ح م د
-- SELECT DISTINCT surah_number, ayah_number
-- FROM root_occurrences
-- WHERE root_id = (SELECT root_id FROM arabic_roots WHERE root_arabic = 'ح م د')
-- ORDER BY surah_number, ayah_number;
```

---

### 3.3 Learning Content Tables

#### **TABLE: courses**

```sql
CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Course Information
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description_en TEXT,
    description_ar TEXT,

    -- Classification
    track VARCHAR(10) NOT NULL CHECK (track IN ('A', 'B')),  -- Track A or Track B
    level VARCHAR(50) NOT NULL,  -- 'beginner', 'intermediate', 'advanced', 'expert'
    level_number INTEGER CHECK (level_number BETWEEN 1 AND 10),
    category VARCHAR(100),  -- 'morphology', 'syntax', 'irab', 'comprehensive'

    -- Structure
    display_order INTEGER NOT NULL,
    parent_course_id UUID REFERENCES courses(course_id),

    -- Completion Estimates
    estimated_hours NUMERIC(5,2),
    total_lessons INTEGER DEFAULT 0,
    total_exercises INTEGER DEFAULT 0,

    -- Prerequisites
    prerequisite_course_ids UUID[],
    required_score_percentage INTEGER DEFAULT 80,

    -- Content
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    course_outline JSONB DEFAULT '[]'::jsonb,

    -- Status
    is_published BOOLEAN DEFAULT false,
    is_free BOOLEAN DEFAULT true,

    -- Metadata
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_courses_track ON courses(track);
CREATE INDEX idx_courses_level ON courses(level_number);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_published ON courses(is_published);
```

#### **TABLE: lessons**

*[Schema already defined in QURANIC_ARABIC_LMS_DESIGN.md - 240+ lines]*

Includes complete structure for lesson content in JSONB format.

---

## 4. CROSS-REFERENCE SYSTEM

### 4.1 Cross-Reference Table

```sql
-- ============================================
-- The magic table that links everything together!
-- Enables: Lesson → Verse → POS Topic → Exercise
-- ============================================
CREATE TABLE learning_cross_references (
    xref_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- SOURCE (What is linking FROM)
    source_type VARCHAR(50) NOT NULL,  -- 'lesson', 'verse', 'word', 'pos_topic', 'exercise'
    source_id UUID NOT NULL,            -- ID of the source entity

    -- TARGET (What is being linked TO)
    target_type VARCHAR(50) NOT NULL,  -- 'lesson', 'verse', 'word', 'pos_topic', 'exercise'
    target_id UUID NOT NULL,            -- ID of the target entity

    -- Relationship
    relationship_type VARCHAR(50) NOT NULL,
    -- Values: 'example_of', 'explains', 'prerequisite', 'related',
    --         'practice_for', 'illustrated_by', 'applies_to'

    -- Display Information
    link_text_en TEXT,
    link_text_ar TEXT,
    tooltip_en TEXT,
    tooltip_ar TEXT,
    icon VARCHAR(50),  -- Icon to display (e.g., '📖', '🕌', '📚')

    -- Context & Metadata
    context_note TEXT,
    relevance_score NUMERIC(3,2) DEFAULT 1.0,  -- 0.0 to 1.0

    -- Ordering
    display_order INTEGER DEFAULT 0,
    display_group VARCHAR(50),

    -- Bidirectional flag
    is_bidirectional BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id)
);

-- Indexes for fast bidirectional lookup
CREATE INDEX idx_xref_source ON learning_cross_references(source_type, source_id);
CREATE INDEX idx_xref_target ON learning_cross_references(target_type, target_id);
CREATE INDEX idx_xref_relationship ON learning_cross_references(relationship_type);
CREATE INDEX idx_xref_score ON learning_cross_references(relevance_score DESC);

-- Constraint to prevent duplicate links
CREATE UNIQUE INDEX idx_xref_unique ON learning_cross_references(
    source_type, source_id, target_type, target_id, relationship_type
);
```

### 4.2 Cross-Reference Examples

```sql
-- Example 1: Link Lesson to Quranic Verse
-- "Lesson 2.2.1 (What is a Noun?) has examples in Surah 1:2"
INSERT INTO learning_cross_references (
    source_type, source_id,
    target_type, target_id,
    relationship_type,
    link_text_en, link_text_ar,
    icon
) VALUES (
    'lesson', 'lesson_2_2_1_uuid',
    'verse', 'verse_1_2_uuid',
    'example_of',
    'Example: الْحَمْدُ in Surah Al-Fatiha',
    'مثال: الْحَمْدُ في سورة الفاتحة',
    '🕌'
);

-- Example 2: Link Word to Grammar Lesson (Bidirectional)
-- "Word الْحَمْدُ can be explained by Lesson 2.2.1"
INSERT INTO learning_cross_references (
    source_type, source_id,
    target_type, target_id,
    relationship_type,
    link_text_en, link_text_ar,
    is_bidirectional
) VALUES (
    'word', 'word_1_2_1_uuid',
    'lesson', 'lesson_2_2_1_uuid',
    'explained_by',
    'Learn about Nouns →',
    'تعلم عن الأسماء ←',
    true
);

-- Example 3: Link Lesson to POS Library Topic
INSERT INTO learning_cross_references (
    source_type, source_id,
    target_type, target_id,
    relationship_type,
    link_text_en
) VALUES (
    'lesson', 'lesson_2_2_1_uuid',
    'pos_topic', 'pos_noun_uuid',
    'related',
    'See complete reference on Nouns →'
);

-- Example 4: Link Exercise to Verse (Practice)
INSERT INTO learning_cross_references (
    source_type, source_id,
    target_type, target_id,
    relationship_type,
    link_text_en
) VALUES (
    'exercise', 'exercise_noun_identification_uuid',
    'verse', 'verse_1_2_uuid',
    'practice_for',
    'Practice with this verse'
);
```

### 4.3 Queries for Cross-Linking

```sql
-- Query 1: Get all Quranic examples for a lesson
SELECT v.surah_number, v.ayah_number, v.verse_text_uthmani,
       xref.link_text_en, xref.context_note
FROM learning_cross_references xref
JOIN quran_verses v ON xref.target_id = v.verse_id
WHERE xref.source_type = 'lesson'
  AND xref.source_id = 'lesson_2_2_1_uuid'
  AND xref.target_type = 'verse'
ORDER BY xref.display_order;

-- Query 2: Get all grammar lessons related to a word
SELECT l.title_en, l.slug, l.estimated_minutes,
       xref.link_text_en, xref.relevance_score
FROM learning_cross_references xref
JOIN lessons l ON xref.target_id = l.lesson_id
WHERE xref.source_type = 'word'
  AND xref.source_id = 'word_1_2_1_uuid'
  AND xref.target_type = 'lesson'
ORDER BY xref.relevance_score DESC, xref.display_order;

-- Query 3: Bidirectional lookup
-- Given a lesson, find related verses
-- AND given a verse, find explaining lessons
WITH bidirectional_links AS (
    SELECT target_id, target_type, relationship_type
    FROM learning_cross_references
    WHERE source_type = 'lesson' AND source_id = ?

    UNION

    SELECT source_id, source_type, relationship_type
    FROM learning_cross_references
    WHERE target_type = 'lesson' AND target_id = ? AND is_bidirectional = true
)
SELECT * FROM bidirectional_links;
```

---

## 5. DATA IMPORT PIPELINE

### 5.1 Import Script Architecture

```javascript
// scripts/import-quranic-data.js

const ImportPipeline = {

  // PHASE 1: Download Source Data
  async downloadCorpusData() {
    console.log('📥 Downloading Quranic Corpus XML...');

    const corpusUrl = 'http://corpus.quran.com/download/quranic-corpus-morphology-0.4.xml';
    const xmlData = await fetch(corpusUrl);

    fs.writeFileSync('./data/corpus.xml', xmlData);
    console.log('✅ Downloaded 200 MB XML file');
  },

  // PHASE 2: Parse XML
  async parseXML() {
    console.log('📖 Parsing XML data...');

    const xml = fs.readFileSync('./data/corpus.xml', 'utf8');
    const parser = new XMLParser();
    const parsed = parser.parse(xml);

    return parsed;
  },

  // PHASE 3: Extract Verse Data
  async extractVerses(parsed) {
    console.log('📝 Extracting 6,236 verses...');

    const verses = [];

    for (const surah of parsed.corpus.surahs.surah) {
      for (const ayah of surah.ayahs.ayah) {
        const verse = {
          surah_number: surah.index,
          ayah_number: ayah.index,
          surah_name_en: surah.name,
          surah_name_ar: surah.name_arabic,
          verse_text_uthmani: ayah.text,
          verse_text_simple: ayah.text_simple,
          // ... more fields
        };

        verses.push(verse);
      }
    }

    console.log(`✅ Extracted ${verses.length} verses`);
    return verses;
  },

  // PHASE 4: Extract Word Analysis
  async extractWords(parsed) {
    console.log('📝 Extracting 77,429 words with POS data...');

    const words = [];
    let wordCount = 0;

    for (const surah of parsed.corpus.surahs.surah) {
      for (const ayah of surah.ayahs.ayah) {
        for (const segment of ayah.segments.segment) {

          const word = {
            word_position: segment.position,
            word_text: segment.text,
            word_simple: segment.simple,
            word_type: this.determineWordType(segment),

            // Extract complete analysis from XML
            analysis: this.buildAnalysisJSON(segment),

            // We'll add visualization & educational data later
            visualization: {},
            educational_data: {}
          };

          words.push(word);
          wordCount++;

          if (wordCount % 1000 === 0) {
            console.log(`   Processed ${wordCount} words...`);
          }
        }
      }
    }

    console.log(`✅ Extracted ${words.length} words`);
    return words;
  },

  // Helper: Build analysis JSON from XML segment
  buildAnalysisJSON(segment) {
    return {
      pos_detailed: {
        type: segment.morphology.pos,
        subtype: segment.morphology.subtype,
        definiteness: segment.morphology.definiteness,
        case: segment.morphology.case,
        case_marker: segment.morphology.case_marker,
        number: segment.morphology.number,
        gender: segment.morphology.gender
      },

      morphology: {
        root: {
          arabic: segment.morphology.root,
          transliteration: this.transliterateRoot(segment.morphology.root)
        },
        template: segment.morphology.pattern,
        pattern_type: segment.morphology.pattern_type,
        letters: this.extractLetters(segment)
      },

      syntax: {
        grammatical_role: segment.syntax.role,
        arabic_term: segment.syntax.term_arabic,
        irab: this.buildIrabData(segment)
      }
    };
  },

  // PHASE 5: Import to Database
  async importToDatabase(verses, words) {
    console.log('💾 Importing to PostgreSQL...');

    const db = await getDBConnection();

    // Import verses
    console.log('   Importing verses...');
    for (const verse of verses) {
      await db.query(`
        INSERT INTO quran_verses (...)
        VALUES (...)
      `, verse);
    }

    // Import words
    console.log('   Importing words...');
    const batchSize = 1000;
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      await db.query(`
        INSERT INTO verse_words (...)
        VALUES (...)
      `, batch);

      console.log(`   ${i + batch.length} / ${words.length} words imported`);
    }

    console.log('✅ Database import complete');
  },

  // PHASE 6: Extract Roots
  async extractRoots() {
    console.log('🌱 Extracting Arabic roots...');

    const rootsQuery = `
      SELECT DISTINCT
        analysis->'morphology'->'root'->>'arabic' as root_arabic,
        analysis->'morphology'->'root'->>'transliteration' as root_trans
      FROM verse_words
      WHERE analysis->'morphology'->'root' IS NOT NULL
    `;

    const roots = await db.query(rootsQuery);

    for (const root of roots.rows) {
      // Calculate statistics
      const occurrences = await this.countRootOccurrences(root.root_arabic);
      const verses = await this.countVersesWithRoot(root.root_arabic);

      await db.query(`
        INSERT INTO arabic_roots (root_arabic, root_transliteration, occurrence_count, verse_count)
        VALUES ($1, $2, $3, $4)
      `, [root.root_arabic, root.root_trans, occurrences, verses]);
    }

    console.log(`✅ Extracted ${roots.rows.length} unique roots`);
  },

  // PHASE 7: Build Cross-References
  async buildCrossReferences() {
    console.log('🔗 Building root_occurrences table...');

    const query = `
      INSERT INTO root_occurrences (root_id, word_id, surah_number, ayah_number, word_position, word_text)
      SELECT
        r.root_id,
        w.word_id,
        v.surah_number,
        v.ayah_number,
        w.word_position,
        w.word_text
      FROM verse_words w
      JOIN quran_verses v ON w.verse_id = v.verse_id
      JOIN arabic_roots r ON r.root_arabic = w.analysis->'morphology'->'root'->>'arabic'
      WHERE w.analysis->'morphology'->'root' IS NOT NULL
    `;

    await db.query(query);
    console.log('✅ Cross-references built');
  },

  // PHASE 8: Add Educational Enhancements
  async addEducationalEnhancements() {
    console.log('📚 Adding educational enhancements...');

    // This is where we add custom explanations for different levels
    const words = await db.query('SELECT word_id, analysis FROM verse_words');

    for (const word of words.rows) {
      const educational = this.generateEducationalContent(word.analysis);

      await db.query(`
        UPDATE verse_words
        SET educational_data = $1
        WHERE word_id = $2
      `, [JSON.stringify(educational), word.word_id]);
    }

    console.log('✅ Educational enhancements added');
  },

  // Helper: Generate level-specific explanations
  generateEducationalContent(analysis) {
    const wordType = analysis.pos_detailed.type;

    return {
      beginner_explanation: {
        en: this.generateBeginnerExplanation(wordType, analysis),
        ar: this.generateBeginnerExplanationArabic(wordType, analysis)
      },
      intermediate_explanation: {
        en: this.generateIntermediateExplanation(wordType, analysis),
        ar: this.generateIntermediateExplanationArabic(wordType, analysis)
      },
      advanced_explanation: {
        en: this.generateAdvancedExplanation(wordType, analysis),
        ar: this.generateAdvancedExplanationArabic(wordType, analysis)
      },
      expert_notes: {
        en: this.generateExpertNotes(wordType, analysis),
        ar: this.generateExpertNotesArabic(wordType, analysis)
      }
    };
  },

  // MAIN EXECUTION
  async run() {
    console.log('🚀 Starting Quranic Data Import Pipeline\n');

    try {
      // Step 1
      await this.downloadCorpusData();

      // Step 2
      const parsed = await this.parseXML();

      // Step 3 & 4
      const verses = await this.extractVerses(parsed);
      const words = await this.extractWords(parsed);

      // Step 5
      await this.importToDatabase(verses, words);

      // Step 6
      await this.extractRoots();

      // Step 7
      await this.buildCrossReferences();

      // Step 8
      await this.addEducationalEnhancements();

      console.log('\n✅ IMPORT COMPLETE!');
      console.log(`   📖 ${verses.length} verses imported`);
      console.log(`   📝 ${words.length} words analyzed`);
      console.log(`   🌱 Roots extracted and cross-referenced`);
      console.log(`   ⏱️  Total time: ~6-8 hours`);

    } catch (error) {
      console.error('❌ Import failed:', error);
      process.exit(1);
    }
  }
};

// Execute
ImportPipeline.run();
```

---

## 6. API ARCHITECTURE

### 6.1 REST API Endpoints

```
VERSE ANALYSIS ENDPOINTS:
─────────────────────────
GET  /api/v1/quran/verses/:surah/:ayah
GET  /api/v1/quran/verses/:surah/:ayah/words
GET  /api/v1/quran/verses/:surah/:ayah/analysis
GET  /api/v1/quran/words/:word_id
GET  /api/v1/quran/words/:word_id/analysis
GET  /api/v1/quran/search?q=root:حمد
GET  /api/v1/quran/search?q=type:noun+case:nominative

ROOT EXPLORATION:
─────────────────
GET  /api/v1/roots
GET  /api/v1/roots/:root_arabic
GET  /api/v1/roots/:root_arabic/verses
GET  /api/v1/roots/:root_arabic/derivatives
GET  /api/v1/roots/search?q=praise

LEARNING CONTENT:
─────────────────
GET  /api/v1/courses
GET  /api/v1/courses/:course_id
GET  /api/v1/courses/:course_id/lessons
GET  /api/v1/lessons/:lesson_id
GET  /api/v1/lessons/:lesson_id/cross-references
GET  /api/v1/pos-library/:topic_id

CROSS-LINKING:
──────────────
GET  /api/v1/cross-references?source_type=lesson&source_id=xxx
GET  /api/v1/cross-references?target_type=verse&target_id=xxx
GET  /api/v1/cross-references/bidirectional/:entity_type/:entity_id
```

### 6.2 Example API Response

```http
GET /api/v1/quran/verses/1/2/analysis?user_level=intermediate

Response:
{
  "success": true,
  "data": {
    "verse": {
      "reference": "1:2",
      "surah_name": {"en": "Al-Fatiha", "ar": "الفاتحة"},
      "text": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
      "translation": "[All] praise is [due] to Allah, Lord of the worlds.",
      "audio_url": "/audio/001002.mp3"
    },

    "words": [
      {
        "word_id": "uuid-1",
        "position": 0,
        "text": "ٱلْحَمْدُ",
        "translation": "the praise",
        "word_type": "noun",
        "color_code": "#4169E1",

        // Full analysis adapted to user level
        "analysis_for_level": {
          "summary": "Noun - Nominative case",
          "grammatical_role": "Subject (مبتدأ)",
          "explanation": "This noun is the subject of the sentence...",
          // ... intermediate-level details
        },

        // Cross-links
        "learn_more": [
          {
            "type": "lesson",
            "id": "lesson_2_2_1",
            "title": "What is a Noun?",
            "url": "/learn/track-a/level-2/lesson-2-2-1",
            "estimated_time": "12 min"
          },
          {
            "type": "pos_library",
            "id": "pos_noun",
            "title": "Noun (اسم) - Quick Reference",
            "url": "/pos-library/noun",
            "estimated_time": "2 min"
          }
        ],

        "audio_url": "/audio/words/001002_001.mp3"
      },
      // ... more words
    ],

    "sentence_structure": {
      "type": "nominal",
      "components": {...}
    },

    "related_content": {
      "similar_verses": [...],
      "practice_exercises": [...]
    }
  },

  "meta": {
    "response_time_ms": 42,
    "cache_hit": true
  }
}
```

---

## 7. CACHING STRATEGY

### 7.1 Multi-Layer Caching

```
┌─────────────────────────────────────────────────────────────┐
│                    CACHE LAYER 1: REDIS                     │
├─────────────────────────────────────────────────────────────┤
│  • Frequently accessed verses (TTL: 1 hour)                │
│  • User sessions (TTL: 30 min)                             │
│  • Search results (TTL: 15 min)                            │
│  • Leaderboards (TTL: 5 min)                               │
└─────────────────────────────────────────────────────────────┘
           ↓ (Cache miss)
┌─────────────────────────────────────────────────────────────┐
│               CACHE LAYER 2: APPLICATION                    │
├─────────────────────────────────────────────────────────────┤
│  • In-memory cache for static data                         │
│  • Surah metadata                                          │
│  • POS library topics                                      │
└─────────────────────────────────────────────────────────────┘
           ↓ (Cache miss)
┌─────────────────────────────────────────────────────────────┐
│               DATABASE: POSTGRESQL                          │
├─────────────────────────────────────────────────────────────┤
│  • Primary data source                                     │
│  • Query time: < 50ms                                      │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Redis Cache Keys

```javascript
const CacheKeys = {
  // Verse data
  verse: (surah, ayah) => `verse:${surah}:${ayah}`,
  verseAnalysis: (surah, ayah, level) => `verse:${surah}:${ayah}:analysis:${level}`,

  // Word data
  word: (wordId) => `word:${wordId}`,
  wordsByVerse: (surah, ayah) => `words:${surah}:${ayah}`,

  // Roots
  root: (rootArabic) => `root:${rootArabic}`,
  rootVerses: (rootArabic) => `root:${rootArabic}:verses`,

  // Search
  search: (query) => `search:${md5(query)}`,

  // User data
  userProgress: (userId) => `user:${userId}:progress`,
  userPreferences: (userId) => `user:${userId}:prefs`
};

// Usage
const verseData = await redis.get(CacheKeys.verse(1, 2));
if (!verseData) {
  const data = await db.getVerse(1, 2);
  await redis.set(CacheKeys.verse(1, 2), JSON.stringify(data), 'EX', 3600);
}
```

---

## 8. SEARCH & DISCOVERY

### 8.1 Full-Text Search

```sql
-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create full-text search index
CREATE INDEX idx_verse_text_fts ON quran_verses
    USING gin (to_tsvector('arabic', verse_text_simple));

-- Search query example
SELECT surah_number, ayah_number, verse_text_uthmani,
       ts_rank(to_tsvector('arabic', verse_text_simple), query) AS rank
FROM quran_verses, to_tsquery('arabic', 'الحمد') query
WHERE to_tsvector('arabic', verse_text_simple) @@ query
ORDER BY rank DESC
LIMIT 20;
```

### 8.2 Advanced Search

```javascript
// API: /api/v1/quran/search

const searchFilters = {
  // Text search
  text: "praise Allah",

  // Root search
  root: "ح م د",

  // Grammatical filters
  word_type: "noun",
  case: "nominative",
  number: "singular",
  gender: "masculine",

  // Surah filters
  surah: 1,
  revelation_place: "Meccan",

  // Juz/Page
  juz: 1,
  page: 1
};

// SQL generation
const buildSearchQuery = (filters) => {
  let query = `
    SELECT DISTINCT v.surah_number, v.ayah_number, v.verse_text_uthmani
    FROM quran_verses v
    JOIN verse_words w ON v.verse_id = w.verse_id
    WHERE 1=1
  `;

  if (filters.root) {
    query += ` AND w.word_id IN (
      SELECT word_id FROM root_occurrences ro
      JOIN arabic_roots r ON ro.root_id = r.root_id
      WHERE r.root_arabic = '${filters.root}'
    )`;
  }

  if (filters.word_type) {
    query += ` AND w.word_type = '${filters.word_type}'`;
  }

  if (filters.case) {
    query += ` AND w.analysis->'pos_detailed'->>'case' = '${filters.case}'`;
  }

  // ... more filters

  return query;
};
```

---

## 9. PERFORMANCE OPTIMIZATION

### 9.1 Query Optimization

```sql
-- Problematic query (N+1)
SELECT * FROM lessons WHERE course_id = ?;
-- Then for each lesson:
SELECT * FROM exercises WHERE lesson_id = ?;

-- Optimized (single query with JOIN)
SELECT
  l.*,
  json_agg(e.*) as exercises
FROM lessons l
LEFT JOIN exercises e ON e.lesson_id = l.lesson_id
WHERE l.course_id = ?
GROUP BY l.lesson_id;
```

### 9.2 Indexing Strategy

```sql
-- Composite indexes for common queries
CREATE INDEX idx_words_verse_position ON verse_words(verse_id, word_position);
CREATE INDEX idx_progress_user_course ON user_course_progress(user_id, course_id);

-- Partial indexes for filtered queries
CREATE INDEX idx_published_courses ON courses(level_number) WHERE is_published = true;
CREATE INDEX idx_active_users ON users(last_login) WHERE is_active = true;
```

### 9.3 Database Connection Pooling

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000,
});

// Use pooled connections
const result = await pool.query('SELECT * FROM ...');
```

---

## 10. IMPLEMENTATION SCRIPTS

### 10.1 Database Migration Script

```sql
-- migrations/001_initial_schema.sql

BEGIN;

-- Create all tables in correct order (respecting foreign keys)
\i 001_create_users.sql
\i 002_create_quran_verses.sql
\i 003_create_verse_words.sql
\i 004_create_arabic_roots.sql
\i 005_create_root_occurrences.sql
\i 006_create_courses.sql
\i 007_create_lessons.sql
\i 008_create_exercises.sql
\i 009_create_cross_references.sql
\i 010_create_indexes.sql

COMMIT;
```

### 10.2 Deployment Checklist

```bash
# 1. Database setup
createdb quran_lms
psql quran_lms < migrations/001_initial_schema.sql

# 2. Import Quranic data
node scripts/import-quranic-data.js

# 3. Verify import
psql quran_lms -c "SELECT COUNT(*) FROM quran_verses;" # Should be 6236
psql quran_lms -c "SELECT COUNT(*) FROM verse_words;"  # Should be 77429

# 4. Build indexes
psql quran_lms < scripts/build-indexes.sql

# 5. Set up Redis
redis-server --daemonize yes

# 6. Start application
npm run start
```

---

**END OF DATA ARCHITECTURE DOCUMENT**

Total Pages: ~40
Total Size: Database ~450 MB, Docs ~200 KB

This completes the comprehensive data architecture. The system is designed for:
- ✅ Fast performance (< 50ms queries)
- ✅ Offline capability
- ✅ Unlimited customization
- ✅ Scalability to millions of users
- ✅ Seamless cross-linking between all content types
