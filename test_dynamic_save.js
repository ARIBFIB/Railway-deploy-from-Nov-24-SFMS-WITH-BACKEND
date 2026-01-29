// Simple test script to verify user data and foundation setup
console.log('=== Salary Agreements Dynamic Save Test ===');

// Check if we have user data in localStorage
const userData = localStorage.getItem('user');
const foundationData = localStorage.getItem('currentFoundation');

console.log('User data in localStorage:', userData ? '✓ Present' : '✗ Missing');
console.log('Foundation data in localStorage:', foundationData ? '✓ Present' : '✗ Missing');

if (userData) {
  try {
    const user = JSON.parse(userData);
    console.log('User ID:', user.id || 'Not found');
    console.log('User Foundation ID:', user.foundation_id || 'Not found');
  } catch (e) {
    console.log('Error parsing user data:', e.message);
  }
}

if (foundationData) {
  try {
    const foundation = JSON.parse(foundationData);
    console.log('Foundation ID:', foundation.id || 'Not found');
    console.log('Foundation Name:', foundation.name || 'Not found');
  } catch (e) {
    console.log('Error parsing foundation data:', e.message);
  }
}

// Test the foundation ID retrieval function
function getFoundationId() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.foundation_id || '00000000-0000-0000-0000-000000000000';
  } catch (e) {
    return '00000000-0000-0000-0000-000000000000';
  }
}

console.log('Foundation ID for API calls:', getFoundationId());

console.log('\n=== SQL Migration Instructions ===');
console.log('1. Run the following SQL files in Supabase:');
console.log('   - 20260128100000_create_salary_agreements_dynamic.sql');
console.log('   - 20260128100001_setup_foundation_user.sql');
console.log('\n2. These files will create:');
console.log('   - salary_agreements table with proper structure');
console.log('   - Test foundation and user setup');
console.log('   - RLS policies for secure access');
console.log('   - Sample data for testing');
console.log('\n3. After running migrations, the dynamic save should work!');