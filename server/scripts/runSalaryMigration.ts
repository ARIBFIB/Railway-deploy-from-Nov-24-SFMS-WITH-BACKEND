import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
  // Get connection details from environment variables
  // Supabase connection string format: postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('VITE_SUPABASE_URL is not set in environment variables');
  }

  // Extract database connection details from Supabase URL
  // For Supabase, we need to construct the direct PostgreSQL connection string
  // Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  
  // Try to get direct database connection from environment
  const dbConnectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  
  if (!dbConnectionString && !supabaseServiceKey) {
    console.error('❌ Missing database connection information.');
    console.error('Please provide either:');
    console.error('  - DATABASE_URL or SUPABASE_DB_URL environment variable, OR');
    console.error('  - Use Supabase Dashboard -> SQL Editor to run the migration manually');
    console.error('\n📋 Migration file location:');
    console.error(path.join(__dirname, '../../supabase/migrations/20250112_create_salary_settings.sql'));
    return;
  }

  let pool: Pool;
  
  if (dbConnectionString) {
    pool = new Pool({
      connectionString: dbConnectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  } else {
    // If we only have the Supabase URL and service key, we can't directly connect
    // Show instructions instead
    console.log('⚠️  Cannot execute migration directly with current configuration.');
    console.log('\n📋 To run this migration, please:');
    console.log('1. Open Supabase Dashboard -> SQL Editor');
    console.log('2. Copy and paste the contents of the migration file:');
    console.log(`   ${path.join(__dirname, '../../supabase/migrations/20250112_create_salary_settings.sql')}`);
    console.log('3. Click "Run" to execute');
    return;
  }

  const migrationFile = path.join(__dirname, '../../supabase/migrations/20250112_create_salary_settings.sql');
  
  console.log('📄 Reading migration file...');
  const sql = fs.readFileSync(migrationFile, 'utf-8');
  
  console.log('🚀 Executing migration...');
  
  try {
    const client = await pool.connect();
    
    try {
      // Execute the SQL migration
      await client.query(sql);
      console.log('✅ Migration executed successfully!');
      console.log('✅ salary_settings table created with RLS disabled');
    } catch (error: any) {
      console.error('❌ Error executing migration:', error.message);
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('❌ Database connection error:', error.message);
    throw error;
  } finally {
    await pool.end();
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
      console.error('\n💡 Alternative: Run the migration via Supabase Dashboard -> SQL Editor');
      process.exit(1);
    });
}

export { runMigration };

