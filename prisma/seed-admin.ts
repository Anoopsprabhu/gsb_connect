import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'superadmin@gsbconnect.com';
  const password = 'SuperAdminPassword123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'superadmin',
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Super Admin',
      role: 'superadmin',
    },
  });

  console.log('Superadmin created/updated:', admin.email);
  console.log('Password:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
