import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed 15 diverse achievements for the arQ platform
 */

const achievements = [
  // LEARNING achievements
  {
    name: 'First Steps',
    nameArabic: 'الخطوات الأولى',
    description: 'Complete your first lesson',
    icon: 'trophy',
    category: 'learning',
    rarity: 'COMMON',
    xpReward: 50,
    requirement: { type: 'lessons_completed', count: 1 },
  },
  {
    name: 'Lesson Explorer',
    nameArabic: 'مستكشف الدروس',
    description: 'Complete 10 lessons',
    icon: 'book-open',
    category: 'learning',
    rarity: 'COMMON',
    xpReward: 100,
    requirement: { type: 'lessons_completed', count: 10 },
  },
  {
    name: 'Dedicated Learner',
    nameArabic: 'المتعلم المتفاني',
    description: 'Complete 25 lessons',
    icon: 'graduation-cap',
    category: 'learning',
    rarity: 'RARE',
    xpReward: 250,
    requirement: { type: 'lessons_completed', count: 25 },
  },
  {
    name: 'Grammar Master',
    nameArabic: 'أستاذ النحو',
    description: 'Complete 50 lessons',
    icon: 'crown',
    category: 'learning',
    rarity: 'EPIC',
    xpReward: 500,
    requirement: { type: 'lessons_completed', count: 50 },
  },

  // PRACTICE achievements
  {
    name: 'Practice Makes Perfect',
    nameArabic: 'الممارسة تصنع الإتقان',
    description: 'Complete 50 exercises',
    icon: 'target',
    category: 'practice',
    rarity: 'COMMON',
    xpReward: 75,
    requirement: { type: 'exercises_completed', count: 50 },
  },
  {
    name: 'Exercise Enthusiast',
    nameArabic: 'عاشق التمارين',
    description: 'Complete 200 exercises',
    icon: 'zap',
    category: 'practice',
    rarity: 'RARE',
    xpReward: 200,
    requirement: { type: 'exercises_completed', count: 200 },
  },
  {
    name: 'Practice Champion',
    nameArabic: 'بطل الممارسة',
    description: 'Complete 500 exercises',
    icon: 'star',
    category: 'practice',
    rarity: 'EPIC',
    xpReward: 400,
    requirement: { type: 'exercises_completed', count: 500 },
  },

  // STREAK achievements
  {
    name: 'Consistent Learner',
    nameArabic: 'المتعلم المنتظم',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    category: 'streak',
    rarity: 'COMMON',
    xpReward: 100,
    requirement: { type: 'streak', count: 7 },
  },
  {
    name: 'Dedication Award',
    nameArabic: 'جائزة التفاني',
    description: 'Maintain a 30-day streak',
    icon: 'award',
    category: 'streak',
    rarity: 'RARE',
    xpReward: 300,
    requirement: { type: 'streak', count: 30 },
  },
  {
    name: 'Unstoppable Force',
    nameArabic: 'القوة التي لا تقهر',
    description: 'Maintain a 100-day streak',
    icon: 'trophy',
    category: 'streak',
    rarity: 'LEGENDARY',
    xpReward: 1000,
    requirement: { type: 'streak', count: 100 },
  },

  // ACCURACY achievements
  {
    name: 'Sharp Mind',
    nameArabic: 'العقل الحاد',
    description: 'Achieve 90% average accuracy',
    icon: 'crosshair',
    category: 'accuracy',
    rarity: 'RARE',
    xpReward: 150,
    requirement: { type: 'average_accuracy', value: 90 },
  },
  {
    name: 'Perfection Seeker',
    nameArabic: 'الساعي للكمال',
    description: 'Achieve 95% average accuracy',
    icon: 'star',
    category: 'accuracy',
    rarity: 'EPIC',
    xpReward: 300,
    requirement: { type: 'average_accuracy', value: 95 },
  },

  // XP achievements
  {
    name: 'Rising Star',
    nameArabic: 'النجم الصاعد',
    description: 'Reach Level 5',
    icon: 'trending-up',
    category: 'level',
    rarity: 'COMMON',
    xpReward: 100,
    requirement: { type: 'level', level: 5 },
  },
  {
    name: 'Advanced Scholar',
    nameArabic: 'الباحث المتقدم',
    description: 'Reach Level 10',
    icon: 'book',
    category: 'level',
    rarity: 'RARE',
    xpReward: 250,
    requirement: { type: 'level', level: 10 },
  },
  {
    name: 'Elite Linguist',
    nameArabic: 'اللغوي النخبوي',
    description: 'Reach Level 20',
    icon: 'crown',
    category: 'level',
    rarity: 'LEGENDARY',
    xpReward: 1000,
    requirement: { type: 'level', level: 20 },
  },
];

async function seedAchievements() {
  console.log('🏆 Starting seed: Achievements...\n');

  let createdCount = 0;
  let skippedCount = 0;

  for (const achievementData of achievements) {
    try {
      // Check if achievement already exists
      const existing = await prisma.achievement.findFirst({
        where: { name: achievementData.name },
      });

      if (existing) {
        console.log(`⏭️  Skipped: "${achievementData.name}" (already exists)`);
        skippedCount++;
        continue;
      }

      await prisma.achievement.create({
        data: achievementData,
      });

      console.log(`✅ Created: "${achievementData.name}" (${achievementData.rarity}, ${achievementData.xpReward} XP)`);
      createdCount++;

    } catch (error) {
      console.error(`❌ Error creating "${achievementData.name}":`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Created: ${createdCount} achievements`);
  console.log(`   ⏭️  Skipped: ${skippedCount} achievements (already exist)`);
}

async function main() {
  try {
    await seedAchievements();
    console.log('\n✨ Achievements seed completed!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
