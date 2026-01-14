
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api/quotes';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b2p4cnhrY2l6bmd2dm50eWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyNzQ5MCwiZXhwIjoyMDcxOTAzNDkwfQ.iz6wzunzC8X9Jx68DupSAYQ6zJgspl5zpkxm_t-psqU';

const quoteId = '65f7d104-988f-418f-9728-12c622f1e9ed';
const foundationId = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

async function testApiUpdate() {
    console.log('Testing API update for quote:', quoteId);
    const url = `${API_URL}/${quoteId}?foundation_id=${foundationId}`;
    console.log('URL:', url);

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify({
                status: 'sent'
            })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response body:', data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testApiUpdate();
