-- AlterTable
ALTER TABLE "verse_words" ADD COLUMN     "dependency_relation" VARCHAR(50),
ADD COLUMN     "parent_word_id" UUID,
ADD COLUMN     "syntactic_role" VARCHAR(50),
ADD COLUMN     "syntactic_role_ar" VARCHAR(50);

-- CreateIndex
CREATE INDEX "verse_words_parent_word_id_idx" ON "verse_words"("parent_word_id");

-- CreateIndex
CREATE INDEX "verse_words_syntactic_role_idx" ON "verse_words"("syntactic_role");

-- AddForeignKey
ALTER TABLE "verse_words" ADD CONSTRAINT "verse_words_parent_word_id_fkey" FOREIGN KEY ("parent_word_id") REFERENCES "verse_words"("id") ON DELETE SET NULL ON UPDATE CASCADE;
