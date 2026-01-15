
// import fetch from 'node-fetch'; // Native fetch available in Node 18+
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const API_URL = 'http://localhost:3001/api/invoices';
// Use the service key to bypass auth middleware logic if we can mocking the user, 
// OR use the service key as a Bearer token if the backend is configured to accept it (which test_api_fail.ts implies).
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b2p4cnhrY2l6bmd2dm50eWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyNzQ5MCwiZXhwIjoyMDcxOTAzNDkwfQ.iz6wzunzC8X9Jx68DupSAYQ6zJgspl5zpkxm_t-psqU';

const foundationId = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

async function testCreateInvoice() {
    console.log('Testing Create Invoice with Full Fields...');

    // 1. Prepare Payload with ALL new fields
    const payload = {
        invoice_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_terms: '30 dagar',
        invoice_type: 'invoice',
        currency: 'SEK',

        invoice_address: 'Test Street 1',
        invoice_address_2: 'Suite 100',
        postcode: '12345',
        city: 'Test City',
        country: 'Sweden',
        cin: '555555-5555',

        your_order_number: 'ORD-123',
        your_reference: 'John Doe',
        our_reference: 'Jane Max',

        delivery_name: 'Delivery Corp',
        delivery_address: 'Warehouse Ave 5',
        delivery_address_2: 'Gate 3',
        delivery_postcode: '54321',
        delivery_city: 'Logistics City',
        delivery_country: 'Sweden',
        delivery_date: new Date().toISOString(),
        delivery_method: 'Post',

        shipping_fee: 150,
        invoice_fee: 50,
        invoice_discount_percent: 10,
        price_list: 'A',
        prices_incl_vat: true,

        email: 'billing@test.com',
        phone: '123-456-7890',

        items: [
            {
                description: 'Test Item 1',
                quantity: 2,
                unit_price: 1000,
                unit: 'pcs',
                discount_percent: 0,
                vat_rate: 25
            }
        ]
    };

    const url = `${API_URL}?foundation_id=${foundationId}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
            },
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        const data = await response.json();

        if (response.ok) {
            console.log('✅ Invoice Created Successfully:', data.id);
            console.log('Retrieved Data:', data);

            // Validate specific fields were saved
            if (data.invoice_address === 'Test Street 1' &&
                data.shipping_fee === 150 &&
                data.delivery_city === 'Logistics City') {
                console.log('✅ New fields verified correctly.');
            } else {
                console.error('❌ Fields mismatch!', data);
            }
        } else {
            console.error('❌ Creation Failed:', data);
        }

    } catch (error) {
        console.error('❌ Test Execution Error:', error);
    }
}

testCreateInvoice();
