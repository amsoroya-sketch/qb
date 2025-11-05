-- Grammar Gamification Features Migration
-- This migration adds SRS, Grammar Reference Library, Leaderboards, and Daily Challenges
-- Part of Grammar Gamification Implementation Plan Phase 1

-- ================== Create New Enums ==================

-- SRS Card States for Spaced Repetition System
DO $$ BEGIN
    CREATE TYPE "SRSState" AS ENUM ('NEW', 'LEARNING', 'REVIEW', 'RELEARNING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Leaderboard Types for competitive features
DO $$ BEGIN
    CREATE TYPE "LeaderboardType" AS ENUM ('GLOBAL', 'WEEKLY', 'FRIENDS', 'GRAMMAR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ================== Create SRS Tables ==================

-- SRSCard: Tracks spaced repetition cards for grammar concepts
CREATE TABLE IF NOT EXISTS "srs_cards" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "content_type" VARCHAR(50) NOT NULL,
    "content_id" UUID NOT NULL,
    "ease_factor" DECIMAL(4,2) NOT NULL DEFAULT 2.50,
    "interval_days" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "state" "SRSState" NOT NULL DEFAULT 'NEW',
    "due_date" TIMESTAMPTZ NOT NULL,
    "last_reviewed" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "srs_cards_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "srs_cards_user_id_content_type_content_id_key" UNIQUE ("user_id", "content_type", "content_id")
);

-- SRSReview: Tracks individual review sessions
CREATE TABLE IF NOT EXISTS "srs_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "card_id" UUID NOT NULL,
    "quality" SMALLINT NOT NULL,
    "time_spent" INTEGER NOT NULL,
    "old_ease_factor" DECIMAL(4,2) NOT NULL,
    "old_interval" INTEGER NOT NULL,
    "new_ease_factor" DECIMAL(4,2) NOT NULL,
    "new_interval" INTEGER NOT NULL,
    "reviewed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "srs_reviews_pkey" PRIMARY KEY ("id")
);

-- ================== Create Grammar Rules Table ==================

-- GrammarRule: Static reference library for 70 grammar rules
CREATE TABLE IF NOT EXISTS "grammar_rules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rule_id" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "title_arabic" VARCHAR(255) NOT NULL,
    "level" SMALLINT NOT NULL,
    "order" SMALLINT NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "explanation_beginner" TEXT NOT NULL,
    "explanation_intermediate" TEXT,
    "explanation_advanced" TEXT,
    "examples" JSONB NOT NULL,
    "prerequisite_rules" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "related_rules" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "difficulty" "Difficulty" NOT NULL,
    "estimated_time" SMALLINT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "grammar_rules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "grammar_rules_rule_id_key" UNIQUE ("rule_id")
);

-- ================== Create Leaderboard Table ==================

-- LeaderboardEntry: Tracks user rankings across different leaderboards
CREATE TABLE IF NOT EXISTS "leaderboard_entries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "board_type" "LeaderboardType" NOT NULL,
    "period" VARCHAR(20) NOT NULL,
    "score" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "user_name" VARCHAR(255) NOT NULL,
    "user_level" INTEGER NOT NULL,
    "calculated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "leaderboard_entries_user_id_board_type_period_key" UNIQUE ("user_id", "board_type", "period")
);

-- ================== Create Daily Challenge Tables ==================

-- DailyChallenge: Daily grammar challenges for engagement
CREATE TABLE IF NOT EXISTS "daily_challenges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "date" DATE NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "title_arabic" VARCHAR(255),
    "description" TEXT NOT NULL,
    "grammar_focus" VARCHAR(50) NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "questions" JSONB NOT NULL,
    "xp_reward" INTEGER NOT NULL DEFAULT 30,
    "bonus_xp" INTEGER NOT NULL DEFAULT 20,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_challenges_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "daily_challenges_date_key" UNIQUE ("date")
);

