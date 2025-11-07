import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Master seed runner - executes all seed scripts in correct order
 */

async function runSeed(scriptPath: string, description: string) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`🌱 ${description}`);
  console.log(`${'='.repeat(70)}\n`);

  try {
    execSync(`npx tsx ${scriptPath}`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    console.log(`\n✅ ${description} - COMPLETED\n`);
  } catch (error) {
    console.error(`\n❌ ${description} - FAILED\n`);
    throw error;
  }
}

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════════════╗');
  console.log('║                arQ Platform - Master Seed Runner                  ║');
  console.log('╚═══════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  const startTime = Date.now();

  try {
    // Verify database connection
    console.log('🔍 Verifying database connection...');
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // Run seeds in order
    await runSeed(
      'prisma/seeds/seed-achievements.ts',
      'Seeding Achievements'
    );

    await runSeed(
      'prisma/seeds/seed-100-users.ts',
      'Seeding 100 Diverse Users'
    );

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║                    ✨ ALL SEEDS COMPLETED! ✨                     ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝');
    console.log(`\n⏱️  Total time: ${duration}s\n`);

    console.log('📧 Test User Credentials:');
    console.log('   • New users: newuser1@test.com to newuser20@test.com');
    console.log('   • Beginners: beginner1@test.com to beginner20@test.com');
    console.log('   • Intermediate: intermediate1@test.com to intermediate20@test.com');
    console.log('   • Advanced: advanced1@test.com to advanced20@test.com');
    console.log('   • Power users: poweruser1@test.com to poweruser10@test.com');
    console.log('   • Inactive: inactive1@test.com to inactive5@test.com');
    console.log('   • Teachers: teacher1@test.com to teacher3@test.com');
    console.log('   • Admins: admin1@test.com to admin2@test.com');
    console.log('   • Password for all: Test123@\n');

  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
