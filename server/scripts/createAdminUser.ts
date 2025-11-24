import { supabase } from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

export async function createAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sfms.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';
    const adminName = process.env.ADMIN_NAME || 'System Administrator';

    console.log('Creating admin user...');

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError.message);
      return;
    }

    if (!authData.user) {
      console.error('Failed to create auth user');
      return;
    }

    console.log('Auth user created:', authData.user.id);

    // Create profile with admin role
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: adminName,
        email: adminEmail,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) {
      console.error('Error creating profile:', profileError.message);
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role: admin');
    console.log('User ID:', authData.user.id);

  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the script
createAdminUser().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});