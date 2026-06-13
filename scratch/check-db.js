const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables in database:', tables.map(t => t.table_name));
    
    // Specifically check for Startup
    const startupTable = tables.find(t => t.table_name.toLowerCase() === 'startup');
    if (startupTable) {
      console.log('✅ Startup table exists!');
    } else {
      console.log('❌ Startup table NOT found!');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
