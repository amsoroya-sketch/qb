import { PrismaClient, UserRole, Track, Difficulty } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Comprehensive seed script for 100 diverse users with different scenarios
 *
 * User Scenarios:
 * - 20 students: New users (just registered, 0 progress)
 * - 20 students: Beginners (1-5 lessons, low XP, short streaks)
 * - 20 students: Intermediate (10-20 lessons, moderate XP, active streaks)
 * - 20 students: Advanced (30+ lessons, high XP, long streaks, many achievements)
 * - 10 students: Power users (completed curriculum, max XP, all achievements)
 * - 5 students: Inactive (good progress but no activity in 30+ days)
 * - 3 teachers
 * - 2 admins
 */

interface UserScenario {
  email: string;
  name: string;
  role: UserRole;
  progress?: {
    currentXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    lessonsCompleted: number;
    exercisesCompleted: number;
    totalTimeSpent: number;
    averageAccuracy: number;
    lastActiveDate: Date;
  };
  achievements?: number; // Number of achievements to unlock
  lessons?: {
    track: Track;
    completedCount: number;
  };
}

async function generateUsers(): Promise<UserScenario[]> {
  const users: UserScenario[] = [];
  const password = 'Test123@'; // Same password for all test users

  // 1. NEW USERS (0 progress) - IDs 1-20
  for (let i = 1; i <= 20; i++) {
    users.push({
      email: `newuser${i}@test.com`,
      name: `New Student ${i}`,
      role: UserRole.STUDENT,
    });
  }

  // 2. BEGINNERS (1-5 lessons) - IDs 21-40
  for (let i = 1; i <= 20; i++) {
    const lessonsCompleted = Math.floor(Math.random() * 5) + 1;
    const exercisesCompleted = lessonsCompleted * (Math.floor(Math.random() * 8) + 5);
    const currentStreak = Math.floor(Math.random() * 5) + 1;

    users.push({
      email: `beginner${i}@test.com`,
      name: `Beginner Student ${i}`,
      role: UserRole.STUDENT,
      progress: {
        currentXP: lessonsCompleted * 50 + exercisesCompleted * 10,
        currentLevel: 1,
        currentStreak,
        longestStreak: currentStreak + Math.floor(Math.random() * 3),
        lessonsCompleted,
        exercisesCompleted,
        totalTimeSpent: lessonsCompleted * 1200 + exercisesCompleted * 180,
        averageAccuracy: 60 + Math.random() * 20,
        lastActiveDate: new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000),
      },
      achievements: Math.floor(Math.random() * 3) + 1,
      lessons: {
        track: i % 2 === 0 ? Track.A : Track.B,
        completedCount: lessonsCompleted,
      },
    });
  }

  // 3. INTERMEDIATE (10-20 lessons) - IDs 41-60
  for (let i = 1; i <= 20; i++) {
    const lessonsCompleted = Math.floor(Math.random() * 11) + 10;
    const exercisesCompleted = lessonsCompleted * (Math.floor(Math.random() * 10) + 8);
    const currentStreak = Math.floor(Math.random() * 15) + 5;
    const currentLevel = Math.floor(lessonsCompleted / 5) + 2;

    users.push({
      email: `intermediate${i}@test.com`,
      name: `Intermediate Student ${i}`,
      role: UserRole.STUDENT,
      progress: {
        currentXP: lessonsCompleted * 50 + exercisesCompleted * 10 + currentLevel * 100,
        currentLevel,
        currentStreak,
        longestStreak: currentStreak + Math.floor(Math.random() * 10),
        lessonsCompleted,
        exercisesCompleted,
        totalTimeSpent: lessonsCompleted * 1500 + exercisesCompleted * 200,
        averageAccuracy: 70 + Math.random() * 15,
        lastActiveDate: new Date(Date.now() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000),
      },
      achievements: Math.floor(Math.random() * 5) + 3,
      lessons: {
        track: i % 2 === 0 ? Track.A : Track.B,
        completedCount: lessonsCompleted,
      },
    });
  }

  // 4. ADVANCED (30+ lessons) - IDs 61-80
  for (let i = 1; i <= 20; i++) {
    const lessonsCompleted = Math.floor(Math.random() * 21) + 30;
    const exercisesCompleted = lessonsCompleted * (Math.floor(Math.random() * 12) + 10);
    const currentStreak = Math.floor(Math.random() * 30) + 15;
    const currentLevel = Math.floor(lessonsCompleted / 5) + 3;

    users.push({
      email: `advanced${i}@test.com`,
      name: `Advanced Student ${i}`,
      role: UserRole.STUDENT,
      progress: {
        currentXP: lessonsCompleted * 50 + exercisesCompleted * 10 + currentLevel * 150,
        currentLevel,
        currentStreak,
        longestStreak: currentStreak + Math.floor(Math.random() * 20),
        lessonsCompleted,
        exercisesCompleted,
        totalTimeSpent: lessonsCompleted * 1800 + exercisesCompleted * 220,
        averageAccuracy: 80 + Math.random() * 15,
        lastActiveDate: new Date(),
      },
      achievements: Math.floor(Math.random() * 8) + 6,
      lessons: {
        track: i % 2 === 0 ? Track.A : Track.B,
        completedCount: lessonsCompleted,
      },
    });
  }

  // 5. POWER USERS (50+ lessons, max progress) - IDs 81-90
  for (let i = 1; i <= 10; i++) {
    const lessonsCompleted = Math.floor(Math.random() * 11) + 50;
    const exercisesCompleted = lessonsCompleted * (Math.floor(Math.random() * 15) + 12);
    const currentStreak = Math.floor(Math.random() * 50) + 50;
    const currentLevel = Math.floor(lessonsCompleted / 5) + 5;

    users.push({
      email: `poweruser${i}@test.com`,
      name: `Power User ${i}`,
      role: UserRole.STUDENT,
      progress: {
        currentXP: lessonsCompleted * 50 + exercisesCompleted * 10 + currentLevel * 200,
        currentLevel,
        currentStreak,
        longestStreak: currentStreak + Math.floor(Math.random() * 30),
        lessonsCompleted,
        exercisesCompleted,
        totalTimeSpent: lessonsCompleted * 2000 + exercisesCompleted * 250,
        averageAccuracy: 90 + Math.random() * 10,
        lastActiveDate: new Date(),
      },
      achievements: 15, // All achievements
      lessons: {
        track: Track.A, // Completed full track
        completedCount: lessonsCompleted,
      },
    });
  }

  // 6. INACTIVE USERS (good progress but inactive) - IDs 91-95
  for (let i = 1; i <= 5; i++) {
    const lessonsCompleted = Math.floor(Math.random() * 15) + 10;
    const exercisesCompleted = lessonsCompleted * (Math.floor(Math.random() * 10) + 8);
    const inactiveDays = Math.floor(Math.random() * 30) + 30; // 30-60 days inactive

    users.push({
      email: `inactive${i}@test.com`,
      name: `Inactive Student ${i}`,
      role: UserRole.STUDENT,
      progress: {
        currentXP: lessonsCompleted * 50 + exercisesCompleted * 10,
        currentLevel: Math.floor(lessonsCompleted / 5) + 2,
        currentStreak: 0, // Streak broken
        longestStreak: Math.floor(Math.random() * 20) + 10,
        lessonsCompleted,
        exercisesCompleted,
        totalTimeSpent: lessonsCompleted * 1500 + exercisesCompleted * 200,
        averageAccuracy: 75 + Math.random() * 10,
        lastActiveDate: new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000),
      },
      achievements: Math.floor(Math.random() * 5) + 2,
      lessons: {
        track: i % 2 === 0 ? Track.A : Track.B,
        completedCount: lessonsCompleted,
      },
    });
  }

  // 7. TEACHERS - IDs 96-98
  for (let i = 1; i <= 3; i++) {
    users.push({
      email: `teacher${i}@test.com`,
      name: `Teacher ${i}`,
      role: UserRole.TEACHER,
    });
  }

  // 8. ADMINS - IDs 99-100
  for (let i = 1; i <= 2; i++) {
    users.push({
      email: `admin${i}@test.com`,
      name: `Admin ${i}`,
      role: UserRole.ADMIN,
    });
  }

  return users;
}

async function seedUsers() {
  console.log('🌱 Starting seed: 100 diverse users...\n');

  const users = await generateUsers();
  const hashedPassword = await bcrypt.hash('Test123@', 10);

  let createdCount = 0;
  let skippedCount = 0;

  for (const userData of users) {
    try {
      // Check if user already exists
      const existing = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existing) {
        console.log(`⏭️  Skipped: ${userData.email} (already exists)`);
        skippedCount++;
        continue;
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: userData.role,
        },
      });

      // Create user progress if applicable
      if (userData.progress && userData.role === UserRole.STUDENT) {
        await prisma.userProgress.create({
          data: {
            userId: user.id,
            ...userData.progress,
          },
        });
      }

      console.log(`✅ Created: ${userData.email} (${userData.role})`);
      createdCount++;

    } catch (error) {
      console.error(`❌ Error creating ${userData.email}:`, error.message);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Created: ${createdCount} users`);
  console.log(`   ⏭️  Skipped: ${skippedCount} users (already exist)`);
  console.log(`   📧 All users can login with password: Test123@`);
}

async function main() {
  try {
    await seedUsers();
    console.log('\n✨ Seed completed successfully!');
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
