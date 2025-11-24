import { supabase } from '../config/database';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  const migrationFile = path.join(__dirname, '../../supabase/migrations/20250112_create_salary_settings.sql');
  
  console.log('📄 Reading migration file...');
  const sql = fs.readFileSync(migrationFile, 'utf-8');
  
  console.log('🚀 Executing migration...');
  
  try {
    // Split SQL by semicolons and execute each statement
    // Note: Supabase JS client doesn't support raw SQL execution directly
    // This approach uses the REST API to execute SQL
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // For Supabase, we need to use the REST API or psql
    // Since we can't execute raw SQL easily, let's try using the database connection
    // We'll need to use a different approach - directly connecting via pg client
    
    console.log('⚠️  Note: Supabase JS client cannot execute raw SQL statements directly.');
    console.log('📝 Migration file prepared at:', migrationFile);
    console.log('💡 Please run this migration using one of the following methods:');
    console.log('   1. Supabase Dashboard -> SQL Editor');
    console.log('   2. psql command line tool');
    console.log('   3. Supabase CLI: supabase db push');
    
    // Try to execute via RPC if we have that capability
    // For now, we'll output the SQL for manual execution
    console.log('\n📋 Migration SQL:\n');
    console.log(sql);
    
  } catch (error) {
    console.error('❌ Error running migration:', error);
    throw error;
  }
}

if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('\n✅ Migration script completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Migration failed:', error);
      process.exit(1);
    });
}

export { runMigration };

