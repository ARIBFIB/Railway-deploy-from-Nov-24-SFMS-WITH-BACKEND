import { API_BASE_URL } from './api';

// Debug utility to check authentication status
export const debugAuth = () => {
  console.log('🔍 === AUTHENTICATION DEBUG ===');

  // Check localStorage
  const token = localStorage.getItem('auth_token');
  const userDataRaw = localStorage.getItem('user_data');

  console.log('📋 Token:', {
    exists: !!token,
    length: token?.length || 0,
    preview: token ? `${token.substring(0, 20)}...` : 'No token'
  });

  console.log('👤 User Data:', {
    exists: !!userDataRaw,
    raw: userDataRaw
  });

  if (userDataRaw) {
    try {
      const userData = JSON.parse(userDataRaw);
      console.log('👤 Parsed User Data:', {
        id: userData.id,
        user_id: userData.user_id,
        foundationId: userData.foundationId,
        foundation_id: userData.foundation_id,
        role: userData.role,
        email: userData.email
      });
    } catch (e) {
      console.error('❌ Failed to parse user data:', e);
    }
  }

  // Check if we can make a simple API call
  console.log('🌐 Testing API connectivity...');

  fetch(`${API_BASE_URL}/health`)
    .then(response => {
      console.log('✅ Health check response:', response.status, response.ok);
      return response.json();
    })
    .then(data => {
      console.log('✅ Health check data:', data);
    })
    .catch(error => {
      console.error('❌ Health check failed:', error);
    });

  console.log('🔍 === END AUTHENTICATION DEBUG ===');
};

// Make it available globally for debugging
(window as any).debugAuth = debugAuth;

