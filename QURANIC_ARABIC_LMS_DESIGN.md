# Quranic Arabic Grammar LMS - Comprehensive Design Document

**Version:** 1.0
**Date:** 2025-11-02
**Project:** Complete Learning Management System for Quranic Arabic Grammar

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Complete Database Schema](#3-complete-database-schema)
4. [Curriculum Structure (Day 1 → Expert)](#4-curriculum-structure-day-1--expert)
5. [Authentic Grammar Sources](#5-authentic-grammar-sources)
6. [Content Model Design](#6-content-model-design)
7. [User Roles & Permissions](#7-user-roles--permissions)
8. [Teacher-Student Features](#8-teacher-student-features)
9. [UI/UX Flexibility Strategy](#9-uiux-flexibility-strategy)
10. [Technology Stack](#10-technology-stack)
11. [API Design](#11-api-design)
12. [Implementation Roadmap](#12-implementation-roadmap)

---

## 1. EXECUTIVE SUMMARY

### Project Goals
Build a comprehensive LMS for Quranic Arabic grammar supporting:
- ✅ Self-paced individual learning
- ✅ Teacher-student assignment model
- ✅ Complete curriculum (beginner → expert)
- ✅ Multiple visualization styles
- ✅ Web + Mobile platforms
- ✅ Authentic scholarly content

### Key Features
1. **Flexible Visualization**: Switch between tree diagrams, color-coded text, card stacks
2. **Dual Learning Modes**: Self-study OR instructor-led
3. **Progressive Curriculum**: Structured path from basics to mastery
4. **Rich Content**: Rules, examples, exercises, quizzes from Quran
5. **Analytics**: Track progress for students and teachers
6. **Responsive**: Web, iOS, Android from single codebase

---

## 2. SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
├──────────────────────┬──────────────────────────────────────┤
│   Web Application    │      Mobile Applications             │
│   (React + Next.js)  │   (React Native / Flutter)           │
│   - Responsive UI    │   - iOS App                          │
│   - PWA Support      │   - Android App                      │
└──────────────────────┴──────────────────────────────────────┘
                              │
                              │ HTTPS/REST API/GraphQL
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│   - Authentication (JWT)                                     │
│   - Rate Limiting                                            │
│   - Request Routing                                          │
│   - API Versioning                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
├──────────────────┬──────────────────┬───────────────────────┤
│  Auth Service    │  Learning Service │  Analytics Service   │
│  - User mgmt     │  - Curriculum     │  - Progress tracking │
│  - Permissions   │  - Assignments    │  - Reports           │
│  - Sessions      │  - Exercises      │  - Insights          │
├──────────────────┼──────────────────┼───────────────────────┤
│  Content Service │  NLP Service      │  Notification Svc    │
│  - Lessons       │  - POS tagging    │  - Email             │
│  - Exercises     │  - Root extract   │  - Push              │
│  - Verses        │  - Grammar parse  │  - In-app            │
└──────────────────┴──────────────────┴───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├──────────────────────┬──────────────────────────────────────┤
│  PostgreSQL          │  Redis Cache                         │
│  - Users             │  - Session data                      │
│  - Content           │  - Analysis cache                    │
│  - Progress          │  - Leaderboards                      │
├──────────────────────┼──────────────────────────────────────┤
│  Elasticsearch       │  S3/Object Storage                   │
│  - Full-text search  │  - Media files                       │
│  - Verse search      │  - Images/Audio                      │
└──────────────────────┴──────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  - Quranic Corpus API                                        │
│  - quranic-nlp / CAMeL Tools                                │
│  - Payment Gateway (Stripe)                                  │
│  - Email Service (SendGrid)                                  │
│  - Analytics (Mixpanel/Amplitude)                           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Decisions

**Frontend:**
- **Web**: React 18 + Next.js 14 (App Router)
  - Server-side rendering for SEO
  - Progressive Web App (PWA) capabilities
  - RTL support built-in
- **Mobile**: React Native (Expo)
  - Single codebase for iOS/Android
  - Native performance
  - Shared component library with web

**Backend:**
- **API**: Node.js + NestJS (or Python FastAPI)
  - TypeScript for type safety
  - Modular architecture
  - Built-in validation
- **Database**: PostgreSQL 15+
  - JSONB for flexible schema
  - Full-text search
  - Robust transactions
- **Cache**: Redis 7+
  - Session management
  - Query caching
  - Real-time features

**DevOps:**
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (production)
- **CI/CD**: GitHub Actions
- **Hosting**: AWS/GCP/DigitalOcean
- **CDN**: CloudFlare

---

## 3. COMPLETE DATABASE SCHEMA

### 3.1 Core Tables

#### **users**
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'student', 'teacher', 'admin'
    avatar_url TEXT,
    language_preference VARCHAR(10) DEFAULT 'en', -- 'en', 'ar', 'ur', etc.
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Student-specific fields
    current_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'expert'
    total_xp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,

    -- Teacher-specific fields
    teacher_bio TEXT,
    specialization TEXT[],

    -- Preferences
    preferences JSONB DEFAULT '{
        "ui_theme": "light",
        "visualization_mode": "color-coded",
        "daily_goal_minutes": 15,
        "notifications_enabled": true,
        "audio_autoplay": false
    }'::jsonb,

    CONSTRAINT valid_role CHECK (role IN ('student', 'teacher', 'admin')),
    CONSTRAINT valid_level CHECK (current_level IN ('beginner', 'intermediate', 'advanced', 'expert'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_level ON users(current_level);
```

---

#### **courses**
```sql
CREATE TABLE courses (
    course_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    level VARCHAR(50) NOT NULL, -- 'beginner', 'intermediate', 'advanced', 'expert'
    category VARCHAR(100) NOT NULL, -- 'morphology', 'syntax', 'irab', 'comprehensive'

    -- Ordering and structure
    display_order INTEGER NOT NULL,
    parent_course_id UUID REFERENCES courses(course_id), -- For sub-courses

    -- Estimated completion
    estimated_hours NUMERIC(5,2),
    total_lessons INTEGER DEFAULT 0,
    total_exercises INTEGER DEFAULT 0,

    -- Prerequisites
    prerequisite_course_ids UUID[], -- Array of course IDs that must be completed first

    -- Status
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Metadata for flexibility
    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT valid_level CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert'))
);

CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_parent ON courses(parent_course_id);
CREATE INDEX idx_courses_order ON courses(display_order);
```

---

#### **lessons**
```sql
CREATE TABLE lessons (
    lesson_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,

    -- Content
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,

    -- Lesson type
    lesson_type VARCHAR(50) NOT NULL, -- 'theory', 'example', 'exercise', 'quiz', 'video'

    -- Ordering
    display_order INTEGER NOT NULL,

    -- Estimated time
    estimated_minutes INTEGER,

    -- Content structure (FLEXIBLE FOR UI CHANGES)
    content JSONB NOT NULL, -- SEE DETAILED STRUCTURE BELOW

    -- Visual presentation options (stored per lesson)
    visualization_config JSONB DEFAULT '{
        "default_mode": "color-coded",
        "available_modes": ["color-coded", "tree-diagram", "card-stack", "timeline"],
        "color_scheme": {
            "verbs": "#2E8B57",
            "nouns": "#4169E1",
            "particles": "#FF8C00",
            "roots": "#9370DB",
            "irab": "#DC143C"
        }
    }'::jsonb,

    -- Prerequisites
    prerequisite_lesson_ids UUID[],

    -- Status
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_lesson_type CHECK (lesson_type IN ('theory', 'example', 'exercise', 'quiz', 'video', 'interactive'))
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(display_order);
CREATE INDEX idx_lessons_type ON lessons(lesson_type);
CREATE INDEX idx_lessons_slug ON lessons(slug);
```

---

### 3.2 Content Structure (JSONB Format)

#### **lessons.content** JSONB Structure

This is the KEY to UI flexibility. All content is stored in a structured format that can be rendered in multiple ways.

```json
{
    "sections": [
        {
            "section_id": "intro",
            "section_type": "introduction",
            "title": {
                "en": "Understanding Past Tense Verbs",
                "ar": "فهم الأفعال الماضية"
            },
            "content": {
                "en": "In Arabic, past tense verbs (الفعل الماضي) indicate actions...",
                "ar": "في اللغة العربية، الفعل الماضي يدل على..."
            },
            "display_order": 1
        },
        {
            "section_id": "rule_definition",
            "section_type": "rule",
            "title": {
                "en": "The Rule",
                "ar": "القاعدة"
            },
            "rule_content": {
                "rule_id": "rule_past_verb_01",
                "rule_text": {
                    "en": "Past tense verbs are formed by applying the فَعَلَ pattern to the root",
                    "ar": "تُصاغ الأفعال الماضية بتطبيق وزن فَعَلَ على الجذر"
                },
                "formula": {
                    "pattern": "فَعَلَ",
                    "components": [
                        {"position": "first_radical", "label": "ف"},
                        {"position": "second_radical", "label": "ع"},
                        {"position": "third_radical", "label": "ل"}
                    ]
                },
                "visual_aids": [
                    {
                        "type": "diagram",
                        "url": "/assets/diagrams/past_verb_formation.svg",
                        "alt_text": "Past verb formation diagram"
                    }
                ]
            },
            "display_order": 2
        },
        {
            "section_id": "quranic_examples",
            "section_type": "examples",
            "title": {
                "en": "Examples from the Quran",
                "ar": "أمثلة من القرآن"
            },
            "examples": [
                {
                    "example_id": "ex_001",
                    "verse_reference": {
                        "surah": 1,
                        "ayah": 2,
                        "surah_name_en": "Al-Fatiha",
                        "surah_name_ar": "الفاتحة"
                    },
                    "verse_text": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
                    "focus_word": {
                        "word": "الْحَمْدُ",
                        "position": 0,
                        "analysis": {
                            "word_type": "noun",
                            "root": "ح م د",
                            "template": "فَعْل",
                            "pos_detailed": {
                                "type": "noun",
                                "definiteness": "definite",
                                "case": "nominative",
                                "number": "singular",
                                "gender": "masculine"
                            },
                            "meaning_en": "The praise",
                            "meaning_ar": "الحمد",
                            "grammatical_role": "subject (مبتدأ)",

                            // FLEXIBLE VISUALIZATION DATA
                            "visualization_data": {
                                "color_code": "#4169E1",
                                "tree_node": {
                                    "type": "NP",
                                    "children": [
                                        {"type": "DET", "value": "ال"},
                                        {"type": "N", "value": "حَمْد"}
                                    ]
                                },
                                "letter_breakdown": [
                                    {"letter": "ا", "type": "definite_article", "diacritic": null},
                                    {"letter": "ل", "type": "definite_article", "diacritic": null},
                                    {"letter": "ح", "type": "root_1", "diacritic": "fatha"},
                                    {"letter": "م", "type": "root_2", "diacritic": "sukun"},
                                    {"letter": "د", "type": "root_3", "diacritic": "damma"}
                                ],
                                "morphology_layers": [
                                    {"layer": "root", "value": "ح م د", "order": 1},
                                    {"layer": "template", "value": "فَعْل", "order": 2},
                                    {"layer": "definiteness", "value": "ال", "order": 3},
                                    {"layer": "case_ending", "value": "ُ", "order": 4}
                                ]
                            }
                        }
                    },
                    "explanation": {
                        "en": "The word 'الْحَمْدُ' is a definite noun...",
                        "ar": "كلمة 'الْحَمْدُ' اسم معرف..."
                    },
                    "audio_url": "/assets/audio/1_2.mp3"
                }
            ],
            "display_order": 3
        },
        {
            "section_id": "practice",
            "section_type": "exercise",
            "title": {
                "en": "Practice Exercise",
                "ar": "تمرين عملي"
            },
            "exercise_ref_id": "exercise_001", -- Links to exercises table
            "display_order": 4
        }
    ],

    // Learning objectives
    "learning_objectives": [
        {
            "objective_id": "obj_01",
            "text_en": "Identify past tense verbs in Quranic verses",
            "text_ar": "التعرف على الأفعال الماضية في الآيات القرآنية"
        }
    ],

    // Additional resources
    "resources": [
        {
            "type": "video",
            "title": "Visual explanation of past tense formation",
            "url": "/assets/videos/lesson_01.mp4",
            "duration_seconds": 180
        },
        {
            "type": "pdf",
            "title": "Practice worksheet",
            "url": "/assets/pdfs/worksheet_01.pdf"
        }
    ]
}
```

**Key Benefits:**
1. ✅ **UI Independent**: Same data renders as tree, color-coded, or cards
2. ✅ **Multilingual**: All text in multiple languages
3. ✅ **Rich Analysis**: Complete grammatical breakdown
4. ✅ **Extensible**: Add new visualization modes without schema changes
5. ✅ **Searchable**: JSONB allows SQL queries on nested data

---

#### **exercises**
```sql
CREATE TABLE exercises (
    exercise_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(lesson_id) ON DELETE CASCADE,

    -- Basic info
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,

    -- Exercise type
    exercise_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'fill_blank', 'drag_drop', 'matching', 'identification'

    -- Difficulty
    difficulty VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'

    -- Exercise content (FLEXIBLE FORMAT)
    content JSONB NOT NULL, -- SEE STRUCTURE BELOW

    -- Scoring
    max_points INTEGER DEFAULT 10,
    passing_score INTEGER DEFAULT 7,

    -- Timing
    time_limit_seconds INTEGER, -- NULL = no limit

    display_order INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_exercise_type CHECK (exercise_type IN ('multiple_choice', 'fill_blank', 'drag_drop', 'matching', 'identification', 'parsing')),
    CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

CREATE INDEX idx_exercises_lesson ON exercises(lesson_id);
CREATE INDEX idx_exercises_type ON exercises(exercise_type);
```

#### **exercises.content** JSONB Structure

```json
{
    "exercise_type": "identification",
    "instructions": {
        "en": "Identify all past tense verbs in the following verse",
        "ar": "حدد جميع الأفعال الماضية في الآية التالية"
    },
    "verse": {
        "surah": 2,
        "ayah": 255,
        "text": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۚ الْحَيُّ الْقَيُّومُ"
    },
    "question_data": {
        "words": [
            {"word": "اللَّهُ", "is_target": false},
            {"word": "لَا", "is_target": false},
            {"word": "إِلَٰهَ", "is_target": false},
            // ... more words
        ],
        "correct_answers": [
            {"word": "اللَّهُ", "reason_en": "This is a noun, not a verb", "reason_ar": "هذا اسم وليس فعلاً"}
        ]
    },
    "hints": [
        {
            "hint_text_en": "Past tense verbs in Arabic typically end with فَعَلَ pattern",
            "hint_text_ar": "عادة تنتهي الأفعال الماضية بوزن فَعَلَ",
            "reveal_after_seconds": 30
        }
    ],
    "explanation": {
        "en": "Detailed explanation of the answer...",
        "ar": "شرح مفصل للإجابة..."
    }
}
```

---

### 3.3 User Progress & Learning Tables

#### **user_course_progress**
```sql
CREATE TABLE user_course_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,

    -- Progress metrics
    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    progress_percentage NUMERIC(5,2) DEFAULT 0.00,

    -- Lessons completed
    completed_lesson_ids UUID[] DEFAULT '{}',
    total_lessons_completed INTEGER DEFAULT 0,

    -- Exercises completed
    completed_exercise_ids UUID[] DEFAULT '{}',
    total_exercises_completed INTEGER DEFAULT 0,

    -- Scoring
    total_points_earned INTEGER DEFAULT 0,
    total_points_possible INTEGER DEFAULT 0,
    average_score NUMERIC(5,2),

    -- Time tracking
    total_time_spent_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,

    -- Mastery level
    mastery_level VARCHAR(20), -- 'novice', 'competent', 'proficient', 'expert'

    UNIQUE(user_id, course_id),
    CONSTRAINT valid_status CHECK (status IN ('not_started', 'in_progress', 'completed'))
);

CREATE INDEX idx_progress_user ON user_course_progress(user_id);
CREATE INDEX idx_progress_course ON user_course_progress(course_id);
CREATE INDEX idx_progress_status ON user_course_progress(status);
```

#### **user_lesson_progress**
```sql
CREATE TABLE user_lesson_progress (
    progress_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(lesson_id) ON DELETE CASCADE,

    -- Status
    status VARCHAR(50) DEFAULT 'not_started',

    -- Time
    time_spent_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Attempts
    attempt_count INTEGER DEFAULT 0,

    -- Notes (student can add personal notes)
    personal_notes TEXT,
    bookmarked BOOLEAN DEFAULT false,

    UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON user_lesson_progress(lesson_id);
```

#### **user_exercise_attempts**
```sql
CREATE TABLE user_exercise_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,

    -- Attempt details
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,

    -- Answers submitted
    user_answers JSONB NOT NULL, -- Stores user's answers

    -- Scoring
    score_earned INTEGER,
    score_possible INTEGER,
    is_correct BOOLEAN,

    -- Time taken
    time_taken_seconds INTEGER,

    -- Feedback
    feedback JSONB -- Detailed feedback per question
);

CREATE INDEX idx_attempts_user ON user_exercise_attempts(user_id);
CREATE INDEX idx_attempts_exercise ON user_exercise_attempts(exercise_id);
CREATE INDEX idx_attempts_submitted ON user_exercise_attempts(submitted_at);
```

---

### 3.4 Teacher-Student Tables

#### **classrooms**
```sql
CREATE TABLE classrooms (
    classroom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Settings
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false, -- Can students join without invitation?
    join_code VARCHAR(10) UNIQUE, -- 6-digit code for students to join

    -- Limits
    max_students INTEGER DEFAULT 50,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE INDEX idx_classrooms_join_code ON classrooms(join_code);
```

#### **classroom_enrollments**
```sql
CREATE TABLE classroom_enrollments (
    enrollment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    enrolled_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'removed'

    UNIQUE(classroom_id, student_id),
    CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'removed'))
);

CREATE INDEX idx_enrollments_classroom ON classroom_enrollments(classroom_id);
CREATE INDEX idx_enrollments_student ON classroom_enrollments(student_id);
```

#### **assignments**
```sql
CREATE TABLE assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(classroom_id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES users(user_id),

    -- Assignment details
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- What to complete
    assigned_course_id UUID REFERENCES courses(course_id),
    assigned_lesson_ids UUID[], -- Can assign specific lessons
    assigned_exercise_ids UUID[], -- Can assign specific exercises

    -- Timing
    assigned_at TIMESTAMP DEFAULT NOW(),
    due_date TIMESTAMP,

    -- Settings
    allow_late_submission BOOLEAN DEFAULT true,
    max_attempts INTEGER, -- NULL = unlimited
    passing_score_percentage NUMERIC(5,2) DEFAULT 70.00,

    -- Status
    is_published BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assignments_classroom ON assignments(classroom_id);
CREATE INDEX idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
```

#### **assignment_submissions**
```sql
CREATE TABLE assignment_submissions (
    submission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(assignment_id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Submission details
    submitted_at TIMESTAMP DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,

    -- Progress
    lessons_completed UUID[] DEFAULT '{}',
    exercises_completed UUID[] DEFAULT '{}',

    -- Scoring
    total_score NUMERIC(5,2),
    passed BOOLEAN,

    -- Teacher feedback
    teacher_feedback TEXT,
    graded_at TIMESTAMP,
    graded_by UUID REFERENCES users(user_id),

    UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);
```

---

### 3.5 Gamification Tables

#### **badges**
```sql
CREATE TABLE badges (
    badge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Badge details
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,

    -- Visual
    icon_url TEXT NOT NULL,
    color VARCHAR(7), -- Hex color code

    -- Criteria to earn badge
    criteria JSONB NOT NULL, -- e.g., {"type": "lessons_completed", "count": 10}

    -- Rarity
    rarity VARCHAR(20), -- 'common', 'rare', 'epic', 'legendary'
    points_value INTEGER DEFAULT 0,

    -- Category
    category VARCHAR(50), -- 'achievement', 'mastery', 'streak', 'social'

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_badges_category ON badges(category);
```

#### **user_badges**
```sql
CREATE TABLE user_badges (
    user_badge_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(badge_id),

    earned_at TIMESTAMP DEFAULT NOW(),

    -- Context (what earned this badge)
    earned_for JSONB, -- e.g., {"course_id": "...", "action": "completed"}

    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_earned ON user_badges(earned_at);
```

#### **daily_streaks**
```sql
CREATE TABLE daily_streaks (
    streak_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    streak_date DATE NOT NULL,
    activity_count INTEGER DEFAULT 0, -- Number of activities that day
    xp_earned INTEGER DEFAULT 0,

    UNIQUE(user_id, streak_date)
);

CREATE INDEX idx_streaks_user ON daily_streaks(user_id);
CREATE INDEX idx_streaks_date ON daily_streaks(streak_date);
```

#### **leaderboards**
```sql
CREATE TABLE leaderboards (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Leaderboard type
    leaderboard_type VARCHAR(50) NOT NULL, -- 'global', 'classroom', 'course'
    context_id UUID, -- classroom_id or course_id if applicable

    -- Metrics
    total_xp INTEGER DEFAULT 0,
    rank_position INTEGER,

    -- Time period
    time_period VARCHAR(20) NOT NULL, -- 'all_time', 'monthly', 'weekly'
    period_start DATE,
    period_end DATE,

    last_updated TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_type CHECK (leaderboard_type IN ('global', 'classroom', 'course')),
    CONSTRAINT valid_period CHECK (time_period IN ('all_time', 'monthly', 'weekly'))
);

CREATE INDEX idx_leaderboard_type ON leaderboards(leaderboard_type);
CREATE INDEX idx_leaderboard_context ON leaderboards(context_id);
CREATE INDEX idx_leaderboard_period ON leaderboards(time_period);
```

---

### 3.6 Quran-Specific Tables

#### **quran_verses**
```sql
CREATE TABLE quran_verses (
    verse_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Verse reference
    surah_number INTEGER NOT NULL,
    ayah_number INTEGER NOT NULL,

    -- Surah info
    surah_name_en VARCHAR(255),
    surah_name_ar VARCHAR(255),

    -- Verse text
    verse_text_uthmani TEXT NOT NULL, -- Uthmanic script
    verse_text_simple TEXT NOT NULL, -- Simplified script (no diacritics)

    -- Translations
    translations JSONB, -- {"en": "...", "ur": "...", "fr": "..."}

    -- Audio
    audio_url TEXT,

    -- Metadata
    juz_number INTEGER,
    page_number INTEGER,

    UNIQUE(surah_number, ayah_number)
);

CREATE INDEX idx_verses_surah ON quran_verses(surah_number);
CREATE INDEX idx_verses_juz ON quran_verses(juz_number);
```

#### **verse_words**
```sql
CREATE TABLE verse_words (
    word_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verse_id UUID NOT NULL REFERENCES quran_verses(verse_id) ON DELETE CASCADE,

    -- Word details
    word_position INTEGER NOT NULL, -- Position in verse (0-indexed)
    word_text TEXT NOT NULL,

    -- Grammatical analysis (from Quranic Corpus)
    analysis JSONB NOT NULL, -- Complete grammatical breakdown

    -- This is where ALL visualization data lives
    -- Tree diagram data, color codes, morphology layers, etc.
    -- See previous examples for structure

    UNIQUE(verse_id, word_position)
);

CREATE INDEX idx_words_verse ON verse_words(verse_id);
CREATE INDEX idx_words_root ON verse_words USING gin ((analysis->'root'));
CREATE INDEX idx_words_pos ON verse_words USING gin ((analysis->'pos_detailed'));
```

---

## 4. CURRICULUM STRUCTURE (DAY 1 → EXPERT)

### 4.1 Learning Path Overview

```
BEGINNER (Levels 1-3)
  ↓
INTERMEDIATE (Levels 4-6)
  ↓
ADVANCED (Levels 7-9)
  ↓
EXPERT (Level 10+)
```

### 4.2 Complete Curriculum Map

#### **LEVEL 1: ABSOLUTE BEGINNER (Day 1-14)**

**Course 1.1: Introduction to Quranic Arabic**
- Lesson 1.1.1: What is Quranic Arabic?
- Lesson 1.1.2: The Arabic Alphabet
- Lesson 1.1.3: Reading with Diacritics (Harakat)
- Lesson 1.1.4: Short Vowels (Fatha, Kasra, Damma)
- Lesson 1.1.5: Sukoon and Shadda
- Quiz 1.1

**Course 1.2: The Three Categories**
- Lesson 1.2.1: Introduction to Word Types
- Lesson 1.2.2: اسم (Noun) - What is it?
- Lesson 1.2.3: فعل (Verb) - What is it?
- Lesson 1.2.4: حرف (Particle) - What is it?
- Lesson 1.2.5: Identifying Word Types in Quran
- Exercise 1.2: Word Type Identification
- Quiz 1.2

**Course 1.3: The Root System**
- Lesson 1.3.1: What is a Root (جذر)?
- Lesson 1.3.2: Three-Letter Roots (99% of Arabic)
- Lesson 1.3.3: How to Extract Roots
- Lesson 1.3.4: Root Families in Quran
- Interactive Exercise: Root Extraction Practice
- Quiz 1.3

**Milestone: Level 1 Assessment**
- Can identify word types
- Can extract basic roots
- Can read with harakat

---

#### **LEVEL 2: BASIC GRAMMAR (Week 3-4)**

**Course 2.1: Verb Basics**
- Lesson 2.1.1: Past Tense (الفعل الماضي)
  - Examples from Surah Al-Fatiha
  - Pattern: فَعَلَ
  - Conjugation introduction
- Lesson 2.1.2: Present Tense (الفعل المضارع)
  - Pattern: يَفْعَلُ
  - Examples from Surah Al-Ikhlas
- Lesson 2.1.3: Future Tense (المستقبل)
  - Using سَـ and سَوْفَ
- Exercise 2.1: Tense Identification
- Quiz 2.1

**Course 2.2: Noun Basics**
- Lesson 2.2.1: Definite vs Indefinite (ال التعريف)
- Lesson 2.2.2: Gender (Masculine/Feminine)
- Lesson 2.2.3: Number (Singular/Dual/Plural)
- Lesson 2.2.4: Common Noun Patterns
- Exercise 2.2: Noun Analysis
- Quiz 2.2

**Course 2.3: Particles (Introduction)**
- Lesson 2.3.1: Common Prepositions (في، من، إلى، على)
- Lesson 2.3.2: Conjunctions (و، ف، ثم)
- Lesson 2.3.3: Negation Particles (لا، ما، لم)
- Exercise 2.3: Particle Usage
- Quiz 2.3

**Milestone: Level 2 Assessment**
- Can identify verb tenses
- Understands definite/indefinite
- Recognizes common particles

---

#### **LEVEL 3: SENTENCE STRUCTURE (Week 5-6)**

**Course 3.1: Nominal Sentences**
- Lesson 3.1.1: What is a Nominal Sentence? (الجملة الاسمية)
- Lesson 3.1.2: المبتدأ (Subject)
- Lesson 3.1.3: الخبر (Predicate)
- Lesson 3.1.4: Examples from Quran
  - اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ
- Exercise 3.1: Identify Subject and Predicate
- Quiz 3.1

**Course 3.2: Verbal Sentences**
- Lesson 3.2.1: What is a Verbal Sentence? (الجملة الفعلية)
- Lesson 3.2.2: الفعل (Verb)
- Lesson 3.2.3: الفاعل (Subject/Doer)
- Lesson 3.2.4: المفعول به (Object)
- Lesson 3.2.5: VSO Word Order
- Exercise 3.2: Sentence Analysis
- Quiz 3.2

**Course 3.3: Simple Sentence Practice**
- 10 Quranic verses analyzed
- Interactive parsing exercises
- Comprehensive Quiz 3.3

**Milestone: Level 3 Assessment**
- Can identify sentence types
- Can parse simple sentences
- Understands basic word order

---

#### **LEVEL 4: INTERMEDIATE - I'RAB INTRODUCTION (Week 7-9)**

**Course 4.1: Introduction to I'rab (إعراب)**
- Lesson 4.1.1: What is I'rab?
- Lesson 4.1.2: The Three Cases
  - Nominative (المرفوع)
  - Accusative (المنصوب)
  - Genitive (المجرور)
- Lesson 4.1.3: Case Markers
  - Damma (ُ) for Raf'
  - Fatha (َ) for Nasb
  - Kasra (ِ) for Jarr
- Examples from Quran
- Quiz 4.1

**Course 4.2: I'rab of Nouns**
- Lesson 4.2.1: When Nouns are Marfoo'
  - Subject of nominal sentence
  - Doer of verb
- Lesson 4.2.2: When Nouns are Mansoob
  - Object of verb
  - After certain particles
- Lesson 4.2.3: When Nouns are Majroor
  - After prepositions
  - Second term of Idafa
- Exercise 4.2: Case Identification
- Quiz 4.2

**Course 4.3: Idafa (Possession) إضافة**
- Lesson 4.3.1: What is Idafa?
- Lesson 4.3.2: First term (المضاف)
- Lesson 4.3.3: Second term (المضاف إليه)
- Lesson 4.3.4: Examples from Quran
  - رَبِّ الْعَالَمِينَ
  - مَالِكِ يَوْمِ الدِّينِ
- Exercise 4.3: Idafa Recognition
- Quiz 4.3

**Milestone: Level 4 Assessment**
- Can identify case endings
- Understands Idafa structure
- Can apply I'rab to nouns

---

#### **LEVEL 5: INTERMEDIATE - VERB FORMS (Week 10-12)**

**Course 5.1: Introduction to Verb Forms**
- Lesson 5.1.1: What are Verb Forms (الأوزان)?
- Lesson 5.1.2: The 10 Main Forms
- Lesson 5.1.3: Form I (فَعَلَ) - Basic
- Lesson 5.1.4: Form II (فَعَّلَ) - Intensification
- Lesson 5.1.5: Form III (فَاعَلَ) - Reciprocal
- Quiz 5.1

**Course 5.2: Common Verb Forms in Quran**
- Lesson 5.2.1: Form IV (أَفْعَلَ) - Causative
  - Examples: أَنْزَلَ (He sent down)
- Lesson 5.2.2: Form V (تَفَعَّلَ) - Reflexive of II
- Lesson 5.2.3: Form VI (تَفَاعَلَ) - Reflexive of III
- Lesson 5.2.4: Form VII (اِنْفَعَلَ) - Passive-like
- Lesson 5.2.5: Form VIII (اِفْتَعَلَ) - Reflexive
- Lesson 5.2.6: Form X (اِسْتَفْعَلَ) - Seeking
  - Examples: اسْتَغْفَرَ (sought forgiveness)
- Exercise 5.2: Form Identification
- Quiz 5.2

**Course 5.3: Verb Conjugation Deep Dive**
- Lesson 5.3.1: Perfect Conjugation (all persons)
- Lesson 5.3.2: Imperfect Conjugation
- Lesson 5.3.3: Imperative Mood
- Lesson 5.3.4: Jussive Mood
- Lesson 5.3.5: Subjunctive Mood
- Exercise 5.3: Full Conjugation Practice
- Quiz 5.3

**Milestone: Level 5 Assessment**
- Can identify verb forms
- Can conjugate in different moods
- Recognizes patterns in Quran

---

#### **LEVEL 6: INTERMEDIATE - PARTICLES & SPECIAL CASES (Week 13-15)**

**Course 6.1: Advanced Particles**
- Lesson 6.1.1: إِنَّ and Sisters (إِنَّ وأخواتها)
- Lesson 6.1.2: كَانَ and Sisters (كَانَ وأخواتها)
- Lesson 6.1.3: Particles of Exception (أدوات الاستثناء)
- Lesson 6.1.4: Conditional Particles (إِنْ، لَوْ، etc.)
- Exercise 6.1: Particle Effect Analysis
- Quiz 6.1

**Course 6.2: Special Nouns**
- Lesson 6.2.1: The Five Nouns (الأسماء الخمسة)
- Lesson 6.2.2: Diptotes (الممنوع من الصرف)
- Lesson 6.2.3: Indeclinable Nouns (المبني)
- Exercise 6.2: Special Cases
- Quiz 6.2

**Course 6.3: Adjectives and Descriptions**
- Lesson 6.3.1: الصفة (Adjective)
- Lesson 6.3.2: Agreement Rules
- Lesson 6.3.3: Multiple Adjectives
- Exercise 6.3: Adjective Analysis
- Quiz 6.3

**Milestone: Level 6 Assessment**
- Complete intermediate understanding
- Can handle special grammatical cases
- Ready for advanced parsing

---

#### **LEVEL 7: ADVANCED - COMPLETE I'RAB (Week 16-19)**

**Course 7.1: Advanced Parsing**
- Comprehensive I'rab of complex verses
- Multiple parse possibilities
- Understanding context

**Course 7.2: Rhetoric Introduction (البلاغة)**
- Lesson 7.2.1: علم المعاني (Semantics)
- Lesson 7.2.2: علم البيان (Eloquence)
- Lesson 7.2.3: علم البديع (Figures of Speech)

**Course 7.3: Quranic Syntax Patterns**
- Common structures in Quran
- Unique Quranic usages
- Grammatical miracles

**Milestone: Level 7 Assessment**
- Can perform complete I'rab
- Understands rhetoric basics
- Recognizes advanced patterns

---

#### **LEVEL 8-10: EXPERT (Week 20+)**

**Course 8.1: Quranic Exegesis Grammar**
- How grammar affects meaning
- Different qira'at (recitations) effects
- Scholar interpretations

**Course 9.1: Comparative Grammar**
- Classical vs Quranic Arabic
- Regional variations
- Evolution of grammar

**Course 10.1: Research & Teaching**
- Original research in Quranic grammar
- Teaching methodology
- Becoming a teacher on platform

**Final Certification**
- Comprehensive examination
- Practical parsing test
- Teaching demonstration

---

## 5. AUTHENTIC GRAMMAR SOURCES

### 5.1 Primary Sources (To Extract Rules From)

#### **1. Quranic Arabic Corpus** ⭐ PRIMARY
- **URL**: https://corpus.quran.com/
- **Authority**: University of Leeds
- **Data**: Complete morphological & syntactic analysis
- **Format**: XML/JSON API available
- **License**: Open source
- **Usage**: Extract all word-level analysis
  - POS tags
  - Root extraction
  - I'rab information
  - Dependency relations

#### **2. Classical Grammar Books** (Reference)

**Beginner Level:**
- **الآجرومية** (Al-Ajurrumiyyah) by Ibn Ajurrum
  - Foundational grammar text
  - Clear, simple rules
  - Used for centuries

- **قطر الندى** (Qatr al-Nada) by Ibn Hisham
  - Intermediate level
  - More detailed than Ajurrumiyyah

**Advanced Level:**
- **ألفية ابن مالك** (Alfiyyah Ibn Malik)
  - 1000-line poem covering all grammar
  - Expert level reference

- **شرح ابن عقيل** (Sharh Ibn Aqeel)
  - Commentary on Alfiyyah
  - Detailed explanations

#### **3. Modern Academic Sources**

- **Quranic Grammar** by Dr. Abd al-Rahman al-Sharqawi
- **A New Arabic Grammar of the Written Language** by Haywood & Nahmad
- **Arabic Grammar in Context** by Nariman Naili al-Warraki

#### **4. Digital Resources**

- **JQuranTree** (Java API)
  - Structured access to Quranic Corpus

- **QuranTree.jl** (Julia)
  - Alternative API access

- **quranic-nlp** (Python)
  - NLP pipeline for analysis

### 5.2 Content Creation Process

```
1. Extract Rule from Classical Text
   ↓
2. Find Examples in Quranic Corpus
   ↓
3. Verify with Scholarly Commentary
   ↓
4. Write Explanation (Multi-lingual)
   ↓
5. Create Exercises
   ↓
6. Review by Arabic Scholar
   ↓
7. Add to Database
```

### 5.3 Data Quality Assurance

- ✅ Every rule cited to classical source
- ✅ Every example verified in Quranic Corpus
- ✅ Multiple scholar review
- ✅ User correction submissions
- ✅ Regular updates from research

---

## 6. CONTENT MODEL DESIGN

[Content model already covered in Section 3.2 - lessons.content JSONB structure]

Key principle: **Separation of content from presentation**

```
CONTENT (Database) ← Independent → PRESENTATION (UI)
```

This allows:
- Same lesson rendered as color-coded OR tree OR cards
- User switches view modes dynamically
- Add new visualization modes without DB changes
- A/B testing different presentation styles

---

## 7. USER ROLES & PERMISSIONS

### 7.1 Role Definitions

#### **Student**
```json
{
    "role": "student",
    "permissions": [
        "view_courses",
        "enroll_courses",
        "view_lessons",
        "submit_exercises",
        "view_own_progress",
        "join_classrooms",
        "view_own_assignments",
        "submit_assignments",
        "view_leaderboards",
        "earn_badges",
        "add_personal_notes"
    ]
}
```

#### **Teacher**
```json
{
    "role": "teacher",
    "permissions": [
        // All student permissions, PLUS:
        "create_classrooms",
        "manage_own_classrooms",
        "invite_students",
        "create_assignments",
        "grade_assignments",
        "view_student_progress",
        "generate_reports",
        "provide_feedback",
        "view_classroom_analytics"
    ]
}
```

#### **Admin**
```json
{
    "role": "admin",
    "permissions": [
        // All teacher permissions, PLUS:
        "create_courses",
        "edit_courses",
        "publish_courses",
        "create_lessons",
        "create_exercises",
        "manage_users",
        "view_all_analytics",
        "manage_badges",
        "manage_content",
        "system_configuration"
    ]
}
```

### 7.2 Permission Checking

```typescript
// Example permission check
function canUserAccessLesson(userId: UUID, lessonId: UUID): boolean {
    const user = getUser(userId);
    const lesson = getLesson(lessonId);

    // Admin can access everything
    if (user.role === 'admin') return true;

    // Check if lesson is in a course user has access to
    const course = getCourse(lesson.courseId);

    // Public courses
    if (course.isPublic) return true;

    // Enrolled courses
    const enrollment = getUserCourseProgress(userId, course.courseId);
    if (enrollment) return true;

    // Assigned by teacher
    const assignment = getAssignmentForUserAndLesson(userId, lessonId);
    if (assignment) return true;

    return false;
}
```

---

## 8. TEACHER-STUDENT FEATURES

### 8.1 Teacher Dashboard

```
TEACHER DASHBOARD
├── My Classrooms
│   ├── Classroom A (25 students)
│   ├── Classroom B (18 students)
│   └── [+ Create New Classroom]
│
├── Active Assignments
│   ├── Assignment 1 (15/25 submitted)
│   ├── Assignment 2 (Due tomorrow)
│   └── [+ Create New Assignment]
│
├── Student Progress Overview
│   ├── Top Performers
│   ├── Students Needing Help
│   └── Recent Activity
│
├── Analytics
│   ├── Engagement metrics
│   ├── Completion rates
│   └── Common mistakes
│
└── Resources
    ├── All Courses
    ├── Lesson Library
    └── Exercise Bank
```

### 8.2 Assignment Workflow

**Teacher Creates Assignment:**
```
1. Select classroom(s)
2. Choose content:
   - Entire course
   - Specific lessons
   - Specific exercises
   - Custom mix
3. Set parameters:
   - Due date
   - Passing score
   - Max attempts
   - Late submission policy
4. Add instructions
5. Publish to students
```

**Student Receives Assignment:**
```
1. Notification (email + in-app)
2. Assignment appears in dashboard
3. Student works through content
4. Submits completion
5. Receives grade/feedback
```

**Teacher Reviews Submission:**
```
1. View student's work
2. See exercise attempts
3. See time spent
4. See score
5. Add written feedback
6. Mark as graded
```

### 8.3 Classroom Management Features

```typescript
interface ClassroomFeatures {
    // Basic
    name: string;
    description: string;
    joinCode: string; // XYZABC123

    // Student management
    enrolledStudents: User[];
    pendingInvitations: Invitation[];

    // Assignment management
    assignments: Assignment[];

    // Communication
    announcements: Announcement[];

    // Analytics
    classroomStats: {
        averageProgress: number;
        averageScore: number;
        totalTimeSpent: number;
        engagementRate: number;
    };

    // Settings
    settings: {
        allowStudentInteraction: boolean;
        showLeaderboard: boolean;
        requireApprovalToJoin: boolean;
    };
}
```

### 8.4 Progress Tracking for Teachers

**Individual Student View:**
```
STUDENT: Ahmed Khan

Overall Progress: 67%
Current Level: Intermediate (Level 5)
Total XP: 2,340
Current Streak: 12 days

COURSES IN PROGRESS:
┌──────────────────────┬──────────┬───────┐
│ Course               │ Progress │ Score │
├──────────────────────┼──────────┼───────┤
│ Verb Forms           │ 80%      │ 85%   │
│ I'rab Basics         │ 45%      │ 72%   │
│ Sentence Structure   │ 100%     │ 91%   │
└──────────────────────┴──────────┴───────┘

RECENT ACTIVITY:
- Completed Lesson 5.2.3 (2 hours ago)
- Scored 9/10 on Quiz 5.2 (Yesterday)
- Spent 45 minutes on exercises (Yesterday)

AREAS NEEDING ATTENTION:
⚠️ Struggles with Form VIII verbs (3 failed attempts)
⚠️ Hasn't logged in for 2 days (streak at risk)

TEACHER NOTES:
[Add note about Ahmed's progress...]
```

**Class Overview:**
```
CLASSROOM: Arabic Grammar 101 (25 students)

Average Progress: 54%
Average Score: 78%
Engagement Rate: 82%

LEADERBOARD (Top 5):
1. Fatima Ali - 3,450 XP
2. Ahmed Khan - 2,340 XP
3. Sara Mohamed - 2,100 XP
4. Omar Hassan - 1,980 XP
5. Aisha Ibrahim - 1,750 XP

UPCOMING DEADLINES:
- Assignment 3: Due in 2 days (18/25 submitted)
- Assignment 4: Due next week (0/25 submitted)

RECENT ACHIEVEMENTS:
🏆 Fatima Ali earned "I'rab Master" badge
🏆 5 students reached Level 4
🏆 Class maintained 90% weekly engagement

COMMON MISTAKES:
1. Confusing Form II and Form IV verbs (15 students)
2. Idafa case endings (12 students)
3. Particle إِنَّ usage (10 students)
```

---

## 9. UI/UX FLEXIBILITY STRATEGY

### 9.1 Visualization Mode System

All content stored with `visualization_data` in JSONB allows multiple rendering modes.

**Available Modes:**

1. **Color-Coded Text** (Default)
   - Words colored by POS
   - Hover for details
   - Clean, readable

2. **Tree Diagram**
   - Dependency tree
   - Interactive nodes
   - Zoom/pan controls

3. **Card Stack**
   - One word per card
   - Swipe through
   - Flip for layers

4. **Timeline/Flow**
   - Horizontal word flow
   - Root → Template → POS
   - Clear progression

5. **Layered Analysis**
   - Expandable sections
   - Progressive disclosure
   - Beginner-friendly

6. **Side-by-Side Compare**
   - Multiple analysis styles
   - Educational comparison

### 9.2 Implementing Flexibility

```typescript
// Rendering component
function RenderLesson({ lesson, userPreferences }) {
    const mode = userPreferences.visualization_mode || 'color-coded';

    switch(mode) {
        case 'color-coded':
            return <ColorCodedView content={lesson.content} />;
        case 'tree-diagram':
            return <TreeDiagramView content={lesson.content} />;
        case 'card-stack':
            return <CardStackView content={lesson.content} />;
        case 'timeline':
            return <TimelineView content={lesson.content} />;
        case 'layered':
            return <LayeredView content={lesson.content} />;
        default:
            return <ColorCodedView content={lesson.content} />;
    }
}
```

**Mode Switcher UI:**
```
┌─────────────────────────────────────────┐
│  View Mode: [Color-Coded ▼]            │
│  ○ Color-Coded Text                     │
│  ○ Tree Diagram                         │
│  ○ Card Stack                           │
│  ○ Timeline Flow                        │
│  ○ Layered Analysis                     │
└─────────────────────────────────────────┘
```

### 9.3 User Preferences

```sql
-- Stored in users.preferences JSONB
{
    "ui_theme": "light",  -- "light" | "dark" | "high-contrast"
    "visualization_mode": "color-coded",
    "font_size": "medium",  -- "small" | "medium" | "large" | "xlarge"
    "arabic_font": "uthmanic",  -- "uthmanic" | "naskh" | "kufi"
    "show_transliteration": true,
    "show_translation": true,
    "translation_language": "en",
    "audio_autoplay": false,
    "daily_goal_minutes": 15,
    "notifications_enabled": true,
    "notification_times": ["09:00", "20:00"],
    "show_hints_automatically": true,
    "animation_speed": "normal"  -- "slow" | "normal" | "fast" | "off"
}
```

---

## 10. TECHNOLOGY STACK

### 10.1 Frontend

**Web Application:**
```
- Framework: React 18 + Next.js 14
- Language: TypeScript
- State: Redux Toolkit / Zustand
- UI Library: Material-UI / Chakra UI / Tailwind CSS
- Charts: Recharts / Victory
- Animations: Framer Motion
- RTL Support: rtl-detect, styled-components/emotion
- Forms: React Hook Form + Zod
- API: React Query / SWR
```

**Mobile Application:**
```
- Framework: React Native (Expo)
- Language: TypeScript
- State: Redux Toolkit
- UI: React Native Paper / NativeBase
- Navigation: React Navigation
- Offline: WatermelonDB / Realm
- Push: Expo Notifications
```

### 10.2 Backend

```
- Runtime: Node.js 20 LTS
- Framework: NestJS (TypeScript)
- API Style: REST + GraphQL
- Validation: class-validator / Zod
- Auth: Passport.js + JWT
- File Upload: Multer + S3
- WebSockets: Socket.io (for real-time features)
- Job Queue: Bull + Redis
- Email: Nodemailer + SendGrid
```

### 10.3 Database & Cache

```
- Primary DB: PostgreSQL 15+
- Cache: Redis 7+
- Search: Elasticsearch 8
- File Storage: AWS S3 / MinIO
- Backup: pg_dump + automated snapshots
```

### 10.4 NLP & Analysis

```
- Library: quranic-nlp (Python)
- Alternative: CAMeL Tools
- API: Python FastAPI microservice
- Format: REST endpoints
- Cache: Redis (analysis results)
```

### 10.5 DevOps & Infrastructure

```
- Containerization: Docker
- Orchestration: Kubernetes / Docker Swarm
- CI/CD: GitHub Actions
- Hosting: AWS / GCP / DigitalOcean
- CDN: CloudFlare
- Monitoring: Prometheus + Grafana
- Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
- Error Tracking: Sentry
```

---

## 11. API DESIGN

### 11.1 REST API Endpoints

**Authentication:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

**Users:**
```
GET    /api/v1/users/me
PATCH  /api/v1/users/me
GET    /api/v1/users/:id
GET    /api/v1/users/:id/progress
GET    /api/v1/users/:id/badges
GET    /api/v1/users/:id/achievements
```

**Courses:**
```
GET    /api/v1/courses
GET    /api/v1/courses/:id
GET    /api/v1/courses/:id/lessons
POST   /api/v1/courses/:id/enroll
GET    /api/v1/courses/:id/progress
```

**Lessons:**
```
GET    /api/v1/lessons/:id
POST   /api/v1/lessons/:id/start
POST   /api/v1/lessons/:id/complete
GET    /api/v1/lessons/:id/next
```

**Exercises:**
```
GET    /api/v1/exercises/:id
POST   /api/v1/exercises/:id/submit
GET    /api/v1/exercises/:id/attempts
GET    /api/v1/exercises/:id/feedback
```

**Classrooms (Teacher):**
```
GET    /api/v1/classrooms
POST   /api/v1/classrooms
GET    /api/v1/classrooms/:id
PATCH  /api/v1/classrooms/:id
DELETE /api/v1/classrooms/:id
GET    /api/v1/classrooms/:id/students
POST   /api/v1/classrooms/:id/invite
```

**Assignments (Teacher):**
```
GET    /api/v1/assignments
POST   /api/v1/assignments
GET    /api/v1/assignments/:id
GET    /api/v1/assignments/:id/submissions
POST   /api/v1/assignments/:id/grade
```

**Quran:**
```
GET    /api/v1/quran/verses
GET    /api/v1/quran/verses/:surah/:ayah
GET    /api/v1/quran/verses/:surah/:ayah/words
GET    /api/v1/quran/verses/:surah/:ayah/analysis
GET    /api/v1/quran/search?q=root:كتب
```

**Analytics:**
```
GET    /api/v1/analytics/progress
GET    /api/v1/analytics/leaderboard
GET    /api/v1/analytics/classroom/:id
```

### 11.2 GraphQL Schema (Alternative/Complementary)

```graphql
type User {
  id: ID!
  email: String!
  fullName: String!
  role: UserRole!
  currentLevel: Level
  totalXp: Int!
  currentStreak: Int!
  preferences: UserPreferences!
  courses: [CourseProgress!]!
  badges: [UserBadge!]!
}

type Course {
  id: ID!
  title: String!
  description: String
  level: Level!
  lessons: [Lesson!]!
  totalLessons: Int!
  estimatedHours: Float
  prerequisites: [Course!]
}

type Lesson {
  id: ID!
  title: String!
  content: JSON!
  lessonType: LessonType!
  estimatedMinutes: Int
  exercises: [Exercise!]
}

type Exercise {
  id: ID!
  title: String!
  exerciseType: ExerciseType!
  content: JSON!
  difficulty: Difficulty!
  maxPoints: Int!
}

type Query {
  me: User
  course(id: ID!): Course
  lesson(id: ID!): Lesson
  myProgress: [CourseProgress!]!
  leaderboard(timeframe: Timeframe!): [LeaderboardEntry!]!
  verseAnalysis(surah: Int!, ayah: Int!): VerseAnalysis!
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  enrollCourse(courseId: ID!): CourseProgress!
  submitExercise(exerciseId: ID!, answers: JSON!): ExerciseAttempt!
  completeLesson(lessonId: ID!): LessonProgress!
  createAssignment(input: CreateAssignmentInput!): Assignment!
}
```

---

## 12. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Months 1-3)

**Month 1: Infrastructure**
- ✅ Set up development environment
- ✅ Database schema implementation
- ✅ Authentication system
- ✅ Basic API endpoints
- ✅ Web app skeleton
- ✅ Mobile app skeleton

**Month 2: Core Learning Features**
- ✅ Course browsing
- ✅ Lesson viewer (color-coded mode)
- ✅ Exercise system
- ✅ Progress tracking
- ✅ User dashboard

**Month 3: Content Creation**
- ✅ Curriculum Level 1 (Beginner)
- ✅ Curriculum Level 2 (Basic Grammar)
- ✅ 50+ lessons created
- ✅ 100+ exercises
- ✅ Quranic Corpus integration

**Deliverable**: MVP for self-paced learning

---

### Phase 2: Teacher Features (Months 4-5)

**Month 4: Classroom System**
- ✅ Classroom creation
- ✅ Student enrollment
- ✅ Teacher dashboard
- ✅ Basic analytics

**Month 5: Assignment System**
- ✅ Assignment creation
- ✅ Assignment submission
- ✅ Grading system
- ✅ Feedback mechanism
- ✅ Student reports

**Deliverable**: Full LMS with teacher-student model

---

### Phase 3: Enhanced Visualization (Month 6)

- ✅ Tree diagram mode
- ✅ Card stack mode
- ✅ Timeline mode
- ✅ Mode switcher UI
- ✅ User preference system

**Deliverable**: Multiple visualization styles

---

### Phase 4: Gamification (Month 7)

- ✅ XP system
- ✅ Badge system
- ✅ Streak tracking
- ✅ Leaderboards
- ✅ Achievements
- ✅ Social features

**Deliverable**: Engaging gamified experience

---

### Phase 5: Advanced Content (Months 8-10)

- ✅ Curriculum Level 3-6
- ✅ 200+ additional lessons
- ✅ 500+ exercises
- ✅ Video explanations
- ✅ Audio integration
- ✅ Advanced parsing tools

**Deliverable**: Complete beginner to advanced curriculum

---

### Phase 6: Polish & Launch (Months 11-12)

- ✅ Performance optimization
- ✅ Mobile app refinement
- ✅ Comprehensive testing
- ✅ User acceptance testing
- ✅ Documentation
- ✅ Marketing materials
- ✅ App store submission
- ✅ Public launch

**Deliverable**: Production-ready platform

---

### Phase 7: Post-Launch (Ongoing)

- ✅ Expert level content (Levels 7-10)
- ✅ Community features
- ✅ Advanced analytics
- ✅ AI-powered recommendations
- ✅ Continuous improvement

---

## APPENDIX A: Sample Data

### Sample Lesson JSON

[Already provided in Section 3.2]

### Sample Exercise JSON

[Already provided in exercises section]

---

## APPENDIX B: Technology Research

### Comparison: React Native vs Flutter

| Feature | React Native | Flutter |
|---------|--------------|---------|
| Language | JavaScript/TypeScript | Dart |
| Performance | Good (native components) | Excellent (compiled) |
| Learning Curve | Lower (web devs) | Higher |
| Code Sharing | High (web + mobile) | Medium |
| Community | Larger | Growing |
| RTL Support | Good | Excellent |
| Arabic Text | Good | Excellent |

**Recommendation**: React Native (better web code sharing)

---

## APPENDIX C: Estimated Costs

### Development Team (12 months)
- 1 Senior Full-Stack Developer: $120k
- 1 Mobile Developer: $100k
- 1 UI/UX Designer: $80k
- 1 Arabic Content Creator: $60k
- 1 Project Manager: $90k
- 1 QA Engineer: $70k

**Total**: ~$520k

### Infrastructure (Annual)
- Hosting (AWS/GCP): $5k - $15k
- CDN: $2k - $5k
- Database: Included
- Email/SMS: $1k - $3k
- Analytics: $2k - $5k
- Misc: $2k

**Total**: ~$12k - $30k/year

### One-Time Costs
- Design assets: $5k
- Legal/incorporation: $3k
- App store fees: $200

**Total**: ~$8k

---

## CONCLUSION

This design provides a complete, production-ready architecture for a Quranic Arabic Grammar LMS with:

✅ **Flexible database** supporting multiple UI modes
✅ **Complete curriculum** from day 1 to expert
✅ **Dual learning modes** (self-paced + teacher-led)
✅ **Authentic content** from scholarly sources
✅ **Modern tech stack** (web + mobile)
✅ **Scalable architecture** for growth
✅ **Engaging features** (gamification, social)
✅ **Teacher tools** (classrooms, assignments, analytics)

**Ready for implementation.**

---

**Document End**
