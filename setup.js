// Cosmic Sudoku - Setup Helper Script
const fs = require('fs');
const path = require('path');

console.log('🚀 COSMIC SUDOKU - SETUP HELPER');
console.log('================================\n');

// Check .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local not found!');
  console.log('\nPlease create .env.local with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://nfieiencvlrpibdtajtr.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const hasUrl = envContent.includes('nfieiencvlrpibdtajtr.supabase.co');
const hasKey = envContent.includes('eyJ') && !envContent.includes('your_anon_key_here');

console.log('✅ .env.local exists');
console.log(hasUrl ? '✅ Supabase URL configured' : '❌ Supabase URL missing');
console.log(hasKey ? '✅ API key configured' : '❌ API key missing or placeholder');
console.log('');

if (!hasKey) {
  console.log('⚠️  Please update your API key in .env.local\n');
}

// Check SQL files
const sqlFiles = [
  'supabase/schema.sql',
  'supabase/currency-functions.sql',
  'supabase/functions.sql'
];

console.log('📄 SQL Migration Files:');
sqlFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(exists ? `✅ ${file}` : `❌ ${file} missing`);
});

console.log('\n================================');
console.log('📋 NEXT STEPS:\n');
console.log('1. Run SQL migrations in Supabase:');
console.log('   https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new\n');
console.log('2. Copy and paste each SQL file content');
console.log('3. Click "Run" for each file\n');
console.log('4. Start the dev server:');
console.log('   npm run dev\n');
console.log('================================\n');
