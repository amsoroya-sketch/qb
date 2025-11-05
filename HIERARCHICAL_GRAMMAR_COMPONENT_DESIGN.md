# HIERARCHICAL GRAMMAR COMPONENT DESIGN

**Project:** arQ - Quranic Arabic Grammar LMS
**Version:** 1.0
**Date:** 2025-11-02
**Document Type:** Interactive Component Specification - Progressive Grammar Hierarchy

---

## TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Learning Stages & Hierarchy Levels](#2-learning-stages--hierarchy-levels)
3. [Component Architecture](#3-component-architecture)
4. [Layer-by-Layer Breakdown](#4-layer-by-layer-breakdown)
5. [Interactive UI Designs](#5-interactive-ui-designs)
6. [User Interaction Flows](#6-user-interaction-flows)
7. [Technical Implementation](#7-technical-implementation)
8. [Examples for Each Learning Stage](#8-examples-for-each-learning-stage)

---

## 1. OVERVIEW

### Purpose

The **Hierarchical Grammar Component** is an interactive, progressive disclosure system that presents grammatical analysis in **layers**. As students advance through learning stages, they unlock deeper layers of grammatical understanding.

### Design Philosophy

```
┌─────────────────────────────────────────────────────────────┐
│                    PROGRESSIVE DISCLOSURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Stage 1 (Beginner):     Layer 1 only                       │
│  ┌─────────────┐                                            │
│  │ Basic Info  │                                            │
│  └─────────────┘                                            │
│                                                             │
│  Stage 2 (Elementary):   Layers 1-2                         │
│  ┌─────────────┐                                            │
│  │ Basic Info  │                                            │
│  │ ┌─────────┐ │                                            │
│  │ │Word Type│ │                                            │
│  │ └─────────┘ │                                            │
│  └─────────────┘                                            │
│                                                             │
│  Stage 3 (Intermediate): Layers 1-3                         │
│  ┌─────────────┐                                            │
│  │ Basic Info  │                                            │
│  │ ┌─────────┐ │                                            │
│  │ │Word Type│ │                                            │
│  │ │┌───────┐│ │                                            │
│  │ ││I'rab  ││ │                                            │
│  │ │└───────┘│ │                                            │
│  │ └─────────┘ │                                            │
│  └─────────────┘                                            │
│                                                             │
│  Stage 4 (Advanced):     Layers 1-4                         │
│  Stage 5 (Expert):       All 6 layers                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

✅ **6 Hierarchical Layers** - From basic to expert analysis
✅ **Interactive Expansion** - Click to reveal deeper layers
✅ **Stage-Based Access** - Unlock layers as you learn
✅ **Visual Hierarchy** - Indentation and color coding
✅ **Compound Word Support** - Analyze word relationships
✅ **Contextual Explanations** - Why each property matters
✅ **Adaptive Complexity** - Matches user's learning stage

---

## 2. LEARNING STAGES & HIERARCHY LEVELS

### The 6 Hierarchical Layers

```
┌────────────────────────────────────────────────────────────────────────┐
│ LAYER HIERARCHY - From Surface to Deep Analysis                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Layer 0: SURFACE                                                      │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • Word text (with diacritics)                                │     │
│  │ • Translation                                                 │     │
│  │ • Audio pronunciation                                         │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  Layer 1: BASIC CATEGORIZATION                                        │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • Part of Speech (Noun/Verb/Particle)                        │     │
│  │ • Basic meaning category                                      │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  Layer 2: WORD PROPERTIES                                             │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • Gender (Masculine/Feminine)                                │     │
│  │ • Number (Singular/Dual/Plural)                              │     │
│  │ • Definiteness (Definite/Indefinite)                         │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  Layer 3: GRAMMATICAL CASE (I'RAB)                                    │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • Case (Nominative/Accusative/Genitive)                      │     │
│  │ • Case sign (Damma/Fatha/Kasra)                              │     │
│  │ • Why this case? (Reason)                                    │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  Layer 4: MORPHOLOGY (WORD STRUCTURE)                                 │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • Root (جذر)                                                  │     │
│  │ • Pattern/Template (وزن)                                      │     │
│  │ • Letter-by-letter breakdown                                 │     │
│  │ • Prefixes, root, suffixes                                   │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  Layer 5: SYNTAX (SENTENCE ROLE)                                      │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • Grammatical role (Subject/Object/etc.)                     │     │
│  │ • Relationship to other words                                │     │
│  │ • Sentence structure position                                │     │
│  │ • Dependencies                                               │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
│  Layer 6: ADVANCED ANALYSIS                                           │
│  ┌──────────────────────────────────────────────────────────────┐     │
│  │ • Complete i'rab statement                                   │     │
│  │ • Scholarly notes                                            │     │
│  │ • Alternative parses                                         │     │
│  │ • Rhetorical significance (بلاغة)                            │     │
│  │ • Qira'at variations                                         │     │
│  └──────────────────────────────────────────────────────────────┘     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Learning Stages & Layer Access

```
┌──────────────────────────────────────────────────────────────────────┐
│ LEARNING STAGE          │ ACCESSIBLE LAYERS      │ TYPICAL DURATION │
├──────────────────────────────────────────────────────────────────────┤
│ Stage 1: Beginner       │ Layers 0-1             │ Weeks 1-4        │
│ • Just started learning │ • Surface + Basic POS  │                  │
│ • Learning alphabet     │                        │                  │
├──────────────────────────────────────────────────────────────────────┤
│ Stage 2: Elementary     │ Layers 0-2             │ Weeks 5-12       │
│ • Can read Arabic       │ + Word Properties      │                  │
│ • Know basic grammar    │                        │                  │
├──────────────────────────────────────────────────────────────────────┤
│ Stage 3: Intermediate   │ Layers 0-3             │ Months 4-8       │
│ • Understanding i'rab   │ + Grammatical Case     │                  │
│ • Can parse simple text │                        │                  │
├──────────────────────────────────────────────────────────────────────┤
│ Stage 4: Advanced       │ Layers 0-4             │ Months 9-15      │
│ • Know morphology       │ + Morphology           │                  │
│ • Understand roots      │                        │                  │
├──────────────────────────────────────────────────────────────────────┤
│ Stage 5: Expert         │ All layers (0-6)       │ 15+ months       │
│ • Complete analysis     │ + Syntax + Scholarly   │                  │
│ • Teaching capability   │                        │                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. COMPONENT ARCHITECTURE

### Component Structure

```typescript
// Component Hierarchy
<HierarchicalGrammarComponent>
  <WordSurface />                    // Layer 0: Always visible
  <CollapsibleLayer level={1}>       // Layer 1: Basic POS
    <BasicCategorizationPanel />
  </CollapsibleLayer>
  <CollapsibleLayer level={2}>       // Layer 2: Properties
    <WordPropertiesPanel />
  </CollapsibleLayer>
  <CollapsibleLayer level={3}>       // Layer 3: I'rab
    <GrammaticalCasePanel />
  </CollapsibleLayer>
  <CollapsibleLayer level={4}>       // Layer 4: Morphology
    <MorphologyPanel />
  </CollapsibleLayer>
  <CollapsibleLayer level={5}>       // Layer 5: Syntax
    <SyntaxPanel />
  </CollapsibleLayer>
  <CollapsibleLayer level={6}>       // Layer 6: Advanced
    <AdvancedAnalysisPanel />
  </CollapsibleLayer>
</HierarchicalGrammarComponent>
```

### State Management

```typescript
interface HierarchyState {
  // User's current learning stage (determines max accessible layer)
  userStage: 1 | 2 | 3 | 4 | 5;

  // Which layers are currently expanded
  expandedLayers: Set<number>;

  // Maximum layer user can access
  maxAccessibleLayer: number;

  // Current focus/highlight
  activeLayers: number[];

  // Animation states
  isAnimating: boolean;
  animatingLayer: number | null;
}

interface WordData {
  // Layer 0: Surface
  surface: {
    wordText: string;
    translation: string;
    audioUrl: string;
  };

  // Layer 1: Basic
  layer1_basic: {
    pos: 'noun' | 'verb' | 'particle';
    posArabic: string;
    category: string;
  };

  // Layer 2: Properties
  layer2_properties: {
    gender?: 'masculine' | 'feminine';
    number?: 'singular' | 'dual' | 'plural';
    definiteness?: 'definite' | 'indefinite';
  };

  // Layer 3: I'rab
  layer3_irab: {
    case: string;
    caseSign: string;
    reason: string;
  };

  // Layer 4: Morphology
  layer4_morphology: {
    root: string;
    pattern: string;
    breakdown: LetterBreakdown[];
  };

  // Layer 5: Syntax
  layer5_syntax: {
    role: string;
    dependencies: WordRelation[];
    sentencePosition: string;
  };

  // Layer 6: Advanced
  layer6_advanced: {
    completeIrab: string;
    scholarlyNotes: string[];
    alternativeParses: Parse[];
  };
}
```

---

## 4. LAYER-BY-LAYER BREAKDOWN

### Layer 0: SURFACE (Always Visible)

**Purpose**: The basic visible form of the word
**Available to**: All users (Stage 1+)

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 0: SURFACE                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              ٱلْحَمْدُ                                  │
│              ───────                                    │
│              [🔊 Play]                                  │
│                                                         │
│              Translation: the praise                    │
│              Transliteration: al-hamdu                  │
│                                                         │
│  [▼ Click to see grammar breakdown]                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Structure**:
```json
{
  "layer0_surface": {
    "wordText": "ٱلْحَمْدُ",
    "wordSimple": "الحمد",
    "translation": "the praise",
    "transliteration": "al-hamdu",
    "audioUrl": "/audio/001002_001.mp3",
    "displaySize": "large",
    "highlightDiacritics": true
  }
}
```

---

### Layer 1: BASIC CATEGORIZATION

**Purpose**: Understand what type of word this is
**Available to**: Stage 1+ (Beginners)
**Complexity**: Very simple, no technical terms

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 0: SURFACE                                       │
│              ٱلْحَمْدُ  - the praise                    │
│              [🔊]                                        │
│  [▲ Collapse]                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LAYER 1: WHAT TYPE OF WORD IS THIS?            │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                 │   │
│  │  📘 This is a NOUN (اسم)                       │   │
│  │                                                 │   │
│  │  What is a noun?                                │   │
│  │  A noun is a word that names a person, place,  │   │
│  │  thing, or idea.                                │   │
│  │                                                 │   │
│  │  Examples:                                      │   │
│  │  • Person: أحمد (Ahmad)                        │   │
│  │  • Place: مكة (Makkah)                         │   │
│  │  • Thing: كتاب (book)                          │   │
│  │  • Idea: حمد (praise) ← This word!            │   │
│  │                                                 │   │
│  │  [📖 Learn more about nouns →]                 │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [▼ Show more details] (Unlocks at Stage 2)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Structure**:
```json
{
  "layer1_basic": {
    "pos": "noun",
    "posArabic": "اسم",
    "posEnglish": "Noun",
    "category": "common_noun",

    "explanation": {
      "beginner": "This is a NOUN. Nouns name people, places, things, or ideas.",
      "elementary": "This is a common NOUN (اسم) that names an abstract concept.",
      "intermediate": "اسم جنس - Common noun naming an abstract concept"
    },

    "examples": [
      {"type": "person", "word": "أحمد", "meaning": "Ahmad"},
      {"type": "place", "word": "مكة", "meaning": "Makkah"},
      {"type": "thing", "word": "كتاب", "meaning": "book"},
      {"type": "idea", "word": "حمد", "meaning": "praise", "isCurrent": true}
    ],

    "learnMoreLink": {
      "lessonId": "lesson_2_2_1",
      "title": "What is a Noun?",
      "estimatedMinutes": 12
    }
  }
}
```

---

### Layer 2: WORD PROPERTIES

**Purpose**: Understand the characteristics of this word
**Available to**: Stage 2+ (Elementary)
**Complexity**: Simple classifications

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 0: ٱلْحَمْدُ  - the praise [🔊]                  │
│  [▲ Collapse]                                           │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ LAYER 1: NOUN (اسم) [▲ Collapse]               │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LAYER 2: WORD PROPERTIES                        │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                 │   │
│  │  Every Arabic word has 3 important properties: │   │
│  │                                                 │   │
│  │  1️⃣  GENDER (الجنس)                            │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │ ♂ MASCULINE (مذكر)                       │ │   │
│  │  │                                           │ │   │
│  │  │ Why? Most abstract concepts in Arabic    │ │   │
│  │  │ are masculine.                            │ │   │
│  │  │                                           │ │   │
│  │  │ [📖 Learn about gender →]                │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  2️⃣  NUMBER (العدد)                            │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │ ① SINGULAR (مفرد)                        │ │   │
│  │  │                                           │ │   │
│  │  │ This word refers to ONE thing.           │ │   │
│  │  │ Not two (dual) or many (plural).         │ │   │
│  │  │                                           │ │   │
│  │  │ Compare:                                  │ │   │
│  │  │ • Singular: حَمْد (praise)               │ │   │
│  │  │ • Dual: حَمْدَانِ (two praises)          │ │   │
│  │  │ • Plural: أَحْمَاد (many praises)        │ │   │
│  │  │                                           │ │   │
│  │  │ [📖 Learn about number →]                │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  3️⃣  DEFINITENESS (التعريف والتنكير)          │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │ ✓ DEFINITE (معرفة)                       │ │   │
│  │  │                                           │ │   │
│  │  │ How do we know? It has ال at the start!  │ │   │
│  │  │                                           │ │   │
│  │  │ الْحَمْدُ = THE praise (specific)         │ │   │
│  │  │ حَمْدٌ = A praise (general)               │ │   │
│  │  │                                           │ │   │
│  │  │ Think of "the" vs "a" in English.        │ │   │
│  │  │                                           │ │   │
│  │  │ [📖 Learn about definiteness →]          │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [▼ Show grammar role] (Unlocks at Stage 3)           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Structure**:
```json
{
  "layer2_properties": {
    "gender": {
      "value": "masculine",
      "valueArabic": "مذكر",
      "icon": "♂",
      "explanation": {
        "stage2": "This word is MASCULINE. Most abstract concepts in Arabic are masculine.",
        "stage3": "مذكر - Masculine gender, typical for abstract nouns derived from trilateral roots.",
        "stage4": "Gender determined by classical usage and semantic category (abstract concepts)."
      },
      "learnMoreLink": "lesson_2_2_3"
    },

    "number": {
      "value": "singular",
      "valueArabic": "مفرد",
      "icon": "①",
      "explanation": {
        "stage2": "This word is SINGULAR. It refers to ONE thing, not two or many.",
        "stage3": "مفرد - Singular number. No dual or plural markers present.",
        "stage4": "Singular form. Dual would be حَمْدَانِ, sound masculine plural أَحْمَاد."
      },
      "comparisons": [
        {"form": "singular", "word": "حَمْد", "meaning": "praise"},
        {"form": "dual", "word": "حَمْدَانِ", "meaning": "two praises"},
        {"form": "plural", "word": "أَحْمَاد", "meaning": "many praises"}
      ],
      "learnMoreLink": "lesson_2_2_4"
    },

    "definiteness": {
      "value": "definite",
      "valueArabic": "معرفة",
      "type": "article",
      "icon": "✓",
      "explanation": {
        "stage2": "This word is DEFINITE because it has ال at the start. Like 'THE' in English.",
        "stage3": "معرفة بال - Definite through the definite article ال",
        "stage4": "Definiteness marked by prefixed article ال, indicating specific/known referent."
      },
      "comparison": {
        "definite": "الْحَمْدُ (THE praise - specific)",
        "indefinite": "حَمْدٌ (A praise - general)"
      },
      "learnMoreLink": "lesson_2_2_2"
    }
  }
}
```

---

### Layer 3: GRAMMATICAL CASE (I'RAB)

**Purpose**: Understand the word's role and why it has this ending
**Available to**: Stage 3+ (Intermediate)
**Complexity**: Introduces i'rab concepts

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 0: ٱلْحَمْدُ  - the praise [🔊]                  │
│  LAYER 1: NOUN (اسم) [▲]                                │
│  LAYER 2: Masculine, Singular, Definite [▲]            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LAYER 3: GRAMMATICAL CASE (الإعراب)            │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                 │   │
│  │  🎯 THE CASE                                    │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  🟢 NOMINATIVE CASE (مرفوع)               │ │   │
│  │  │                                           │ │   │
│  │  │  What does this mean?                     │ │   │
│  │  │  In Arabic, words change their ending    │ │   │
│  │  │  based on their job in the sentence.     │ │   │
│  │  │  This is called I'rab (إعراب).           │ │   │
│  │  │                                           │ │   │
│  │  │  There are 3 main cases:                 │ │   │
│  │  │  🟢 Nominative (مرفوع) - for subjects    │ │   │
│  │  │  🔴 Accusative (منصوب) - for objects     │ │   │
│  │  │  🔵 Genitive (مجرور) - after prepositions│ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  📌 THE SIGN                                    │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  Case Sign: ضمة (DAMMA)  ُ                │ │   │
│  │  │                                           │ │   │
│  │  │  Look at the end of the word:            │ │   │
│  │  │                                           │ │   │
│  │  │       ٱلْحَمْدُ                           │ │   │
│  │  │            └─ُ  ← This is the damma!    │ │   │
│  │  │                                           │ │   │
│  │  │  The damma (ُ) is the sign of the        │ │   │
│  │  │  nominative case for singular nouns.     │ │   │
│  │  │                                           │ │   │
│  │  │  Compare different cases:                │ │   │
│  │  │  الْحَمْدُ  (Nominative - with damma ُ)   │ │   │
│  │  │  الْحَمْدَ  (Accusative - with fatha َ)   │ │   │
│  │  │  الْحَمْدِ  (Genitive - with kasra ِ)     │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  ❓ WHY IS IT NOMINATIVE?                      │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  This word is the SUBJECT (المبتدأ)       │ │   │
│  │  │  of a nominal sentence.                   │ │   │
│  │  │                                           │ │   │
│  │  │  Rule: The subject of a nominal sentence │ │   │
│  │  │  is ALWAYS in the nominative case.       │ │   │
│  │  │                                           │ │   │
│  │  │  Sentence structure:                      │ │   │
│  │  │  ٱلْحَمْدُ لِلَّهِ                         │ │   │
│  │  │  └─Subject  └─Predicate                  │ │   │
│  │  │    (مبتدأ)     (خبر)                      │ │   │
│  │  │                                           │ │   │
│  │  │  [📖 Learn about nominal sentences →]    │ │   │
│  │  │  [📖 Learn about i'rab →]                │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  💡 PRACTICE                                    │   │
│  │  Can you identify the case in other words?     │   │
│  │  [Take a quick quiz →]                         │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [▼ Show word structure] (Unlocks at Stage 4)         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Structure**:
```json
{
  "layer3_irab": {
    "case": {
      "value": "nominative",
      "valueArabic": "مرفوع",
      "color": "#4CAF50",
      "icon": "🟢",

      "explanation": {
        "stage3": "This word is NOMINATIVE (مرفوع). In Arabic, words change their ending based on their job in the sentence.",
        "stage4": "مرفوع - Nominative case, indicating the subject role in this nominal sentence.",
        "stage5": "Nominative case marked by damma. Required for subjects (مبتدأ) in جملة اسمية."
      }
    },

    "sign": {
      "value": "damma",
      "valueArabic": "ضمة",
      "symbol": "ُ",
      "position": "end",

      "visualization": {
        "wordWithHighlight": "ٱلْحَمْدُ",
        "highlightPosition": 6,
        "annotation": "← Damma here"
      },

      "comparison": [
        {"case": "nominative", "sign": "ُ", "example": "الْحَمْدُ"},
        {"case": "accusative", "sign": "َ", "example": "الْحَمْدَ"},
        {"case": "genitive", "sign": "ِ", "example": "الْحَمْدِ"}
      ]
    },

    "reason": {
      "grammaticalRole": "subject",
      "grammaticalRoleArabic": "مبتدأ",

      "rule": {
        "stage3": "Rule: The subject of a nominal sentence is ALWAYS nominative.",
        "stage4": "المبتدأ مرفوع دائماً - The subject of a nominal sentence is always raised (nominative).",
        "stage5": "Classical rule: المبتدأ مرفوع، وعلامة رفعه الضمة الظاهرة على آخره"
      },

      "sentenceStructure": {
        "type": "nominal",
        "typeArabic": "جملة اسمية",
        "components": [
          {"part": "subject", "word": "ٱلْحَمْدُ", "role": "مبتدأ"},
          {"part": "predicate", "word": "لِلَّهِ", "role": "خبر"}
        ]
      },

      "learnMoreLinks": [
        {"topic": "nominal_sentences", "lessonId": "lesson_3_1"},
        {"topic": "irab_system", "lessonId": "lesson_4_1"},
        {"topic": "nominative_case", "lessonId": "lesson_4_2"}
      ]
    }
  }
}
```

---

### Layer 4: MORPHOLOGY (WORD STRUCTURE)

**Purpose**: Understand how the word is built from its root
**Available to**: Stage 4+ (Advanced)
**Complexity**: Root-pattern system

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 0-3: [Previous layers collapsed] [▼ Expand all] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LAYER 4: MORPHOLOGY (الصرف)                    │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                 │   │
│  │  🌱 THE ROOT (الجذر)                           │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  Root Letters: ح م د (h-m-d)             │ │   │
│  │  │                                           │ │   │
│  │  │  Core Meaning: "to praise, to thank"     │ │   │
│  │  │                                           │ │   │
│  │  │  All words with this root share the      │ │   │
│  │  │  concept of praise/thanks:               │ │   │
│  │  │                                           │ │   │
│  │  │  Derivatives:                             │ │   │
│  │  │  • حَمْد (praise - noun)                 │ │   │
│  │  │  • حَمِدَ (he praised - verb)            │ │   │
│  │  │  • حَامِد (one who praises)              │ │   │
│  │  │  • مَحْمُود (praiseworthy)                │ │   │
│  │  │  • مُحَمَّد (Muhammad - highly praised)   │ │   │
│  │  │  • أَحْمَد (Ahmad - more praiseworthy)    │ │   │
│  │  │                                           │ │   │
│  │  │  [🌱 Explore all ح م د words →]          │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  📐 THE PATTERN (الوزن)                        │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  Pattern: فَعْل (fa'l)                    │ │   │
│  │  │                                           │ │   │
│  │  │  This is the basic NOUN pattern.         │ │   │
│  │  │  It creates a "verbal noun" (مصدر).      │ │   │
│  │  │                                           │ │   │
│  │  │  How it works:                            │ │   │
│  │  │  ┌──────────────────────────────────┐    │ │   │
│  │  │  │ Pattern:  ف  َ  ع  ْ  ل          │    │ │   │
│  │  │  │           ↓     ↓     ↓           │    │ │   │
│  │  │  │ Root:     ح  َ  م  ْ  د          │    │ │   │
│  │  │  │           =  =  =     =           │    │ │   │
│  │  │  │ Result:   ح َ م ْ د  = حَمْد      │    │ │   │
│  │  │  └──────────────────────────────────┘    │ │   │
│  │  │                                           │ │   │
│  │  │  Other examples with فَعْل pattern:      │ │   │
│  │  │  • ك ت ب → كَتْب (writing)               │ │   │
│  │  │  • ش ك ر → شَكْر (thanks)                │ │   │
│  │  │  • ع ل م → عَلْم (knowledge)             │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  🔤 LETTER-BY-LETTER BREAKDOWN                 │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  Word: ٱلْحَمْدُ                          │ │   │
│  │  │                                           │ │   │
│  │  │  Position 1-2: ٱل (al)                    │ │   │
│  │  │  └─ Type: Definite Article               │ │   │
│  │  │  └─ Function: Makes the word definite    │ │   │
│  │  │  └─ Not part of root                     │ │   │
│  │  │                                           │ │   │
│  │  │  Position 3: ح (ha)                       │ │   │
│  │  │  └─ Type: ROOT LETTER 1 (ف الفعل)        │ │   │
│  │  │  └─ Diacritic: fatha (َ)                 │ │   │
│  │  │  └─ From pattern: فَ                      │ │   │
│  │  │                                           │ │   │
│  │  │  Position 4: م (meem)                     │ │   │
│  │  │  └─ Type: ROOT LETTER 2 (ع الفعل)        │ │   │
│  │  │  └─ Diacritic: sukun (ْ)                 │ │   │
│  │  │  └─ From pattern: عْ                      │ │   │
│  │  │                                           │ │   │
│  │  │  Position 5: د (dal)                      │ │   │
│  │  │  └─ Type: ROOT LETTER 3 (ل الفعل)        │ │   │
│  │  │  └─ Diacritic: damma (ُ) - CASE MARKER   │ │   │
│  │  │  └─ From pattern: ل                       │ │   │
│  │  │                                           │ │   │
│  │  │  Visual Breakdown:                        │ │   │
│  │  │  ┌──┬──┬──┬──┬──┐                        │ │   │
│  │  │  │ٱل│ ح│ م│ د│ ُ│                        │ │   │
│  │  │  ├──┼──┼──┼──┼──┤                        │ │   │
│  │  │  │Al│ H│ M│ D│ U│                        │ │   │
│  │  │  ├──┼──┼──┼──┼──┤                        │ │   │
│  │  │  │Ar│R1│R2│R3│Ca│                        │ │   │
│  │  │  │ti│oo│oo│oo│se│                        │ │   │
│  │  │  │cl│t │t │t │  │                        │ │   │
│  │  │  │e │  │  │  │  │                        │ │   │
│  │  │  └──┴──┴──┴──┴──┘                        │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  [📖 Learn about roots and patterns →]         │   │
│  │  [📖 Learn about Arabic morphology →]          │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [▼ Show sentence role] (Unlocks at Stage 5)          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Structure**:
```json
{
  "layer4_morphology": {
    "root": {
      "letters": "ح م د",
      "transliteration": "h-m-d",
      "coreMeaning": "to praise, to thank, to commend",

      "derivatives": [
        {"word": "حَمْد", "type": "masdar", "meaning": "praise"},
        {"word": "حَمِدَ", "type": "verb_past", "meaning": "he praised"},
        {"word": "حَامِد", "type": "active_participle", "meaning": "one who praises"},
        {"word": "مَحْمُود", "type": "passive_participle", "meaning": "praiseworthy"},
        {"word": "مُحَمَّد", "type": "proper_noun", "meaning": "Muhammad"},
        {"word": "أَحْمَد", "type": "elative", "meaning": "more praiseworthy"}
      ],

      "exploreLink": "/roots/ح-م-د"
    },

    "pattern": {
      "template": "فَعْل",
      "transliteration": "fa'l",
      "type": "masdar",
      "typeDescription": "Basic verbal noun pattern (Form I)",

      "mapping": {
        "pattern_letters": ["ف", "ع", "ل"],
        "root_letters": ["ح", "م", "د"],
        "result": "حَمْد"
      },

      "examples": [
        {"root": "ك ت ب", "word": "كَتْب", "meaning": "writing"},
        {"root": "ش ك ر", "word": "شَكْر", "meaning": "thanks"},
        {"root": "ع ل م", "word": "عَلْم", "meaning": "knowledge"}
      ]
    },

    "letterBreakdown": [
      {
        "position": 1,
        "letter": "ا",
        "letterName": "alif",
        "type": "prefix",
        "function": "definite_article_part1",
        "isRoot": false,
        "diacritic": null
      },
      {
        "position": 2,
        "letter": "ل",
        "letterName": "lam",
        "type": "prefix",
        "function": "definite_article_part2",
        "isRoot": false,
        "diacritic": "sukun"
      },
      {
        "position": 3,
        "letter": "ح",
        "letterName": "ha",
        "type": "root",
        "rootPosition": "first_radical",
        "rootLabel": "ف",
        "isRoot": true,
        "diacritic": "fatha",
        "fromPattern": true
      },
      {
        "position": 4,
        "letter": "م",
        "letterName": "meem",
        "type": "root",
        "rootPosition": "second_radical",
        "rootLabel": "ع",
        "isRoot": true,
        "diacritic": "sukun",
        "fromPattern": true
      },
      {
        "position": 5,
        "letter": "د",
        "letterName": "dal",
        "type": "root",
        "rootPosition": "third_radical",
        "rootLabel": "ل",
        "isRoot": true,
        "diacritic": "damma",
        "fromPattern": false,
        "note": "Damma is case marker, not from pattern"
      }
    ]
  }
}
```

---

### Layer 5: SYNTAX (SENTENCE ROLE)

**Purpose**: Understand how this word relates to others in the sentence
**Available to**: Stage 5+ (Expert)
**Complexity**: Dependency parsing and sentence structure

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 0-4: [Previous layers] [▼ Expand all]           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LAYER 5: SYNTAX (النحو)                        │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                 │   │
│  │  🎯 GRAMMATICAL ROLE                            │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  This word is the SUBJECT (المبتدأ)       │   │
│  │  │  of a nominal sentence.                   │   │
│  │  │                                           │ │   │
│  │  │  Complete Sentence:                       │ │   │
│  │  │  ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ    │   │
│  │  │                                           │ │   │
│  │  │  Sentence Type: جملة اسمية                │ │   │
│  │  │  (Nominal Sentence)                       │ │   │
│  │  │                                           │ │   │
│  │  │  What is a nominal sentence?              │ │   │
│  │  │  A sentence that begins with a noun       │ │   │
│  │  │  (not a verb).                            │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  🔗 SENTENCE STRUCTURE                          │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │        Nominal Sentence (جملة اسمية)      │ │   │
│  │  │                │                          │ │   │
│  │  │     ┌──────────┴──────────┐               │ │   │
│  │  │     │                     │               │ │   │
│  │  │  Subject              Predicate           │ │   │
│  │  │  (مبتدأ)              (خبر)               │ │   │
│  │  │     │                     │               │ │   │
│  │  │  ٱلْحَمْدُ          ┌──────┴─────┐        │ │   │
│  │  │  [THIS WORD]      │            │        │ │   │
│  │  │                 لِلَّهِ       رَبِّ ٱلْعَٰلَمِينَ │ │   │
│  │  │              (Prep. Phrase) (Appositive)  │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  🔀 WORD RELATIONSHIPS                          │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  This word (ٱلْحَمْدُ) governs:           │   │
│  │  │                                           │ │   │
│  │  │  1. لِلَّهِ (Prepositional phrase)         │   │
│  │  │     Relationship: Predicate (خبر شبه جملة)│   │
│  │  │     Direction: ٱلْحَمْدُ → لِلَّهِ          │   │
│  │  │                                           │ │   │
│  │  │  2. رَبِّ ٱلْعَٰلَمِينَ (Appositive)        │   │
│  │  │     Relationship: Explains "الله"         │   │
│  │  │     Direction: لِلَّهِ → رَبِّ ٱلْعَٰلَمِينَ  │   │
│  │  │                                           │ │   │
│  │  │  Dependency Tree:                         │ │   │
│  │  │  ┌─ ٱلْحَمْدُ (root of sentence)           │   │
│  │  │  │                                        │ │   │
│  │  │  ├─ لِلَّهِ (dependent - predicate)        │   │
│  │  │  │  │                                     │ │   │
│  │  │  │  └─ رَبِّ (dependent of لِلَّهِ)         │   │
│  │  │  │     │                                  │ │   │
│  │  │  │     └─ ٱلْعَٰلَمِينَ (dependent of رَبِّ) │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  📍 POSITION IN SENTENCE                        │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  Position: FIRST (sentence-initial)       │ │   │
│  │  │  Index: Word 1 of 4                       │ │   │
│  │  │                                           │ │   │
│  │  │  Significance:                            │ │   │
│  │  │  Being first establishes it as the        │ │   │
│  │  │  subject (مبتدأ) of this nominal sentence.│   │
│  │  │                                           │ │   │
│  │  │  Compare if verb came first:              │ │   │
│  │  │  حَمِدَ اللَّهَ  (He praised Allah)        │ │   │
│  │  │  └─ This would be a VERBAL sentence       │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  [📖 Learn about sentence types →]             │   │
│  │  [📖 Learn about dependency grammar →]         │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [▼ Show advanced analysis] (Unlocks at Stage 5)      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Layer 6: ADVANCED ANALYSIS

**Purpose**: Complete scholarly analysis with multiple interpretations
**Available to**: Stage 5+ (Expert)
**Complexity**: Scholarly debates, rhetoric, alternative parses

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 0-5: [All previous layers] [▼ Expand all]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ LAYER 6: ADVANCED SCHOLARLY ANALYSIS            │   │
│  ├─────────────────────────────────────────────────┤   │
│  │                                                 │   │
│  │  📜 COMPLETE I'RAB STATEMENT                    │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  Classical I'rab (الإعراب التقليدي):      │   │
│  │  │                                           │ │   │
│  │  │  الْحَمْدُ: مبتدأ مرفوع، وعلامة رفعه     │   │
│  │  │  الضمة الظاهرة على آخره                  │   │
│  │  │                                           │ │   │
│  │  │  English Translation:                     │ │   │
│  │  │  "Al-hamdu: Subject in nominative case,  │   │
│  │  │  the sign of which is the visible damma  │ │   │
│  │  │  at its end."                             │ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  🎓 SCHOLARLY NOTES                             │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  1. Al-Zamakhshari (الزمخشري):            │   │
│  │  │  ─────────────────────────────────        │ │   │
│  │  │  Discusses why الحمد (with ال) rather     │   │
│  │  │  than حمد (without ال):                   │   │
│  │  │                                           │ │   │
│  │  │  "الْحَمْدُ means ALL praise belongs to   │   │
│  │  │  Allah, not just SOME praise. The        │ │   │
│  │  │  definite article (ال) indicates         │   │
│  │  │  completeness and exclusivity."          │   │
│  │  │                                           │ │   │
│  │  │  This is called الاستغراق (comprehensiveness)│ │   │
│  │  │                                           │ │   │
│  │  │  ──────────────────────────────────       │ │   │
│  │  │                                           │ │   │
│  │  │  2. Sibawayh (سيبويه):                    │   │
│  │  │  ─────────────────────────                │ │   │
│  │  │  Analyzes the relationship with لِلَّهِ:   │   │
│  │  │                                           │ │   │
│  │  │  "لِلَّهِ is the predicate (خبر), indicating│   │
│  │  │  that praise is specifically and         │   │
│  │  │  exclusively for Allah."                  │   │
│  │  │                                           │ │   │
│  │  │  Some scholars say there's an omitted    │   │
│  │  │  predicate: الحمد (كائن/ثابت) لله         │   │
│  │  │  "Praise is (established/due) for Allah" │   │
│  │  │                                           │ │   │
│  │  │  ──────────────────────────────────       │ │   │
│  │  │                                           │ │   │
│  │  │  3. Ibn Kathir (ابن كثير):                │   │
│  │  │  ─────────────────────────                │ │   │
│  │  │  "Starting with الحمد rather than نحمد    │   │
│  │  │  (we praise) indicates that:             │   │
│  │  │                                           │ │   │
│  │  │  1. This praise is established (ثابت)    │   │
│  │  │  2. It's not contingent on our action    │   │
│  │  │  3. It's a universal truth"              │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  🔀 ALTERNATIVE PARSES                          │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  Parse 1 (Majority View - Sibawayh):     │   │
│  │  │  ────────────────────────────────────     │ │   │
│  │  │  الْحَمْدُ = Subject (مبتدأ)              │ │   │
│  │  │  لِلَّهِ = Predicate (خبر)                 │ │   │
│  │  │                                           │ │   │
│  │  │  Structure: [Subject] [Predicate]        │ │   │
│  │  │                                           │ │   │
│  │  │  ──────────────────────────────────       │ │   │
│  │  │                                           │ │   │
│  │  │  Parse 2 (Al-Zamakhshari):               │ │   │
│  │  │  ─────────────────────────                │ │   │
│  │  │  الْحَمْدُ = Subject (مبتدأ)              │ │   │
│  │  │  [كائن/ثابت] = Omitted predicate (خبر محذوف)│ │   │
│  │  │  لِلَّهِ = Specification (متعلق بالخبر)    │   │
│  │  │                                           │ │   │
│  │  │  Structure: [Subject] [(is)] [for Allah] │ │   │
│  │  │                                           │ │   │
│  │  │  ──────────────────────────────────       │ │   │
│  │  │                                           │ │   │
│  │  │  Parse 3 (Some grammarians):             │ │   │
│  │  │  ───────────────────────────              │ │   │
│  │  │  الْحَمْدُ لِلَّهِ = Complete topic (مبتدأ خبره)│ │   │
│  │  │  رَبِّ الْعَالَمِينَ = New information (بدل)│ │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  🎨 RHETORICAL SIGNIFICANCE (البلاغة)          │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  1. الاستغراق (Comprehensiveness):        │   │
│  │  │     Using ال makes the meaning: ALL      │   │
│  │  │     praise (not just some)               │   │
│  │  │                                           │ │   │
│  │  │  2. التقديم (Fronting):                   │   │
│  │  │     Putting الحمد first emphasizes it     │   │
│  │  │     (Could have said: لله الحمد)          │   │
│  │  │                                           │ │   │
│  │  │  3. الحصر (Restriction):                  │   │
│  │  │     The structure restricts ALL praise   │   │
│  │  │     exclusively to Allah                 │   │
│  │  │                                           │ │   │
│  │  │  4. جملة اسمية (Nominal sentence):        │   │
│  │  │     Indicates permanence and continuity  │   │
│  │  │     (vs. verbal sentence = temporary act)│   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  📚 QIRA'AT VARIATIONS                          │   │
│  │  ┌───────────────────────────────────────────┐ │   │
│  │  │                                           │ │   │
│  │  │  This word has NO variations in the      │   │
│  │  │  10 accepted Qira'at.                    │   │
│  │  │                                           │ │   │
│  │  │  All reciters read: الْحَمْدُ             │   │
│  │  │  with damma at the end.                   │   │
│  │  │                                           │ │   │
│  │  └───────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │  📖 REFERENCES                                  │   │
│  │  • Tafsir al-Zamakhshari (al-Kashshaf)        │   │
│  │  • Kitab Sibawayh                              │   │
│  │  • Tafsir Ibn Kathir                           │   │
│  │  • Al-Ajurrumiyyah (Grammar Reference)         │   │
│  │  • Quranic Corpus (quraniccorpus.org)          │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. INTERACTIVE UI DESIGNS

### Design 1: Accordion-Style Hierarchy

**Desktop Version**:

```
┌──────────────────────────────────────────────────────────────────┐
│  WORD ANALYSIS: ٱلْحَمْدُ                            [🔊] [⭐] [?]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [▼] LAYER 0: SURFACE                                   (L0)│ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │                                                            │ │
│  │           ٱلْحَمْدُ                                        │ │
│  │           ───────                                          │ │
│  │           the praise                                       │ │
│  │           [🔊 Play Audio]                                  │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [▶] LAYER 1: BASIC TYPE                    🔓 Unlocked (L1)│ │
│  │     Noun (اسم)                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                 ↓ [User clicks to expand]                       │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [▼] LAYER 1: BASIC TYPE                    🔓 Unlocked (L1)│ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ 📘 This is a NOUN (اسم)                                    │ │
│  │ [Full explanation with examples...]                        │ │
│  │ [Learn more →]                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [▶] LAYER 2: PROPERTIES                    🔓 Unlocked (L2)│ │
│  │     Masculine, Singular, Definite                          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [▶] LAYER 3: GRAMMATICAL CASE              🔓 Unlocked (L3)│ │
│  │     🟢 Nominative (مرفوع) - Sign: ُ                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [🔒] LAYER 4: MORPHOLOGY                   🔒 Locked (L4)  │ │
│  │      Complete Level 7 to unlock                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [🔒] LAYER 5: SYNTAX                       🔒 Locked (L5)  │ │
│  │      Complete Level 9 to unlock                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ [🔒] LAYER 6: ADVANCED                     🔒 Locked (L6)  │ │
│  │      Complete Level 10 to unlock                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [Expand All Unlocked] [Collapse All]                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Mobile Version**:

```
┌─────────────────────────────────┐
│ ٱلْحَمْدُ                        │
│ the praise      [🔊]            │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │▼ L0: SURFACE            (0/6)│ │
│ └─────────────────────────────┘ │
│   [Audio player, translation]   │
│                                 │
│ ┌─────────────────────────────┐ │
│ │▶ L1: BASIC          🔓 (1/6)│ │
│ │  Noun (اسم)                 │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │▶ L2: PROPERTIES     🔓 (2/6)│ │
│ │  ♂ Singular, Definite       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │▶ L3: CASE           🔓 (3/6)│ │
│ │  🟢 Nominative (ُ)          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │🔒 L4: MORPHOLOGY    🔒 (4/6)│ │
│ │   Unlock at Level 7         │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Expand unlocked layers]        │
│                                 │
└─────────────────────────────────┘
```

---

### Design 2: Radial/Onion Layer Visualization

**Interactive Visualization**:

```
┌──────────────────────────────────────────────────────────────────┐
│  HIERARCHICAL GRAMMAR EXPLORER                    [Settings ⚙️]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                                                                  │
│                   ╭───────────────────╮                          │
│               ╭───│   LAYER 6        │───╮                      │
│           ╭───│   │   Advanced       │   │───╮                  │
│       ╭───│   │   │   🔒 Locked      │   │   │───╮              │
│   ╭───│   │   │   ╰───────────────────╯   │   │   │───╮          │
│ ╭─│   │   │   │     LAYER 5: Syntax       │   │   │   │─╮        │
│ │ │   │   │   │     🔒 Locked              │   │   │   │ │        │
│ │ │   │   │   ╰──────────────────────────╯   │   │   │ │        │
│ │ │   │   │       LAYER 4: Morphology        │   │   │ │        │
│ │ │   │   │       🔒 Locked                   │   │   │ │        │
│ │ │   │   ╰───────────────────────────────────╯   │   │ │        │
│ │ │   │         LAYER 3: Case                     │   │ │        │
│ │ │   │         🟢 Nominative (ُ)                 │   │ │        │
│ │ │   │         ✓ Click to view                   │   │ │        │
│ │ │   ╰────────────────────────────────────────────╯   │ │        │
│ │ │             LAYER 2: Properties                    │ │        │
│ │ │             ♂ Singular, Definite                   │ │        │
│ │ │             ✓ Click to view                        │ │        │
│ │ ╰──────────────────────────────────────────────────────╯ │        │
│ │                   LAYER 1: Basic                       │        │
│ │                   Noun (اسم)                           │        │
│ │                   ✓ Click to view                      │        │
│ ╰─────────────────────────────────────────────────────────╯        │
│                                                                  │
│                         ┌──────────┐                             │
│                         │ ٱلْحَمْدُ  │                             │
│                         │the praise│                             │
│                         │  [🔊]    │                             │
│                         └──────────┘                             │
│                     LAYER 0: Surface                             │
│                                                                  │
│  ───────────────────────────────────────────────────────────    │
│                                                                  │
│  Current View: Layer 3                                           │
│  [Details panel shows expanded Layer 3 content]                  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### Design 3: Step-by-Step Progressive Wizard

**Step 1 of 6**:
```
┌──────────────────────────────────────────────────────────────────┐
│  GRAMMAR EXPLORER                              Progress: ●○○○○○  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 1: What is this word?                                      │
│                                                                  │
│             ٱلْحَمْدُ                                            │
│             ───────                                              │
│             the praise                                           │
│             [🔊 Listen]                                          │
│                                                                  │
│  This word is a:                                                 │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  📘 NOUN (اسم)                                            │ │
│  │                                                            │ │
│  │  Nouns are words that name people, places, things,       │ │
│  │  or ideas. This word names an idea: "praise"             │ │
│  │                                                            │ │
│  │  [📖 Learn more about nouns]                              │ │
│  │                                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [Next: Word Properties →]                                       │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Step 2 of 6**:
```
┌──────────────────────────────────────────────────────────────────┐
│  GRAMMAR EXPLORER                              Progress: ●●○○○○  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 2: Word Properties                                         │
│                                                                  │
│  ٱلْحَمْدُ (the praise) - Noun                                  │
│                                                                  │
│  This word has 3 properties:                                     │
│                                                                  │
│  1. Gender:       ♂ Masculine                                   │
│  2. Number:       ① Singular                                    │
│  3. Definiteness: ✓ Definite (has ال)                          │
│                                                                  │
│  [Click any property to learn more]                              │
│                                                                  │
│  [← Back] [Next: Grammatical Role →]                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 6. USER INTERACTION FLOWS

### Flow 1: Beginner Student (Stage 1) Exploring a Word

```
ACTION 1: Student clicks on word ٱلْحَمْدُ in verse
───────────────────────────────────────────────────
System Response:
• Shows Layer 0 (Surface) - expanded by default
• Shows Layer 1 (Basic) - collapsed, clickable
• Shows Layers 2-6 - grayed out with lock icon
• Tooltip: "Complete Level 2 to unlock more layers"

ACTION 2: Student clicks Layer 1
──────────────────────────────────
System Response:
• Smoothly expands Layer 1
• Shows: "This is a NOUN (اسم)"
• Shows simple explanation with examples
• Shows "Learn more" link to Lesson 2.2.1
• Animation: Gentle slide-down

ACTION 3: Student clicks "Learn more"
──────────────────────────────────────
System Response:
• Saves current position (breadcrumb)
• Navigates to Lesson 2.2.1
• Shows lesson content
• Provides "Return to verse" link

ACTION 4: Student returns and progresses
─────────────────────────────────────────
System Response:
• Returns to exact position (Layer 1 still expanded)
• Shows completion checkmark on Layer 1
• Adds to learning log
• Suggests: "Want to see Layer 2? Click below!"
```

---

### Flow 2: Intermediate Student (Stage 3) Analyzing Compound Structure

**Example**: Word لِلَّهِ (Prepositional Phrase)

```
ACTION 1: Student clicks compound word لِلَّهِ
───────────────────────────────────────────────
System Response:
• Detects compound structure (Prep + Noun)
• Shows split visualization:

  ┌─────────────────────────────────────┐
  │ COMPOUND WORD                       │
  │                                     │
  │ لِلَّهِ = لِ + اللَّهِ                │
  │                                     │
  │ Part 1: لِ (Preposition)            │
  │ Part 2: اللَّهِ (Noun)              │
  │                                     │
  │ [Analyze Part 1] [Analyze Part 2]  │
  └─────────────────────────────────────┘

ACTION 2: Student clicks "Analyze Part 1"
──────────────────────────────────────────
System Response:
• Opens hierarchy for لِ (Preposition)
• Shows accessible layers (0-3)
  Layer 0: لِ - "for/to"
  Layer 1: Particle (حرف جر)
  Layer 2: [N/A for particles]
  Layer 3: Indeclinable (مبني)

ACTION 3: Student clicks "Analyze Part 2"
──────────────────────────────────────────
System Response:
• Opens hierarchy for اللَّهِ
• Shows accessible layers (0-3)
  Layer 0: اللَّهِ - "Allah"
  Layer 1: Noun (Proper Noun)
  Layer 2: Masculine, Singular, Definite
  Layer 3: 🔵 Genitive (مجرور) - After preposition

ACTION 4: Student wants to understand relationship
───────────────────────────────────────────────────
System Response:
• Shows "Compound Structure" section in Layer 3
• Displays relationship:

  ┌─────────────────────────────────────┐
  │ RELATIONSHIP                        │
  │                                     │
  │ لِ + اللَّهِ = Prepositional Phrase  │
  │                                     │
  │ لِ (Preposition)                     │
  │ └─ governs →                        │
  │              ↓                       │
  │         اللَّهِ (Noun in Genitive)   │
  │                                     │
  │ Rule: Nouns after prepositions      │
  │ are ALWAYS in genitive case.        │
  └─────────────────────────────────────┘
```

---

### Flow 3: Advanced Student (Stage 4) Exploring Morphology

```
ACTION 1: Student in Layer 4 (Morphology)
──────────────────────────────────────────
System shows:
• Root: ح م د
• Pattern: فَعْل
• Interactive letter breakdown

ACTION 2: Student clicks on root "ح م د"
─────────────────────────────────────────
System Response:
• Opens "Root Explorer" modal
• Shows all derivatives:
  • حَمْد (praise)
  • حَمِدَ (he praised)
  • حَامِد (praiser)
  • مَحْمُود (praiseworthy)
  • مُحَمَّد (Muhammad)
• Shows occurrence count in Quran
• Allows exploration of each derivative

ACTION 3: Student clicks letter-by-letter breakdown
────────────────────────────────────────────────────
System Response:
• Shows animated breakdown:

  ┌──┬──┬──┬──┬──┐
  │ٱل│ ح│ م│ د│ ُ│
  └──┴──┴──┴──┴──┘
     ↑  ↑  ↑  ↑  ↑
     │  │  │  │  └─ Case marker (damma)
     │  │  │  └──── Root letter 3 (ل الفعل)
     │  │  └─────── Root letter 2 (ع الفعل)
     │  └────────── Root letter 1 (ف الفعل)
     └───────────── Definite article

• Student can click each position for details
```

---

## 7. TECHNICAL IMPLEMENTATION

### Component Architecture

```typescript
// Main hierarchical component
import React, { useState, useEffect } from 'react';

interface HierarchicalGrammarProps {
  wordId: string;
  userStage: 1 | 2 | 3 | 4 | 5;
  initialExpandedLayers?: number[];
}

const HierarchicalGrammarComponent: React.FC<HierarchicalGrammarProps> = ({
  wordId,
  userStage,
  initialExpandedLayers = [0]
}) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(
    new Set(initialExpandedLayers)
  );

  const [wordData, setWordData] = useState<WordData | null>(null);
  const [maxAccessibleLayer, setMaxAccessibleLayer] = useState<number>(0);

  // Determine max accessible layer based on user stage
  useEffect(() => {
    const stageToLayer = {
      1: 1, // Beginner: Layers 0-1
      2: 2, // Elementary: Layers 0-2
      3: 3, // Intermediate: Layers 0-3
      4: 4, // Advanced: Layers 0-4
      5: 6  // Expert: All layers 0-6
    };
    setMaxAccessibleLayer(stageToLayer[userStage]);
  }, [userStage]);

  // Fetch word data
  useEffect(() => {
    fetchWordData(wordId).then(setWordData);
  }, [wordId]);

  const toggleLayer = (layerNum: number) => {
    if (layerNum > maxAccessibleLayer) {
      showUpgradePrompt(layerNum);
      return;
    }

    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(layerNum)) {
      newExpanded.delete(layerNum);
    } else {
      newExpanded.add(layerNum);
    }
    setExpandedLayers(newExpanded);

    // Track analytics
    trackLayerInteraction(wordId, layerNum, 'toggle');
  };

  const isLayerAccessible = (layerNum: number) => {
    return layerNum <= maxAccessibleLayer;
  };

  const isLayerExpanded = (layerNum: number) => {
    return expandedLayers.has(layerNum);
  };

  if (!wordData) return <LoadingSpinner />;

  return (
    <div className="hierarchical-grammar-component">
      <ComponentHeader word={wordData.surface} />

      {/* Layer 0: Always visible */}
      <LayerSurface
        data={wordData.surface}
        isExpanded={isLayerExpanded(0)}
        onToggle={() => toggleLayer(0)}
      />

      {/* Layer 1: Basic Categorization */}
      <CollapsibleLayer
        layerNum={1}
        isAccessible={isLayerAccessible(1)}
        isExpanded={isLayerExpanded(1)}
        onToggle={() => toggleLayer(1)}
        title="BASIC TYPE"
        summary={wordData.layer1_basic.pos}
      >
        <BasicCategorizationPanel
          data={wordData.layer1_basic}
          userStage={userStage}
        />
      </CollapsibleLayer>

      {/* Layer 2: Properties */}
      <CollapsibleLayer
        layerNum={2}
        isAccessible={isLayerAccessible(2)}
        isExpanded={isLayerExpanded(2)}
        onToggle={() => toggleLayer(2)}
        title="PROPERTIES"
        summary={getPropertiesSummary(wordData.layer2_properties)}
      >
        <WordPropertiesPanel
          data={wordData.layer2_properties}
          userStage={userStage}
        />
      </CollapsibleLayer>

      {/* Layer 3: I'rab */}
      <CollapsibleLayer
        layerNum={3}
        isAccessible={isLayerAccessible(3)}
        isExpanded={isLayerExpanded(3)}
        onToggle={() => toggleLayer(3)}
        title="GRAMMATICAL CASE"
        summary={getCaseSummary(wordData.layer3_irab)}
      >
        <GrammaticalCasePanel
          data={wordData.layer3_irab}
          userStage={userStage}
        />
      </CollapsibleLayer>

      {/* Layer 4: Morphology */}
      <CollapsibleLayer
        layerNum={4}
        isAccessible={isLayerAccessible(4)}
        isExpanded={isLayerExpanded(4)}
        onToggle={() => toggleLayer(4)}
        title="MORPHOLOGY"
        summary="Root & Pattern Analysis"
      >
        <MorphologyPanel
          data={wordData.layer4_morphology}
          userStage={userStage}
        />
      </CollapsibleLayer>

      {/* Layer 5: Syntax */}
      <CollapsibleLayer
        layerNum={5}
        isAccessible={isLayerAccessible(5)}
        isExpanded={isLayerExpanded(5)}
        onToggle={() => toggleLayer(5)}
        title="SYNTAX"
        summary="Sentence Role & Relationships"
      >
        <SyntaxPanel
          data={wordData.layer5_syntax}
          userStage={userStage}
        />
      </CollapsibleLayer>

      {/* Layer 6: Advanced */}
      <CollapsibleLayer
        layerNum={6}
        isAccessible={isLayerAccessible(6)}
        isExpanded={isLayerExpanded(6)}
        onToggle={() => toggleLayer(6)}
        title="ADVANCED ANALYSIS"
        summary="Scholarly Notes & Rhetoric"
      >
        <AdvancedAnalysisPanel
          data={wordData.layer6_advanced}
          userStage={userStage}
        />
      </CollapsibleLayer>

      <ComponentFooter
        expandedCount={expandedLayers.size}
        totalAccessible={maxAccessibleLayer + 1}
      />
    </div>
  );
};
```

### Collapsible Layer Component

```typescript
interface CollapsibleLayerProps {
  layerNum: number;
  isAccessible: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  title: string;
  summary?: string;
  children: React.ReactNode;
}

const CollapsibleLayer: React.FC<CollapsibleLayerProps> = ({
  layerNum,
  isAccessible,
  isExpanded,
  onToggle,
  title,
  summary,
  children
}) => {
  const icon = isExpanded ? '▼' : '▶';
  const lockIcon = isAccessible ? '🔓' : '🔒';

  return (
    <div className={`layer layer-${layerNum} ${isAccessible ? 'accessible' : 'locked'}`}>
      <div
        className="layer-header"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`layer-${layerNum}-content`}
      >
        <span className="layer-icon">{isAccessible ? icon : '🔒'}</span>
        <span className="layer-title">LAYER {layerNum}: {title}</span>
        <span className="layer-status">{lockIcon}</span>
        {!isExpanded && summary && (
          <span className="layer-summary">{summary}</span>
        )}
      </div>

      {isAccessible && isExpanded && (
        <div
          id={`layer-${layerNum}-content`}
          className="layer-content"
          role="region"
          aria-labelledby={`layer-${layerNum}-header`}
        >
          <AnimateHeight duration={300} height={isExpanded ? 'auto' : 0}>
            {children}
          </AnimateHeight>
        </div>
      )}

      {!isAccessible && (
        <div className="layer-locked-message">
          <LockIcon />
          <p>Complete Level {getRequiredLevel(layerNum)} to unlock</p>
          <button onClick={() => showLevelInfo(layerNum)}>
            Learn how to unlock
          </button>
        </div>
      )}
    </div>
  );
};
```

### Animation & Transitions

```css
/* Smooth accordion animations */
.layer {
  margin-bottom: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.layer.accessible:hover {
  border-color: #2196F3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.layer.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.layer-header {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  background: #f5f5f5;
  transition: background 0.2s ease;
}

.layer-header:hover {
  background: #eeeeee;
}

.layer-content {
  padding: 24px;
  background: white;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Layer number badge */
.layer-title::before {
  content: '';
  display: inline-block;
  width: 24px;
  height: 24px;
  background: #2196F3;
  border-radius: 50%;
  margin-right: 8px;
}

/* Locked layer styling */
.layer-locked-message {
  padding: 24px;
  text-align: center;
  background: #fafafa;
  color: #757575;
}
```

---

## 8. EXAMPLES FOR EACH LEARNING STAGE

### Stage 1 (Beginner) - Seeing Layers 0-1

**What They See**:
```
┌─────────────────────────────────┐
│ ٱلْحَمْدُ                        │
│ the praise [🔊]                 │
├─────────────────────────────────┤
│ ▼ This is a NOUN                │
│   Words that name things        │
│                                 │
│ 🔒 More details at Level 2      │
└─────────────────────────────────┘
```

**Complexity**: Very simple, encourages them to level up

---

### Stage 2 (Elementary) - Seeing Layers 0-2

**What They See**:
```
┌─────────────────────────────────┐
│ ٱلْحَمْدُ - the praise [🔊]     │
├─────────────────────────────────┤
│ ▼ NOUN (اسم)                    │
│                                 │
│ ▼ Properties:                   │
│   • ♂ Masculine                 │
│   • ① Singular                  │
│   • Definite (has ال)           │
│                                 │
│ 🔒 Grammar role at Level 3      │
└─────────────────────────────────┘
```

**Complexity**: Building blocks of grammar

---

### Stage 3 (Intermediate) - Seeing Layers 0-3

**What They See**:
```
┌─────────────────────────────────┐
│ ٱلْحَمْدُ - Noun [🔊]            │
├─────────────────────────────────┤
│ ▼ Properties:                   │
│   ♂ Masculine, ① Singular       │
│   Definite                      │
│                                 │
│ ▼ Grammar:                      │
│   🟢 NOMINATIVE (مرفوع)          │
│   Sign: ُ (damma)               │
│   Why? It's the subject         │
│                                 │
│ 🔒 Word structure at Level 7    │
└─────────────────────────────────┘
```

**Complexity**: Understanding i'rab

---

### Stage 4 (Advanced) - Seeing Layers 0-4

**What They See**:
```
┌─────────────────────────────────┐
│ ٱلْحَمْدُ [Full analysis]       │
├─────────────────────────────────┤
│ ▼ Morphology:                   │
│   Root: ح م د (h-m-d)           │
│   Pattern: فَعْل                 │
│   Breakdown:                    │
│   [ال][ح][م][د][ُ]              │
│                                 │
│ [Explore root derivatives →]    │
│                                 │
│ 🔒 Syntax at Level 9            │
└─────────────────────────────────┘
```

**Complexity**: Root-pattern system

---

### Stage 5 (Expert) - All Layers 0-6

**What They See**:
```
┌─────────────────────────────────┐
│ ٱلْحَمْدُ [Complete Analysis]   │
├─────────────────────────────────┤
│ ▼ All Layers Unlocked           │
│                                 │
│ ▼ Advanced Analysis:            │
│   Classical I'rab statement     │
│   Scholarly debates             │
│   Rhetorical significance       │
│   Alternative parses            │
│                                 │
│ [Research mode →]               │
└─────────────────────────────────┘
```

**Complexity**: Scholar-level analysis

---

## CONCLUSION

This **Hierarchical Grammar Component** provides:

✅ **6 Progressive Layers** - From surface to expert analysis
✅ **Stage-Based Access** - Unlock layers as you learn
✅ **Interactive Exploration** - Click to reveal deeper understanding
✅ **Adaptive Complexity** - Same content, different explanations
✅ **Compound Word Support** - Analyze parts separately
✅ **Multiple UI Patterns** - Accordion, radial, wizard
✅ **Comprehensive Data Structure** - All layers in database
✅ **Smooth Animations** - Polished user experience

This creates a **learning journey** where students progressively unlock deeper understanding of Arabic grammar, motivated by clear goals and rewarded with new insights at each stage.

---

**END OF HIERARCHICAL GRAMMAR COMPONENT DESIGN**

**Related Documents**:
- WORD_LEVEL_ANALYSIS_SPECIFICATION.md (The 7 fields)
- COMPLETE_UI_UX_WIREFRAMES_AND_INTERACTIONS.md (Complete UI designs)
- CURRICULUM_ARCHITECTURE.md (Learning stages and progression)
