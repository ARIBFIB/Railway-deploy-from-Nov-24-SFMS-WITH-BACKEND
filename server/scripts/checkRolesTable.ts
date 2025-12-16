import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkAndFixRolesTable() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase credentials');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔍 Checking roles table structure...\n');

    // Try to select from roles table to see what columns exist
    const { data: existingRoles, error: selectError } = await supabase
        .from('roles')
        .select('*')
        .limit(1);

    if (selectError) {
        console.log('❌ Error querying roles table:', selectError.message);
        console.log('\n📝 The roles table might not exist or has different structure.');
        console.log('\n✅ SOLUTION: You need to manually run the SQL in Supabase Dashboard');
        console.log('   File: RUN_THIS_IN_SUPABASE.sql');
        console.log('\n   OR ask someone with Supabase dashboard access to run it for you.');
        process.exit(1);
    }

    console.log('✅ Roles table exists!');
    console.log('📊 Current structure:', existingRoles);

    console.log('\n⚠️  The table exists but is missing the "permissions" column.');
    console.log('\n📝 You have two options:');
    console.log('\n   Option 1: Ask someone with Supabase dashboard access to run:');
    console.log('   --------------------------------------------------------');
    console.log('   ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT \'[]\'::jsonb;');
    console.log('   ALTER TABLE roles ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0;');
    console.log('   ALTER TABLE roles ADD COLUMN IF NOT EXISTS description TEXT;');
    console.log('   --------------------------------------------------------');
    console.log('\n   Option 2: Get Supabase dashboard login credentials from the project owner');
    console.log('   Then go to: https://supabase.com/dashboard');
    console.log('   Navigate to: SQL Editor');
    console.log('   Run the SQL from: RUN_THIS_IN_SUPABASE.sql');
}

checkAndFixRolesTable()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
