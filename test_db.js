const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const webinars = await prisma.webinar.findMany({ take: 2 });
  console.log(JSON.stringify(webinars, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
