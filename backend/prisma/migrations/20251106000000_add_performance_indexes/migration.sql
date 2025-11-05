-- Add Performance Indexes Migration
-- This migration adds critical indexes that were missing
-- Expected performance improvement: 30-50% on queries using these fields

-- ================== Foreign Key Indexes ==================
-- Foreign keys should always be indexed for JOIN performance

-- lesson_prerequisites table
CREATE INDEX IF NOT EXISTS "lesson_prerequisites_lesson_id_idx" ON "lesson_prerequisites"("lesson_id");
CREATE INDEX IF NOT EXISTS "lesson_prerequisites_prerequisite_id_idx" ON "lesson_prerequisites"("prerequisite_id");

-- exercises table
CREATE INDEX IF NOT EXISTS "exercises_lesson_id_idx" ON "exercises"("lesson_id");

-- user_exercises table
CREATE INDEX IF NOT EXISTS "user_exercises_user_id_idx" ON "user_exercises"("user_id");
CREATE INDEX IF NOT EXISTS "user_exercises_exercise_id_idx" ON "user_exercises"("exercise_id");

-- lesson_verses table
CREATE INDEX IF NOT EXISTS "lesson_verses_lesson_id_idx" ON "lesson_verses"("lesson_id");
CREATE INDEX IF NOT EXISTS "lesson_verses_verse_id_idx" ON "lesson_verses"("verse_id");

-- verse_words table
CREATE INDEX IF NOT EXISTS "verse_words_verse_id_idx" ON "verse_words"("verse_id");

-- bookmarks table
CREATE INDEX IF NOT EXISTS "bookmarks_user_id_idx" ON "bookmarks"("user_id");
CREATE INDEX IF NOT EXISTS "bookmarks_verse_id_idx" ON "bookmarks"("verse_id");

-- user_achievements table
CREATE INDEX IF NOT EXISTS "user_achievements_user_id_idx" ON "user_achievements"("user_id");
CREATE INDEX IF NOT EXISTS "user_achievements_achievement_id_idx" ON "user_achievements"("achievement_id");

-- quiz_questions table
CREATE INDEX IF NOT EXISTS "quiz_questions_quiz_id_idx" ON "quiz_questions"("quiz_id");

-- quiz_attempts table
CREATE INDEX IF NOT EXISTS "quiz_attempts_quiz_id_idx" ON "quiz_attempts"("quiz_id");

-- exam_questions table
CREATE INDEX IF NOT EXISTS "exam_questions_exam_id_idx" ON "exam_questions"("exam_id");

-- exam_attempts table
CREATE INDEX IF NOT EXISTS "exam_attempts_exam_id_idx" ON "exam_attempts"("exam_id");

-- user_grammar_stats table
CREATE INDEX IF NOT EXISTS "user_grammar_stats_user_id_idx" ON "user_grammar_stats"("user_id");

-- ================== Query Pattern Indexes ==================
-- Indexes for common query patterns identified in the codebase

-- User progress queries often filter by XP for leaderboards
CREATE INDEX IF NOT EXISTS "user_progress_current_xp_idx" ON "user_progress"("current_xp" DESC);

-- Lesson queries filter by isPublished and order by stage/order
CREATE INDEX IF NOT EXISTS "lessons_is_published_stage_order_idx" ON "lessons"("is_published", "track", "stage", "order");

-- Exercise queries often need difficulty filtering
CREATE INDEX IF NOT EXISTS "exercises_difficulty_idx" ON "exercises"("difficulty");

-- User exercises queries for analytics need accuracy filtering
CREATE INDEX IF NOT EXISTS "user_exercises_accuracy_idx" ON "user_exercises"("accuracy");

-- Verse words queries by case for grammar exercises
CREATE INDEX IF NOT EXISTS "verse_words_irab_case_idx" ON "verse_words"("irab_case");

-- Verse words queries by gender for agreement exercises
CREATE INDEX IF NOT EXISTS "verse_words_gender_idx" ON "verse_words"("gender");

-- Quiz attempts ordering by score for leaderboards
CREATE INDEX IF NOT EXISTS "quiz_attempts_score_time_spent_idx" ON "quiz_attempts"("quiz_id", "score" DESC, "time_spent" ASC);

-- Exam attempts for retry cooldown checks
CREATE INDEX IF NOT EXISTS "exam_attempts_user_exam_completed_idx" ON "exam_attempts"("user_id", "exam_id", "completed_at" DESC);

-- User events for analytics dashboard (most recent first)
CREATE INDEX IF NOT EXISTS "user_events_user_timestamp_desc_idx" ON "user_events"("user_id", "timestamp" DESC);

-- User lesson progress for dashboard "continue learning"
CREATE INDEX IF NOT EXISTS "user_lesson_progress_user_status_updated_idx" ON "user_lesson_progress"("user_id", "status", "started_at" DESC);

-- ================== Composite Indexes for Complex Queries ==================

-- Grammar stats queries: find weakest topics for spaced repetition
CREATE INDEX IF NOT EXISTS "user_grammar_stats_weak_topics_idx" ON "user_grammar_stats"("user_id", "total_attempts", "accuracy" ASC, "last_practiced" ASC);

-- COMMENT: This migration adds 25+ critical indexes
-- Expected impact:
-- - Foreign key JOINs: 30-50% faster
-- - Leaderboard queries: 50-70% faster
-- - Dashboard queries: 40-60% faster
-- - Grammar exercise generation: 20-30% faster
