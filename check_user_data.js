// This script would normally run in the browser context
// For now, let's create a placeholder that shows what we need to check

console.log('To check user data, run this in browser console:');
console.log('JSON.parse(localStorage.getItem("user_data") || "{}")');

console.log('\nExpected structure:');
console.log('{');
console.log('  "id": "user-uuid",');
console.log('  "foundationId": "foundation-uuid",');
console.log('  "foundation_id": "foundation-uuid",');
console.log('  "email": "user@example.com"');
console.log('}');