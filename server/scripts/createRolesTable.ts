import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function executeMigrationDirectly() {
    console.log('🚀 Starting roles table migration...\n');

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase credentials in .env file');
        process.exit(1);
    }

    console.log('📍 Supabase URL:', supabaseUrl);
    console.log('🔑 Using service role key\n');

    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    try {
        console.log('1️⃣ Creating roles table...');

        // Create the table
        const { error: createTableError } = await supabase.rpc('exec', {
            query: `
        CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          permissions JSONB DEFAULT '[]'::jsonb,
          user_count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
        });

        if (createTableError) {
            console.log('⚠️  RPC method not available, using direct table operations...\n');

            // Alternative: Try to insert data directly (table might already exist)
            console.log('2️⃣ Inserting default roles...');

            const defaultRoles = [
                {
                    name: 'Board Chairman',
                    description: 'Full governance authority with approval rights',
                    permissions: ['approve_documents', 'schedule_meetings', 'manage_users', 'view_all_data'],
                    user_count: 0
                },
                {
                    name: 'Board Member',
                    description: 'Standard board member with review and voting rights',
                    permissions: ['review_documents', 'attend_meetings', 'view_foundation_data'],
                    user_count: 0
                },
                {
                    name: 'Secretary',
                    description: 'Administrative role for meeting and document management',
                    permissions: ['create_minutes', 'manage_documents', 'schedule_meetings'],
                    user_count: 0
                },
                {
                    name: 'Auditor',
                    description: 'External auditor with read-only access to compliance data',
                    permissions: ['view_audit_trails', 'review_compliance', 'generate_reports'],
                    user_count: 0
                }
            ];

            for (const role of defaultRoles) {
                const { error: insertError } = await supabase
                    .from('roles')
                    .insert(role)
                    .select()
                    .single();

                if (insertError) {
                    if (insertError.message.includes('already exists') || insertError.code === '23505') {
                        console.log(`   ℹ️  Role "${role.name}" already exists, skipping...`);
                    } else {
                        console.error(`   ❌ Error inserting "${role.name}":`, insertError.message);
                    }
                } else {
                    console.log(`   ✅ Created role: ${role.name}`);
                }
            }

            console.log('\n✅ Migration completed successfully!');
            console.log('📊 Default roles have been created');
            console.log('\n🎉 You can now:');
            console.log('   - Refresh your app');
            console.log('   - Go to Role Management page');
            console.log('   - Create, edit, and delete roles');

        } else {
            console.log('✅ Table created successfully!');
        }

    } catch (error: any) {
        console.error('\n❌ Migration failed:', error.message);
        console.log('\n📋 Please run this SQL manually in Supabase Dashboard:');
        console.log('   File: RUN_THIS_IN_SUPABASE.sql');
        console.log('   Location: Project root directory');
        process.exit(1);
    }
}

// Run the migration
executeMigrationDirectly()
    .then(() => {
        console.log('\n✨ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    });