-- UserDailyChallenge: Tracks user attempts at daily challenges
CREATE TABLE IF NOT EXISTS "user_daily_challenges" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "challenge_id" UUID NOT NULL,
    "score" SMALLINT NOT NULL,
    "answers" JSONB NOT NULL,
    "time_spent" INTEGER NOT NULL,
    "xp_earned" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "perfect_score" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_daily_challenges_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_daily_challenges_user_id_challenge_id_key" UNIQUE ("user_id", "challenge_id")
);

-- ================== Create Indexes ==================

-- SRS Card indexes for performance
CREATE INDEX IF NOT EXISTS "srs_cards_user_id_due_date_idx" ON "srs_cards"("user_id", "due_date");
CREATE INDEX IF NOT EXISTS "srs_cards_user_id_state_idx" ON "srs_cards"("user_id", "state");
CREATE INDEX IF NOT EXISTS "srs_cards_state_due_date_idx" ON "srs_cards"("state", "due_date");
CREATE INDEX IF NOT EXISTS "srs_cards_content_type_content_id_idx" ON "srs_cards"("content_type", "content_id");

-- SRS Review indexes
CREATE INDEX IF NOT EXISTS "srs_reviews_card_id_reviewed_at_idx" ON "srs_reviews"("card_id", "reviewed_at");

-- Grammar Rules indexes for browsing and search
CREATE INDEX IF NOT EXISTS "grammar_rules_level_order_idx" ON "grammar_rules"("level", "order");
CREATE INDEX IF NOT EXISTS "grammar_rules_category_idx" ON "grammar_rules"("category");
CREATE INDEX IF NOT EXISTS "grammar_rules_rule_id_idx" ON "grammar_rules"("rule_id");

-- Leaderboard indexes for ranking queries
CREATE INDEX IF NOT EXISTS "leaderboard_entries_board_type_period_rank_idx" ON "leaderboard_entries"("board_type", "period", "rank");
CREATE INDEX IF NOT EXISTS "leaderboard_entries_user_id_board_type_idx" ON "leaderboard_entries"("user_id", "board_type");

-- Daily Challenge indexes
CREATE INDEX IF NOT EXISTS "daily_challenges_date_idx" ON "daily_challenges"("date");
CREATE INDEX IF NOT EXISTS "user_daily_challenges_user_id_completed_at_idx" ON "user_daily_challenges"("user_id", "completed_at");

-- ================== Add Foreign Key Constraints ==================

-- SRS Card foreign keys
DO $$ BEGIN
    ALTER TABLE "srs_cards" ADD CONSTRAINT "srs_cards_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- SRS Review foreign keys
DO $$ BEGIN
    ALTER TABLE "srs_reviews" ADD CONSTRAINT "srs_reviews_card_id_fkey"
        FOREIGN KEY ("card_id") REFERENCES "srs_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Leaderboard foreign keys
DO $$ BEGIN
    ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Daily Challenge foreign keys
DO $$ BEGIN
    ALTER TABLE "user_daily_challenges" ADD CONSTRAINT "user_daily_challenges_user_id_fkey"
        FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "user_daily_challenges" ADD CONSTRAINT "user_daily_challenges_challenge_id_fkey"
        FOREIGN KEY ("challenge_id") REFERENCES "daily_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ================== Migration Summary ==================
-- Tables Added: 6
--   1. srs_cards - Spaced Repetition System cards
--   2. srs_reviews - SRS review history
--   3. grammar_rules - Grammar reference library (70 rules)
--   4. leaderboard_entries - User rankings
--   5. daily_challenges - Daily grammar challenges
--   6. user_daily_challenges - User challenge attempts
--
-- Enums Added: 2
--   1. SRSState - NEW, LEARNING, REVIEW, RELEARNING
--   2. LeaderboardType - GLOBAL, WEEKLY, FRIENDS, GRAMMAR
--
-- Indexes Added: 12 (optimized for common query patterns)
-- Foreign Keys Added: 5 (all with CASCADE delete)
--
-- Expected Impact:
--   - Enables spaced repetition learning system
--   - Provides 70-rule grammar reference library
--   - Adds competitive leaderboards (4 types)
--   - Implements daily engagement challenges
--   - Supports +60% retention rate target
--   - Enables +40% engagement improvement goal
