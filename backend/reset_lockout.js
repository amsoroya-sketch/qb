const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.updateMany({
    where: { email: 'student@arq.com' },
    data: {
      failedLoginAttempts: 0,
      lockUntil: null
    }
  });
  console.log('Reset result:', result);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
