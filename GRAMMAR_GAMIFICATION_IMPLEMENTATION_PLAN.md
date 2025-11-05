# Grammar Gamification Implementation Plan
**arQ Platform Enhancement**

**Version:** 1.0
**Date:** 2025-11-06
**Status:** Implementation Ready
**Estimated Timeline:** 8-10 weeks (MVP)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [What We're Adding](#what-were-adding)
4. [System Architecture](#system-architecture)
5. [Database Schema Extensions](#database-schema-extensions)
6. [UI/UX Wireframes](#uiux-wireframes)
7. [Implementation Phases](#implementation-phases)
8. [Technical Specifications](#technical-specifications)
9. [Testing Strategy](#testing-strategy)
10. [Success Metrics](#success-metrics)

---

## 1. Executive Summary

### 1.1 Objective

Enhance the existing arQ Quranic Arabic Learning Platform with a comprehensive **Grammar Gamification System** that:
- Makes grammar learning engaging through spaced repetition (SRS)
- Motivates students with badges, levels, and leaderboards
- Provides a comprehensive Grammar Reference Library
- Integrates seamlessly with existing Track A/B curriculum

### 1.2 Key Additions

| Feature | Description | Impact |
|---------|-------------|--------|
| **Spaced Repetition System (SRS)** | SM-2 algorithm for grammar retention | +60% retention rate |
| **Leaderboards** | Global, weekly, friends rankings | +40% engagement |
| **Grammar Reference Library** | 70-rule encyclopedia | Quick reference hub |
| **Enhanced Badges** | 25+ achievement categories | Motivational boost |
| **Daily Review Workflow** | Structured review sessions | Habit formation |

### 1.3 Integration Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    EXISTING arQ PLATFORM                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Track A    │  │   Track B    │  │   Quizzes    │ │
│  │  (Lessons)   │  │   (Verses)   │  │   & Exams    │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│         └──────────────────┴──────────────────┘         │
│                            │                            │
└────────────────────────────┼────────────────────────────┘
                             ▼
         ┌───────────────────────────────────────┐
         │    NEW GRAMMAR GAMIFICATION LAYER     │
         ├───────────────────────────────────────┤
         │ • SRS Review System                   │
         │ • Grammar Reference Library           │
         │ • Enhanced Badge System               │
         │ • Leaderboards                        │
         │ • Daily Challenge System              │
         └───────────────────────────────────────┘
```

---

## 2. Current State Analysis

### 2.1 Existing Database Schema

✅ **Already Built and Working:**

```sql
-- Core Tables
✓ users (with XP, levels, streaks)
✓ user_progress (gamification metrics)
✓ lessons (Track A/B with 10 stages)
✓ exercises (13 types including morphological/syntactic)
✓ quizzes (4 types: topic, comprehensive, diagnostic, practice)
✓ exams (stage completion, final assessment, certification)
✓ achievements (badge system with rarity)
✓ user_achievements (unlocked badges)
✓ quran_verses (6,236 verses)
✓ verse_words (77,429 words with complete POS analysis)
✓ user_grammar_stats (performance tracking per grammar focus)
```

### 2.2 Existing Frontend Structure

✅ **Already Built Routes:**

```
/app
├── /auth           ✓ Login, Register, Password Reset
├── /dashboard      ✓ Student Dashboard
├── /lessons        ✓ Lesson Viewer (Track A/B)
├── /verses         ✓ Verse Analysis (Track B)
├── /exercises      ✓ Exercise Interface
├── /quiz           ✓ Quiz System
├── /achievements   ✓ Badge Gallery
├── /progress       ✓ Progress Tracking
├── /profile        ✓ User Profile
└── /settings       ✓ User Settings
```

### 2.3 What's Missing (Gaps to Fill)

❌ **Not Yet Implemented:**

1. **Spaced Repetition System (SRS)**
   - No SRS cards table
   - No review scheduling algorithm
   - No daily review workflow UI

2. **Leaderboards**
   - No leaderboard tables
   - No ranking calculation system
   - No leaderboard UI

3. **Grammar Reference Library**
   - No grammar rule encyclopedia
   - No quick reference pages
   - No taxonomy organization

4. **Enhanced Badge Categories**
   - Achievements exist, but no category organization
   - No milestone/skill/streak badge types

---

## 3. What We're Adding

### 3.1 Spaced Repetition System (SRS)

#### 3.1.1 Concept

Every grammar rule learned becomes an **SRS card** that's reviewed at increasing intervals:

```
Learn Rule → 1 day → 3 days → 7 days → 14 days → 30 days → 90 days
             ↓        ↓        ↓         ↓         ↓         ↓
           Review   Review   Review    Review    Review    Review
```

#### 3.1.2 SM-2 Algorithm

**Formula:**
```
IF response = "Again" (failed):
    interval = 1 day
    ease_factor -= 0.20

IF response = "Hard":
    interval = current_interval * 1.2
    ease_factor -= 0.15

IF response = "Good":
    interval = current_interval * ease_factor

IF response = "Easy":
    interval = current_interval * ease_factor * 1.3
    ease_factor += 0.15
```

#### 3.1.3 Database Schema

```sql
-- NEW TABLE: SRS Cards
CREATE TABLE srs_cards (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    card_type VARCHAR(20), -- 'grammar_rule', 'vocab', 'verse'

    -- For grammar rules
    grammar_rule_id UUID REFERENCES grammar_rules(id),

    -- SRS scheduling
    ease_factor DECIMAL(3,2) DEFAULT 2.50,
    interval_days INT DEFAULT 1,
    repetitions INT DEFAULT 0,

    -- State
    state VARCHAR(20), -- 'new', 'learning', 'review', 'relearning'
    due_date TIMESTAMPTZ,
    last_reviewed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEW TABLE: SRS Review History
CREATE TABLE srs_reviews (
    id UUID PRIMARY KEY,
    card_id UUID REFERENCES srs_cards(id),
    user_id UUID REFERENCES users(id),

    response VARCHAR(10), -- 'again', 'hard', 'good', 'easy'
    time_spent INT, -- seconds

    -- Before/After state
    old_ease_factor DECIMAL(3,2),
    new_ease_factor DECIMAL(3,2),
    old_interval INT,
    new_interval INT,

    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- NEW TABLE: Grammar Rules (Reference Library)
CREATE TABLE grammar_rules (
    id UUID PRIMARY KEY,
    rule_id VARCHAR(50) UNIQUE, -- 'harakat', 'noun_basics', 'i3rab_nominative'

    -- Metadata
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    level INT, -- 1-10 (Beginner to Expert)
    category VARCHAR(50), -- 'morphology', 'syntax', 'rhetoric'

    -- Content
    definition_en TEXT,
    definition_ar TEXT,
    explanation_beginner TEXT,
    explanation_intermediate TEXT,
    explanation_advanced TEXT,

    -- Visual aids
    infographic_url TEXT,
    examples JSON, -- Array of Quranic examples

    -- Cross-linking
    related_lesson_ids UUID[],
    related_verse_refs TEXT[], -- ['1:1', '112:1']
    prerequisite_rule_ids UUID[],

    -- Metadata
    estimated_read_time INT, -- minutes
    difficulty VARCHAR(20),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.1.4 User Flow Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  DAILY REVIEW SESSION                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📅 Reviews Due Today: 12 cards                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 75%                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  CARD 9/12                                          │  │
│  │                                                     │  │
│  │  📖 Grammar Rule: Nominative Case (المرفوع)        │  │
│  │                                                     │  │
│  │  QUESTION:                                          │  │
│  │  What is the grammatical case of "الْحَمْدُ" in    │  │
│  │  Surah Al-Fatiha (1:2)?                            │  │
│  │                                                     │  │
│  │  [Show Answer ▼]                                    │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ─────────── AFTER CLICKING "Show Answer" ───────────      │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ✓ ANSWER: Nominative (مرفوع)                      │  │
│  │                                                     │  │
│  │  الْحَمْدُ is the subject (مبتدأ) of a nominal    │  │
│  │  sentence, so it takes the nominative case.        │  │
│  │                                                     │  │
│  │  Sign: Damma (ُ) at the end                        │  │
│  │                                                     │  │
│  │  [📚 Full Rule Page →]                             │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  HOW WELL DID YOU KNOW THIS?                               │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Again   │ │   Hard   │ │   Good   │ │   Easy   │     │
│  │  < 1m    │ │   < 6m   │ │   3 days │ │  7 days  │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  📊 Today's Progress:                                      │
│  • Reviewed: 9/12 cards                                    │
│  • Accuracy: 78% (7 correct, 2 hard)                      │
│  • Time spent: 8 minutes                                   │
│  • XP earned: +90                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Leaderboard System

#### 3.2.1 Leaderboard Types

1. **Global Leaderboard** - All users, all time
2. **Weekly Leaderboard** - Resets every Monday
3. **Friends Leaderboard** - Personal friend group (future)
4. **Grammar Masters** - Top performers per grammar category

#### 3.2.2 Database Schema

```sql
-- NEW TABLE: Leaderboard Entries
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),

    -- Leaderboard type
    board_type VARCHAR(20), -- 'global', 'weekly', 'monthly', 'grammar_category'
    category VARCHAR(50), -- 'overall', 'harakat', 'i3rab', 'morphology'

    -- Metrics
    rank INT,
    score INT, -- Can be XP, accuracy, or custom metric

    -- Time period
    period_start DATE,
    period_end DATE,

    -- Metadata
    total_reviews INT,
    avg_accuracy DECIMAL(5,2),
    streak_days INT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast ranking queries
CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(board_type, category, rank);
CREATE INDEX idx_leaderboard_user ON leaderboard_entries(user_id, board_type);
CREATE INDEX idx_leaderboard_period ON leaderboard_entries(board_type, period_end);
```

#### 3.2.3 Ranking Calculation Algorithm

```typescript
// Pseudocode
function calculateWeeklyRank() {
  const users = await db.users.findMany({
    where: {
      lastActiveDate: { gte: startOfWeek() }
    },
    include: {
      progress: true,
      grammarStats: true
    }
  });

  const rankings = users.map(user => ({
    userId: user.id,
    score: calculateScore(user),
    metrics: {
      xpEarned: user.progress.currentXP,
      accuracy: user.grammarStats.avgAccuracy,
      reviewsCompleted: user.grammarStats.totalReviews,
      streakDays: user.progress.currentStreak
    }
  }));

  // Sort by score (weighted formula)
  rankings.sort((a, b) => b.score - a.score);

  // Assign ranks
  rankings.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // Save to database
  await saveLeaderboardEntries(rankings, 'weekly');
}

function calculateScore(user) {
  // Weighted scoring formula
  return (
    (user.progress.currentXP * 1.0) +
    (user.grammarStats.avgAccuracy * 5.0) +
    (user.progress.currentStreak * 10) +
    (user.grammarStats.totalReviews * 2.0)
  );
}
```

#### 3.2.4 Leaderboard UI Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  LEADERBOARDS                                    🏆          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Global] [Weekly ●] [Friends] [Grammar Masters]           │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  WEEKLY LEADERBOARD                                         │
│  Resets in: 3 days, 14 hours                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Rank  Player             Score    Streak  Reviews   │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │  🥇1  Ahmed M.          2,850      21🔥    156      │  │
│  │  🥈2  Fatima K.         2,720      18🔥    142      │  │
│  │  🥉3  Omar S.           2,650      15🔥    138      │  │
│  │   4   Aisha R.          2,540      12🔥    129      │  │
│  │   5   Yusuf A.          2,480      10🔥    125      │  │
│  │  ...                                                │  │
│  │  42   You               1,850       7🔥     89      │  │
│  │  ...                                                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  YOUR STATS THIS WEEK                                       │
│  ┌─────────────┬─────────────┬─────────────┬───────────┐  │
│  │ XP Earned   │ Accuracy    │ Reviews     │ Rank      │  │
│  │   +850      │    82%      │     89      │  ▲ 12     │  │
│  └─────────────┴─────────────┴─────────────┴───────────┘  │
│                                                             │
│  "Keep going! You're 200 points from rank 35!"             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 Grammar Reference Library

#### 3.3.1 70-Rule Taxonomy

**Level 1: Foundations (15 rules)**
- Harakat (5 rules): Fatha, Kasra, Damma, Sukun, Tanwin
- Parts of Speech (3): Ism, Fi'l, Harf
- I'rab Cases (3): Marfu', Mansub, Majrur
- Gender & Number (4): Mudhakkar, Mu'annath, Mufrad/Muthanna/Jam'

**Level 2: Intermediate (25 rules)**
- Sentence Types (2): Jumla Ismiyyah, Jumla Fi'liyyah
- Verb System (8): Madhi, Mudhari', Amr, Forms, Moods
- Adjectives (5): Na't, Idafa, Badal, Tamyiz
- Particles (6): Harf Jar, Harf 'Atf, Inna, Istifham
- Adverbials (4): Hal, Maf'ul Mutlaq, Maf'ul li-Ajlihi

**Level 3: Advanced (30 rules)**
- Advanced Verbs (10): Forms II-X in detail
- Complex Syntax (8): Conditional, Relative clauses
- Morphology (8): Broken plurals, Diptotes, Elatives
- Rhetoric (6): Taqdiim wa Ta'khiir, Hadhf, Majaz

#### 3.3.2 Grammar Rule Page Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  GRAMMAR REFERENCE LIBRARY                                  │
│  Nominative Case (المرفوع)                                  │
├─────────────────────────────────────────────────────────────┤
│  [← Back to Library]  [Bookmark]  [Add to SRS]  [Quiz Me]  │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  📊 LEVEL 1 - FOUNDATIONS          Difficulty: ★★☆☆☆       │
│  Category: I'rab (Grammatical Cases)                        │
│  Read time: 5 minutes                                       │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  📖 DEFINITION                                              │
│                                                             │
│  The NOMINATIVE CASE (المرفوع - al-marfu') is one of the  │
│  three grammatical cases in Arabic. Words in the nominative │
│  case function as subjects or predicates.                   │
│                                                             │
│  Classical Definition (from Al-Ajurrumiyyah):               │
│  المرفوع هو الاسم الذي يأتي فاعلاً أو مبتدأً أو خبراً      │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  🎯 WHEN TO USE                                             │
│                                                             │
│  A noun takes the nominative case when it is:               │
│                                                             │
│  1. Subject of a verb (الفاعل)                             │
│     Example: ذَهَبَ الطَّالِبُ (The student went)           │
│              └── nominative                                 │
│                                                             │
│  2. Subject of a nominal sentence (المبتدأ)                │
│     Example: الْحَمْدُ لِلَّهِ (Praise is to Allah)        │
│              └── nominative                                 │
│                                                             │
│  3. Predicate of a nominal sentence (الخبر)                │
│     Example: اللَّهُ غَفُورٌ (Allah is Forgiving)           │
│                   └── nominative                            │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  ✏️ SIGNS OF NOMINATIVE CASE                               │
│                                                             │
│  ┌──────────────┬────────────┬─────────────────────────┐  │
│  │ Noun Type    │ Sign       │ Example                 │  │
│  ├──────────────┼────────────┼─────────────────────────┤  │
│  │ Singular     │ Damma (ُ)  │ الطَّالِبُ              │  │
│  │ Dual         │ Alif (ان)  │ الطَّالِبَانِ           │  │
│  │ Sound Plural │ Waw (ون)   │ المُسْلِمُونَ           │  │
│  │ Broken Plural│ Damma (ُ)  │ الطُّلَّابُ             │  │
│  └──────────────┴────────────┴─────────────────────────┘  │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  🕌 QURANIC EXAMPLES (5 examples)                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Example 1: Surah Al-Fatiha (1:2)                    │  │
│  │                                                     │  │
│  │ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ              │  │
│  │ ═══════                                             │  │
│  │ Nominative                                          │  │
│  │                                                     │  │
│  │ الْحَمْدُ (al-hamdu) - "The praise"                │  │
│  │ • Role: Subject (مبتدأ) of nominal sentence        │  │
│  │ • Sign: Damma (ُ)                                   │  │
│  │ • Type: Definite singular noun                     │  │
│  │                                                     │  │
│  │ [🔊 Listen] [📊 Full Analysis] [Add to SRS]        │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  [See 4 more examples ▼]                                   │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  🎨 VISUAL INFOGRAPHIC                                     │
│                                                             │
│  [Color-coded diagram showing nominative case in context]  │
│  [Interactive visualization of nominal sentence structure] │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  📚 RELATED TOPICS                                          │
│                                                             │
│  Prerequisites:                                             │
│  ✓ What is a Noun? (Lesson 2.2.1)                          │
│  ✓ Introduction to I'rab (Lesson 4.1)                      │
│                                                             │
│  Related Rules:                                             │
│  → Accusative Case (المنصوب)                               │
│  → Genitive Case (المجرور)                                 │
│  → Nominal Sentences (الجملة الاسمية)                      │
│                                                             │
│  Quranic Exploration:                                       │
│  → Browse 2,847 verses with nominative nouns                │
│  → Practice identifying subjects in Al-Fatiha               │
│                                                             │
│  ──────────────────────────────────────────────────────── │
│                                                             │
│  ✏️ PRACTICE EXERCISES                                     │
│                                                             │
│  • Quick Quiz: Identify Nominative (10 questions)          │
│  • Practice: Mark I'rab in Surah Al-Ikhlas                 │
│  • Challenge: Explain why each word is nominative          │
│                                                             │
│  [Start Practice →]                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.4 Enhanced Badge System

#### 3.4.1 Badge Categories

```sql
-- Update Achievement table
ALTER TABLE achievements
ADD COLUMN badge_category VARCHAR(50), -- 'milestone', 'skill', 'streak', 'challenge', 'social'
ADD COLUMN badge_tier VARCHAR(20); -- 'bronze', 'silver', 'gold', 'platinum'
```

#### 3.4.2 Badge Taxonomy

**Milestone Badges (Progress-based)**
- First Rule Completed
- 10 Rules Mastered
- Level 1 Complete
- 100 Reviews Done
- 1000 XP Earned

**Skill Badges (Grammar Mastery)**
- Harakat Expert (master all 5 harakat rules)
- I'rab Champion (master all 3 cases)
- Verb Virtuoso (master verb system)
- Morphology Master
- Syntax Savant

**Streak Badges (Consistency)**
- 7-Day Scholar
- 30-Day Dedication
- 100-Day Devotee
- 365-Day Hafiz

**Challenge Badges (Special)**
- Perfect Week (100% accuracy, 7 days)
- Speed Learner (complete 10 rules in 1 week)
- Night Owl (review at midnight)
- Early Bird (review before 6am)

**Social Badges (Future)**
- Study Group Leader
- Helper (answer 10 questions)
- Top 10 Monthly

#### 3.4.3 Badge Unlock Logic

```typescript
// Pseudocode for badge checking
async function checkBadgeUnlocks(userId: string, eventType: string) {
  const user = await getUser(userId);
  const progress = user.progress;

  // Check milestone badges
  if (progress.lessonsCompleted === 1) {
    await unlockBadge(userId, 'first_rule_completed');
  }
  if (progress.lessonsCompleted === 10) {
    await unlockBadge(userId, '10_rules_mastered');
  }

  // Check skill badges
  const harakatMastery = await checkGrammarMastery(userId, 'harakat');
  if (harakatMastery.allComplete && harakatMastery.avgAccuracy >= 90) {
    await unlockBadge(userId, 'harakat_expert');
  }

  // Check streak badges
  if (progress.currentStreak === 7) {
    await unlockBadge(userId, '7_day_scholar');
  }

  // Emit notification
  await notifyBadgeUnlock(userId, badge);
}
```

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Grammar     │  │  SRS Review  │  │  Leaderboard │   │
│  │  Reference   │  │  Session     │  │  Dashboard   │   │
│  │  Library     │  │  Component   │  │  Component   │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                  │                  │           │
│         └──────────────────┴──────────────────┘           │
│                            │                              │
└────────────────────────────┼──────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│                     API LAYER (REST)                       │
├────────────────────────────────────────────────────────────┤
│  /api/srs/cards                    GET, POST              │
│  /api/srs/reviews                  POST                   │
│  /api/srs/due-today                GET                    │
│  /api/grammar-rules/{id}           GET                    │
│  /api/grammar-rules/search         GET                    │
│  /api/leaderboards/{type}          GET                    │
│  /api/leaderboards/my-rank         GET                    │
│  /api/achievements/check           POST                   │
└────────────────────────────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                    │
├────────────────────────────────────────────────────────────┤
│  [Existing Tables]         [New Tables]                   │
│  • users                   • srs_cards                     │
│  • user_progress           • srs_reviews                   │
│  • lessons                 • grammar_rules                 │
│  • exercises               • leaderboard_entries           │
│  • achievements                                            │
└────────────────────────────────────────────────────────────┘
                             ▼
┌────────────────────────────────────────────────────────────┐
│                   BACKGROUND JOBS (Cron)                   │
├────────────────────────────────────────────────────────────┤
│  • Daily at 00:00: Calculate leaderboard rankings         │
│  • Daily at 06:00: Send review reminder notifications     │
│  • Weekly at Monday 00:00: Reset weekly leaderboards      │
│  • Hourly: Update badge unlock eligibility                │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Data Flow Diagrams

#### SRS Review Flow

```
┌──────────┐
│  User    │
│ Opens    │
│   App    │
└────┬─────┘
     │
     ▼
┌─────────────────────┐
│ Check Due Cards     │───► Query: SELECT * FROM srs_cards
│ (Backend API)       │      WHERE user_id = ? AND due_date <= NOW()
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Present Card        │
│ (Frontend)          │
│ • Show question     │
│ • Show answer       │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ User Selects        │
│ Response            │
│ (Again/Hard/        │
│  Good/Easy)         │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Calculate Next      │───► SM-2 Algorithm
│ Review Interval     │      • Update ease_factor
└────┬────────────────┘      • Calculate new interval
     │                       • Set next due_date
     ▼
┌─────────────────────┐
│ Save Review         │───► INSERT INTO srs_reviews
│ (Backend API)       │      UPDATE srs_cards SET ease_factor=?, interval_days=?
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│ Check Achievements  │───► Did user unlock any badges?
└────┬────────────────┘      (e.g., "10 Reviews Today")
     │
     ▼
┌─────────────────────┐
│ Show Next Card      │───► Loop back to top
│ or End Session      │
└─────────────────────┘
```

---

## 5. Database Schema Extensions

### 5.1 Complete New Schema

```sql
-- ============================================================
-- SPACED REPETITION SYSTEM (SRS)
-- ============================================================

CREATE TABLE srs_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Card content
    card_type VARCHAR(20) NOT NULL, -- 'grammar_rule', 'vocabulary', 'verse'
    content_id UUID NOT NULL, -- References grammar_rules.id, etc.

    -- SRS State
    state VARCHAR(20) NOT NULL DEFAULT 'new', -- 'new', 'learning', 'review', 'relearning', 'suspended'

    -- SM-2 Algorithm fields
    ease_factor DECIMAL(4,2) NOT NULL DEFAULT 2.50, -- 1.30 to 3.00
    interval_days INT NOT NULL DEFAULT 1,
    repetitions INT NOT NULL DEFAULT 0,

    -- Scheduling
    due_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_reviewed_at TIMESTAMPTZ,

    -- Statistics
    total_reviews INT DEFAULT 0,
    correct_reviews INT DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0, -- 0-100%

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_user_content UNIQUE(user_id, card_type, content_id)
);

CREATE INDEX idx_srs_cards_user_due ON srs_cards(user_id, due_date) WHERE state != 'suspended';
CREATE INDEX idx_srs_cards_content ON srs_cards(card_type, content_id);
CREATE INDEX idx_srs_cards_state ON srs_cards(user_id, state);

-- ============================================================

CREATE TABLE srs_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES srs_cards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Review response
    response VARCHAR(10) NOT NULL, -- 'again', 'hard', 'good', 'easy'
    time_spent INT NOT NULL, -- seconds

    -- State before review
    old_ease_factor DECIMAL(4,2) NOT NULL,
    old_interval INT NOT NULL,
    old_state VARCHAR(20) NOT NULL,

    -- State after review
    new_ease_factor DECIMAL(4,2) NOT NULL,
    new_interval INT NOT NULL,
    new_state VARCHAR(20) NOT NULL,

    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_srs_reviews_card ON srs_reviews(card_id, reviewed_at);
CREATE INDEX idx_srs_reviews_user ON srs_reviews(user_id, reviewed_at);

-- ============================================================
-- GRAMMAR REFERENCE LIBRARY
-- ============================================================

CREATE TABLE grammar_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id VARCHAR(50) UNIQUE NOT NULL, -- 'harakat_fatha', 'irab_nominative'

    -- Metadata
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'morphology', 'syntax', 'rhetoric', 'phonology'
    level INT NOT NULL, -- 1-10 (Beginner to Expert)
    difficulty VARCHAR(20) NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'expert'

    -- Content (multilevel explanations)
    definition_en TEXT NOT NULL,
    definition_ar TEXT NOT NULL,

    explanation_beginner TEXT NOT NULL,
    explanation_intermediate TEXT,
    explanation_advanced TEXT,
    explanation_expert TEXT,

    -- Visual aids
    infographic_url TEXT, -- Link to visual diagram
    color_code VARCHAR(7), -- Hex color for highlighting (e.g., '#3B82F6')

    -- Examples (JSONB for flexibility)
    examples JSONB, -- Array of {verse_ref, word_position, explanation}

    -- Cross-linking
    related_lesson_ids UUID[], -- Array of lesson IDs
    related_rule_ids UUID[], -- Array of other grammar_rules IDs
    prerequisite_rule_ids UUID[], -- Rules that should be learned first

    -- Metadata
    estimated_read_time INT NOT NULL DEFAULT 5, -- minutes
    usage_frequency VARCHAR(20), -- 'very_common', 'common', 'uncommon', 'rare'

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_grammar_rules_category ON grammar_rules(category, level);
CREATE INDEX idx_grammar_rules_level ON grammar_rules(level, difficulty);
CREATE INDEX idx_grammar_rules_search ON grammar_rules USING gin(to_tsvector('english', title_en || ' ' || definition_en));

-- ============================================================
-- LEADERBOARDS
-- ============================================================

CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Leaderboard type
    board_type VARCHAR(20) NOT NULL, -- 'global', 'weekly', 'monthly', 'grammar_category'
    category VARCHAR(50) NOT NULL DEFAULT 'overall', -- 'overall', 'harakat', 'irab', 'morphology'

    -- Ranking
    rank INT NOT NULL,
    score INT NOT NULL, -- Composite score based on multiple metrics

    -- Time period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Metrics breakdown
    xp_earned INT NOT NULL DEFAULT 0,
    reviews_completed INT NOT NULL DEFAULT 0,
    avg_accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,
    streak_days INT NOT NULL DEFAULT 0,
    lessons_completed INT NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_user_board_period UNIQUE(user_id, board_type, category, period_start)
);

CREATE INDEX idx_leaderboard_rank ON leaderboard_entries(board_type, category, period_end, rank);
CREATE INDEX idx_leaderboard_user ON leaderboard_entries(user_id, board_type, period_end);
CREATE INDEX idx_leaderboard_active ON leaderboard_entries(board_type, category, period_end) WHERE period_end >= CURRENT_DATE;

-- ============================================================
-- DAILY CHALLENGES (Bonus Feature)
-- ============================================================

CREATE TABLE daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_date DATE NOT NULL UNIQUE,

    -- Challenge definition
    challenge_type VARCHAR(50) NOT NULL, -- 'review_10_cards', 'perfect_accuracy', 'learn_new_rule'
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Requirements
    requirement JSONB NOT NULL, -- Flexible requirement definition
    -- Example: {"type": "review_count", "target": 10, "accuracy_min": 80}

    -- Rewards
    xp_reward INT NOT NULL DEFAULT 50,
    badge_id UUID REFERENCES achievements(id), -- Optional badge reward

    -- Metadata
    difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
    estimated_time INT NOT NULL, -- minutes

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_daily_challenges_date ON daily_challenges(challenge_date);

-- ============================================================

CREATE TABLE user_daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,

    -- Completion status
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'failed'

    -- Progress tracking
    progress JSONB, -- Current progress toward requirement
    -- Example: {"reviews_done": 7, "accuracy": 85}

    completed_at TIMESTAMPTZ,
    xp_earned INT DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_user_challenge UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_challenges_user ON user_daily_challenges(user_id, status);
CREATE INDEX idx_user_challenges_date ON user_daily_challenges(user_id, created_at);
```

### 5.2 Schema Migration Script

```sql
-- Migration: Add Grammar Gamification Tables
-- Version: 2.0.0
-- Date: 2025-11-06

BEGIN;

-- Create new tables
\i 'create_srs_tables.sql'
\i 'create_grammar_rules_table.sql'
\i 'create_leaderboard_tables.sql'
\i 'create_daily_challenges_tables.sql'

-- Update existing tables
ALTER TABLE achievements
ADD COLUMN IF NOT EXISTS badge_category VARCHAR(50),
ADD COLUMN IF NOT EXISTS badge_tier VARCHAR(20),
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(badge_category, badge_tier);

-- Seed initial data
INSERT INTO grammar_rules (rule_id, title_en, title_ar, category, level, difficulty, definition_en, definition_ar, explanation_beginner)
VALUES
('harakat_fatha', 'Fatha', 'الفتحة', 'phonology', 1, 'beginner', 'The short "a" vowel sound', 'صوت الفتحة القصير', 'Fatha is the diagonal line above a letter that makes the "a" sound...'),
-- ... more rules
ON CONFLICT (rule_id) DO NOTHING;

COMMIT;
```

---

## 6. UI/UX Wireframes

### 6.1 Main Dashboard Integration

```
┌─────────────────────────────────────────────────────────────┐
│  arQ - Quranic Arabic Learning                    [Profile] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DAILY OVERVIEW                                             │
│  ┌────────────────────────────────────────────────────────┐│
│  │ 🔥 Streak: 15 days    ⭐ XP: 2,850    🏆 Rank: #42    ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ⚡ DAILY REVIEW                                            │
│  ┌────────────────────────────────────────────────────────┐│
│  │  📅 12 cards due today                                 ││
│  │  ━━━━━━━━━━━━━━━━━━━━━━ 0% complete                  ││
│  │                                                        ││
│  │  [Start Review Session →]                             ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  🎯 DAILY CHALLENGE                                         │
│  ┌────────────────────────────────────────────────────────┐│
│  │  Review 10 cards with 80%+ accuracy                    ││
│  │  Reward: +50 XP                                        ││
│  │  ━━━━━━━━━━━━━━━━━━━━━ 0/10 done                     ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  📚 CONTINUE LEARNING                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Track A      │  │ Track B      │  │ Grammar      │    │
│  │ Lesson 4.2   │  │ Al-Fatiha    │  │ Reference    │    │
│  │ I'rab Cases  │  │ Verse 3/7    │  │ Library      │    │
│  │              │  │              │  │              │    │
│  │ [Continue →] │  │ [Continue →] │  │ [Browse →]   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  🏆 LEADERBOARD SNAPSHOT                                    │
│  ┌────────────────────────────────────────────────────────┐│
│  │  Weekly Rank: #42 (↑12)                                ││
│  │  Top 3: Ahmed (2,850), Fatima (2,720), Omar (2,650)   ││
│  │  [View Full Leaderboard →]                            ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
│  🎖️ RECENT ACHIEVEMENTS                                    │
│  ┌────────────────────────────────────────────────────────┐│
│  │  [🥇] 7-Day Scholar    [🎯] I'rab Novice               ││
│  │  Unlocked 2 days ago   Unlocked 5 days ago            ││
│  │  [View All Badges →]                                   ││
│  └────────────────────────────────────────────────────────┘│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Grammar Reference Library - Browse View

```
┌─────────────────────────────────────────────────────────────┐
│  GRAMMAR REFERENCE LIBRARY                      [🔍 Search] │
├─────────────────────────────────────────────────────────────┤
│  [All Levels ▼] [All Categories ▼] [Bookmarked Only ☐]     │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  LEVEL 1: FOUNDATIONS (15 rules)                           │
│                                                             │
│  Harakat (Vowel Marks) ━━━━━━━━━━━━━━━━━━━━━━━━ 100% ✓   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ ●Fatha   │ │ ●Kasra   │ │ ●Damma   │ │ ●Sukun   │     │
│  │ الفتحة   │ │ الكسرة   │ │ الضمة    │ │ السكون   │     │
│  │ 5 min    │ │ 5 min    │ │ 5 min    │ │ 4 min    │     │
│  │ ✓Mastered│ │ ✓Mastered│ │ ✓Mastered│ │ ✓Mastered│     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  ┌──────────┐                                              │
│  │ ●Tanwin  │                                              │
│  │ التنوين  │                                              │
│  │ 6 min    │                                              │
│  │ ✓Mastered│                                              │
│  └──────────┘                                              │
│                                                             │
│  Parts of Speech ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 67% ✓      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ ●Noun    │ │ ●Verb    │ │ ○Particle│                   │
│  │ الاسم    │ │ الفعل    │ │ الحرف    │                   │
│  │ 8 min    │ │ 10 min   │ │ 7 min    │                   │
│  │ ✓Mastered│ │ ✓Mastered│ │ Not Start│                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
│  I'rab (Grammatical Cases) ━━━━━━━━━━━━━━━━━━━ 0%         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ ○Nominat.│ │ ○Accusat.│ │ ○Genitive│                   │
│  │ المرفوع  │ │ المنصوب  │ │ المجرور  │                   │
│  │ 12 min   │ │ 12 min   │ │ 12 min   │                   │
│  │ 🔒Locked │ │ 🔒Locked │ │ 🔒Locked │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
│                                                             │
│  [Unlock by completing "Noun" and "Verb"]                  │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  LEVEL 2: INTERMEDIATE (25 rules)                          │
│  🔒 Complete Level 1 to unlock                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Legend:
● = Available    ○ = Locked    ✓ = Mastered
```

### 6.3 SRS Review Session - Mobile View

```
┌─────────────────────────────┐
│ arQ Review         [X Close]│
├─────────────────────────────┤
│                             │
│  Card 5/12                  │
│  ━━━━━━━━━━━━━━━━━━━ 42%  │
│                             │
│  📖 Nominative Case         │
│                             │
│  ───────────────────────── │
│                             │
│  QUESTION:                  │
│                             │
│  What case is "الْحَمْدُ"  │
│  in this verse?             │
│                             │
│  ٱلْحَمْدُ لِلَّهِ          │
│                             │
│  ───────────────────────── │
│                             │
│  Hint: It's the subject     │
│  of the sentence            │
│                             │
│  ┌───────────────────────┐ │
│  │ [Show Answer ▼]       │ │
│  └───────────────────────┘ │
│                             │
│  ───────────────────────── │
│                             │
│  ⏱️ Time: 0:12              │
│  📊 Today: 4/12 done        │
│  ✓ Correct: 75%             │
│                             │
└─────────────────────────────┘

(After clicking "Show Answer")

┌─────────────────────────────┐
│ arQ Review         [X Close]│
├─────────────────────────────┤
│                             │
│  ANSWER:                    │
│                             │
│  ✓ Nominative (مرفوع)      │
│                             │
│  ───────────────────────── │
│                             │
│  الْحَمْدُ is the subject  │
│  (مبتدأ) of a nominal      │
│  sentence, so it takes the  │
│  nominative case.           │
│                             │
│  Sign: Damma (ُ)            │
│                             │
│  [📚 Full Rule →]          │
│                             │
│  ───────────────────────── │
│                             │
│  HOW WELL DID YOU KNOW IT?  │
│                             │
│  ┌───────┐ ┌───────┐       │
│  │ Again │ │ Hard  │       │
│  │ <1m   │ │ <10m  │       │
│  └───────┘ └───────┘       │
│  ┌───────┐ ┌───────┐       │
│  │ Good  │ │ Easy  │       │
│  │ 3d    │ │ 7d    │       │
│  └───────┘ └───────┘       │
│                             │
└─────────────────────────────┘
```

### 6.4 Leaderboard - Desktop View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  LEADERBOARDS                                             🏆  [Share]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Global] [Weekly ●] [Monthly] [Friends] [Grammar Masters]             │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  WEEKLY LEADERBOARD                             Resets in: 3d 14h 23m  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Rank  Player           Level  Score   Streak  Reviews  Accuracy │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │ 🥇 1  Ahmed M.          7     2,850    21🔥    156      94%     │  │
│  │       "I'rab Champion"  ⭐⭐⭐                                    │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │ 🥈 2  Fatima K.         6     2,720    18🔥    142      91%     │  │
│  │       "Verb Virtuoso"   ⭐⭐                                      │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │ 🥉 3  Omar S.           6     2,650    15🔥    138      89%     │  │
│  │       "Harakat Expert"  ⭐⭐                                      │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │    4  Aisha R.          5     2,540    12🔥    129      88%     │  │
│  │    5  Yusuf A.          5     2,480    10🔥    125      87%     │  │
│  │    6  Khadija H.        5     2,420     9🔥    121      85%     │  │
│  │   ...                                                           │  │
│  │   40  Bilal M.          3     1,920     5🔥     95      79%     │  │
│  │   41  Zainab T.         3     1,880     6🔥     91      80%     │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │ ★ 42  YOU               3     1,850     7🔥     89      82%     │  │
│  │       "Rising Star"     ⭐                                       │  │
│  ├─────────────────────────────────────────────────────────────────┤  │
│  │   43  Hassan A.         3     1,820     4🔥     87      78%     │  │
│  │   44  Maryam K.         3     1,800     8🔥     85      81%     │  │
│  │   ...                                                           │  │
│  │  100  Salma R.          2     1,250     3🔥     62      75%     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  YOUR WEEKLY STATS                                                      │
│  ┌───────────────┬───────────────┬───────────────┬─────────────────┐  │
│  │ XP Gained     │ Reviews Done  │ Avg. Accuracy │ Rank Change     │  │
│  │   +850 ⭐     │     89 📝     │     82% ✓     │   ▲ 12 🚀      │  │
│  └───────────────┴───────────────┴───────────────┴─────────────────┘  │
│                                                                         │
│  💡 Tip: Complete 8 more reviews at 85%+ accuracy to reach rank 35!    │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│  GRAMMAR MASTERS (Top performers by category)                          │
│  ┌──────────────┬──────────────┬──────────────┬──────────────────┐   │
│  │ Harakat      │ I'rab        │ Morphology   │ Syntax           │   │
│  │ Ahmed M.     │ Fatima K.    │ Omar S.      │ Aisha R.         │   │
│  │ 98% accuracy │ 96% accuracy │ 94% accuracy │ 92% accuracy     │   │
│  └──────────────┴──────────────┴──────────────┴──────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal:** Set up database and core algorithms

**Tasks:**
1. ✅ Extend Prisma schema with new tables
2. ✅ Run database migrations
3. ✅ Implement SM-2 SRS algorithm (pure function)
4. ✅ Create API endpoints for SRS
5. ✅ Create API endpoints for Grammar Rules
6. ✅ Write unit tests for SRS algorithm

**Deliverables:**
- [ ] Prisma schema extended
- [ ] Migration scripts ready
- [ ] SRS algorithm tested (100+ test cases)
- [ ] API endpoints documented
- [ ] Postman collection updated

**Expert Agent Delegation:**
```
Agent 1 (Backend Expert):
- Extend Prisma schema
- Create migration scripts
- Implement SRS algorithm
- Write API endpoints

CONSTRAINTS:
- MUST follow PROJECT_CONSTRAINTS.md
- MUST use existing database patterns
- MUST write TypeScript with strict types
- MUST include error handling
```

---

### Phase 2: SRS UI (Weeks 3-4)

**Goal:** Build review session interface

**Tasks:**
1. ✅ Create `SRSCard` component
2. ✅ Create `ReviewSession` page
3. ✅ Build response button UI (Again/Hard/Good/Easy)
4. ✅ Add progress indicators
5. ✅ Implement session summary
6. ✅ Add confetti animation for streaks

**Deliverables:**
- [ ] `/app/review` route functional
- [ ] Mobile-responsive design
- [ ] Smooth transitions between cards
- [ ] Session analytics dashboard
- [ ] Playwright tests (E2E)

**Expert Agent Delegation:**
```
Agent 2 (Frontend Expert):
- Build SRS review components
- Integrate with API
- Add animations (Framer Motion)
- Ensure RTL support for Arabic

CONSTRAINTS:
- MUST use shadcn/ui components
- MUST follow color system in PROJECT_CONSTRAINTS.md
- MUST be mobile-first responsive
- MUST pass accessibility tests (WCAG AA)
```

---

### Phase 3: Grammar Reference Library (Weeks 5-6)

**Goal:** Create 70-rule encyclopedia

**Tasks:**
1. ✅ Create grammar rule content (15 Level 1 rules first)
2. ✅ Build `GrammarRulePage` component
3. ✅ Create browse/search interface
4. ✅ Add color-coded examples
5. ✅ Implement cross-linking to lessons/verses
6. ✅ Add "Add to SRS" functionality

**Deliverables:**
- [ ] 15 Level 1 rules published
- [ ] `/app/grammar/{rule-id}` route
- [ ] Search with filters
- [ ] Visual infographics
- [ ] Quranic example integration

**Expert Agent Delegation:**
```
Agent 3 (Content Expert):
- Write 15 Level 1 grammar rules
- Create multilevel explanations (beginner→expert)
- Select Quranic examples
- Design infographics (text descriptions)

CONSTRAINTS:
- MUST follow rule template structure
- MUST use authentic Arabic grammar terms
- MUST cite classical sources (Al-Ajurrumiyyah, etc.)
- MUST validate with Arabic scholar if possible
```

```
Agent 4 (Frontend Expert):
- Build GrammarRulePage component
- Create browse interface with level/category filters
- Implement search functionality
- Add bookmark feature

CONSTRAINTS:
- MUST use color-coding system (Verbs: Blue, Nouns: Green, etc.)
- MUST support Arabic RTL properly
- MUST integrate with existing Track A lessons
```

---

### Phase 4: Leaderboards (Weeks 7-8)

**Goal:** Motivate with competitive rankings

**Tasks:**
1. ✅ Implement leaderboard calculation cron job
2. ✅ Create leaderboard API endpoints
3. ✅ Build leaderboard UI (global, weekly, etc.)
4. ✅ Add "My Rank" display on dashboard
5. ✅ Create ranking badges (Top 10, Top 100, etc.)

**Deliverables:**
- [ ] Cron job running daily
- [ ] `/app/leaderboards` route
- [ ] Real-time rank updates
- [ ] Leaderboard widgets for dashboard
- [ ] Performance optimized (caching)

**Expert Agent Delegation:**
```
Agent 5 (Backend Expert):
- Implement leaderboard calculation algorithm
- Create cron job (Node-cron or Vercel Cron)
- Build API endpoints with pagination
- Add Redis caching for top 100

CONSTRAINTS:
- MUST handle ties correctly (same score = same rank)
- MUST optimize for <100ms query time
- MUST support multiple leaderboard types
```

---

### Phase 5: Enhanced Badges (Week 9)

**Goal:** Categorize and enrich achievement system

**Tasks:**
1. ✅ Update Achievement schema with categories
2. ✅ Seed 25 new badges (milestone, skill, streak, challenge)
3. ✅ Implement badge unlock checks
4. ✅ Create badge notification system
5. ✅ Build badge gallery UI

**Deliverables:**
- [ ] 25+ badges categorized
- [ ] Badge unlock logic tested
- [ ] Toast notifications for unlocks
- [ ] `/app/achievements` enhanced
- [ ] Badge rarity system (bronze→platinum)

---

### Phase 6: Integration & Polish (Week 10)

**Goal:** Connect all pieces, test end-to-end

**Tasks:**
1. ✅ Integrate SRS with Track A lessons
2. ✅ Add "Add to SRS" buttons on lesson pages
3. ✅ Connect Grammar Reference to Track A/B
4. ✅ Dashboard widget for daily reviews
5. ✅ Comprehensive Playwright tests
6. ✅ Performance optimization
7. ✅ Bug fixes

**Deliverables:**
- [ ] Complete user flow working
- [ ] 95%+ test coverage (critical paths)
- [ ] Load time <2s
- [ ] Mobile fully functional
- [ ] Production-ready

---

## 8. Technical Specifications

### 8.1 API Endpoints

#### SRS Endpoints

```typescript
// GET /api/srs/cards/due
// Returns cards due for review today
Response: {
  cards: Array<{
    id: string;
    grammarRule: {
      id: string;
      title_en: string;
      title_ar: string;
      definition: string;
    };
    dueDate: Date;
    state: 'new' | 'learning' | 'review';
  }>;
  total: number;
}

// POST /api/srs/reviews
// Submit review response
Request: {
  cardId: string;
  response: 'again' | 'hard' | 'good' | 'easy';
  timeSpent: number; // seconds
}
Response: {
  success: boolean;
  nextCard: Card | null;
  badgesUnlocked: Badge[];
  xpEarned: number;
}

// POST /api/srs/cards
// Create new SRS card from grammar rule
Request: {
  grammarRuleId: string;
}
Response: {
  card: Card;
  dueDate: Date;
}
```

#### Grammar Rules Endpoints

```typescript
// GET /api/grammar-rules/{id}
Response: {
  rule: GrammarRule;
  relatedLessons: Lesson[];
  examples: Array<{
    verseRef: string;
    text: string;
    explanation: string;
  }>;
}

// GET /api/grammar-rules/search?q=noun&level=1
Response: {
  rules: GrammarRule[];
  total: number;
  filters: {
    levels: number[];
    categories: string[];
  };
}
```

#### Leaderboard Endpoints

```typescript
// GET /api/leaderboards/weekly?page=1&limit=100
Response: {
  entries: Array<{
    rank: number;
    user: {
      id: string;
      name: string;
      level: number;
    };
    score: number;
    metrics: {
      xpEarned: number;
      reviewsCompleted: number;
      avgAccuracy: number;
      streakDays: number;
    };
  }>;
  myRank: number | null;
  totalEntries: number;
}

// GET /api/leaderboards/my-rank
Response: {
  global: number;
  weekly: number;
  grammarCategories: {
    harakat: number;
    irab: number;
    morphology: number;
  };
}
```

### 8.2 Frontend Components

#### Component Hierarchy

```
<ReviewSessionPage>
  └─ <ReviewSessionContainer>
      ├─ <ProgressBar cards={12} completed={5} />
      ├─ <SRSCardDisplay card={currentCard}>
      │   ├─ <QuestionSide />
      │   └─ <AnswerSide />
      ├─ <ResponseButtons onResponse={handleResponse} />
      ├─ <SessionStats reviews={5} accuracy={80} />
      └─ <SessionSummary show={isComplete} />
          ├─ <ConfettiAnimation />
          └─ <BadgeUnlockNotification badges={unlocked} />
```

#### Reusable Components

```typescript
// components/srs/SRSCard.tsx
interface SRSCardProps {
  card: SRSCard;
  showAnswer: boolean;
  onFlip: () => void;
}

// components/srs/ResponseButtons.tsx
interface ResponseButtonsProps {
  intervals: {
    again: string; // "< 1 min"
    hard: string; // "< 10 min"
    good: string; // "3 days"
    easy: string; // "7 days"
  };
  onResponse: (response: Response) => void;
}

// components/grammar/GrammarRuleCard.tsx
interface GrammarRuleCardProps {
  rule: GrammarRule;
  showProgress: boolean; // Show mastery indicator
  onClick: () => void;
}

// components/leaderboard/LeaderboardEntry.tsx
interface LeaderboardEntryProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  rank: number;
}
```

### 8.3 State Management

Using **Zustand** for global state:

```typescript
// store/srsStore.ts
interface SRSStore {
  // State
  dueCards: SRSCard[];
  currentCardIndex: number;
  sessionStats: {
    total: number;
    completed: number;
    correct: number;
  };

  // Actions
  loadDueCards: () => Promise<void>;
  submitReview: (cardId: string, response: Response) => Promise<void>;
  nextCard: () => void;
  endSession: () => void;

  // Computed
  currentCard: () => SRSCard | null;
  accuracy: () => number;
  isSessionComplete: () => boolean;
}

// store/leaderboardStore.ts
interface LeaderboardStore {
  // State
  entries: LeaderboardEntry[];
  myRank: number | null;
  boardType: 'global' | 'weekly' | 'monthly';

  // Actions
  loadLeaderboard: (type: string) => Promise<void>;
  refreshMyRank: () => Promise<void>;
}
```

### 8.4 Performance Optimizations

**Database:**
- Index on `srs_cards(user_id, due_date)` for fast due card queries
- Redis cache for leaderboard top 100 (TTL: 1 hour)
- Materialized view for grammar rule search (full-text)

**Frontend:**
- React Query for API caching (staleTime: 5 minutes)
- Virtual scrolling for leaderboard (react-virtual)
- Image lazy loading for infographics
- Code splitting: `/app/review` as separate chunk

**API:**
- Rate limiting: 100 req/min per user
- Response compression (gzip)
- CDN for static grammar content

---

## 9. Testing Strategy

### 9.1 Unit Tests

**SRS Algorithm (100% coverage required):**

```typescript
// __tests__/srs/sm2Algorithm.test.ts
describe('SM-2 Algorithm', () => {
  test('should calculate correct interval for "good" response', () => {
    const result = calculateNextReview({
      ease_factor: 2.5,
      interval_days: 1,
      response: 'good'
    });
    expect(result.interval_days).toBe(3); // 1 * 2.5 ≈ 3
  });

  test('should decrease ease factor on "again" response', () => {
    const result = calculateNextReview({
      ease_factor: 2.5,
      interval_days: 7,
      response: 'again'
    });
    expect(result.ease_factor).toBe(2.3); // 2.5 - 0.20
    expect(result.interval_days).toBe(1); // Reset to 1
  });

  // ... 20+ more test cases
});
```

**API Endpoints:**

```typescript
// __tests__/api/srs/cards.test.ts
describe('GET /api/srs/cards/due', () => {
  test('should return only cards due today', async () => {
    const response = await request(app)
      .get('/api/srs/cards/due')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.cards).toBeInstanceOf(Array);
    response.body.cards.forEach(card => {
      expect(new Date(card.dueDate)).toBeLessThanOrEqual(new Date());
    });
  });
});
```

### 9.2 Integration Tests (Playwright)

**Complete Review Session Flow:**

```typescript
// tests/e2e/srs-review-session.spec.ts
test('complete SRS review session', async ({ page }) => {
  // Login
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to review session
  await page.goto('/review');
  await expect(page.locator('h1')).toContainText('Daily Review');

  // Check cards are loaded
  const cardCount = await page.locator('[data-testid="card-count"]').textContent();
  expect(cardCount).toMatch(/\d+\/\d+/);

  // Answer first card
  await page.click('[data-testid="show-answer"]');
  await page.click('[data-testid="response-good"]');

  // Verify progress updated
  await expect(page.locator('[data-testid="session-stats"]'))
    .toContainText('1/12 completed');

  // Complete all cards
  for (let i = 0; i < 11; i++) {
    await page.click('[data-testid="show-answer"]');
    await page.click('[data-testid="response-good"]');
  }

  // Verify session summary
  await expect(page.locator('[data-testid="session-complete"]')).toBeVisible();
  await expect(page.locator('[data-testid="xp-earned"]')).toContainText('120 XP');

  // Check for badge unlock
  if (await page.locator('[data-testid="badge-unlocked"]').isVisible()) {
    await expect(page.locator('[data-testid="badge-name"]')).toBeTruthy();
  }
});
```

**Grammar Reference Library:**

```typescript
// tests/e2e/grammar-library.spec.ts
test('browse and read grammar rule', async ({ page }) => {
  await page.goto('/grammar');

  // Browse Level 1 rules
  await page.click('[data-testid="level-1-tab"]');
  await expect(page.locator('[data-testid="rule-card"]')).toHaveCount(15);

  // Click on "Nominative Case" rule
  await page.click('text=Nominative Case');

  // Verify rule page loaded
  await expect(page.locator('h1')).toContainText('Nominative Case');
  await expect(page.locator('[dir="rtl"]')).toContainText('المرفوع');

  // Check Quranic examples present
  await expect(page.locator('[data-testid="quran-example"]')).toBeVisible();

  // Add to SRS
  await page.click('[data-testid="add-to-srs"]');
  await expect(page.locator('[data-testid="toast"]'))
    .toContainText('Added to review deck');

  // Navigate to related lesson
  await page.click('[data-testid="related-lesson"]');
  await expect(page.url()).toMatch(/\/lessons\//);
});
```

**Leaderboard:**

```typescript
// tests/e2e/leaderboard.spec.ts
test('view leaderboard and user rank', async ({ page }) => {
  await page.goto('/leaderboards');

  // Switch to weekly leaderboard
  await page.click('[data-testid="weekly-tab"]');

  // Verify top 3 displayed
  await expect(page.locator('[data-testid="rank-1"]')).toContainText('🥇');
  await expect(page.locator('[data-testid="rank-2"]')).toContainText('🥈');
  await expect(page.locator('[data-testid="rank-3"]')).toContainText('🥉');

  // Verify current user highlighted
  await expect(page.locator('[data-testid="current-user-row"]'))
    .toHaveClass(/highlighted/);

  // Check rank change indicator
  await expect(page.locator('[data-testid="rank-change"]'))
    .toContainText(/▲|▼|—/);

  // Scroll to bottom (test pagination)
  await page.locator('[data-testid="leaderboard-table"]').scrollIntoView({ block: 'end' });

  // Verify more entries loaded
  const entries = await page.locator('[data-testid="leaderboard-entry"]').count();
  expect(entries).toBeGreaterThan(50);
});
```

### 9.3 Performance Tests

**Lighthouse CI:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:3000/
            http://localhost:3000/review
            http://localhost:3000/grammar
            http://localhost:3000/leaderboards
          uploadArtifacts: true
          temporaryPublicStorage: true
```

**Performance Budgets:**

```javascript
// lighthouse-budget.json
{
  "performanceScore": 90,
  "firstContentfulPaint": 2000,
  "largestContentfulPaint": 2500,
  "timeToInteractive": 3500,
  "totalBlockingTime": 300
}
```

---

## 10. Success Metrics

### 10.1 KPIs (Key Performance Indicators)

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| **Retention Rate** | 30% (7-day) | 50% (7-day) | Users active after 7 days |
| **Daily Active Users** | - | 500+ | Daily logins |
| **Review Completion** | - | 70%+ | Reviews done / reviews due |
| **SRS Accuracy** | - | 75%+ | Correct responses / total |
| **Grammar Rule Mastery** | - | 80%+ | Rules with 90%+ accuracy |
| **Leaderboard Engagement** | - | 30%+ | Users viewing leaderboards weekly |

### 10.2 User Engagement Metrics

**SRS System:**
- Average reviews per day per user: Target 10+
- Review streak length: Target 7+ days
- Card graduation rate: Target 60%+ (cards moving from "learning" to "review")

**Grammar Reference:**
- Rules viewed per session: Target 3+
- "Add to SRS" conversion: Target 40%+
- Cross-link click-through: Target 50%+

**Leaderboards:**
- Weekly leaderboard views: Target 40%+ of users
- Rank improvement motivation: Track rank changes week-over-week
- Social sharing: Target 10%+ share leaderboard

### 10.3 Technical Metrics

**Performance:**
- API response time: <100ms (p95)
- Page load time: <2s (p95)
- SRS review submission: <500ms
- Leaderboard query: <200ms

**Reliability:**
- Uptime: 99.9%+
- Error rate: <0.1%
- Zero data loss (SRS reviews)

---

## 11. Deployment Plan

### 11.1 Database Migration

```bash
# Step 1: Backup production database
pg_dump -h $DB_HOST -U $DB_USER -d arq_prod > backup_$(date +%Y%m%d).sql

# Step 2: Run migrations in staging
cd backend
npx prisma migrate deploy --preview-feature

# Step 3: Verify migration
npx prisma db pull
npx prisma validate

# Step 4: Run migrations in production
# (Use Vercel environment variables)
npx prisma migrate deploy
```

### 11.2 Feature Flags

```typescript
// lib/featureFlags.ts
export const FEATURES = {
  SRS_SYSTEM: process.env.NEXT_PUBLIC_ENABLE_SRS === 'true',
  LEADERBOARDS: process.env.NEXT_PUBLIC_ENABLE_LEADERBOARDS === 'true',
  GRAMMAR_LIBRARY: process.env.NEXT_PUBLIC_ENABLE_GRAMMAR_LIB === 'true',
};

// Usage in components
if (FEATURES.SRS_SYSTEM) {
  return <SRSReviewButton />;
}
```

### 11.3 Rollout Strategy

**Week 1: Beta (10% of users)**
- Enable for beta testers only
- Collect feedback
- Monitor error rates

**Week 2: Gradual Rollout (50% of users)**
- Enable for 50% randomly selected
- A/B test metrics comparison
- Fix bugs found

**Week 3: Full Rollout (100%)**
- Enable for all users
- Monitor performance
- Send announcement email

---

## 12. Risk Mitigation

### 12.1 Technical Risks

**Risk 1: SRS Algorithm Bugs**
- **Mitigation**: Extensive unit testing (100+ test cases)
- **Fallback**: Feature flag to disable SRS temporarily

**Risk 2: Database Performance Degradation**
- **Mitigation**: Proper indexing, query optimization
- **Monitoring**: Set up alerts for slow queries (>100ms)
- **Fallback**: Read replicas for leaderboard queries

**Risk 3: User Data Loss**
- **Mitigation**: Database backups every 6 hours
- **Recovery**: Point-in-time recovery enabled

### 12.2 User Experience Risks

**Risk 4: Low SRS Adoption**
- **Mitigation**: Onboarding tutorial, gamification (badges)
- **Measurement**: Track "Add to SRS" conversion rate
- **Pivot**: If <20% adoption after 2 weeks, redesign UX

**Risk 5: Leaderboard Demotivation**
- **Mitigation**: Multiple leaderboard types (weekly resets, friends-only)
- **Solution**: Emphasize personal progress over rank

### 12.3 Content Risks

**Risk 6: Grammar Rule Accuracy**
- **Mitigation**: Review by Arabic scholar before publishing
- **Process**: Community feedback mechanism for corrections
- **Version Control**: Track grammar rule updates with changelog

---

## 13. Post-Launch Iteration

### Phase 7: Analytics & Optimization (Weeks 11-12)

**Tasks:**
1. Analyze user behavior (Mixpanel/Plausible)
2. Identify drop-off points
3. A/B test UI variations
4. Optimize algorithm based on data
5. Add requested features from user feedback

**Potential Improvements:**
- Adaptive SRS algorithm (personalized intervals)
- AI-powered grammar recommendations
- Voice input for pronunciation practice
- Social study groups
- Premium features (offline mode, unlimited SRS cards)

---

## 14. Conclusion

This implementation plan provides a comprehensive roadmap for integrating grammar gamification into the arQ platform. By following the phased approach, delegating to expert agents, and maintaining rigorous testing standards, we can deliver a high-quality feature that significantly enhances user engagement and learning outcomes.

**Next Steps:**
1. Review and approve this plan
2. Assemble expert agent team
3. Begin Phase 1: Database schema extensions
4. Track progress using todo list and weekly standups
5. Launch MVP in 8-10 weeks

**Success Definition:**
- 50%+ increase in 7-day retention
- 500+ daily active users
- 70%+ review completion rate
- 4.5+ star user rating
- Zero critical bugs

---

**END OF IMPLEMENTATION PLAN**

*For technical questions, consult PROJECT_CONSTRAINTS.md*
*For curriculum details, consult CURRICULUM_ARCHITECTURE.md*
*For UI specifications, consult COMPLETE_UI_UX_WIREFRAMES_AND_INTERACTIONS.md*
