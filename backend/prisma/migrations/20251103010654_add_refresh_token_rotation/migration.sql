-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Track" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'TRUE_FALSE', 'MATCHING', 'DRAG_DROP', 'WORD_ANALYSIS');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "family_id" UUID NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMPTZ,
    "used_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "current_xp" INTEGER NOT NULL DEFAULT 0,
    "current_level" INTEGER NOT NULL DEFAULT 1,
    "current_streak" INTEGER NOT NULL DEFAULT 0,
    "longest_streak" INTEGER NOT NULL DEFAULT 0,
    "last_active_date" DATE,
    "lessons_completed" INTEGER NOT NULL DEFAULT 0,
    "exercises_completed" INTEGER NOT NULL DEFAULT 0,
    "total_time_spent" INTEGER NOT NULL DEFAULT 0,
    "averageAccuracy" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "title_arabic" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "content_arabic" TEXT,
    "track" "Track" NOT NULL,
    "stage" SMALLINT NOT NULL,
    "order" SMALLINT NOT NULL,
    "grammar_topic" VARCHAR(100) NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "estimated_time" SMALLINT NOT NULL,
    "xp_reward" INTEGER NOT NULL DEFAULT 50,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_prerequisites" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "prerequisite_id" UUID NOT NULL,

    CONSTRAINT "lesson_prerequisites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_lesson_progress" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "status" "LessonStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "started_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "time_spent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_lesson_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "question" TEXT NOT NULL,
    "question_arabic" TEXT,
    "options" JSONB,
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "order" SMALLINT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "xp_reward" INTEGER NOT NULL DEFAULT 10,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_exercises" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "exercise_id" UUID NOT NULL,
    "user_answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "accuracy" DECIMAL(5,2) NOT NULL,
    "time_spent" INTEGER NOT NULL,
    "xp_earned" INTEGER NOT NULL,
    "attempt_number" INTEGER NOT NULL DEFAULT 1,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quran_verses" (
    "id" UUID NOT NULL,
    "surah_number" SMALLINT NOT NULL,
    "verse_number" SMALLINT NOT NULL,
    "text_arabic" TEXT NOT NULL,
    "text_without_diacritics" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "transliteration" TEXT,
    "search_vector_ar" TEXT,
    "search_vector_en" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quran_verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verse_words" (
    "id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL,
    "arabic_text" VARCHAR(100) NOT NULL,
    "text_without_diacritics" VARCHAR(100) NOT NULL,
    "translation" VARCHAR(255) NOT NULL,
    "transliteration" VARCHAR(255),
    "pos_type" VARCHAR(20) NOT NULL,
    "pos_arabic" VARCHAR(50),
    "gender" VARCHAR(10),
    "gender_arabic" VARCHAR(20),
    "number" VARCHAR(10),
    "number_arabic" VARCHAR(20),
    "definiteness" VARCHAR(20),
    "definiteness_arabic" VARCHAR(20),
    "irab_case" VARCHAR(20),
    "irab_case_arabic" VARCHAR(20),
    "case_sign" VARCHAR(20),
    "case_sign_arabic" VARCHAR(20),
    "case_sign_symbol" VARCHAR(5),
    "structure_type" VARCHAR(50),
    "structure_type_arabic" VARCHAR(50),
    "grammar_data" JSONB,
    "root" VARCHAR(10),
    "lemma" VARCHAR(100),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verse_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson_verses" (
    "id" UUID NOT NULL,
    "lesson_id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,
    "order" SMALLINT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "lesson_verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_arabic" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "icon" VARCHAR(255) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "requirement" JSONB NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "achievement_id" UUID NOT NULL,
    "unlocked_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_events" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    "lesson_id" UUID,
    "exercise_id" UUID,
    "accuracy" DECIMAL(5,2),
    "time_spent" INTEGER,
    "xp_earned" INTEGER,

    CONSTRAINT "user_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_hash_idx" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_key" ON "user_progress"("user_id");

-- CreateIndex
CREATE INDEX "lessons_track_stage_order_idx" ON "lessons"("track", "stage", "order");

-- CreateIndex
CREATE INDEX "lessons_grammar_topic_idx" ON "lessons"("grammar_topic");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_prerequisites_lesson_id_prerequisite_id_key" ON "lesson_prerequisites"("lesson_id", "prerequisite_id");

-- CreateIndex
CREATE INDEX "user_lesson_progress_user_id_status_idx" ON "user_lesson_progress"("user_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "user_lesson_progress_user_id_lesson_id_key" ON "user_lesson_progress"("user_id", "lesson_id");

-- CreateIndex
CREATE INDEX "exercises_lesson_id_order_idx" ON "exercises"("lesson_id", "order");

-- CreateIndex
CREATE INDEX "user_exercises_user_id_exercise_id_idx" ON "user_exercises"("user_id", "exercise_id");

-- CreateIndex
CREATE INDEX "user_exercises_user_id_completed_at_idx" ON "user_exercises"("user_id", "completed_at");

-- CreateIndex
CREATE INDEX "quran_verses_surah_number_idx" ON "quran_verses"("surah_number");

-- CreateIndex
CREATE UNIQUE INDEX "quran_verses_surah_number_verse_number_key" ON "quran_verses"("surah_number", "verse_number");

-- CreateIndex
CREATE INDEX "verse_words_verse_id_position_idx" ON "verse_words"("verse_id", "position");

-- CreateIndex
CREATE INDEX "verse_words_root_idx" ON "verse_words"("root");

-- CreateIndex
CREATE INDEX "verse_words_pos_type_idx" ON "verse_words"("pos_type");

-- CreateIndex
CREATE UNIQUE INDEX "lesson_verses_lesson_id_verse_id_key" ON "lesson_verses"("lesson_id", "verse_id");

-- CreateIndex
CREATE INDEX "user_achievements_user_id_unlocked_at_idx" ON "user_achievements"("user_id", "unlocked_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_achievements_user_id_achievement_id_key" ON "user_achievements"("user_id", "achievement_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_verse_id_key" ON "bookmarks"("user_id", "verse_id");

-- CreateIndex
CREATE INDEX "user_events_user_id_timestamp_idx" ON "user_events"("user_id", "timestamp");

-- CreateIndex
CREATE INDEX "user_events_event_type_idx" ON "user_events"("event_type");

-- CreateIndex
CREATE INDEX "user_events_lesson_id_idx" ON "user_events"("lesson_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_prerequisites" ADD CONSTRAINT "lesson_prerequisites_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_prerequisites" ADD CONSTRAINT "lesson_prerequisites_prerequisite_id_fkey" FOREIGN KEY ("prerequisite_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lesson_progress" ADD CONSTRAINT "user_lesson_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercises" ADD CONSTRAINT "user_exercises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exercises" ADD CONSTRAINT "user_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verse_words" ADD CONSTRAINT "verse_words_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "quran_verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_verses" ADD CONSTRAINT "lesson_verses_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_verses" ADD CONSTRAINT "lesson_verses_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "quran_verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "quran_verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
