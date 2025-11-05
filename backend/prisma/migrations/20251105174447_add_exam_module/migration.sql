-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('STAGE_COMPLETION', 'FINAL_ASSESSMENT', 'CERTIFICATION');

-- CreateTable
CREATE TABLE "exams" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "title_arabic" VARCHAR(255),
    "description" TEXT,
    "type" "ExamType" NOT NULL,
    "stage" SMALLINT NOT NULL,
    "track" "Track" NOT NULL,
    "min_pass_score" INTEGER NOT NULL DEFAULT 85,
    "timeLimit" SMALLINT NOT NULL,
    "xp_reward" INTEGER NOT NULL DEFAULT 150,
    "certificate_template" TEXT,
    "retake_cooldown" INTEGER NOT NULL DEFAULT 86400,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,
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

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "exam_id" UUID NOT NULL,
    "score" SMALLINT NOT NULL,
    "answers" JSONB NOT NULL,
    "time_spent" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "certificate_url" TEXT,
    "xp_earned" INTEGER NOT NULL,
    "started_at" TIMESTAMPTZ NOT NULL,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "exam_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exams_type_stage_idx" ON "exams"("type", "stage");

-- CreateIndex
CREATE INDEX "exams_track_stage_idx" ON "exams"("track", "stage");

-- CreateIndex
CREATE INDEX "exam_questions_exam_id_order_idx" ON "exam_questions"("exam_id", "order");

-- CreateIndex
CREATE INDEX "exam_questions_grammar_focus_idx" ON "exam_questions"("grammar_focus");

-- CreateIndex
CREATE INDEX "exam_attempts_user_id_exam_id_idx" ON "exam_attempts"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "exam_attempts_user_id_completed_at_idx" ON "exam_attempts"("user_id", "completed_at");

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
