import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('=== DATA INTEGRITY VERIFICATION ===\n');

  // Count check
  const verses = await prisma.quranVerse.count();
  const words = await prisma.verseWord.count();
  console.log('Total verses:', verses);
  console.log('Total words:', words);
  console.log(
    verses === 6236 && words === 77429 ? '✅ Count check PASSED' : '❌ Count check FAILED',
  );

  // Sample verse (Al-Fatiha 1:1)
  console.log('\n=== Sample Verse: Al-Fatiha 1:1 (Bismillah) ===');
  const verse = await prisma.quranVerse.findFirst({
    where: { surahNumber: 1, verseNumber: 1 },
    include: { words: { orderBy: { position: 'asc' } } },
  });

  if (verse) {
    console.log('Arabic:', verse.textArabic);
    console.log('Translation:', verse.translation);
    console.log('Words:', verse.words.length);
    console.log('\nWord Breakdown:');
    verse.words.forEach((w) => {
      console.log(
        `  [${w.position}] ${w.arabicText} → ${w.translation} (${w.posType}, root: ${w.root || 'N/A'})`,
      );
    });
  }

  // POS distribution
  console.log('\n=== POS Distribution ===');
  const posTypes = await prisma.verseWord.groupBy({
    by: ['posType'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  posTypes.forEach((p) => {
    console.log(`${p.posType}: ${p._count.id.toLocaleString()}`);
  });

  // Words with roots
  const wordsWithRoots = await prisma.verseWord.count({ where: { root: { not: null } } });
  const coverage = ((wordsWithRoots / words) * 100).toFixed(2);
  console.log(`\nWords with root data: ${wordsWithRoots.toLocaleString()} (${coverage}%)`);

  console.log('\n✅ Data verification complete!');
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
