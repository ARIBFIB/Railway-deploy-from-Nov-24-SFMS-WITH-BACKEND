
const API_BASE_URL = 'http://localhost:3001';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'AdminPass123';

async function run() {
    // Login
    const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    // Get Verifications
    const res = await fetch(`${API_BASE_URL}/api/verifications`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-Foundation-ID': 'foundation-1'
        }
    });
    const data = await res.json();

    console.log('Verifications Data Sample:', JSON.stringify(data.data[0], null, 2));
}

run();
