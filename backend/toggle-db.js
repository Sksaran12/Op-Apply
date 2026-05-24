import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, 'prisma/schema.prisma');
const envPath = path.join(__dirname, '.env');

const mode = process.argv[2]; // 'sqlite' or 'postgres'

if (mode !== 'sqlite' && mode !== 'postgres') {
  console.log('Usage: node toggle-db.js <sqlite|postgres>');
  process.exit(1);
}

try {
  // 1. Update schema.prisma
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');
  if (mode === 'sqlite') {
    schemaContent = schemaContent.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
    console.log('[Toggle DB] Swapped provider to "sqlite" in schema.prisma');
  } else {
    schemaContent = schemaContent.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
    console.log('[Toggle DB] Swapped provider to "postgresql" in schema.prisma');
  }
  fs.writeFileSync(schemaPath, schemaContent);

  // 2. Update .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  if (mode === 'sqlite') {
    // Replace DATABASE_URL line
    envContent = envContent.replace(
      /DATABASE_URL\s*=\s*".*"/g,
      'DATABASE_URL="file:./dev.db"'
    );
    console.log('[Toggle DB] Set DATABASE_URL to "file:./dev.db" in .env');
  } else {
    envContent = envContent.replace(
      /DATABASE_URL\s*=\s*".*"/g,
      'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/examseva?schema=public"'
    );
    console.log('[Toggle DB] Set DATABASE_URL to PostgreSQL connection string in .env');
  }
  fs.writeFileSync(envPath, envContent);

  console.log(`[Toggle DB] Successfully toggled development database to: ${mode.toUpperCase()}`);
} catch (error) {
  console.error('[Toggle DB Error] Toggle failed:', error.message);
  process.exit(1);
}
