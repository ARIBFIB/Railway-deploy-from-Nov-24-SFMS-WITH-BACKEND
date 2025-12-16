import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function runMigrationWithPg() {
    console.log('🚀 Running migration using PostgreSQL client...\n');

    // Supabase connection details
    const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

    // Construct PostgreSQL connection string
    // Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
    const connectionString = `postgresql://postgres.${projectRef}:${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;

    console.log('📍 Connecting to Supabase PostgreSQL...');
    console.log('🔗 Project:', projectRef);

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('✅ Connected to database!\n');

        // Read the SQL file
        const sqlFile = path.join(__dirname, '../../FIX_ROLES_TABLE.sql');
        const sql = fs.readFileSync(sqlFile, 'utf-8');

        console.log('📄 Executing SQL migration...\n');

        // Execute the SQL
        await client.query(sql);

        console.log('✅ Migration executed successfully!\n');
        console.log('🎉 The roles table has been fixed!');
        console.log('📊 You can now:');
        console.log('   - Refresh your app');
        console.log('   - Create, edit, and delete roles');
        console.log('   - Dashboard count will update automatically');

    } catch (error: any) {
        console.error('❌ Error executing migration:', error.message);
        console.log('\n💡 This might be a connection issue.');
        console.log('   The connection string format might need adjustment.');
        console.log('\n📋 Please run the SQL manually from FIX_ROLES_TABLE.sql');
    } finally {
        await client.end();
    }
}

runMigrationWithPg()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Fatal error:', error.message);
        process.exit(1);
    });
