
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mzojxrxkcizngvvntyho.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b2p4cnhrY2l6bmd2dm50eWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyNzQ5MCwiZXhwIjoyMDcxOTAzNDkwfQ.iz6wzunzC8X9Jx68DupSAYQ6zJgspl5zpkxm_t-psqU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const quoteId = '65f7d104-988f-418f-9728-12c622f1e9ed';
const foundationId = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

async function testUpdate() {
    console.log('Testing update for quote:', quoteId);
    console.log('Foundation ID:', foundationId);

    // 1. Check if it exists first
    const { data: exists, error: existError } = await supabase
        .from('quotes')
        .select('id, status, foundation_id')
        .eq('id', quoteId)
        .single();

    if (existError) {
        console.error('Error finding quote:', existError);
    } else {
        console.log('Quote found:', exists);
        if (exists.foundation_id !== foundationId) {
            console.error('Foundation ID mismatch! DB has:', exists.foundation_id);
        }
    }

    // 2. Try update
    console.log('Attempting update...');
    const { data: updated, error: updateError } = await supabase
        .from('quotes')
        .update({ status: 'sent', updated_at: new Date().toISOString() })
        .eq('id', quoteId)
        .eq('foundation_id', foundationId)
        .select()
        .single();

    if (updateError) {
        console.error('Update failed:', updateError);
    } else {
        console.log('Update successful:', updated);
    }
}

testUpdate();
