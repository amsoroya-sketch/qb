-- CreateEnum
CREATE TYPE "AchievementRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('TOPIC', 'COMPREHENSIVE', 'DIAGNOSTIC', 'PRACTICE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ExerciseType" ADD VALUE 'MORPHEME_IDENTIFICATION';
ALTER TYPE "ExerciseType" ADD VALUE 'VERB_CONJUGATION';
ALTER TYPE "ExerciseType" ADD VALUE 'NOUN_DECLENSION';
ALTER TYPE "ExerciseType" ADD VALUE 'ROOT_EXTRACTION';
ALTER TYPE "ExerciseType" ADD VALUE 'SENTENCE_TYPE';
ALTER TYPE "ExerciseType" ADD VALUE 'SYNTACTIC_ROLE';
ALTER TYPE "ExerciseType" ADD VALUE 'PHRASE_GROUPING';
ALTER TYPE "ExerciseType" ADD VALUE 'AGREEMENT_CHECKING';
ALTER TYPE "ExerciseType" ADD VALUE 'I3RAB_ANALYSIS';
ALTER TYPE "ExerciseType" ADD VALUE 'MORPHEME_SEGMENTATION';
ALTER TYPE "ExerciseType" ADD VALUE 'DEPENDENCY_TREE';

-- AlterTable
ALTER TABLE "achievements" ADD COLUMN     "rarity" "AchievementRarity" NOT NULL DEFAULT 'COMMON';

-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "metadata" JSONB;

-- CreateTable
CREATE TABLE "quizzes" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "title_arabic" VARCHAR(255),
    "description" TEXT,
    "type" "QuizType" NOT NULL,
    "lesson_id" UUID,
    "stage" SMALLINT,
    "track" "Track",
    "minPassScore" INTEGER NOT NULL DEFAULT 80,
    "timeLimit" SMALLINT,
    "xpReward" INTEGER NOT NULL DEFAULT 50,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "question_arabic" TEXT,
    "type" "ExerciseType" NOT NULL,
    "options" JSONB,
    "correct_answer" TEXT NOT NULL,
    "explanation" TEXT,
    "grammar_focus" VARCHAR(50),
    "verse_reference" VARCHAR(20),
    "word_position" SMALLINT,
    "order" SMALLINT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "quiz_id" UUID NOT NULL,
    "score" SMALLINT NOT NULL,
    "answers" JSONB NOT NULL,
    "time_spent" INTEGER NOT NULL,
    "xp_earned" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "completed_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_grammar_stats" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "grammar_focus" VARCHAR(50) NOT NULL,
    "total_attempts" INTEGER NOT NULL DEFAULT 0,
    "correct_attempts" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "last_practiced" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_grammar_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "quizzes_type_stage_idx" ON "quizzes"("type", "stage");

-- CreateIndex
CREATE INDEX "quizzes_lesson_id_idx" ON "quizzes"("lesson_id");

-- CreateIndex
CREATE INDEX "quiz_questions_quiz_id_order_idx" ON "quiz_questions"("quiz_id", "order");

-- CreateIndex
CREATE INDEX "quiz_questions_grammar_focus_idx" ON "quiz_questions"("grammar_focus");

-- CreateIndex
CREATE INDEX "quiz_attempts_user_id_quiz_id_idx" ON "quiz_attempts"("user_id", "quiz_id");

-- CreateIndex
CREATE INDEX "quiz_attempts_user_id_completed_at_idx" ON "quiz_attempts"("user_id", "completed_at");

-- CreateIndex
CREATE INDEX "user_grammar_stats_user_id_accuracy_idx" ON "user_grammar_stats"("user_id", "accuracy");

-- CreateIndex
CREATE INDEX "user_grammar_stats_grammar_focus_idx" ON "user_grammar_stats"("grammar_focus");

-- CreateIndex
CREATE UNIQUE INDEX "user_grammar_stats_user_id_grammar_focus_key" ON "user_grammar_stats"("user_id", "grammar_focus");

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_grammar_stats" ADD CONSTRAINT "user_grammar_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
