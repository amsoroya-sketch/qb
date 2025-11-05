import { PrismaClient, Track, Difficulty, ExerciseType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create admin user
  console.log('👤 Creating admin user...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@arq.com' },
    update: {},
    create: {
      email: 'admin@arq.com',
      password: await bcrypt.hash('Admin123@', 10),
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log(`✓ Admin created: ${admin.email}`);

  // Create test student
  console.log('\n👤 Creating test student...');
  const student = await prisma.user.upsert({
    where: { email: 'student@arq.com' },
    update: {},
    create: {
      email: 'student@arq.com',
      password: await bcrypt.hash('Student123@', 10),
      name: 'Ahmed Khan',
      role: 'STUDENT',
      progress: {
        create: {
          currentXP: 150,
          currentLevel: 2,
          currentStreak: 5,
          longestStreak: 10,
          lastActiveDate: new Date(),
          lessonsCompleted: 3,
          exercisesCompleted: 12,
          totalTimeSpent: 1800, // 30 minutes
          averageAccuracy: 85.5,
        },
      },
    },
  });
  console.log(`✓ Student created: ${student.email}`);

  // Create sample lessons for Track A
  console.log('\n📚 Creating Track A lessons...');

  const trackALessons = [
    {
      title: 'Introduction to Arabic Nouns (الاسم)',
      titleArabic: 'مقدمة في الأسماء العربية',
      description: 'Learn the fundamentals of Arabic nouns, their properties, and how to identify them in text.',
      content: `# Introduction to Arabic Nouns (الاسم)

## What is a Noun?

A noun (الاسم) in Arabic grammar is a word that names a person, place, thing, or concept. Unlike verbs, nouns do not indicate time.

## How to Identify a Noun

You can identify a noun by these characteristics:

1. **Tanween (تنوين)**: The doubling of short vowels at the end (ٌ، ٍ، ً)
2. **Definite Article (ال)**: The word can accept "al" at the beginning
3. **Jarr Prepositions**: Words like من، في، إلى can precede nouns

## Examples

- **كِتَابٌ** (kitābun) - a book
- **الْكِتَابُ** (al-kitābu) - the book
- **فِي الْبَيْتِ** (fī al-bayti) - in the house

## Practice

In the following exercises, you'll practice identifying nouns in Quranic verses.`,
      contentArabic: 'الاسم في اللغة العربية هو ما دل على معنى في نفسه غير مقترن بزمان...',
      track: Track.A,
      stage: 1,
      order: 1,
      grammarTopic: 'nouns',
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 15,
      xpReward: 50,
      isPublished: true,
    },
    {
      title: 'Arabic Verbs: Past Tense (الفعل الماضي)',
      titleArabic: 'الفعل الماضي',
      description: 'Understanding the past tense verb in Arabic, its structure and usage.',
      content: `# The Past Tense Verb (الفعل الماضي)

## Definition

The past tense verb (الفعل الماضي) indicates an action that has been completed in the past.

## Characteristics

1. Always ends with a fatha (َ)
2. Can be conjugated for different persons
3. The root letters remain constant

## Structure

The basic form uses three root letters:
- ك ت ب → كَتَبَ (he wrote)
- ق ر أ → قَرَأَ (he read)
- ذ ه ب → ذَهَبَ (he went)

## Examples from Quran

- **خَلَقَ** (khalaq) - He created
- **أَنزَلَ** (anzala) - He sent down
- **قَالَ** (qāla) - He said`,
      track: Track.A,
      stage: 1,
      order: 2,
      grammarTopic: 'verbs',
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 20,
      xpReward: 60,
      isPublished: true,
    },
    {
      title: 'Particles in Arabic (الحرف)',
      titleArabic: 'الحروف في اللغة العربية',
      description: 'Learn about particles and their role in Arabic grammar.',
      content: `# Particles (الحرف)

## What are Particles?

Particles (الحرف) are words that have meaning only when used with nouns or verbs. They cannot stand alone.

## Types of Particles

### 1. Prepositions (حروف الجر)
- من (from)
- إلى (to)
- في (in)
- على (on)
- عن (about)

### 2. Coordinating Particles
- و (and)
- ف (then)
- ثم (then, later)

### 3. Interrogative Particles
- هل (question marker)
- ما (what)

## Examples

- **في البيت** - in the house
- **من الله** - from Allah
- **هل تعلم** - do you know?`,
      track: Track.A,
      stage: 1,
      order: 3,
      grammarTopic: 'particles',
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 18,
      xpReward: 55,
      isPublished: true,
    },
  ];

  for (const lessonData of trackALessons) {
    const lesson = await prisma.lesson.create({
      data: lessonData,
    });
    console.log(`✓ Created: ${lesson.title}`);

    // Create exercises for each lesson
    const exercises = [
      {
        lessonId: lesson.id,
        title: 'Identify the Part of Speech',
        type: ExerciseType.MULTIPLE_CHOICE,
        question: `Which word in this phrase is a ${lesson.grammarTopic === 'nouns' ? 'noun' : lesson.grammarTopic === 'verbs' ? 'verb' : 'particle'}?`,
        questionArabic: 'أي كلمة في هذه العبارة؟',
        options: JSON.stringify(['الكتاب', 'قرأ', 'في']),
        correctAnswer: lesson.grammarTopic === 'nouns' ? 'الكتاب' : lesson.grammarTopic === 'verbs' ? 'قرأ' : 'في',
        explanation: `${lesson.grammarTopic === 'nouns' ? 'الكتاب (the book)' : lesson.grammarTopic === 'verbs' ? 'قرأ (read)' : 'في (in)'} is a ${lesson.grammarTopic === 'nouns' ? 'noun' : lesson.grammarTopic === 'verbs' ? 'verb' : 'particle'}`,
        order: 1,
        difficulty: Difficulty.BEGINNER,
        xpReward: 10,
      },
      {
        lessonId: lesson.id,
        title: 'True or False',
        type: ExerciseType.TRUE_FALSE,
        question: `Can you identify a ${lesson.grammarTopic === 'nouns' ? 'noun' : lesson.grammarTopic === 'verbs' ? 'verb' : 'particle'} by its form?`,
        correctAnswer: 'true',
        explanation: `Yes, ${lesson.grammarTopic === 'nouns' ? 'nouns' : lesson.grammarTopic === 'verbs' ? 'verbs' : 'particles'} have distinct characteristics that help identify them.`,
        order: 2,
        difficulty: Difficulty.BEGINNER,
        xpReward: 10,
      },
      {
        lessonId: lesson.id,
        title: 'Fill in the Blank',
        type: ExerciseType.FILL_IN_BLANK,
        question: `The Arabic word for ${lesson.grammarTopic === 'nouns' ? 'noun' : lesson.grammarTopic === 'verbs' ? 'verb' : 'particle'} is ____`,
        correctAnswer: lesson.grammarTopic === 'nouns' ? 'الاسم' : lesson.grammarTopic === 'verbs' ? 'الفعل' : 'الحرف',
        explanation: `In Arabic grammar, ${lesson.grammarTopic === 'nouns' ? 'الاسم' : lesson.grammarTopic === 'verbs' ? 'الفعل' : 'الحرف'} means ${lesson.grammarTopic === 'nouns' ? 'noun' : lesson.grammarTopic === 'verbs' ? 'verb' : 'particle'}`,
        order: 3,
        difficulty: Difficulty.INTERMEDIATE,
        xpReward: 15,
      },
    ];

    await prisma.exercise.createMany({
      data: exercises,
    });
    console.log(`  ✓ Added ${exercises.length} exercises`);
  }

  // Create Track B lessons (verse-based)
  console.log('\n📖 Creating Track B lessons...');

  const trackBLessons = [
    {
      title: 'Surah Al-Fatiha: Verse-by-Verse Analysis',
      titleArabic: 'تحليل سورة الفاتحة',
      description: 'Deep grammatical analysis of the opening chapter of the Quran.',
      content: `# Surah Al-Fatiha Analysis

## Bismillah ar-Rahman ar-Raheem

Let's analyze each word:

### بِسْمِ (bismi) - "In the name of"
- **POS**: Noun (اسم)
- **Structure**: Prepositional phrase
- **Case**: Genitive (مجرور)
- **Sign**: Kasra (ِ)

### اللَّهِ (Allahi) - "Allah"
- **POS**: Proper noun (علم)
- **Case**: Genitive (مجرور)
- **Sign**: Kasra (ِ)
- **Reason**: Mudaf ilayh (مضاف إليه)

Continue through each verse...`,
      track: Track.B,
      stage: 1,
      order: 1,
      grammarTopic: 'verse-analysis',
      difficulty: Difficulty.INTERMEDIATE,
      estimatedTime: 25,
      xpReward: 75,
      isPublished: true,
    },
  ];

  for (const lessonData of trackBLessons) {
    const lesson = await prisma.lesson.create({
      data: lessonData,
    });
    console.log(`✓ Created: ${lesson.title}`);
  }

  // Create sample Quran verses with word analysis
  console.log('\n📖 Creating sample Quran verses...');

  // Verse 1:1 with full word analysis
  const verse1_1 = await prisma.quranVerse.create({
    data: {
      surahNumber: 1,
      verseNumber: 1,
      textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      textWithoutDiacritics: 'بسم الله الرحمن الرحيم',
      translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
      transliteration: 'Bismillāhi r-raḥmāni r-raḥīm',
      words: {
        create: [
          {
            position: 1,
            arabicText: 'بِسْمِ',
            textWithoutDiacritics: 'بسم',
            translation: 'In the name of',
            transliteration: 'bismi',
            posType: 'Noun',
            posArabic: 'اسم',
            gender: 'Masculine',
            genderArabic: 'مذكر',
            number: 'Singular',
            numberArabic: 'مفرد',
            definiteness: 'Indefinite',
            definitenessArabic: 'نكرة',
            irabCase: 'Genitive',
            irabCaseArabic: 'مجرور',
            caseSign: 'Kasra',
            caseSignArabic: 'كسرة',
            caseSignSymbol: 'ِ',
            structureType: 'Prepositional phrase',
            structureTypeArabic: 'جار ومجرور',
            root: 'س م و',
            lemma: 'اسم',
          },
          {
            position: 2,
            arabicText: 'اللَّهِ',
            textWithoutDiacritics: 'الله',
            translation: 'Allah',
            transliteration: 'Allāhi',
            posType: 'Proper Noun',
            posArabic: 'اسم علم',
            gender: 'Masculine',
            genderArabic: 'مذكر',
            number: 'Singular',
            numberArabic: 'مفرد',
            definiteness: 'Definite',
            definitenessArabic: 'معرفة',
            irabCase: 'Genitive',
            irabCaseArabic: 'مجرور',
            caseSign: 'Kasra',
            caseSignArabic: 'كسرة',
            caseSignSymbol: 'ِ',
            structureType: 'Mudaf ilayh',
            structureTypeArabic: 'مضاف إليه',
            root: 'ل ه',
            lemma: 'الله',
          },
          {
            position: 3,
            arabicText: 'الرَّحْمَٰنِ',
            textWithoutDiacritics: 'الرحمن',
            translation: 'the Most Merciful',
            transliteration: 'ar-Raḥmāni',
            posType: 'Adjective',
            posArabic: 'صفة',
            gender: 'Masculine',
            genderArabic: 'مذكر',
            number: 'Singular',
            numberArabic: 'مفرد',
            definiteness: 'Definite',
            definitenessArabic: 'معرفة',
            irabCase: 'Genitive',
            irabCaseArabic: 'مجرور',
            caseSign: 'Kasra',
            caseSignArabic: 'كسرة',
            caseSignSymbol: 'ِ',
            structureType: 'Adjective',
            structureTypeArabic: 'صفة',
            root: 'ر ح م',
            lemma: 'رحمن',
          },
          {
            position: 4,
            arabicText: 'الرَّحِيمِ',
            textWithoutDiacritics: 'الرحيم',
            translation: 'the Especially Merciful',
            transliteration: 'ar-Raḥīmi',
            posType: 'Adjective',
            posArabic: 'صفة',
            gender: 'Masculine',
            genderArabic: 'مذكر',
            number: 'Singular',
            numberArabic: 'مفرد',
            definiteness: 'Definite',
            definitenessArabic: 'معرفة',
            irabCase: 'Genitive',
            irabCaseArabic: 'مجرور',
            caseSign: 'Kasra',
            caseSignArabic: 'كسرة',
            caseSignSymbol: 'ِ',
            structureType: 'Adjective',
            structureTypeArabic: 'صفة',
            root: 'ر ح م',
            lemma: 'رحيم',
          },
        ],
      },
    },
  });
  console.log(`✓ Created verse ${verse1_1.surahNumber}:${verse1_1.verseNumber} with 4 words`);

  // Other verses without word analysis (for now)
  const otherVerses = [
    {
      surahNumber: 1,
      verseNumber: 2,
      textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      textWithoutDiacritics: 'الحمد لله رب العالمين',
      translation: '[All] praise is [due] to Allah, Lord of the worlds',
      transliteration: 'Al-ḥamdu lillāhi rabbi l-ʿālamīn',
    },
    {
      surahNumber: 1,
      verseNumber: 3,
      textArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      textWithoutDiacritics: 'الرحمن الرحيم',
      translation: 'The Entirely Merciful, the Especially Merciful',
      transliteration: 'Ar-raḥmāni r-raḥīm',
    },
  ];

  for (const verseData of otherVerses) {
    const verse = await prisma.quranVerse.create({
      data: verseData,
    });
    console.log(`✓ Created verse ${verse.surahNumber}:${verse.verseNumber}`);
  }

  // Create sample achievements
  console.log('\n🏆 Creating achievements...');

  const achievements = [
    {
      name: 'First Steps',
      nameArabic: 'الخطوات الأولى',
      description: 'Complete your first lesson',
      icon: '🎓',
      category: 'learning',
      requirement: JSON.stringify({ type: 'lessons_completed', count: 1 }),
      xpReward: 25,
    },
    {
      name: 'Grammar Novice',
      nameArabic: 'مبتدئ النحو',
      description: 'Complete 10 lessons',
      icon: '📚',
      category: 'learning',
      requirement: JSON.stringify({ type: 'lessons_completed', count: 10 }),
      xpReward: 100,
    },
    {
      name: 'Streak Master',
      nameArabic: 'سيد الاستمرارية',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'engagement',
      requirement: JSON.stringify({ type: 'streak', count: 7 }),
      xpReward: 150,
    },
    {
      name: 'Perfect Score',
      nameArabic: 'الدرجة الكاملة',
      description: 'Get 100% on any exercise',
      icon: '⭐',
      category: 'performance',
      requirement: JSON.stringify({ type: 'accuracy', value: 100 }),
      xpReward: 50,
    },
    {
      name: 'Dedicated Learner',
      nameArabic: 'متعلم مخلص',
      description: 'Spend 10 hours learning',
      icon: '⏰',
      category: 'engagement',
      requirement: JSON.stringify({ type: 'time_spent', hours: 10 }),
      xpReward: 200,
    },
  ];

  for (const achievementData of achievements) {
    const achievement = await prisma.achievement.create({
      data: achievementData,
    });
    console.log(`✓ Created: ${achievement.name}`);
  }

  // Award first achievement to student
  await prisma.userAchievement.create({
    data: {
      userId: student.id,
      achievementId: (await prisma.achievement.findFirst({ where: { name: 'First Steps' } }))!.id,
    },
  });
  console.log('✓ Awarded "First Steps" achievement to student');

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`  • Users: 2 (1 admin, 1 student)`);
  console.log(`  • Lessons: ${trackALessons.length + trackBLessons.length}`);
  console.log(`  • Exercises: ${trackALessons.length * 3}`);
  console.log(`  • Quran Verses: 3 (1 with full word analysis)`);
  console.log(`  • Verse Words: 4 (for verse 1:1)`);
  console.log(`  • Achievements: ${achievements.length}`);
  console.log('\n🔐 Test Credentials:');
  console.log('  Admin:');
  console.log('    Email: admin@arq.com');
  console.log('    Password: Admin123@');
  console.log('  Student:');
  console.log('    Email: student@arq.com');
  console.log('    Password: Student123@');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
