# Word & Ayat Analysis Page - Detailed Design Specification
## arQ Core Feature: Interactive Grammatical Analysis

**Date:** November 4, 2025
**Version:** 2.0 (Enhanced with research insights)
**Status:** Ready for Implementation

---

## Overview

The Word & Ayat Analysis page is the **core differentiator** for arQ. It combines:
- Word-by-word grammatical breakdown (Corpus-level depth)
- Multiple visualization modes (accessibility for all learning styles)
- Progressive complexity (beginner to expert)
- Interactive exploration (tap, hover, drill-down)
- Teacher annotations (for classroom use)

**Design Philosophy:** **"Simple by default, complex by choice"**

---

## Page Layouts by Device

### Desktop/Tablet Layout (≥768px)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│ [← Back to Lesson]  Surah Al-Fatiha (1) - Ayah 2  [Next Ayah →]  [🔊 Audio]  │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─ Settings Bar ──────────────────────────────────────────────────────────┐  │
│  │ Visualization: [Color-Coded ▼]  │  Complexity: [●━━━━] 2/5  │  [⚙️]    │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ Verse Display (Full Width, Center) ───────────────────────────────────┐  │
│  │                                                                          │  │
│  │              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ                      │  │
│  │                                                                          │  │
│  │         الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ                           │  │
│  │          ───────  ────  ───  ────────                                   │  │
│  │           BLUE    ORG  BLUE   BLUE                                      │  │
│  │                                                                          │  │
│  │  Translation: "All praise is for Allah—Lord of all worlds,"            │  │
│  │  Transliteration: Al-hamdu lillahi rabbil-'aalameen                    │  │
│  │                                                                          │  │
│  │  [👁️ Show/Hide Translation]  [🔤 Show/Hide Transliteration]             │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ Analysis Panel (2/3 width) ──────┐  ┌─ Context Panel (1/3 width) ────┐  │
│  │                                    │  │                                  │  │
│  │  Selected Word: الْحَمْدُ          │  │  📖 Lesson Notes                │  │
│  │  ──────────────────────             │  │  This word appears 3x in       │  │
│  │                                    │  │  Al-Fatiha...                   │  │
│  │  [Word Analysis Details Here]     │  │                                  │  │
│  │                                    │  │  📚 Related Concepts            │  │
│  │  • Part of Speech: Noun           │  │  • Definite Article (ال)        │  │
│  │  • Gender: Masculine              │  │  • Damma case ending            │  │
│  │  • Number: Singular               │  │  • Nominal sentences            │  │
│  │  • Case: Nominative (Marfu')      │  │                                  │  │
│  │  • Definiteness: Definite         │  │  🎯 Practice                    │  │
│  │  • Role: Subject (Mubtada)        │  │  [Quiz on this word]            │  │
│  │  • Root: ح م د (praise)           │  │  [Find similar words]           │  │
│  │                                    │  │  [Add to review queue]          │  │
│  │  [Show More ▼]                     │  │                                  │  │
│  │                                    │  │  💬 Teacher Notes               │  │
│  │                                    │  │  (If viewing assignment)        │  │
│  │                                    │  │                                  │  │
│  └────────────────────────────────────┘  └──────────────────────────────────┘  │
│                                                                                 │
│  ┌─ Mode-Specific Visualization (Full Width) ──────────────────────────────┐  │
│  │  [Based on selected mode: tree diagram, timeline, card stack, etc.]     │  │
│  │  [Details in "Visualization Modes" section below]                       │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  [Compare with another word]  [View entire Surah analysis]  [Bookmark this]   │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌──────────────────────────────────────┐
│ ☰  Surah 1, Ayah 2     🔊  ⋮         │
├──────────────────────────────────────┤
│                                       │
│  [Swipe for prev/next verse]         │
│                                       │
│  ┌─ Verse (Full Screen) ──────────┐ │
│  │                                 │ │
│  │   الْحَمْدُ لِلَّهِ رَبِّ       │ │
│  │    الْعَالَمِينَ                │ │
│  │                                 │ │
│  │   [Tap any word for analysis]  │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Translation:                         │
│  "All praise is for Allah..."        │
│  [Expand ▼]                           │
│                                       │
│  ┌─ Settings Drawer (Collapsed) ──┐ │
│  │  Visualization: Color-Coded ▼   │ │
│  │  Complexity: ●━━━━ 2/5          │ │
│  └─────────────────────────────────┘ │
│                                       │
│  [When user taps word "الْحَمْدُ":]  │
│                                       │
│  ┌─ Bottom Sheet slides up ────────┐│
│  │ ═══ [drag handle]                ││
│  │                                  ││
│  │ الْحَمْدُ - The Praise            ││
│  │                                  ││
│  │ Noun • Nominative • Subject      ││
│  │                                  ││
│  │ [Swipe up for full analysis ▲]  ││
│  └──────────────────────────────────┘│
│                                       │
│  [< Prev Word]  [Next Word >]        │
│                                       │
└──────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Verse Display Component

**Purpose:** Show Quranic verse with interactive words

#### States:
1. **Default State** - All words displayed
2. **Hover State** (Desktop) - Word highlighted + tooltip
3. **Selected State** - Word highlighted + analysis panel shown
4. **Audio Playing** - Current word highlighted with animation

#### Specifications:

```typescript
interface VerseDisplayProps {
  surahNumber: number;
  ayahNumber: number;
  verseText: string;
  words: Word[];
  selectedWordIndex: number | null;
  visualizationMode: VisualizationMode;
  complexityLevel: 1 | 2 | 3 | 4 | 5;
  showTranslation: boolean;
  showTransliteration: boolean;
  onWordClick: (wordIndex: number) => void;
  onAudioPlay: () => void;
}

interface Word {
  wordId: string;
  position: number;
  text: string;
  analysis: WordAnalysis;
  visualizationData: VisualizationData;
}
```

#### Styling:

```css
.verse-display {
  font-family: 'Amiri', 'KFGQPC Uthman Taha Naskh', serif;
  font-size: clamp(24px, 5vw, 42px); /* Responsive, large, readable */
  line-height: 2.5;
  text-align: center;
  direction: rtl;
  padding: 2rem;
}

.word {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  margin: 0 0.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.word:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.word.selected {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.word.noun { border-bottom: 3px solid #4169E1; }
.word.verb { border-bottom: 3px solid #2E8B57; }
.word.particle { border-bottom: 3px solid #FF8C00; }

/* Accessibility */
.word:focus-visible {
  outline: 3px solid #036635;
  outline-offset: 2px;
}
```

#### Interactions:

**Desktop:**
- **Hover:** Show quick tooltip (word type + meaning)
- **Click:** Select word and open analysis panel
- **Keyboard:** Tab to navigate, Enter to select

**Mobile:**
- **Tap:** Open bottom sheet with analysis
- **Long Press:** Show quick actions (bookmark, add to review)
- **Swipe:** Navigate between words

### 2. Analysis Panel Component

**Purpose:** Show detailed grammatical analysis of selected word

#### Levels of Complexity:

**Level 1 (Beginner):**
```
┌─────────────────────────────────────┐
│ الْحَمْدُ                            │
│ "The Praise"                        │
│                                     │
│ 🔵 NOUN                             │
│ This is a name for something or     │
│ someone. Like "book" or "Ahmad".    │
│                                     │
│ Root: ح م د                         │
│ Family of words about "praising"    │
│                                     │
│ [🎮 Practice with this word]        │
│ [📚 Learn more about nouns]         │
└─────────────────────────────────────┘
```

**Level 2 (Intermediate):**
```
┌─────────────────────────────────────┐
│ الْحَمْدُ - Al-Hamdu                │
│ "The Praise"                        │
│                                     │
│ Part of Speech: NOUN (اسم)         │
│ Definiteness: DEFINITE (معرفة)      │
│ Gender: MASCULINE (مذكر)            │
│ Number: SINGULAR (مفرد)             │
│                                     │
│ Root: ح م د (h-m-d)                │
│ Meaning: to praise, to thank        │
│                                     │
│ Template: فَعْل (fa'l)              │
│ Verbal noun (مصدر) from حَمِدَ      │
│                                     │
│ [Show advanced details ▼]           │
└─────────────────────────────────────┘
```

**Level 3 (Advanced):**
```
┌─────────────────────────────────────┐
│ الْحَمْدُ - Al-Hamdu                │
│ "The Praise"                        │
│                                     │
│ MORPHOLOGY:                         │
│ • Type: Noun (اسم)                 │
│ • Root: ح م د (h-m-d)              │
│ • Template: فَعْل (fa'l)           │
│ • Verbal Noun (مصدر) of حَمِدَ      │
│                                     │
│ INFLECTION:                         │
│ • Definiteness: Definite (al-)     │
│ • Gender: Masculine                 │
│ • Number: Singular                  │
│                                     │
│ I'RAB (CASE):                       │
│ • Case: Nominative (مرفوع)         │
│ • Sign: Damma (ضمة) - ُـ           │
│ • Reason: Subject of nominal       │
│   sentence (المبتدأ)                │
│                                     │
│ SYNTAX:                             │
│ • Grammatical Role: مبتدأ (Subject) │
│ • Sentence Type: Nominal (اسمية)   │
│ • Predicate: لِلَّهِ                │
│                                     │
│ [📊 View tree diagram]              │
│ [🔗 See word family]                │
│ [📖 Scholarly notes]                │
└─────────────────────────────────────┘
```

**Level 4 (Expert):**
```
┌─────────────────────────────────────────────┐
│ الْحَمْدُ - Al-Hamdu                        │
│ "The Praise (absolute and perfect)"        │
│                                             │
│ COMPLETE MORPHOLOGICAL ANALYSIS:            │
│                                             │
│ Root: ح م د (√ḥ-m-d)                       │
│ └─ Trilateral root, sound (صحيح)           │
│ └─ Semantic field: praise, thanks          │
│                                             │
│ Template: فَعْل (fa'l) [Form I verbal noun]│
│ ┌─ Base: ح م د                             │
│ ├─ Apply template: حَمْد                    │
│ ├─ Add article: الحَمْد                     │
│ └─ Add case marker: الحَمْدُ                │
│                                             │
│ Definiteness: ال التعريف (definite article)│
│ └─ Assimilated: ال becomes الل before ل     │
│                                             │
│ Case Marking (إعراب):                       │
│ • State: مرفوع (Nominative/Raised)         │
│ • Marker: ضمة ظاهرة (Visible damma)        │
│ • Reason: مبتدأ (Subject of nominal sent.) │
│                                             │
│ Syntactic Function:                         │
│ • Position: مبتدأ (Mubtada/Subject)        │
│ • Type: Nominal sentence (الجملة الاسمية)  │
│ • Predicate: شبه جملة (pseudo-sentence)    │
│   → لِلَّهِ (prepositional phrase)          │
│                                             │
│ Semantic Notes:                             │
│ • ال here: استغراق الجنس (encompasses all) │
│   = "ALL praise" (not just some)           │
│ • Placement: خبر مقدم وجوباً (obligatory   │
│   fronting) - theological significance     │
│                                             │
│ Historical Usage:                           │
│ • Appears 38 times in Quran                │
│ • Opening of 5 Surahs                      │
│ • Always with ال (never حمد alone)         │
│                                             │
│ Cross-References:                           │
│ • Surah 6:1, 18:1, 34:1, 35:1 (similar)   │
│ • Hadith: "Al-hamdu lillah fills the scale"│
│                                             │
│ [📚 View scholarly tafsir]                  │
│ [🌳 Complete dependency analysis]           │
│ [🔍 Search all occurrences]                │
└─────────────────────────────────────────────┘
```

**Level 5 (Scholar):**
- Add: Different Qira'at readings
- Add: Scholarly disagreements on parsing
- Add: Historical linguistic notes
- Add: Comparative Semitic analysis

### 3. Visualization Modes

#### Mode 1: Color-Coded Text (Default)

**Best for:** Beginners, quick reference, reading flow

```
Implementation:
- Each word colored by POS
- Hover shows quick tooltip
- Click shows full analysis
- Legend at top:
  [🔵 Noun] [🟢 Verb] [🟠 Particle] [🟣 Pronoun]
```

**CSS Variables:**
```css
:root {
  --noun-color: #4169E1;
  --verb-color: #2E8B57;
  --particle-color: #FF8C00;
  --pronoun-color: #9370DB;
  --proper-noun-color: #8B4513;
}
```

#### Mode 2: Tree Diagram (Dependency Graph)

**Best for:** Visual learners, understanding relationships

```
Libraries: React Flow or D3.js

Structure:
        [Sentence (الجملة الاسمية)]
               │
        ┌──────┴──────┐
     [مبتدأ]         [خبر]
        │              │
   [الْحَمْدُ]      [لِلَّهِ]
```

**Implementation:**

```typescript
import ReactFlow, { Node, Edge } from 'reactflow';

const treeNodes: Node[] = [
  {
    id: 'sentence',
    type: 'sentenceNode',
    position: { x: 250, y: 0 },
    data: { label: 'Nominal Sentence', labelAr: 'الجملة الاسمية' }
  },
  {
    id: 'subject',
    type: 'grammarNode',
    position: { x: 100, y: 100 },
    data: { label: 'Subject', labelAr: 'مبتدأ', case: 'Nominative' }
  },
  {
    id: 'predicate',
    type: 'grammarNode',
    position: { x: 400, y: 100 },
    data: { label: 'Predicate', labelAr: 'خبر', case: 'Genitive (in preposition)' }
  },
  {
    id: 'word1',
    type: 'wordNode',
    position: { x: 100, y: 200 },
    data: { word: 'الْحَمْدُ', meaning: 'The Praise', pos: 'noun' }
  },
  {
    id: 'word2',
    type: 'wordNode',
    position: { x: 400, y: 200 },
    data: { word: 'لِلَّهِ', meaning: 'For Allah', pos: 'preposition+noun' }
  }
];

const treeEdges: Edge[] = [
  { id: 'e1', source: 'sentence', target: 'subject', label: 'has subject' },
  { id: 'e2', source: 'sentence', target: 'predicate', label: 'has predicate' },
  { id: 'e3', source: 'subject', target: 'word1', label: 'realized as' },
  { id: 'e4', source: 'predicate', target: 'word2', label: 'realized as' }
];
```

**Interactive Features:**
- Click node: Show word analysis
- Zoom in/out with mousewheel
- Pan by dragging
- Minimap for orientation
- Export as image (for teacher notes)

#### Mode 3: Card Stack

**Best for:** Mobile, focused study, memorization

```
┌──────────────────────────────────────┐
│  [Card 1/4]                          │
│                                      │
│         الْحَمْدُ                     │
│       "The Praise"                   │
│                                      │
│      🔵 NOUN                          │
│      Nominative Case                 │
│      Subject of sentence             │
│                                      │
│  [Previous]  [Flip]  [Next]          │
│                                      │
│  ●○○○ (progress dots)                │
└──────────────────────────────────────┘

[Flip animation shows grammatical details on back]

┌──────────────────────────────────────┐
│  [Card 1/4] - Back                   │
│                                      │
│  Root: ح م د                         │
│  Template: فَعْل                     │
│  Gender: Masculine                   │
│  Number: Singular                    │
│  Definiteness: Definite (ال)         │
│  Case: Nominative (ضمة)              │
│  Role: Subject (مبتدأ)               │
│                                      │
│  [Previous]  [Flip]  [Next]          │
│                                      │
│  ●○○○                                │
└──────────────────────────────────────┘
```

**Implementation:**
- CSS 3D transforms for flip animation
- Swipe gestures for navigation
- Save progress (which card user is on)

#### Mode 4: Timeline (Morphology Build)

**Best for:** Understanding word formation process

```
┌────────────────────────────────────────────────────────────┐
│  Word Formation Timeline: الْحَمْدُ                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Step 1     Step 2       Step 3      Step 4     Step 5    │
│  ──────     ──────       ──────      ──────     ──────    │
│                                                            │
│  Root  →  Template  →   Base    →   Article →  Case      │
│                                                            │
│  حمد   →    فَعْل    →   حَمْد   →   الحَمْد  →  الحَمْدُ  │
│                                                            │
│  "praise"  "noun      "praise"   "THE praise"  "THE       │
│            pattern"                             Praise"    │
│                                                 (subject)  │
│                                                            │
│  [Auto-play animation]  [Step-by-step]  [Speed: 1x ▼]    │
│                                                            │
│  ●●○○○ (showing step 2/5)                                  │
└────────────────────────────────────────────────────────────┘
```

**Animation:**
- Smooth transitions between steps
- Color changes to highlight what's added
- Audio option (pronounce each step)
- Rewind/forward controls

#### Mode 5: Mind Map

**Best for:** Exploring word family, root connections

```
                  ح م د (Root: Praise)
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     حَمِدَ         حَمْد         مَحْمُود
   (he praised)   (praise)    (praiseworthy)
        │              │              │
    ┌───┴───┐      الحَمْد       مُحَمَّد
    │       │    (THE praise)    (Muhammad)
  حامِد  مَحْمُود                (praised one)
 (praiser)(praised)
```

**Implementation:**
- D3.js force-directed graph
- Collapsible nodes (expand/collapse word families)
- Click word to see analysis
- Search to find specific words in map

#### Mode 6: Progressive Disclosure (Layered)

**Best for:** Teaching, presenting, step-by-step learning

```
Click to reveal layers:

┌──────────────────────────────────────┐
│  الْحَمْدُ                            │
│  ─────                               │
│  [Click to reveal more ▼]            │
└──────────────────────────────────────┘

↓ After click:

┌──────────────────────────────────────┐
│  الْحَمْدُ                            │
│  ─────                               │
│  ✓ Word Type: NOUN                   │
│  [Click for more ▼]                  │
└──────────────────────────────────────┘

↓ After click:

┌──────────────────────────────────────┐
│  الْحَمْدُ                            │
│  ─────                               │
│  ✓ Word Type: NOUN                   │
│  ✓ Root: ح م د (praise)              │
│  [Click for more ▼]                  │
└──────────────────────────────────────┘

... and so on, revealing information progressively
```

### 4. Context Panel (Desktop Only)

**Purpose:** Provide supplementary information and actions

**Sections:**

1. **Lesson Notes**
   - Context from current lesson
   - Teacher annotations (if applicable)
   - Key concepts highlighted

2. **Related Concepts**
   - Links to grammar lessons
   - Similar words to study
   - Root family connections

3. **Practice**
   - Quick quiz on this word
   - Find similar examples
   - Add to spaced repetition queue

4. **Cross-References**
   - Other occurrences in Quran
   - Related verses
   - Hadith references

5. **Teacher Notes** (if in assignment)
   - Specific instructions
   - Focus areas
   - Grading rubric

### 5. Settings & Controls

**Global Settings (Gear Icon):**

```
┌────────────────────────────────────┐
│  ⚙️ Analysis Settings               │
├────────────────────────────────────┤
│                                    │
│  Display:                          │
│  ☑ Show translations               │
│  ☑ Show transliteration            │
│  ☐ Show word position numbers      │
│  ☑ Color-code by POS               │
│                                    │
│  Terminology:                      │
│  ⦿ English (Simplified)            │
│  ○ Arabic (Traditional)            │
│  ○ Both                            │
│                                    │
│  Audio:                            │
│  Reciter: [Mishary Alafasy ▼]     │
│  Speed: [1.0x ▼]                   │
│  ☑ Auto-play on word selection     │
│                                    │
│  Advanced:                         │
│  ☐ Show alternate readings (Qira'at)│
│  ☐ Show scholarly notes            │
│  ☐ Enable comparison mode          │
│                                    │
│  [Save Preferences]                │
└────────────────────────────────────┘
```

---

## User Flows

### Flow 1: Student Studying Lesson

```
1. Student navigates to lesson: "Past Tense Verbs"
2. Lesson contains example verse: Surah 2:2
3. Student clicks verse → Opens Word/Ayat Analysis Page
4. Default view: Color-coded text, Complexity Level 2 (Intermediate)
5. Student taps word "ذَٰلِكَ" (that)
6. Analysis panel shows:
   - Pronoun (demonstrative)
   - Nominative case
   - Subject of sentence
7. Student clicks "Show more" → Complexity increases to Level 3
8. Additional details appear: root, template, I'rab reasoning
9. Student clicks "Add to review queue"
10. Word saved for spaced repetition later
11. Student clicks "Next word" → Analysis shifts to next word
12. Student cycles through all words in verse
13. Student clicks "Quiz me" → Interactive exercise on verse words
14. Student completes quiz → XP earned, progress saved
```

### Flow 2: Teacher Reviewing Student Work

```
1. Teacher views assignment submission from Ahmed
2. Assignment: "Analyze Surah Al-Fatiha, Ayah 1-2"
3. Teacher clicks "View Ahmed's Analysis"
4. Opens Word/Ayat Analysis Page with Ahmed's annotations overlaid
5. Ahmed has identified word types and cases
6. Some are correct (green checkmarks), some incorrect (red X)
7. Teacher clicks incorrect answer: "Ahmed marked this as accusative, but it's genitive"
8. Teacher adds feedback: "Remember, this word follows a preposition (لِ), so it must be genitive"
9. Teacher clicks "Save Feedback"
10. Ahmed will see teacher's notes when reviewing
11. Teacher grades: 8/10 (good understanding, minor mistake)
12. Teacher assigns remedial work: "Review lesson on prepositions"
```

### Flow 3: Advanced User Exploring Word Family

```
1. Expert student studying root ح م د
2. Opens Surah 1:2 analysis (contains الْحَمْدُ)
3. Switches to Mind Map visualization
4. Mind map shows all words from root ح م د in Quran
5. Student clicks on مَحْمُود (praiseworthy) - appears in Surah 17:79
6. New tab opens with Surah 17:79 analysis
7. Student compares الْحَمْدُ (noun) with مَحْمُود (adjective)
8. Uses "Compare" mode to see side-by-side differences
9. Student takes notes in personal notebook feature
10. Bookmarks both verses for future reference
11. Adds both words to custom study set for later review
```

---

## Responsive Design Breakpoints

```css
/* Mobile (Portrait) */
@media (max-width: 480px) {
  .verse-display { font-size: 28px; }
  .analysis-panel { width: 100%; position: fixed; bottom: 0; } /* Bottom sheet */
  .context-panel { display: none; } /* Hidden on mobile */
}

/* Mobile (Landscape) / Small Tablet */
@media (min-width: 481px) and (max-width: 767px) {
  .verse-display { font-size: 32px; }
  .analysis-panel { width: 100%; max-height: 60vh; }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .verse-display { font-size: 36px; }
  .analysis-panel { width: 60%; }
  .context-panel { width: 40%; }
}

/* Desktop */
@media (min-width: 1024px) {
  .verse-display { font-size: 42px; }
  .analysis-panel { width: 66%; }
  .context-panel { width: 34%; }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .verse-display { max-width: 1200px; margin: 0 auto; }
  .analysis-panel { max-width: 800px; }
  .context-panel { max-width: 400px; }
}
```

---

## Accessibility Features

### Keyboard Navigation

```
Tab Order:
1. Back button
2. Prev/Next ayah buttons
3. Audio play button
4. Settings button
5. Visualization mode dropdown
6. Complexity slider
7. First word in verse
8. Second word in verse
... (all words)
N. Translation toggle
N+1. Transliteration toggle
N+2. Context panel (if visible)
N+3. Action buttons (bookmark, quiz, etc.)

Keyboard Shortcuts:
- Arrow Left/Right: Navigate words
- Enter: Select word
- Escape: Deselect word / Close panel
- Space: Play audio
- M: Change mode
- +/-: Increase/decrease complexity
- T: Toggle translation
- R: Toggle transliteration
- B: Bookmark current word
- Q: Quick quiz
- H: Show keyboard help
```

### Screen Reader Optimizations

```html
<div
  role="article"
  aria-label="Quranic verse 1:2 from Surah Al-Fatiha with word-by-word grammatical analysis"
>
  <h2 id="verse-heading" class="sr-only">Verse Display</h2>

  <div role="list" aria-labelledby="verse-heading">
    <button
      role="listitem"
      aria-label="Word 1: Al-Hamdu, meaning The Praise. Noun in nominative case, serving as subject. Click for detailed analysis."
      aria-pressed="false"
      class="word"
    >
      الْحَمْدُ
    </button>
    <!-- More words... -->
  </div>

  <section
    aria-label="Grammatical analysis of selected word"
    aria-live="polite"
  >
    <!-- Analysis content with semantic HTML -->
    <dl>
      <dt>Part of Speech</dt>
      <dd>Noun (in Arabic: Ism)</dd>
      <!-- More properties... -->
    </dl>
  </section>
</div>
```

### ARIA Live Regions

```html
<!-- Announce when word is selected -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  <!-- Screen reader announcement: -->
  "Selected word 2 of 4: Lillah, meaning 'for Allah'. Click for details."
</div>

<!-- Announce when complexity changes -->
<div aria-live="polite" aria-atomic="true" class="sr-only">
  "Complexity level changed to 3 out of 5. Showing advanced grammatical details."
</div>
```

---

## Performance Optimization

### Lazy Loading

```typescript
// Lazy load heavy visualization components
const TreeDiagram = lazy(() => import('./visualizations/TreeDiagram'));
const MindMap = lazy(() => import('./visualizations/MindMap'));
const TimelineView = lazy(() => import('./visualizations/TimelineView'));

// Only load active visualization mode
{visualizationMode === 'tree' && (
  <Suspense fallback={<VisualizationSkeleton />}>
    <TreeDiagram data={wordData} />
  </Suspense>
)}
```

### Caching Strategy

```typescript
// Cache word analysis data with React Query
const { data: wordAnalysis } = useQuery({
  queryKey: ['word-analysis', surahNumber, ayahNumber, wordIndex],
  queryFn: () => fetchWordAnalysis(surahNumber, ayahNumber, wordIndex),
  staleTime: Infinity, // Word analysis never changes
  cacheTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
});

// Prefetch adjacent words for smooth navigation
const queryClient = useQueryClient();
useEffect(() => {
  if (selectedWordIndex < words.length - 1) {
    queryClient.prefetchQuery({
      queryKey: ['word-analysis', surahNumber, ayahNumber, selectedWordIndex + 1],
      queryFn: () => fetchWordAnalysis(surahNumber, ayahNumber, selectedWordIndex + 1),
    });
  }
}, [selectedWordIndex]);
```

### Animation Performance

```typescript
// Use CSS transforms and opacity for 60fps animations
// Avoid layout thrashing

const wordVariants = {
  idle: {
    scale: 1,
    y: 0,
    opacity: 1,
  },
  hover: {
    scale: 1.05,
    y: -2,
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  selected: {
    scale: 1.1,
    y: -4,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

<motion.button
  className="word"
  variants={wordVariants}
  initial="idle"
  whileHover="hover"
  animate={isSelected ? 'selected' : 'idle'}
>
  {word.text}
</motion.button>
```

---

## Technical Implementation Checklist

### Phase 1: Core Display (Week 1-2)
- [ ] Verse display component with word highlighting
- [ ] Basic tooltip on hover (word type + meaning)
- [ ] Click to select word
- [ ] Basic analysis panel (Level 1-2 complexity)
- [ ] Translation/transliteration toggle
- [ ] Mobile bottom sheet UI
- [ ] Keyboard navigation
- [ ] Screen reader support

### Phase 2: Visualizations (Week 3-4)
- [ ] Color-coded mode (default)
- [ ] Tree diagram mode (React Flow)
- [ ] Card stack mode with flip animation
- [ ] Timeline/morphology build mode
- [ ] Mode switcher UI
- [ ] Save user preference for mode
- [ ] Smooth transitions between modes

### Phase 3: Advanced Features (Week 5-6)
- [ ] Mind map mode (D3.js)
- [ ] Progressive disclosure mode
- [ ] Complexity level slider (1-5)
- [ ] Comparison mode (side-by-side words)
- [ ] Context panel with related concepts
- [ ] Audio integration (word highlighting during recitation)
- [ ] Spaced repetition integration ("Add to review queue")
- [ ] Bookmark functionality

### Phase 4: Teacher Features (Week 7-8)
- [ ] Teacher annotation overlay
- [ ] Student work review interface
- [ ] Feedback system
- [ ] Grading interface
- [ ] Custom notes per word
- [ ] Assignment-specific analysis views

### Phase 5: Polish & Optimization (Week 9-10)
- [ ] Performance optimization (lazy loading, caching)
- [ ] Animation smoothness (60fps)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile gesture support (swipe, long-press)
- [ ] Offline support (cached analyses)
- [ ] Cross-browser testing
- [ ] Load testing (large verses)
- [ ] User testing with real students and teachers

---

## Success Metrics

### User Engagement
- **Time on page:** Target 5+ minutes per verse
- **Words analyzed:** Target 10+ words per session
- **Mode switches:** Track which modes are most popular
- **Return visits:** Track how often users revisit same verse

### Learning Effectiveness
- **Comprehension:** Quiz scores after using analysis page
- **Retention:** Spaced repetition performance on analyzed words
- **Progress:** Complexity level increase over time
- **Confidence:** User self-assessment before/after

### Technical Performance
- **Load time:** < 2 seconds (initial)
- **Interaction latency:** < 200ms (word selection)
- **Animation smoothness:** 60fps (maintained)
- **Error rate:** < 0.1% (JavaScript errors)

---

## Conclusion

This Word & Ayat Analysis page design:
- ✅ Provides **world-class grammatical analysis** (Corpus-level depth)
- ✅ Supports **all learning styles** (6 visualization modes)
- ✅ Adapts to **all skill levels** (5 complexity levels)
- ✅ Works on **all devices** (responsive + mobile-first)
- ✅ Enhances **teacher-student interaction** (annotations, feedback)
- ✅ Promotes **long-term retention** (spaced repetition integration)

This is arQ's **killer feature** - no other platform offers this combination of depth, flexibility, and usability.

**Ready to implement:** Start with Phase 1 (Core Display) and iterate based on user feedback.
