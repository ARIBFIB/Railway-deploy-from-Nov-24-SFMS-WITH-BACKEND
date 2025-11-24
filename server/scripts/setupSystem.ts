import { createAdminUser } from './createAdminUser';
import { setupDocumentTypesForAllFoundations } from './setupDocumentTypes';
import { supabase } from '../config/database';

async function setupSystem() {
  try {
    console.log('🚀 Starting SFMS system setup...\n');

    // Step 1: Test database connection
    console.log('1. Testing database connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    console.log('✅ Database connection successful\n');

    // Step 2: Create admin user
    console.log('2. Setting up admin user...');
    await createAdminUser();
    console.log('✅ Admin user setup completed\n');

    // Step 3: Setup document types for existing foundations
    console.log('3. Setting up document types for existing foundations...');
    await setupDocumentTypesForAllFoundations();
    console.log('✅ Document types setup completed\n');

    console.log('🎉 SFMS system setup completed successfully!');
    console.log('\n📋 Setup Summary:');
    console.log('- Admin user created with email: admin@sfms.com');
    console.log('- Default document types created for all foundations');
    console.log('- System is ready for use');

  } catch (error) {
    console.error('❌ System setup failed:', error);
    throw error;
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupSystem()
    .then(() => {
      console.log('\n✅ Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Setup failed:', error);
      process.exit(1);
    });
}

export { setupSystem };

