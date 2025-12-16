import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function runRolesMigration() {
    const migrationFile = path.join(__dirname, '../../supabase/migrations/20251126_create_roles_table.sql');

    console.log('📄 Reading migration file...');
    const sql = fs.readFileSync(migrationFile, 'utf-8');

    console.log('🚀 Executing roles table migration...');

    try {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase credentials in .env file');
        }

        // Create Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Execute the SQL using Supabase's RPC
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('❌ Error executing migration via RPC:', error);
            console.log('\n📋 Please execute this SQL manually in Supabase Dashboard:\n');
            console.log(sql);
            console.log('\n💡 Steps:');
            console.log('   1. Go to https://supabase.com/dashboard');
            console.log('   2. Select your project');
            console.log('   3. Click SQL Editor');
            console.log('   4. Paste the SQL above');
            console.log('   5. Click Run');
            return;
        }

        console.log('✅ Migration executed successfully!');
        console.log('📊 Roles table created with default data');

    } catch (error) {
        console.error('❌ Error running migration:', error);
        console.log('\n📋 Migration SQL to run manually:\n');
        console.log(sql);
        console.log('\n💡 Please run this in Supabase Dashboard SQL Editor');
    }
}

if (require.main === module) {
    runRolesMigration()
        .then(() => {
            console.log('\n✅ Migration script completed');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Migration failed:', error);
            process.exit(1);
        });
}

export { runRolesMigration };
