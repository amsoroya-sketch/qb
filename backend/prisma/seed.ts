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

  // Create Level 1 Grammar Rules (15 foundational rules)
  console.log('\n📖 Creating Level 1 Grammar Rules...');

  const grammarRules = [
    // === HARAKAT (VOWELS) - 3 rules ===
    {
      ruleId: 'L1_HARAKAT_FATHA',
      title: 'Fathah (َ) - The "A" Sound',
      titleArabic: 'الفتحة',
      level: 1,
      order: 1,
      category: 'phonology',
      explanationBeginner: `Fathah (َ) is a short vowel mark that appears above an Arabic letter and produces an "a" sound (like in "cat").

## How to Read It
When you see a fathah above a letter, pronounce that letter followed by a short "a" sound.

## Examples
- بَ = ba
- تَ = ta
- كَ = ka

## In the Quran
In verse 1:1, notice the fathah in بِسْمِ اللَّهِ الرَّحْمَٰنِ (ar-Rahmāni) - the ن has a fathah followed by kasra in the next word.`,
      explanationIntermediate: `The fathah (َ) is one of the three primary short vowels (harakat) in Arabic. It indicates a short /a/ sound and is crucial for proper pronunciation and meaning differentiation.

## Grammatical Function
- Fathah appears as the case ending (i'rab) for accusative (nasb) case
- It's used in definite adjectives following nasb case nouns
- Forms part of fathatain (tanween) for indefinite accusative

## Pronunciation Rules
- Duration: Approximately 1/3 of a long vowel (alif)
- Tongue position: Low, forward
- Jaw: Slightly open`,
      explanationAdvanced: `From a phonological perspective, the fathah represents the short vowel /a/ (/æ/ in IPA), classified as a low front unrounded vowel. Its morphophonological behavior varies based on surrounding consonants - becoming more centralized near emphatic letters (ص، ض، ط، ظ) and pharyngealized consonants.

## Morphological Significance
1. **I'rab Marker**: Primary indicator of mansub (accusative) case
2. **Verbal Morphology**: Characteristic of past tense (الفعل الماضي) final vowel
3. **Definiteness**: Combines with final noon (ـً) for tanween fathatain
4. **Prosody**: Contributes to metrical patterns in classical poetry

## Cross-Linguistic Comparison
Similar to Sanskrit short 'a', Greek alpha (α), and Hebrew patakh (פַּתָח)`,
      examples: [
        { verseRef: '1:1', wordPosition: 1, highlight: 'بِسْمِ - Notice the sukoon after س, not a fathah, but فَتَحَ would use fathahs' },
        { verseRef: '1:2', wordPosition: 1, highlight: 'الْحَمْدُ - The م has a fathah: حَمْ' },
      ],
      prerequisiteRules: [],
      relatedRules: ['L1_HARAKAT_KASRA', 'L1_HARAKAT_DAMMA', 'L1_TANWEEN_FATH'],
      tags: ['beginner', 'harakat', 'vowels', 'pronunciation'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 10,
      isPublished: true,
    },
    {
      ruleId: 'L1_HARAKAT_KASRA',
      title: 'Kasrah (ِ) - The "I" Sound',
      titleArabic: 'الكسرة',
      level: 1,
      order: 2,
      category: 'phonology',
      explanationBeginner: `Kasrah (ِ) is a short vowel mark that appears below an Arabic letter and produces an "i" sound (like in "sit").

## How to Read It
When you see a kasrah below a letter, pronounce that letter followed by a short "i" sound.

## Examples
- بِ = bi
- تِ = ti
- كِ = ki

## In the Quran
In verse 1:1, the first word بِسْمِ (bismi) starts with a kasrah under the ب: بِ = "bi"`,
      explanationIntermediate: `The kasrah (ِ) is the second of the three primary short vowels. It produces a short /i/ sound and is essential for both pronunciation and grammatical case marking.

## Grammatical Function
- Kasrah marks the genitive (jarr) case in nouns
- Appears after prepositions (حروف الجر)
- Used in the construct state (mudaf ilayh)
- Combines with noon for tanween kasratain (ـٍ)

## Pronunciation
- Duration: 1/3 of long vowel (ya)
- Tongue position: High, front
- Jaw: Nearly closed`,
      explanationAdvanced: `Phonologically, kasrah represents /i/ (/ɪ/ in IPA), a high front unrounded vowel. Like fathah, it undergoes allophonic variation near emphatic consonants, becoming more centralized ([ɨ]).

## Morphosyntactic Roles
1. **Jarr Marker**: Primary indicator of majrur (genitive) case
2. **Prepositional Government**: Obligatory after jarr prepositions
3. **Construct State**: Marks mudaf ilayh in idafa constructions
4. **Elision Context**: Can be elided (kasrah khanjariyyah) in certain phonological environments

## Historical Development
Evolved from Semitic *i vowel, cognate with Hebrew khiriq (חִ), preserving Indo-European front vowel phoneme`,
      examples: [
        { verseRef: '1:1', wordPosition: 1, highlight: 'بِسْمِ - The ب has kasrah: بِ = "bi"' },
        { verseRef: '1:1', wordPosition: 2, highlight: 'اللَّهِ - The final ه has kasrah due to jarr case: ـهِ' },
        { verseRef: '1:1', wordPosition: 3, highlight: 'الرَّحْمَٰنِ - Final noon has kasrah: ـنِ' },
      ],
      prerequisiteRules: [],
      relatedRules: ['L1_HARAKAT_FATHA', 'L1_HARAKAT_DAMMA', 'L1_TANWEEN_KASR', 'L1_IRAB_JARR'],
      tags: ['beginner', 'harakat', 'vowels', 'pronunciation', 'genitive'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 10,
      isPublished: true,
    },
    {
      ruleId: 'L1_HARAKAT_DAMMA',
      title: 'Dammah (ُ) - The "U" Sound',
      titleArabic: 'الضمة',
      level: 1,
      order: 3,
      category: 'phonology',
      explanationBeginner: `Dammah (ُ) is a short vowel mark that appears above an Arabic letter and produces a "u" sound (like in "put").

## How to Read It
When you see a dammah above a letter, pronounce that letter followed by a short "u" sound.

## Examples
- بُ = bu
- تُ = tu
- كُ = ku

## In the Quran
In verse 1:2, the word الْحَمْدُ (al-hamdu) ends with a dammah: دُ = "du"`,
      explanationIntermediate: `The dammah (ُ) is the third primary short vowel in Arabic, producing a short /u/ sound. It's critical for indicating the nominative case.

## Grammatical Function
- Marks nominative (raf') case in nouns
- Indicates subject position in nominal sentences
- Used for predicate in verbal sentences
- Combines with noon for tanween dammatain (ـٌ)

## Pronunciation
- Duration: 1/3 of long vowel (waw)
- Tongue position: High, back
- Lips: Rounded`,
      explanationAdvanced: `Phonologically, dammah represents /u/ (/ʊ/ in IPA), a high back rounded vowel. Near emphatic consonants, it can be realized as [o] or [ɔ], showing distinctive coarticulatory effects.

## Morphosyntactic Functions
1. **Raf' Marker**: Primary indicator of marfu' (nominative) case
2. **Subject Marking**: Obligatory for mubtada (topic) and khabar (comment)
3. **Agentive**: Marks fa'il (agent/subject) in verbal sentences
4. **Vocalization**: Used in imperative mood formations

## Comparative Semitic Linguistics
Corresponds to Proto-Semitic *u, Hebrew qamatz qatan (קָ‎ short), and Akkadian u-vowel`,
      examples: [
        { verseRef: '1:2', wordPosition: 1, highlight: 'الْحَمْدُ - Final dal has dammah: دُ = "du" (nominative case)' },
        { verseRef: '2:2', wordPosition: 1, highlight: 'ذَٰلِكَ الْكِتَابُ - الْكِتَابُ ends with dammah (subject)' },
      ],
      prerequisiteRules: [],
      relatedRules: ['L1_HARAKAT_FATHA', 'L1_HARAKAT_KASRA', 'L1_TANWEEN_DAMM', 'L1_IRAB_RAF'],
      tags: ['beginner', 'harakat', 'vowels', 'pronunciation', 'nominative'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 10,
      isPublished: true,
    },

    // === SUKOON & TANWEEN - 4 rules ===
    {
      ruleId: 'L1_SUKOON',
      title: 'Sukoon (ْ) - Absence of Vowel',
      titleArabic: 'السكون',
      level: 1,
      order: 4,
      category: 'phonology',
      explanationBeginner: `Sukoon (ْ) is a mark that appears above a letter to show that it has NO vowel sound after it. The letter is pronounced without any following vowel.

## How to Read It
When you see a sukoon above a letter, pronounce only the consonant without adding a, i, or u.

## Examples
- بْ = b (just the consonant)
- تْ = t (just the consonant)
- كْ = k (just the consonant)

## In the Quran
In verse 1:1, the word بِسْمِ (bismi) has sukoon on the س: بِسْـ = "bis" (no vowel after س)`,
      explanationIntermediate: `Sukoon (ْ) indicates the absence of a short vowel, creating a consonant cluster. It's essential for syllable structure in Arabic.

## Rules
1. **Word-Final**: Marks pausal pronunciation (وقف)
2. **Word-Internal**: Creates closed syllables (CV̄C or CVC)
3. **Assimilation**: Can trigger phonological processes with following letters

## Phonetic Realization
- No glide or transition to next sound
- Full articulation of consonant
- Can cause gemination with following identical consonant`,
      explanationAdvanced: `From a phonological perspective, sukoon represents the absence of nuclear vocalism (/∅/), creating consonantal phonemes without vocalic satellites. This is crucial for Arabic's complex syllable typology.

## Syllabic Structure
Arabic permits: CV, CVV, CVC, CVVC, CVCC (pause only)
Sukoon enables CVC and CVCC patterns, crucial for morphological templates.

## Morphophonological Effects
1. **Assimilation**: Triggers idgham (إدغام) with following consonants
2. **Deletion**: Subject to elision (حذف) in certain sandhi environments
3. **Epenthesis**: May trigger anaptyxis in foreign loanwords`,
      examples: [
        { verseRef: '1:1', wordPosition: 1, highlight: 'بِسْمِ - The س has sukoon: سْـ (no vowel)' },
        { verseRef: '1:2', wordPosition: 1, highlight: 'الْحَمْدُ - Both ل and م have sukoon: ـلْحَمْـ' },
      ],
      prerequisiteRules: ['L1_HARAKAT_FATHA', 'L1_HARAKAT_KASRA', 'L1_HARAKAT_DAMMA'],
      relatedRules: [],
      tags: ['beginner', 'sukoon', 'consonant', 'pronunciation'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 8,
      isPublished: true,
    },
    {
      ruleId: 'L1_TANWEEN_FATH',
      title: 'Fathatain (ً) - Double Fathah (-an)',
      titleArabic: 'تنوين الفتح',
      level: 1,
      order: 5,
      category: 'morphology',
      explanationBeginner: `Fathatain (ً) consists of two fathahs stacked together, producing an "-an" sound. It's a special mark used on indefinite nouns in the accusative case.

## How to Read It
When you see fathatain (ً), pronounce the letter with "-an" at the end.

## Examples
- كِتَابًا = kitāban (a book, accusative)
- بَيْتًا = baytan (a house, accusative)

## What It Means
- The noun is INDEFINITE (like "a" or "an" in English)
- The noun is in the ACCUSATIVE case (object position)`,
      explanationIntermediate: `Fathatain (ً), also called tanween fathin, is a morphological marker combining indefiniteness with accusative case. It's written as double fathah and pronounced as [-an].

## Grammatical Functions
1. Marks indefinite accusative nouns (مفعول به)
2. Appears on direct objects
3. Used in circumstantial accusative (حال)
4. Marks adverbs of time and place (ظرف)

## Writing Rules
- Usually accompanied by alif (ا) except after taa marbuta (ة) or hamza
- Examples: كِتَابًا but مَدْرَسَةً`,
      explanationAdvanced: `Fathatain represents the morphophonological fusion of indefiniteness marker /n/ with accusative case vowel /a/, yielding [-an]. This reflects Proto-Semitic *-an nunation.

## Morphological Distribution
1. **Indefinite Nasb**: Primary function marking [-definite, +accusative]
2. **Adverbial Marking**: Grammaticalized for ظرف (circumstantial adjuncts)
3. **Tmyiz (تمييز)**: Specification/discriminative construction marker

## Orthographic Variation
Alif al-tanween (ألف التنوين) added except:
- After taa marbuta: ـةً
- After hamza: شَيْءًا
- Historical: Pre-Uthmanic manuscripts showed variation`,
      examples: [
        { verseRef: '2:49', wordPosition: 3, highlight: 'Example of tanween fath in accusative context' },
      ],
      prerequisiteRules: ['L1_HARAKAT_FATHA', 'L1_IRAB_NASB'],
      relatedRules: ['L1_TANWEEN_KASR', 'L1_TANWEEN_DAMM'],
      tags: ['beginner', 'tanween', 'indefinite', 'accusative', 'case-ending'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 12,
      isPublished: true,
    },
    {
      ruleId: 'L1_TANWEEN_KASR',
      title: 'Kasratain (ٍ) - Double Kasrah (-in)',
      titleArabic: 'تنوين الكسر',
      level: 1,
      order: 6,
      category: 'morphology',
      explanationBeginner: `Kasratain (ٍ) consists of two kasrahs stacked together, producing an "-in" sound. It's used on indefinite nouns in the genitive case.

## How to Read It
When you see kasratain (ٍ), pronounce the letter with "-in" at the end.

## Examples
- كِتَابٍ = kitābin (of a book)
- بَيْتٍ = baytin (of a house)

## What It Means
- The noun is INDEFINITE
- The noun is in the GENITIVE case (after prepositions or in idafa)`,
      explanationIntermediate: `Kasratain (ٍ), or tanween kasrin, marks indefinite genitive case. It appears after prepositions and as the second noun in idafa constructions.

## Grammatical Functions
1. Indefinite noun after prepositions (حروف الجر)
2. Second term of idafa when indefinite (rare)
3. After genitive-governing particles

## Pronunciation
[-in], with short i vowel + noon sound

## Context
Most common after: من، إلى، في، على، عن + indefinite noun`,
      explanationAdvanced: `Kasratain [-in] marks the intersection of indefiniteness with genitive case, reflecting Proto-Semitic *-in nunation pattern.

## Syntactic Distribution
1. **Prepositional Complements**: Obligatory after حروف الجر when indefinite
2. **Idafa (rare)**: Can appear on مضاف إليه when exceptionally indefinite
3. **Circumstantial**: Occasionally in حال constructions

## Phonological Behavior
- No orthographic alif added (unlike tanween fath)
- Subject to pause simplification: كِتَابٍ → كِتَاب (in وقف)`,
      examples: [
        { verseRef: '2:164', wordPosition: 5, highlight: 'Example of tanween kasr after preposition' },
      ],
      prerequisiteRules: ['L1_HARAKAT_KASRA', 'L1_IRAB_JARR'],
      relatedRules: ['L1_TANWEEN_FATH', 'L1_TANWEEN_DAMM'],
      tags: ['beginner', 'tanween', 'indefinite', 'genitive', 'case-ending'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 12,
      isPublished: true,
    },
    {
      ruleId: 'L1_TANWEEN_DAMM',
      title: 'Dammatain (ٌ) - Double Dammah (-un)',
      titleArabic: 'تنوين الضم',
      level: 1,
      order: 7,
      category: 'morphology',
      explanationBeginner: `Dammatain (ٌ) consists of two dammahs stacked together, producing an "-un" sound. It's used on indefinite nouns in the nominative case.

## How to Read It
When you see dammatain (ٌ), pronounce the letter with "-un" at the end.

## Examples
- كِتَابٌ = kitābun (a book, subject)
- بَيْتٌ = baytun (a house, subject)

## What It Means
- The noun is INDEFINITE
- The noun is in the NOMINATIVE case (subject position)`,
      explanationIntermediate: `Dammatain (ٌ), or tanween dammun, marks indefinite nominative case. It's the most common tanween form, appearing on subjects and predicates.

## Grammatical Functions
1. Indefinite subject (مبتدأ) in nominal sentences
2. Indefinite predicate (خبر)
3. Subject of verb (فاعل) when indefinite

## Usage Notes
- Most frequently encountered tanween
- Indicates the noun can take the definite article (ال)`,
      explanationAdvanced: `Dammatain [-un] represents the unmarked case-indefiniteness combination, reflecting Proto-Semitic *-un mimation/nunation.

## Morphosyntactic Primacy
As the nominative-indefinite marker, dammatain represents the citation form in Arabic lexicography and represents the least marked case configuration.

## Distribution
1. **Mubtada (مبتدأ)**: Topic of nominal sentence when indefinite
2. **Khabar (خبر)**: Predicate position
3. **Fa'il (فاعل)**: Agent in verbal sentences
4. **Na'ib Fa'il**: Passive agent

## Historical Note
Reflects both Pre-Islamic Arabic *-um/-un alternation and later standardization in Classical Arabic`,
      examples: [
        { verseRef: '2:2', wordPosition: 1, highlight: 'ذَٰلِكَ الْكِتَابُ - If indefinite, would be كِتَابٌ' },
      ],
      prerequisiteRules: ['L1_HARAKAT_DAMMA', 'L1_IRAB_RAF'],
      relatedRules: ['L1_TANWEEN_FATH', 'L1_TANWEEN_KASR'],
      tags: ['beginner', 'tanween', 'indefinite', 'nominative', 'case-ending'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 12,
      isPublished: true,
    },

    // === PART OF SPEECH - 3 rules ===
    {
      ruleId: 'L1_POS_ISM',
      title: 'Ism (الاسم) - Noun',
      titleArabic: 'الاسم',
      level: 1,
      order: 8,
      category: 'morphology',
      explanationBeginner: `An Ism (اسم) is a NOUN - a word that names a person, place, thing, or concept. Nouns do NOT indicate when something happens (no time reference).

## How to Identify a Noun
Look for these signs:
1. **Tanween**: Double vowels (ٌ، ٍ، ً)
2. **Definite Article**: Can have ال at the start
3. **After Prepositions**: Comes after من، في، إلى، etc.

## Examples from Quran
- اللَّهِ (Allah) - proper noun
- الْحَمْدُ (praise) - abstract noun
- الرَّحْمَٰنِ (the Most Merciful) - attribute noun`,
      explanationIntermediate: `The ism (noun) is one of the three fundamental word classes in Arabic grammar. It encompasses nouns, pronouns, adjectives, and adverbs.

## Defining Characteristics
1. **Tanween Reception**: Can accept nunation (كِتَابٌ)
2. **Article Acceptance**: Can take ال (الْكِتَابُ)
3. **Case Inflection**: Shows i'rab (الْكِتَابُ، الْكِتَابَ، الْكِتَابِ)
4. **Prepositional Government**: Can follow حروف الجر

## Subcategories
- Common nouns (اسم نكرة)
- Proper nouns (اسم علم)
- Adjectives (صفة)
- Pronouns (ضمير)`,
      explanationAdvanced: `The ism represents the nominal word class in Arabic morphosyntax, defined distributionally by its ability to bear case morphology and determination markers.

## Formal Definition
X is an ism iff:
1. X can appear with tanween or ال
2. X shows tripartite case distinction (raf', nasb, jarr)
3. X can serve as argument in predicate-argument structure

## Morphological Typology
1. **Derived (مشتق)**: Participles, verbal nouns (خَالِقٌ، خَلْقٌ)
2. **Primitive (جامد)**: Underived nouns (رَجُلٌ، دَارٌ)
3. **Inflectable (معرب)**: Shows full i'rab
4. **Invariable (مبني)**: Frozen forms (pronouns, demonstratives)

## Cross-Linguistic Parallel
Similar to noun class in Indo-European but with Afro-Asiatic templatic morphology`,
      examples: [
        { verseRef: '1:1', wordPosition: 1, highlight: 'بِسْمِ (name) - noun in idafa' },
        { verseRef: '1:1', wordPosition: 2, highlight: 'اللَّهِ (Allah) - proper noun' },
        { verseRef: '1:2', wordPosition: 1, highlight: 'الْحَمْدُ (praise) - noun as subject' },
      ],
      prerequisiteRules: [],
      relatedRules: ['L1_POS_FIIL', 'L1_POS_HARF', 'L1_IRAB_RAF', 'L1_IRAB_NASB', 'L1_IRAB_JARR'],
      tags: ['beginner', 'part-of-speech', 'noun', 'ism'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 15,
      isPublished: true,
    },
    {
      ruleId: 'L1_POS_FIIL',
      title: "Fi'l (الفعل) - Verb",
      titleArabic: 'الفعل',
      level: 1,
      order: 9,
      category: 'morphology',
      explanationBeginner: `A Fi'l (فعل) is a VERB - a word that expresses an action or state. Verbs ALWAYS indicate WHEN something happens (past, present, or future).

## How to Identify a Verb
Look for these signs:
1. **Time Indication**: Shows when action occurred
2. **قد Before It**: The particle قد often comes before past verbs
3. **س or سوف Before It**: These come before future verbs
4. **No Tanween**: Verbs NEVER have tanween (ٌ، ٍ، ً)

## Examples from Quran
- خَلَقَ (khalaq) - He created (PAST)
- يَعْلَمُ (ya'lam) - He knows (PRESENT)
- سَيَجْعَلُ (sayaj'al) - He will make (FUTURE)`,
      explanationIntermediate: `The fi'l (verb) is the word class that expresses actions, events, or states, always associated with a time frame (tense/aspect).

## Types of Verbs
1. **Past (الماضي)**: Completed action - فَعَلَ
2. **Present (المضارع)**: Ongoing/habitual - يَفْعَلُ
3. **Imperative (الأمر)**: Command - افْعَلْ

## Defining Features
1. Cannot accept ال (definite article)
2. Cannot have tanween
3. Has mood (مرفوع، منصوب، مجزوم for present)
4. Conjugates for person, number, gender`,
      explanationAdvanced: `The fi'l constitutes the verbal word class, defined by its temporal-aspectual morphology and argument structure licensing properties.

## Formal Characteristics
1. **Templatic Morphology**: Root-and-pattern system (ف-ع-ل)
2. **TAM Categories**: Tense-Aspect-Mood marking
3. **Agreement**: φ-features (person, number, gender)
4. **Valency**: Subcategorization for arguments (فاعل، مفعول)

## Aspectual System
- Perfective (الماضي): [-continuative, +bounded]
- Imperfective (المضارع): [+continuative, -bounded]
- Jussive/Subjunctive: Modal operators

## Derivational Patterns
15 forms (أوزان): فَعَلَ، فَعَّلَ، فَاعَلَ، أَفْعَلَ... each with semantic regularities`,
      examples: [
        { verseRef: '2:29', wordPosition: 2, highlight: 'خَلَقَ (created) - past tense verb' },
        { verseRef: '2:20', wordPosition: 3, highlight: 'يَكَادُ (almost) - present tense verb' },
      ],
      prerequisiteRules: [],
      relatedRules: ['L1_POS_ISM', 'L1_POS_HARF', 'L1_IRAB_JAZM'],
      tags: ['beginner', 'part-of-speech', 'verb', 'fiil', 'tense'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 15,
      isPublished: true,
    },
    {
      ruleId: 'L1_POS_HARF',
      title: 'Harf (الحرف) - Particle',
      titleArabic: 'الحرف',
      level: 1,
      order: 10,
      category: 'morphology',
      explanationBeginner: `A Harf (حرف) is a PARTICLE - a word that has meaning only when combined with nouns or verbs. Particles cannot stand alone.

## How to Identify a Particle
1. **Short Words**: Usually 1-3 letters
2. **No Tanween**: Never has tanween
3. **No ال**: Cannot take the definite article
4. **Function Words**: Prepositions, conjunctions, etc.

## Common Particles
**Prepositions (حروف الجر):**
- مِنْ (from)
- فِي (in)
- إِلَى (to)

**Conjunctions:**
- وَ (and)
- فَ (then)`,
      explanationIntermediate: `The harf (particle) is the third major word class, encompassing function words that modify or relate nouns and verbs.

## Categories of Particles
1. **Prepositions (حروف الجر)**: من، إلى، في، على، عن
2. **Conjunctions (حروف العطف)**: و، ف، ثم، أو
3. **Nasb Particles**: أن، لن، كي، إذن
4. **Jazm Particles**: لم، لمّا، لا (prohibitive)
5. **Emphasis**: إنَّ، أنَّ، لكنَّ

## Key Features
- Invariable (مبني)
- No case marking
- Governs nouns or verbs (عوامل)`,
      explanationAdvanced: `Particles (حروف) constitute the closed-class functional category in Arabic, serving as governors (عوامل) that assign case and mood to open-class elements.

## Formal Properties
1. **Functional Heads**: Occupy C°, T°, P° positions in X-bar structure
2. **Case Assignment**: Prepositional phrases assign jarr to complements
3. **Mood Selection**: Nasb/jazm particles subcategorize for verbal complements
4. **Scope**: Some particles scope over entire clauses (إنَّ، أنَّ)

## Morphosyntactic Classes
1. **Case Governors (عوامل النصب والجر)**
2. **Mood Governors (عوامل الجزم)**
3. **Sentential Operators (حروف مشبهة بالفعل)**

## Comparative Note
Similar to adpositions, complementizers, and tense-aspect heads in generative frameworks`,
      examples: [
        { verseRef: '1:1', wordPosition: 1, highlight: 'بِـ (the ب in بِسْمِ) - preposition "in/with"' },
        { verseRef: '1:2', wordPosition: 2, highlight: 'لِـ (the ل in لِلَّهِ) - preposition "for/to"' },
      ],
      prerequisiteRules: [],
      relatedRules: ['L1_POS_ISM', 'L1_POS_FIIL', 'L1_IRAB_JARR', 'L1_IRAB_NASB', 'L1_IRAB_JAZM'],
      tags: ['beginner', 'part-of-speech', 'particle', 'harf', 'preposition'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 15,
      isPublished: true,
    },

    // === BASIC I'RAB (CASE) - 5 rules ===
    {
      ruleId: 'L1_IRAB_RAF',
      title: "Raf' (الرفع) - Nominative Case",
      titleArabic: 'الرفع',
      level: 1,
      order: 11,
      category: 'syntax',
      explanationBeginner: `Raf' (رفع) is the NOMINATIVE case - used for subjects and predicates. When a noun is in raf' case, it usually ends with dammah (ُ) or dammatain (ٌ).

## When to Use Raf'
1. **Subject of sentence** (مبتدأ): الْكِتَابُ جَدِيدٌ (The book is new)
2. **Subject of verb** (فاعل): جَاءَ مُحَمَّدٌ (Muhammad came)
3. **Predicate** (خبر): هَذَا طَالِبٌ (This is a student)

## How to Recognize It
- Ends with ُ (dammah) if definite: الْكِتَابُ
- Ends with ٌ (dammatain) if indefinite: كِتَابٌ`,
      explanationIntermediate: `Raf' (nominative case) is marked by dammah (ُ/ٌ) and appears on subjects and predicates in Arabic sentences.

## Grammatical Positions Requiring Raf'
1. **Mubtada (مبتدأ)**: Topic of nominal sentence
2. **Khabar (خبر)**: Predicate of mubtada
3. **Fa'il (فاعل)**: Agent/subject of verb
4. **Na'ib Fa'il (نائب الفاعل)**: Deputy agent (passive)

## Signs of Raf'
- Regular nouns: dammah (ـُ)
- Broken plurals: dammah (ـُ)
- Sound masculine plural: waw + noon (ـونَ)
- Dual: alif + noon (ـانِ)`,
      explanationAdvanced: `Raf' represents the structural case assigned to subjects (Spec-TP) and predicates in Arabic, marked by [-oblique, -objective] features.

## Case Assignment Configuration
- **Mubtada**: Inherent case in Spec-TopP
- **Fa'il**: Structural nominative assigned by T° (EPP satisfaction)
- **Na'ib Fa'il**: Promotion to Spec-TP in passive derivations

## Morphological Realization
| Category | Raf' Marker |
|----------|-------------|
| Singular | ـُ/ـٌ |
| Dual | ـانِ |
| Masc. Plural | ـونَ |
| Fem. Plural | ـاتٌ |
| Five Nouns | ـو |

## Theoretical Status
Raf' = [+structural, -governed] case in GB/MP frameworks`,
      examples: [
        { verseRef: '1:2', wordPosition: 1, highlight: "الْحَمْدُ - mubtada (subject) in raf' case: ـدُ" },
        { verseRef: '2:2', wordPosition: 2, highlight: "الْكِتَابُ - khabar (predicate) in raf' case" },
      ],
      prerequisiteRules: ['L1_HARAKAT_DAMMA', 'L1_TANWEEN_DAMM', 'L1_POS_ISM'],
      relatedRules: ['L1_IRAB_NASB', 'L1_IRAB_JARR', 'L1_IRAB_VS_BINA'],
      tags: ['beginner', 'irab', 'case', 'nominative', 'subject', 'raf'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 18,
      isPublished: true,
    },
    {
      ruleId: 'L1_IRAB_NASB',
      title: 'Nasb (النصب) - Accusative Case',
      titleArabic: 'النصب',
      level: 1,
      order: 12,
      category: 'syntax',
      explanationBeginner: `Nasb (نصب) is the ACCUSATIVE case - used for direct objects and other specific grammatical roles. Nouns in nasb case usually end with fathah (َ) or fathatain (ً).

## When to Use Nasb
1. **Direct object** (مفعول به): قَرَأْتُ الْكِتَابَ (I read the book)
2. **After certain particles**: إِنَّ اللَّهَ غَفُورٌ (Indeed, Allah is Forgiving)
3. **Circumstantial** (حال): جَاءَ رَاكِبًا (He came riding)

## How to Recognize It
- Ends with َ (fathah) if definite: الْكِتَابَ
- Ends with ً (fathatain) if indefinite: كِتَابًا`,
      explanationIntermediate: `Nasb (accusative case) is marked by fathah (َ/ً) and appears on direct objects, complements of nasb particles, and other governed positions.

## Grammatical Positions Requiring Nasb
1. **Maf'ul bihi (مفعول به)**: Direct object
2. **Khabar inna (خبر إن)**: Predicate after إنّ and sisters
3. **Hal (حال)**: Circumstantial accusative
4. **Tamyiz (تمييز)**: Specification
5. **Maf'ul mutlaq (مفعول مطلق)**: Cognate accusative

## Signs of Nasb
- Regular nouns: fathah (ـَ)
- Sound masculine plural: ya + noon (ـينَ)
- Dual: ya + noon (ـيْنِ)
- Five nouns: alif (ـا)`,
      explanationAdvanced: `Nasb represents the objective/accusative structural case assigned to internal arguments (Spec-VP) and governed positions.

## Case Assignment Mechanisms
1. **Structural Accusative**: Assigned by V° to Spec-VP (maf'ul bihi)
2. **Inherent Accusative**: Lexically governed (hal, tamyiz)
3. **Particle-Assigned**: Governed by nasb particles (إنَّ، أنَّ، لكنَّ)

## Morphological Paradigm
| Category | Nasb Marker |
|----------|-------------|
| Singular | ـَ/ـً |
| Dual | ـيْنِ |
| Masc. Plural | ـينَ |
| Fem. Plural | ـاتٍ |
| Five Nouns | ـا |

## Syntactic Distribution
Nasb correlates with [+governed, +structural] in case hierarchy`,
      examples: [
        { verseRef: '2:29', wordPosition: 5, highlight: "Example of maf'ul bihi (direct object) in nasb case" },
      ],
      prerequisiteRules: ['L1_HARAKAT_FATHA', 'L1_TANWEEN_FATH', 'L1_POS_ISM'],
      relatedRules: ['L1_IRAB_RAF', 'L1_IRAB_JARR', 'L1_IRAB_VS_BINA'],
      tags: ['beginner', 'irab', 'case', 'accusative', 'object', 'nasb'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 18,
      isPublished: true,
    },
    {
      ruleId: 'L1_IRAB_JARR',
      title: 'Jarr (الجر) - Genitive Case',
      titleArabic: 'الجر',
      level: 1,
      order: 13,
      category: 'syntax',
      explanationBeginner: `Jarr (جر) is the GENITIVE case - used after prepositions and in possessive constructions. Nouns in jarr case end with kasrah (ِ) or kasratain (ٍ).

## When to Use Jarr
1. **After prepositions**: فِي الْبَيْتِ (in the house)
2. **Possessive (idafa)**: كِتَابُ الطَّالِبِ (the student's book)

## How to Recognize It
- Ends with ِ (kasrah) if definite: الْبَيْتِ
- Ends with ٍ (kasratain) if indefinite: بَيْتٍ`,
      explanationIntermediate: `Jarr (genitive case) is marked by kasrah (ِ/ٍ) and appears after prepositions and as the second term in idafa (construct state).

## Grammatical Positions Requiring Jarr
1. **After prepositions** (حروف الجر): مِنَ الْكِتَابِ
2. **Mudaf ilayh** (مضاف إليه): Second noun in idafa
3. **After إضافة**: كِتَابُ الطَّالِبِ

## Prepositions Causing Jarr
مِنْ، إِلَى، عَنْ، عَلَى، فِي، بِ، لِ، كَ

## Signs of Jarr
- Regular nouns: kasrah (ـِ)
- Sound masculine plural: ya + noon (ـينَ)
- Dual: ya + noon (ـيْنِ)
- Five nouns: ya (ـي)`,
      explanationAdvanced: `Jarr represents oblique case assigned by prepositional heads (P°) or in construct state (idafa) configurations.

## Case Assignment
1. **Prepositional Government**: P° assigns jarr to its complement (Spec-PP)
2. **Construct State**: Head noun in idafa licenses jarr on complement
3. **Inherent Case**: [+oblique, -structural]

## Morphological Realization
| Category | Jarr Marker |
|----------|-------------|
| Singular | ـِ/ـٍ |
| Dual | ـيْنِ |
| Masc. Plural | ـينَ |
| Fem. Plural | ـاتٍ |
| Five Nouns | ـي |

## Theoretical Status
Jarr = lexically-selected case in GB, parallel to dative/genitive in other languages

## Idafa Structure
[DP [D° ∅] [NP1 N° [NP2]]] where NP2 receives jarr`,
      examples: [
        { verseRef: '1:1', wordPosition: 2, highlight: 'اللَّهِ - mudaf ilayh in jarr case: ـهِ' },
        { verseRef: '1:1', wordPosition: 3, highlight: 'الرَّحْمَٰنِ - adjective in jarr case: ـنِ' },
      ],
      prerequisiteRules: ['L1_HARAKAT_KASRA', 'L1_TANWEEN_KASR', 'L1_POS_ISM', 'L1_POS_HARF'],
      relatedRules: ['L1_IRAB_RAF', 'L1_IRAB_NASB', 'L1_IRAB_VS_BINA'],
      tags: ['beginner', 'irab', 'case', 'genitive', 'preposition', 'jarr', 'idafa'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 18,
      isPublished: true,
    },
    {
      ruleId: 'L1_IRAB_JAZM',
      title: 'Jazm (الجزم) - Jussive Mood',
      titleArabic: 'الجزم',
      level: 1,
      order: 14,
      category: 'syntax',
      explanationBeginner: `Jazm (جزم) is a special case that applies ONLY to PRESENT TENSE VERBS (not nouns). It's used after certain particles to express negation, command, or condition.

## When Verbs Get Jazm
1. **After لَمْ** (did not): لَمْ يَكْتُبْ (he did not write)
2. **After لَمَّا** (not yet): لَمَّا يَأْتِ (he has not yet come)
3. **In prohibitions with لَا**: لَا تَكْتُبْ (do not write!)

## How to Recognize It
- Present verb loses its final vowel
- Regular verbs: sukoon on last letter (ـْ)
- Example: يَكْتُبُ → يَكْتُبْ`,
      explanationIntermediate: `Jazm is the mood marking for present tense verbs (مضارع), triggered by specific particles. It functions like a "case" for verbs.

## Particles Causing Jazm
1. **Negation**: لَمْ، لَمَّا
2. **Prohibition**: لَا الناهية
3. **Condition**: إِنْ، مَنْ، مَا (in conditional constructions)
4. **Command**: لِ الأمر (let/may)

## Signs of Jazm
- Sound verbs: sukoon (ـْ)
- Weak verbs (معتل): deletion of weak letter
- Five verbs: deletion of noon (ـنَ → ـوا)

## Example
يَكْتُبُ (marfu') → لَمْ يَكْتُبْ (majzum)`,
      explanationAdvanced: `Jazm represents irrealis mood marking on imperfective verbs, assigned by negative, conditional, or jussive operators in C°.

## Syntactic Licensing
Jazm is assigned to V° by modal/negation heads:
- NEG° (لَمْ، لَمَّا) → [-realis, +past]
- PROHIB° (لَا الناهية) → [-realis, +prohibitive]
- COND° (إِنْ، مَنْ) → [-realis, +conditional]

## Morphological Realization
| Verb Type | Jazm Marker |
|-----------|-------------|
| Sound | sukoon (ـْ) |
| Hollow (أجوف) | deletion |
| Defective (ناقص) | deletion |
| Five Verbs | deletion of ن |

## Modal Semantics
Jazm encodes:
- Counterfactuality (لَمْ)
- Non-actualized prohibition (لَا)
- Hypotheticality (إِنْ)

Parallel to subjunctive/optative in Indo-European`,
      examples: [
        { verseRef: '2:6', wordPosition: 4, highlight: 'Example: لَمْ with jazm on verb' },
      ],
      prerequisiteRules: ['L1_SUKOON', 'L1_POS_FIIL'],
      relatedRules: ['L1_IRAB_RAF', 'L1_IRAB_NASB', 'L1_IRAB_VS_BINA', 'L1_POS_HARF'],
      tags: ['beginner', 'irab', 'mood', 'verb', 'jazm', 'jussive', 'negation'],
      difficulty: Difficulty.BEGINNER,
      estimatedTime: 20,
      isPublished: true,
    },
    {
      ruleId: 'L1_IRAB_VS_BINA',
      title: "I'rab vs. Bina - Declinable vs. Indeclinable",
      titleArabic: 'الإعراب والبناء',
      level: 1,
      order: 15,
      category: 'morphology',
      explanationBeginner: `Arabic words are divided into two types based on whether their endings change:

## I'rab (الإعراب) - DECLINABLE
Words whose endings CHANGE based on their role in the sentence.
- Most nouns: الْكِتَابُ، الْكِتَابَ، الْكِتَابِ
- Most verbs: يَكْتُبُ، يَكْتُبَ، يَكْتُبْ
- Adjectives: جَمِيلٌ، جَمِيلاً، جَمِيلٍ

## Bina (البناء) - INDECLINABLE
Words whose endings NEVER change.
- Pronouns: هُوَ (he) - always stays the same
- Demonstratives: هَذَا (this) - always stays the same
- Prepositions: مِنْ، إِلَى، فِي - never change`,
      explanationIntermediate: `I'rab (إعراب) and bina (بناء) represent the fundamental morphological distinction in Arabic grammar regarding case/mood marking.

## Mu'rab (المعرب) - Declinable Words
Words that show i'rab (case/mood inflection):
1. Most nouns (except pronouns, demonstratives)
2. Present tense verbs (المضارع)
3. Adjectives and participles
4. Relative pronouns (except الذي and variants)

## Mabni (المبني) - Indeclinable Words
Words that never change endings:
1. All pronouns (ضمائر)
2. Demonstratives (أسماء الإشارة)
3. Some interrogatives
4. Past verbs (الماضي)
5. Imperative verbs (الأمر)
6. All particles (حروف)

## Key Principle
If a word's ending changes for raf'/nasb/jarr, it's mu'rab.
If the ending stays frozen, it's mabni.`,
      explanationAdvanced: `I'rab vs. bina represents the parametric distinction between inflectional morphology (φ-features + case/mood) vs. invariant forms in Arabic.

## Formal Definition
- **Mu'rab**: X bears case/mood features assigned by functional heads (T°, P°, etc.)
- **Mabni**: X lacks case/mood features OR has lexically frozen features

## Theoretical Status
From a minimalist perspective:
- Mu'rab = words that enter Agree relations with functional probes
- Mabni = words lacking unvalued φ-features or outside case domains

## Distribution
| Category | I'rab/Bina | Rationale |
|----------|-----------|-----------|
| Nouns | Mostly mu'rab | Enter case relations |
| Pronouns | Mabni | Φ-complete, case-resistant |
| Particles | Mabni | Functional heads |
| Past verbs | Mabni | No Tense agreement |
| Present verbs | Mu'rab | Agreement with T° |

## Historical Note
Bina represents older Semitic invariant forms preserved in Arabic closed-class elements`,
      examples: [
        { verseRef: '1:1', wordPosition: 1, highlight: "بِسْمِ - mu'rab noun (changes: بِسْمُ، بِسْمَ، بِسْمِ)" },
        { verseRef: '1:2', wordPosition: 2, highlight: 'لِـ - mabni particle (never changes)' },
      ],
      prerequisiteRules: ['L1_IRAB_RAF', 'L1_IRAB_NASB', 'L1_IRAB_JARR', 'L1_IRAB_JAZM'],
      relatedRules: ['L1_POS_ISM', 'L1_POS_FIIL', 'L1_POS_HARF'],
      tags: ['beginner', 'irab', 'bina', 'declension', 'inflection', 'morphology'],
      difficulty: Difficulty.INTERMEDIATE,
      estimatedTime: 20,
      isPublished: true,
    },
  ];

  for (const ruleData of grammarRules) {
    const rule = await prisma.grammarRule.create({
      data: ruleData,
    });
    console.log(`✓ Created: ${rule.title}`);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`  • Users: 2 (1 admin, 1 student)`);
  console.log(`  • Lessons: ${trackALessons.length + trackBLessons.length}`);
  console.log(`  • Exercises: ${trackALessons.length * 3}`);
  console.log(`  • Quran Verses: 3 (1 with full word analysis)`);
  console.log(`  • Verse Words: 4 (for verse 1:1)`);
  console.log(`  • Achievements: ${achievements.length}`);
  console.log(`  • Grammar Rules (Level 1): ${grammarRules.length}`);
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
