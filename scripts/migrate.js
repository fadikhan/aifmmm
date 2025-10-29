// Database migration runner
// Run with: node ./scripts/migrate.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 Running database migrations...\n');

const sqlFile = path.join(__dirname, '../db/migrations/001_init.sql');
const sql = fs.readFileSync(sqlFile, 'utf-8');

console.log('Migration SQL loaded from:', sqlFile);
console.log('\n⚠️  To apply this migration to Supabase:');
console.log('   1. Go to your Supabase project SQL Editor');
console.log('   2. Copy the contents of db/migrations/001_init.sql');
console.log('   3. Paste and run in the SQL Editor');
console.log('\nAlternatively, use Supabase CLI:');
console.log('   supabase db push\n');

// For now, just echo the SQL
console.log('--- Migration SQL ---\n');
console.log(sql);

