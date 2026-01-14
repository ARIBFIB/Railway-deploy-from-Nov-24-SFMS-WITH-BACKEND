import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing configuration');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
    console.log('Testing insert with service_role...');
    const { data, error } = await supabase
        .from('quotes')
        .insert({
            foundation_id: '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9',
            quote_number: 'TEST-SCRIPT-001',
            quote_date: new Date().toISOString().split('T')[0],
            total_amount: 100,
            total_vat: 25,
            status: 'draft'
        })
        .select()
        .single();

    if (error) {
        console.error('❌ Insert failed:', error);
    } else {
        console.log('✅ Insert successful:', data);
    }
}

test();
