# Comprehensive UI Design Requirements
## arQ Quranic Arabic Learning Platform

**Date:** November 4, 2025
**Version:** 3.0 (Final Implementation Guide)
**Status:** Ready for Development

---

## Table of Contents

1. [Design System](#1-design-system)
2. [Component Library](#2-component-library)
3. [Page-by-Page Specifications](#3-page-by-page-specifications)
4. [Interaction Patterns](#4-interaction-patterns)
5. [Animation Guidelines](#5-animation-guidelines)
6. [Responsive Behavior](#6-responsive-behavior)
7. [Accessibility Standards](#7-accessibility-standards)
8. [Performance Requirements](#8-performance-requirements)
9. [Implementation Priorities](#9-implementation-priorities)

---

## 1. DESIGN SYSTEM

### 1.1 Color Palette

#### Primary Colors
```css
:root {
  /* Brand Colors */
  --primary: #036635;           /* Islamic Green (main brand) */
  --primary-light: #048C48;     /* Lighter shade for hover */
  --primary-dark: #024A26;      /* Darker shade for active */

  /* Secondary Colors */
  --secondary: #D4AF37;         /* Gold (accent, achievements) */
  --secondary-light: #E5C158;
  --secondary-dark: #B8941E;
}
```

#### Grammatical Color Coding
```css
:root {
  /* Parts of Speech */
  --noun: #4169E1;              /* Royal Blue */
  --noun-light: #6A89E6;
  --noun-dark: #2850C8;

  --verb: #2E8B57;              /* Sea Green */
  --verb-light: #4FA976;
  --verb-dark: #1F6B42;

  --particle: #FF8C00;          /* Dark Orange */
  --particle-light: #FFA833;
  --particle-dark: #CC7000;

  --pronoun: #9370DB;           /* Medium Purple */
  --pronoun-light: #A98BE5;
  --pronoun-dark: #7556C2;

  --proper-noun: #8B4513;       /* Saddle Brown */
  --proper-noun-light: #A4632B;
  --proper-noun-dark: #6B3410;
}
```

#### Case/I'rab Colors
```css
:root {
  --nominative: #DC143C;        /* Crimson (Marfu/مرفوع) */
  --accusative: #FF6347;        /* Tomato (Mansoob/منصوب) */
  --genitive: #8B008B;          /* Dark Magenta (Majroor/مجرور) */
  --jussive: #4B0082;           /* Indigo (Majzoom/مجزوم) */
}
```

#### Semantic Colors
```css
:root {
  /* Status */
  --success: #10B981;           /* Green */
  --warning: #F59E0B;           /* Amber */
  --error: #EF4444;             /* Red */
  --info: #3B82F6;              /* Blue */

  /* Neutrals */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;

  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F9FAFB;
  --bg-tertiary: #F3F4F6;

  /* Text */
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --text-inverse: #FFFFFF;
}
```

#### Dark Mode
```css
[data-theme="dark"] {
  --primary: #048C48;
  --bg-primary: #111827;
  --bg-secondary: #1F2937;
  --bg-tertiary: #374151;
  --text-primary: #F9FAFB;
  --text-secondary: #D1D5DB;
  --text-tertiary: #9CA3AF;
  --text-inverse: #111827;
}
```

### 1.2 Typography

#### Font Families
```css
:root {
  /* Arabic Fonts */
  --font-quran: 'KFGQPC Uthmanic Script Hafs', 'Amiri Quran', serif;
  --font-arabic: 'Amiri', 'Traditional Arabic', 'Geeza Pro', serif;
  --font-arabic-ui: 'Cairo', 'Tajawal', sans-serif;

  /* Latin Fonts */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-heading: 'Poppins', var(--font-primary);
  --font-mono: 'Fira Code', 'Courier New', monospace;
}
```

#### Font Scales
```css
/* Desktop Scale */
.text-xs     { font-size: 0.75rem; line-height: 1rem; }    /* 12px */
.text-sm     { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-base   { font-size: 1rem; line-height: 1.5rem; }     /* 16px */
.text-lg     { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
.text-xl     { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
.text-2xl    { font-size: 1.5rem; line-height: 2rem; }     /* 24px */
.text-3xl    { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-4xl    { font-size: 2.25rem; line-height: 2.5rem; }  /* 36px */
.text-5xl    { font-size: 3rem; line-height: 1; }          /* 48px */

/* Arabic-specific (larger) */
.text-quran-sm  { font-size: 1.5rem; line-height: 2.5; }   /* 24px */
.text-quran-base { font-size: 2rem; line-height: 2.5; }    /* 32px */
.text-quran-lg  { font-size: 2.5rem; line-height: 2.5; }   /* 40px */
.text-quran-xl  { font-size: 3rem; line-height: 2.5; }     /* 48px */
```

#### Font Weights
```css
.font-light      { font-weight: 300; }
.font-normal     { font-weight: 400; }
.font-medium     { font-weight: 500; }
.font-semibold   { font-weight: 600; }
.font-bold       { font-weight: 700; }
.font-extrabold  { font-weight: 800; }
```

### 1.3 Spacing System

Based on 4px base unit (Tailwind-compatible):

```css
--spacing-0: 0;
--spacing-1: 0.25rem;    /* 4px */
--spacing-2: 0.5rem;     /* 8px */
--spacing-3: 0.75rem;    /* 12px */
--spacing-4: 1rem;       /* 16px */
--spacing-5: 1.25rem;    /* 20px */
--spacing-6: 1.5rem;     /* 24px */
--spacing-8: 2rem;       /* 32px */
--spacing-10: 2.5rem;    /* 40px */
--spacing-12: 3rem;      /* 48px */
--spacing-16: 4rem;      /* 64px */
--spacing-20: 5rem;      /* 80px */
--spacing-24: 6rem;      /* 96px */
```

### 1.4 Border Radius

```css
--radius-sm: 0.25rem;    /* 4px - buttons, badges */
--radius-md: 0.5rem;     /* 8px - cards, inputs */
--radius-lg: 0.75rem;    /* 12px - modals, panels */
--radius-xl: 1rem;       /* 16px - hero sections */
--radius-2xl: 1.5rem;    /* 24px - large cards */
--radius-full: 9999px;   /* Fully rounded - pills, avatars */
```

### 1.5 Shadows

```css
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
--shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
```

### 1.6 Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
--z-maximum: 2147483647;
```

---

## 2. COMPONENT LIBRARY

### 2.1 Core Components

#### Button Component

**Variants:**
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Visual Specifications:**

```
Primary Button:
┌─────────────────────────┐
│  ▶  Continue Lesson     │  ← leftIcon, text
└─────────────────────────┘
bg: var(--primary)
text: white
hover: var(--primary-light)
active: var(--primary-dark)
focus: ring (2px, primary, offset 2px)

Size Scale:
xs:  px-2.5 py-1.5 text-xs
sm:  px-3 py-2 text-sm
md:  px-4 py-2.5 text-base (default)
lg:  px-5 py-3 text-lg
xl:  px-6 py-3.5 text-xl
```

#### Input Component

```tsx
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'search';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  dir?: 'ltr' | 'rtl'; // Important for Arabic input
}
```

**Visual:**
```
┌─ Label ─────────────────┐
│ 📧  email@example.com   │  ← leftIcon, input
└─────────────────────────┘
    ↓ (if error)
    "Please enter a valid email"

Default: border-gray-300
Focus: border-primary, ring-primary
Error: border-error, ring-error
Disabled: bg-gray-100, cursor-not-allowed
```

#### Card Component

```tsx
interface CardProps {
  variant: 'default' | 'outlined' | 'elevated';
  padding: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
```

**Visual:**
```
┌────────────────────────────────┐
│ Header (optional)              │
├────────────────────────────────┤
│                                │
│  Content                       │
│                                │
├────────────────────────────────┤
│ Footer (optional)              │
└────────────────────────────────┘

Default: bg-white, border, rounded-lg
Elevated: shadow-md, no border
Hoverable: shadow-lg on hover, transition
```

#### Badge Component

```tsx
interface BadgeProps {
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size: 'sm' | 'md' | 'lg';
  dot?: boolean; // Show status dot
  children: React.ReactNode;
}
```

**Visual:**
```
Small: [● New]
       px-2 py-0.5 text-xs

Medium: [● Intermediate]
        px-2.5 py-1 text-sm

Large: [● Advanced]
       px-3 py-1.5 text-base

Colors match variant (primary, success, etc.)
Rounded: full
Font: semibold
```

### 2.2 Arabic-Specific Components

#### ArabicText Component

```tsx
interface ArabicTextProps {
  text: string;
  size: 'sm' | 'base' | 'lg' | 'xl' | 'quran';
  withDiacritics?: boolean;
  highlightType?: 'noun' | 'verb' | 'particle' | null;
  clickable?: boolean;
  onClick?: () => void;
  dir?: 'rtl' | 'auto';
}
```

**Features:**
- Automatic font selection (Quran vs. regular Arabic)
- Proper RTL rendering
- Diacritic optimization
- Color coding for grammar

#### WordCard Component

```tsx
interface WordCardProps {
  word: string;
  transliteration: string;
  translation: string;
  pos: 'noun' | 'verb' | 'particle' | 'pronoun';
  root?: string;
  onClick?: () => void;
  selected?: boolean;
}
```

**Visual:**
```
┌─────────────────────────┐
│      الْحَمْدُ           │  ← Arabic word (large)
│    Al-Hamdu             │  ← Transliteration
│    "The Praise"         │  ← Translation
│                         │
│  🔵 Noun                │  ← POS with color
│  Root: ح م د            │  ← Root
└─────────────────────────┘

Hover: Lift effect (translateY -4px)
Selected: Border (3px, primary), shadow-lg
```

#### VerseDisplay Component

```tsx
interface VerseDisplayProps {
  surahNumber: number;
  ayahNumber: number;
  verseText: string;
  translation?: string;
  transliteration?: string;
  words: Word[];
  onWordClick?: (wordIndex: number) => void;
  visualizationMode?: VisualizationMode;
  showTranslation?: boolean;
  showTransliteration?: boolean;
  highlightedWordIndex?: number;
}
```

### 2.3 Gamification Components

#### StreakCounter Component

```tsx
interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  freezesAvailable: number;
  onStreakClick?: () => void;
}
```

**Visual:**
```
┌────────────────────────────────┐
│  🔥 15 Day Streak              │
│                                │
│  Mon Tue Wed Thu Fri Sat Sun   │
│   🔥  🔥  🔥  🔥  🔥  🧊  🔥   │
│                                │
│  ❄️  Freezes: 2                │
│  🏆 Longest: 23 days           │
└────────────────────────────────┘

Animated flame icon
Pulse animation on streak increase
Ice cube for freeze days
```

#### ProgressBar Component

```tsx
interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  showLabel?: boolean;
  variant: 'primary' | 'success' | 'warning';
  size: 'sm' | 'md' | 'lg';
  animated?: boolean;
}
```

**Visual:**
```
Small (4px height):
[████████░░] 80%

Medium (8px height):
[█████████████░░░░░] 75%

Large (12px height):
Lesson Progress
[████████████████████] 100% ✓

Animated: Progress bar fills with smooth transition
```

#### XPIndicator Component

```tsx
interface XPIndicatorProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  recentGain?: number; // Show "+50 XP" animation
}
```

**Visual:**
```
┌────────────────────────────────┐
│  Level 5                       │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░ 2,340 / 3,000│
│                       [+50 XP ↗]│
└────────────────────────────────┘

Recent gain animates in and fades out
Progress bar fills smoothly
Level up shows celebration animation
```

### 2.4 Teacher Components

#### StudentCard Component

```tsx
interface StudentCardProps {
  student: {
    id: string;
    name: string;
    avatar?: string;
    currentLevel: string;
    progress: number;
    lastActive: Date;
    averageScore: number;
  };
  showInterventionAlert?: boolean;
  onClick?: () => void;
}
```

**Visual:**
```
┌─────────────────────────────────────┐
│ 👤 Ahmed Khan          [⚠️]        │  ← Alert icon if intervention needed
│                                     │
│ Level 3 - Intermediate              │
│ Progress: ████████░░ 75%            │
│ Avg Score: 82%                      │
│ Last active: 2 hours ago            │
│                                     │
│ [View Details] [Message]            │
└─────────────────────────────────────┘

Hover: Shadow increase
Alert: Orange/red glow on card border
```

#### AssignmentCard Component

```tsx
interface AssignmentCardProps {
  assignment: {
    id: string;
    title: string;
    dueDate: Date;
    submitted: number;
    total: number;
    needsGrading: number;
  };
  onClick?: () => void;
}
```

**Visual:**
```
┌─────────────────────────────────────┐
│ Past Tense Verbs Practice           │
│ Due: Tomorrow at 5:00 PM            │
│                                     │
│ Submissions: 18/25                  │
│ [██████████████░░░░░░░░] 72%       │
│                                     │
│ 🟡 5 need grading                   │
│ 🟢 13 graded                        │
│ 🔴 7 not submitted                  │
│                                     │
│ [View Submissions]                  │
└─────────────────────────────────────┘
```

---

## 3. PAGE-BY-PAGE SPECIFICATIONS

### 3.1 Student Dashboard

**URL:** `/dashboard`
**Layout:** Full-width with sidebar

**Desktop (≥1024px):**
```
┌──────────────────────────────────────────────────────────────┐
│ [Logo] arQ    [Search]    [Profile] [Notifications] [⚙️]    │
├────────┬─────────────────────────────────────────────────────┤
│        │                                                      │
│ Sidebar│  Welcome back, Ahmed! 👋                            │
│        │                                                      │
│ 📚 My  │  ┌─ Daily Goal ────────┐  ┌─ Streak ─────────┐    │
│ Courses│  │ ███████░░░  7/10 min│  │ 🔥 15 days       │    │
│        │  └─────────────────────┘  └──────────────────┘    │
│ 📊     │                                                      │
│ Progress│  Continue Learning:                                │
│        │  ┌──────────────────────────────────────────────┐  │
│ 🎯     │  │ [Lesson thumbnail]                           │  │
│ Goals  │  │ Lesson 5: Verb Conjugation                   │  │
│        │  │ Progress: ████████░░ 75%                     │  │
│ 🏆     │  │ [Continue →]                                 │  │
│ Achieve│  └──────────────────────────────────────────────┘  │
│        │                                                      │
│ 💬     │  My Courses:                                        │
│ Discuss│  [3 course cards in grid]                          │
│        │                                                      │
│ ⚙️     │  Recent Activity:                                   │
│ Settings│ [Timeline of recent completions, achievements]     │
│        │                                                      │
└────────┴─────────────────────────────────────────────────────┘
```

**Mobile (<768px):**
```
┌──────────────────────────────────┐
│ ☰  arQ        🔔  👤             │
├──────────────────────────────────┤
│ Welcome, Ahmed! 👋               │
│                                  │
│ Daily Goal: ███░ 7/10 min        │
│ Streak: 🔥 15 days  ❄️ 2         │
│                                  │
│ Continue Learning:               │
│ ┌────────────────────────────┐  │
│ │ Lesson 5: Verb Conjugation │  │
│ │ ██████████░░ 75%           │  │
│ │ [Continue →]               │  │
│ └────────────────────────────┘  │
│                                  │
│ My Courses:                      │
│ [Vertical stack of course cards] │
│                                  │
│ ┌─ Quick Actions ─────────────┐ │
│ │ [Review Queue] [Practice]   │ │
│ └─────────────────────────────┘ │
│                                  │
└──────────────────────────────────┘
Bottom Nav: [🏠] [📚] [🎯] [🏆] [👤]
```

**Key Elements:**
1. **Header:** Global navigation, search, profile
2. **Sidebar (desktop):** Main navigation with icons
3. **Hero Section:** Personalized greeting, daily stats
4. **Continue Learning Card:** Resume last lesson
5. **Course Grid:** Enrolled courses with progress
6. **Activity Feed:** Recent achievements, completions
7. **Bottom Navigation (mobile):** Primary navigation

### 3.2 Lesson Viewer

**URL:** `/courses/[courseId]/lessons/[lessonId]`
**Layout:** Full-screen with sidebar (collapsible)

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│ [← Back to Course]     Lesson 5: Past Tense Verbs      [Next]│
├────────┬─────────────────────────────────────────────────────┤
│        │                                                      │
│ Table  │  [Lesson Content Area]                              │
│ of     │                                                      │
│ Content│  1. Introduction                                    │
│        │  ───────────────                                    │
│ ☑ Intro│  Past tense verbs in Arabic (الفعل الماضي)         │
│ ☐ Rule │  indicate actions that have been completed...      │
│ ☐ Ex.  │                                                      │
│ ☐ Quiz │  [Continue reading...]                              │
│        │                                                      │
│ [Hide  │  2. The Rule                                        │
│  TOC]  │  ──────────                                         │
│        │  Past tense verbs follow the pattern فَعَلَ        │
│        │                                                      │
│        │  [Visual diagram showing verb formation]            │
│        │                                                      │
│        │  3. Examples from Quran                             │
│        │  ─────────────────────                              │
│        │                                                      │
│        │  [Quranic verse with interactive words]             │
│        │  [Click any word for grammatical analysis]          │
│        │                                                      │
│        │  4. Practice Exercise                               │
│        │  ───────────────────                                │
│        │  [Interactive exercise embedded]                    │
│        │                                                      │
│        │  [Complete Lesson ✓]                                │
│        │                                                      │
└────────┴─────────────────────────────────────────────────────┘
```

**Mobile:**
```
┌──────────────────────────────────┐
│ ☰  Lesson 5           [•••]      │
├──────────────────────────────────┤
│                                  │
│ [Lesson content - full width]    │
│                                  │
│ Sections appear as cards:        │
│                                  │
│ ┌─ 1. Introduction ───────────┐ │
│ │ [Content...]                │ │
│ │ [Expand ▼]                  │ │
│ └─────────────────────────────┘ │
│                                  │
│ ┌─ 2. The Rule ───────────────┐ │
│ │ [Content...]                │ │
│ └─────────────────────────────┘ │
│                                  │
│ [Swipe up to continue]           │
│                                  │
│ ┌─ Bottom Actions ─────────────┐│
│ │ [Bookmark] [Note] [Complete] ││
│ └──────────────────────────────┘│
└──────────────────────────────────┘
```

**Features:**
- Auto-save progress (every 30 seconds)
- Bookmark sections
- Add personal notes
- Text-to-speech for Arabic content
- Print/export lesson option

### 3.3 Exercise/Quiz Interface

**URL:** `/courses/[courseId]/exercises/[exerciseId]`
**Layout:** Full-screen, modal-like

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│ Exercise: Identify Past Tense Verbs          ⏱ 10:00 [Pause]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Question 3 of 10                                            │
│  [██████░░░░░░░░░░░░] 30%                                    │
│                                                              │
│  Identify the past tense verb in this verse:                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │     اللَّهُ  لَا  إِلَٰهَ  إِلَّا  هُوَ               │  │
│  │                                                       │  │
│  │     [Tap the past tense verb]                        │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  💡 Hint: Past tense verbs often end with...                │
│     [Show Full Hint] (costs 5 XP)                           │
│                                                              │
│  ┌─ Actions ────────────────────────────────────────────┐  │
│  │ [← Previous]    [Skip]    [Next →]                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**After Answer:**
```
┌──────────────────────────────────────────────────────────────┐
│                          ✓ Correct!                          │
│                                                              │
│  You selected: [word]                                        │
│  That's right! This is a past tense verb because...          │
│                                                              │
│  +10 XP                                                      │
│                                                              │
│  [Continue to Next Question →]                               │
└──────────────────────────────────────────────────────────────┘
```

**Types of Exercises:**
1. **Multiple Choice:** Select correct answer from options
2. **Fill in the Blank:** Type missing word/diacritic
3. **Matching:** Drag items to match pairs
4. **Identification:** Tap words in verse to identify type
5. **Sequencing:** Arrange words/steps in correct order
6. **Parsing:** Complete i'rab analysis of sentence

### 3.4 Teacher Dashboard

**URL:** `/teacher/dashboard`
**Layout:** Full-width with tabs

**Desktop:**
```
┌──────────────────────────────────────────────────────────────┐
│ arQ Teacher    [Classes] [Assignments] [Students] [Reports]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Teacher Dashboard                    [+ New Assignment]     │
│                                                              │
│  ┌─ Intervention Alerts ──────────────────────────────────┐ │
│  │ ⚠️ 2 students need attention                           │ │
│  │ • Ahmed Khan - No activity for 7 days                  │ │
│  │ • Sara Mohamed - Failing assignments                   │ │
│  │ [Review All Alerts →]                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  My Classes:                                                 │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  │
│  │ Arabic 101    │  │ Grammar 201   │  │ Advanced 301  │  │
│  │ 25 students   │  │ 18 students   │  │ 12 students   │  │
│  │ Avg: 78%      │  │ Avg: 85%      │  │ Avg: 92%      │  │
│  │ [View Class]  │  │ [View Class]  │  │ [View Class]  │  │
│  └───────────────┘  └───────────────┘  └───────────────┘  │
│                                                              │
│  Recent Activity:                                            │
│  • 12 new submissions need grading                          │
│  • 3 assignments due this week                              │
│  • 5 students achieved new badges                           │
│                                                              │
│  Quick Actions:                                              │
│  [Create Assignment] [Grade Submissions] [View Reports]     │
│  [Message Students] [Create Announcement]                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Teacher Features:**
1. **Intervention Alerts:** Proactive notifications
2. **Class Overview Cards:** At-a-glance metrics
3. **Grading Queue:** Submissions needing review
4. **Assignment Builder:** Create/assign content
5. **Analytics Dashboard:** Detailed reports
6. **Communication Tools:** Message students, announcements
7. **Content Library:** Browse assignable lessons/exercises

---

## 4. INTERACTION PATTERNS

### 4.1 Loading States

**Full Page Loading:**
```
┌──────────────────────────────────┐
│                                  │
│                                  │
│         ⌛ Loading...            │
│         [spinner animation]      │
│                                  │
│                                  │
└──────────────────────────────────┘
```

**Skeleton Loading (Preferred):**
```
┌──────────────────────────────────┐
│ ▮▮▮▮▮▮▮▮     ▮▮▮▮ ▮▮▮           │ ← Header skeleton
│                                  │
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮                │ ← Content skeleton
│ ▮▮▮▮▮▮▮▮▮▮                       │
│                                  │
│ ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮                │
│ ▮▮▮▮▮▮▮▮                         │
└──────────────────────────────────┘

Animation: Shimmer effect moving left to right
```

**Button Loading:**
```
[⌛ Processing...]  ← Spinner replaces icon
  Disabled state, cursor: wait
```

### 4.2 Empty States

```
┌──────────────────────────────────┐
│                                  │
│         📚                       │
│                                  │
│    No courses yet                │
│    Start learning Quranic Arabic!│
│                                  │
│    [Browse Courses]              │
│                                  │
└──────────────────────────────────┘

Elements:
- Friendly icon (not sad)
- Clear explanation
- Action button (what to do next)
```

### 4.3 Error States

**Inline Error:**
```
Email Address *
┌─────────────────────────────────┐
│ invalid@                        │
└─────────────────────────────────┘
❌ Please enter a valid email address

Border: red
Icon: error (red)
Text: error color
```

**Page Error:**
```
┌──────────────────────────────────┐
│                                  │
│         ⚠️                       │
│                                  │
│    Oops! Something went wrong    │
│    We couldn't load this page.   │
│                                  │
│    [Try Again]  [Go Home]        │
│                                  │
│    Error ID: #12345              │
└──────────────────────────────────┘
```

**Toast Notification (Preferred for minor errors):**
```
╔════════════════════════════════╗
║ ⚠️ Connection lost             ║
║ Retrying in 3 seconds...       ║
╚════════════════════════════════╝

Position: Top-right (desktop), Top-center (mobile)
Duration: Auto-dismiss or manual close
```

### 4.4 Success States

**Completion:**
```
┌──────────────────────────────────┐
│                                  │
│         ✨ 🎉 ✨               │
│                                  │
│    Lesson Complete!              │
│    You earned 50 XP              │
│                                  │
│    [Next Lesson →]               │
│    [Review Notes]                │
│                                  │
└──────────────────────────────────┘

Animation: Confetti or celebration
Sound: Success chime (optional)
```

**Toast Notification:**
```
╔════════════════════════════════╗
║ ✓ Progress saved               ║
╚════════════════════════════════╝

Duration: 2 seconds, auto-dismiss
```

### 4.5 Confirmation Dialogs

```
┌──────────────────────────────────┐
│ Delete Assignment?               │
├──────────────────────────────────┤
│                                  │
│ Are you sure you want to delete  │
│ "Past Tense Verbs Practice"?     │
│                                  │
│ This action cannot be undone.    │
│ 25 students have submitted work. │
│                                  │
│  [Cancel]      [Delete]          │
│               (danger variant)   │
└──────────────────────────────────┘

Backdrop: Semi-transparent dark overlay
Position: Center screen
Animation: Fade + scale in
```

### 4.6 Tooltips

**Hover Tooltip:**
```
         [?] ← Hover trigger
         ▼
    ┌────────────────────┐
    │ This is a helpful  │
    │ explanation of...  │
    └────────────────────┘

Delay: 500ms
Position: Intelligent (above if space, below otherwise)
Max width: 300px
```

**Word Analysis Tooltip (Quick):**
```
      الْحَمْدُ ← Hover
         ▼
    ┌─────────────────┐
    │ Al-Hamdu        │
    │ "The Praise"    │
    │ 🔵 Noun         │
    │ [Click for more]│
    └─────────────────┘
```

---

## 5. ANIMATION GUIDELINES

### 5.1 Timing Functions

```css
/* Ease out (most common) - starts fast, ends slow */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Ease in (less common) - starts slow, ends fast */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Ease in-out - smooth both ends */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Spring (bouncy) - for playful interactions */
--spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 5.2 Duration Scale

```css
--duration-fast: 150ms;      /* Quick micro-interactions */
--duration-normal: 250ms;    /* Standard transitions */
--duration-slow: 350ms;      /* Larger movements */
--duration-slower: 500ms;    /* Page transitions */
```

### 5.3 Animation Patterns

**Fade In:**
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

**Slide Up (Mobile Bottom Sheet):**
```css
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-up {
  animation: slideUp var(--duration-slow) var(--ease-out);
}
```

**Scale & Fade (Modals):**
```css
@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

**Pulse (Notifications):**
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
```

**Confetti (Celebrations):**
- Use library: `canvas-confetti` or `react-rewards`
- Trigger on: Lesson completion, level up, achievement unlocked
- Duration: 2-3 seconds

### 5.4 Performance Guidelines

✅ **DO:**
- Animate `transform` and `opacity` (GPU-accelerated)
- Use `will-change` sparingly for complex animations
- Limit concurrent animations (max 3-4 elements)
- Use `requestAnimationFrame` for JS animations

❌ **DON'T:**
- Animate `width`, `height`, `top`, `left` (causes reflow)
- Animate during scroll (causes jank)
- Use heavy box-shadows in animations
- Animate SVGs with many nodes

---

## 6. RESPONSIVE BEHAVIOR

### 6.1 Breakpoint System

```css
/* Mobile */
@media (max-width: 479px) { /* xs */ }
@media (min-width: 480px) and (max-width: 767px) { /* sm */ }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { /* md */ }

/* Desktop */
@media (min-width: 1024px) and (max-width: 1439px) { /* lg */ }
@media (min-width: 1440px) { /* xl */ }
```

### 6.2 Responsive Typography

Use `clamp()` for fluid typography:

```css
.verse-text {
  font-size: clamp(24px, 4vw, 48px);
  /* Min 24px, scales with viewport, max 48px */
}

.heading-1 {
  font-size: clamp(2rem, 5vw, 3rem);
}

.body-text {
  font-size: clamp(1rem, 2vw, 1.125rem);
}
```

### 6.3 Container Widths

```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

@media (min-width: 1440px) {
  .container { max-width: 1280px; }
}
```

### 6.4 Mobile-First Patterns

**Navigation:**
- Mobile: Hamburger menu → Full-screen drawer
- Tablet: Top bar with main items
- Desktop: Full sidebar or top navigation

**Content Layout:**
- Mobile: Single column, stacked
- Tablet: 1-2 columns depending on content
- Desktop: Multi-column with sidebar

**Forms:**
- Mobile: Full-width inputs, vertical labels
- Desktop: Horizontal layout possible, max-width 600px

---

## 7. ACCESSIBILITY STANDARDS

### 7.1 WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text (16px): Minimum 4.5:1 ratio
- Large text (24px+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio against background

**Test tools:**
- WebAIM Contrast Checker
- Browser DevTools (Lighthouse)
- axe DevTools extension

**Focus Indicators:**
```css
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Never remove outline without replacement */
*:focus:not(:focus-visible) {
  outline: none;
}
```

**Skip Links:**
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<style>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  z-index: var(--z-maximum);
}

.skip-link:focus {
  top: 0;
}
</style>
```

### 7.2 Semantic HTML

✅ **Use semantic elements:**
```html
<header>...</header>
<nav>...</nav>
<main>...</main>
<article>...</article>
<aside>...</aside>
<footer>...</footer>
<section>...</section>
```

❌ **Avoid div soup:**
```html
<!-- Bad -->
<div class="header">
  <div class="nav">...</div>
</div>

<!-- Good -->
<header>
  <nav>...</nav>
</header>
```

### 7.3 ARIA Labels

**Buttons without text:**
```html
<button aria-label="Close dialog">
  <CloseIcon />
</button>
```

**Form inputs:**
```html
<label for="email">Email Address</label>
<input
  id="email"
  type="email"
  aria-describedby="email-hint"
  aria-invalid="false"
/>
<span id="email-hint">We'll never share your email</span>
```

**Live regions:**
```html
<div aria-live="polite" aria-atomic="true">
  Progress saved
</div>
```

### 7.4 Keyboard Navigation

**Focusable elements:**
- All interactive elements must be keyboard accessible
- Tab order must be logical (top → bottom, left → right)
- Trapped focus in modals (Escape to close)

**Custom components:**
```tsx
// Example: Custom dropdown
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  aria-expanded={isOpen}
  aria-haspopup="listbox"
>
  Select option
</div>
```

### 7.5 Screen Reader Support

**Announcements:**
```tsx
import { useEffect } from 'react';

function announceToScreenReader(message: string) {
  const announcement = document.getElementById('sr-announcement');
  if (announcement) {
    announcement.textContent = message;
  }
}

// In component:
useEffect(() => {
  announceToScreenReader('Lesson completed successfully');
}, [lessonCompleted]);

// In HTML:
<div
  id="sr-announcement"
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
/>
```

**Screen-reader only text:**
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 8. PERFORMANCE REQUIREMENTS

### 8.1 Page Load Metrics

**Targets (Lighthouse):**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

**Strategies:**
1. **Code splitting** - Dynamic imports for routes
2. **Lazy loading** - Images, components below fold
3. **Prefetching** - Predictive loading of next page
4. **Caching** - Service worker for offline support
5. **Compression** - Brotli/Gzip enabled
6. **CDN** - Static assets served from edge locations

### 8.2 Bundle Size Targets

**Web App:**
- Initial JS bundle: < 200 KB (gzipped)
- Total JS (including lazy): < 800 KB
- CSS: < 50 KB (gzipped)
- Fonts: < 100 KB (subset and optimized)

**Tools:**
- `webpack-bundle-analyzer` or `@next/bundle-analyzer`
- Lighthouse
- WebPageTest

### 8.3 Image Optimization

**Format selection:**
- Use WebP with JPEG/PNG fallback
- Use AVIF where supported (next-gen format)
- Use SVG for icons and illustrations

**Sizing:**
- Use `<picture>` element for responsive images
- Provide multiple sizes (srcset)
- Use next/image for automatic optimization (Next.js)

**Example:**
```tsx
<Image
  src="/verse-bg.jpg"
  alt="Background"
  width={1200}
  height={600}
  placeholder="blur"
  blurDataURL="..."
  loading="lazy" // or "eager" for above fold
  quality={85}
  formats={['avif', 'webp']}
/>
```

### 8.4 Font Loading Strategy

```css
@font-face {
  font-family: 'Amiri';
  src: url('/fonts/amiri.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Prevent invisible text */
  unicode-range: U+0600-06FF; /* Arabic range only */
}

/* Preload critical fonts */
<link
  rel="preload"
  href="/fonts/amiri.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

### 8.5 Runtime Performance

**React optimizations:**
```tsx
// Memoize expensive computations
const wordAnalysis = useMemo(() => {
  return analyzeWordGrammar(word);
}, [word]);

// Memoize components
const WordCard = memo(({ word }) => {
  return <div>{word.text}</div>;
});

// Lazy load heavy components
const TreeDiagram = lazy(() => import('./TreeDiagram'));
```

**Virtual scrolling:**
- Use `react-window` or `react-virtualized` for long lists
- Example: Verse list, word list, student roster

**Debounce/Throttle:**
```tsx
import { useDebouncedCallback } from 'use-debounce';

const handleSearch = useDebouncedCallback((query) => {
  fetchResults(query);
}, 300); // 300ms delay
```

---

## 9. IMPLEMENTATION PRIORITIES

### Phase 1: Foundation (Weeks 1-4)

**Week 1: Design System Setup**
- [ ] Install Tailwind CSS + shadcn/ui
- [ ] Configure design tokens (colors, fonts, spacing)
- [ ] Set up Storybook for component development
- [ ] Create base components (Button, Input, Card, Badge)
- [ ] Configure RTL support

**Week 2: Core Components**
- [ ] ArabicText component with font loading
- [ ] WordCard component
- [ ] VerseDisplay component (basic)
- [ ] Navigation components (Header, Sidebar, Mobile Nav)
- [ ] Layout components (Container, Grid, Stack)

**Week 3: Page Layouts**
- [ ] Authentication pages (Login, Register, Forgot Password)
- [ ] Student Dashboard (basic version)
- [ ] Course List page
- [ ] Lesson Viewer (basic, text-only)

**Week 4: Word Analysis (MVP)**
- [ ] Word selection interaction
- [ ] Analysis panel (Level 1-2 complexity)
- [ ] Color-coded visualization mode
- [ ] Mobile bottom sheet UI

**Deliverable:** MVP with basic learning flow

### Phase 2: Enhanced Features (Weeks 5-8)

**Week 5: Visualizations**
- [ ] Tree diagram mode (React Flow)
- [ ] Card stack mode
- [ ] Timeline/morphology mode
- [ ] Mode switcher UI

**Week 6: Gamification**
- [ ] Streak counter with freeze
- [ ] XP system and progress bars
- [ ] Badge system
- [ ] Leaderboard (optional display)

**Week 7: Exercise System**
- [ ] Exercise types (multiple choice, fill blank, identification)
- [ ] Quiz interface with timer
- [ ] Immediate feedback
- [ ] Progress tracking

**Week 8: Teacher Dashboard (Basic)**
- [ ] Class management
- [ ] Assignment creation
- [ ] Submission viewing
- [ ] Basic grading interface

**Deliverable:** Full student experience + basic teacher tools

### Phase 3: Advanced Features (Weeks 9-12)

**Week 9: Spaced Repetition**
- [ ] Daily review queue
- [ ] SM-2 algorithm implementation
- [ ] Review card interface
- [ ] Performance analytics

**Week 10: Teacher Features (Advanced)**
- [ ] Intervention alerts
- [ ] Detailed analytics and reports
- [ ] Bulk grading tools
- [ ] Custom feedback templates

**Week 11: Advanced Visualizations**
- [ ] Mind map mode
- [ ] Progressive disclosure mode
- [ ] Comparison mode
- [ ] Export/print options

**Week 12: Polish & Optimization**
- [ ] Performance audit and optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] Mobile app refinements (if applicable)
- [ ] User acceptance testing

**Deliverable:** Production-ready platform

### Phase 4: Native Mobile Apps (Weeks 13-16)

**If React Native chosen:**
- [ ] Set up React Native project with Expo
- [ ] Port shared components
- [ ] Implement native navigation
- [ ] Offline support with local database
- [ ] Push notifications
- [ ] App Store / Play Store submission

---

## Summary: Key Requirements

### Non-Negotiable Requirements

1. **Accessibility:** WCAG 2.1 AA compliance (4.5:1 contrast, keyboard nav, screen reader support)
2. **Performance:** < 2.5s LCP, < 100ms FID, 60fps animations
3. **Responsive:** Mobile-first, works on all screen sizes
4. **RTL Support:** Full bidirectional text support for Arabic
5. **Browser Support:** Chrome, Firefox, Safari, Edge (last 2 versions)
6. **Font Loading:** < 2s for first contentful paint with Arabic text
7. **Offline Support:** Service worker for basic offline functionality
8. **Security:** HTTPS only, secure authentication, CSRF protection

### Quality Gates

**Before moving to next phase:**
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] Zero critical bugs in current features
- [ ] All components documented in Storybook
- [ ] Cross-browser testing passed
- [ ] User testing feedback incorporated

### Success Metrics

**User Experience:**
- Time to first interaction: < 3s
- Task completion rate: > 80%
- User satisfaction (SUS score): > 70

**Technical:**
- Test coverage: > 80%
- Bundle size: Within targets
- Zero high-severity security vulnerabilities

---

## Appendix: Tools & Libraries

### Recommended Stack

**Frontend Framework:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+

**UI Components:**
- Tailwind CSS 3+
- shadcn/ui (Radix UI primitives)
- Headless UI (accessible components)

**Visualization:**
- React Flow (tree diagrams)
- D3.js (mind maps, custom visualizations)
- Recharts (analytics charts)
- Framer Motion (animations)

**Forms & Validation:**
- React Hook Form
- Zod (schema validation)

**State Management:**
- Redux Toolkit + RTK Query
- OR Zustand (lighter alternative)

**Data Fetching:**
- React Query (TanStack Query)
- SWR (alternative)

**Authentication:**
- NextAuth.js
- OR Supabase Auth

**Testing:**
- Vitest (unit tests)
- Testing Library (component tests)
- Playwright (E2E tests)
- Storybook (component development)

**Code Quality:**
- ESLint + Prettier
- Husky (git hooks)
- lint-staged
- Commitlint

**Monitoring:**
- Vercel Analytics
- Sentry (error tracking)
- LogRocket (session replay)

---

**Document Complete. Ready for implementation.**
