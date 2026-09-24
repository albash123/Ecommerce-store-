// Deliberately do not load .env: an explicit database URL prevents accidentally
// using the development database while preparing production.
// Capture first because importing Prisma can itself load a nearby .env file.
const environment = { ...process.env };
const [{ PrismaClient }, { bootstrapProduction }] = await Promise.all([
  import('@prisma/client'),
  import('../prisma/bootstrap-production.ts'),
]);
const db = new PrismaClient({ datasourceUrl: environment.DATABASE_URL });
try {
  const result = await bootstrapProduction(db, environment);
  console.log(`Production catalog and CMS initialized; administrator ${result.adminCreated ? 'created' : 'preserved'}. Existing records were preserved. New inventory starts at zero.`);
  console.log('Remove INITIAL_ADMIN_PASSWORD from the environment after this one-time bootstrap.');
} catch (error) {
  const message = error instanceof Error ? error.message : '';
  if (message.startsWith('DATABASE_URL must') || message.startsWith('APP_URL must') || message.startsWith('Set INITIAL_ADMIN_')) console.error(message);
  else console.error('Production bootstrap failed. No changes were committed. Check database access, migrations, and existing account constraints.');
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
