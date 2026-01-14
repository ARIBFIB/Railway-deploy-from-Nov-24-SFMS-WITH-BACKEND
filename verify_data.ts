
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mzojxrxkcizngvvntyho.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16b2p4cnhrY2l6bmd2dm50eWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyNzQ5MCwiZXhwIjoyMDcxOTAzNDkwfQ.iz6wzunzC8X9Jx68DupSAYQ6zJgspl5zpkxm_t-psqU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const quoteId = 'b2f99fb2-3e3d-459d-ac4a-95b96c9fff61';
const foundationId = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';
const userId = '807065b8-2e0f-414f-9ac1-a7796a968c3f';

async function verifyData() {
    console.log('--- Verifying Data ---');

    // 1. Check Quote
    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

    if (quoteError) {
        console.error('Error fetching quote:', quoteError);
    } else {
        console.log('Quote:', quote);
        console.log('Quote Foundation Matches?', quote.foundation_id === foundationId);
    }

    // 2. Check Foundation Membership
    const { data: membership, error: memberError } = await supabase
        .from('foundation_members')
        .select('*')
        .eq('foundation_id', foundationId)
        .eq('user_id', userId);

    if (memberError) {
        console.error('Error fetching membership:', memberError);
    } else {
        console.log('Membership:', membership);
        console.log('User is member?', membership && membership.length > 0);
    }

    // 3. Test RLS Policy Query Simulation
    const { data: policyCheck, error: policyError } = await supabase
        .from('foundation_members')
        .select('foundation_id')
        .eq('user_id', userId)
        .eq('foundation_id', foundationId);

    console.log('Policy Check Result:', policyCheck);
}

verifyData();
