import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Starting DB migration: SEVA- prefix -> OP- prefix');
  try {
    const apps = await prisma.application.findMany();
    let count = 0;
    for (const app of apps) {
      if (app.applicationNumber && app.applicationNumber.startsWith('SEVA-')) {
        const oldNum = app.applicationNumber;
        const newNum = oldNum.replace(/^SEVA-/, 'OP-');
        console.log(`Migrating: ${oldNum} -> ${newNum}`);
        await prisma.application.update({
          where: { id: app.id },
          data: { applicationNumber: newNum }
        });
        count++;
      }
    }
    console.log(`Success: Migrated ${count} application records.`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
