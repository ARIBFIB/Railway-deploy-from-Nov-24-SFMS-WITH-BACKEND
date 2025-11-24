const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Debugging Database Connection...');
console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function debugDatabase() {
  try {
    console.log('\n1️⃣ Testing database connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Connection test failed:', testError);
      return;
    }
    
    console.log('✅ Database connection successful');
    
    // Check profiles table structure
    console.log('\n2️⃣ Checking profiles table structure...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError);
    } else {
      console.log('✅ Profiles table accessible');
      if (profiles && profiles.length > 0) {
        console.log('📋 Sample profile structure:', Object.keys(profiles[0]));
      }
    }
    
    // Test inserting a test profile
    console.log('\n3️⃣ Testing profile insertion...');
    const testProfile = {
      id: '00000000-0000-0000-0000-000000000001', // Valid UUID format
      full_name: 'Test User',
      email: 'test@example.com',
      role: 'member',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert(testProfile)
      .select();
    
    if (insertError) {
      console.error('❌ Profile insertion failed:', insertError);
      console.error('Error details:', JSON.stringify(insertError, null, 2));
    } else {
      console.log('✅ Profile insertion successful');
      console.log('📋 Inserted profile:', insertData);
      
      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('id', testProfile.id);
      console.log('🧹 Test data cleaned up');
    }
    
    // Check if auth.users table exists and is accessible
    console.log('\n4️⃣ Checking auth integration...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth users access failed:', authError);
    } else {
      console.log('✅ Auth users accessible');
      console.log('📊 Total users:', authUsers.users.length);
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugDatabase();
