import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
    const foundation_id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

    console.log('1. Creating a test quote...');
    const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
            foundation_id,
            quote_number: 'TEST-ITEMS-003',
            quote_date: '2026-01-01',
            total_amount: 30,
            total_vat: 7.5,
            status: 'draft'
        })
        .select()
        .single();

    if (quoteError) {
        console.error('❌ Quote creation failed:', quoteError);
        return;
    }

    console.log('✅ Quote created:', quote.id);

    // Payload similar to what frontend sends
    const items = [
        {
            line_number: 1,
            product_id: null,
            article_number: '',
            description: 'Item 1',
            quantity: 1,
            unit: 'pcs',
            unit_price: 10,
            vat_rate: 25,
            account_number: '',
            tg_percent: 100
        }
    ];

    console.log('2. Preparing and inserting quote items...');
    const quoteItems = items.map((item: any, index: number) => {
        const lineTotal = (item.quantity || 0) * (item.unit_price || 0);
        const discountAmount = lineTotal * ((item.discount_percent || 0) / 100);
        const itemTotal = lineTotal - discountAmount;

        return {
            quote_id: quote.id,
            line_number: index + 1,
            product_id: item.product_id,
            article_number: item.article_number,
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            discount_percent: item.discount_percent || 0,
            discount_amount: discountAmount,
            line_total: itemTotal,
            vat_rate: item.vat_rate || 0,
            vat_amount: itemTotal * ((item.vat_rate || 0) / 100),
            account_number: item.account_number,
            tg_percent: item.tg_percent,
            created_at: new Date().toISOString()
        };
    });

    const { error: itemsError } = await supabase
        .from('quote_items')
        .insert(quoteItems);

    if (itemsError) {
        console.error('❌ Items insertion failed:', itemsError);
    } else {
        console.log('✅ Items inserted successfully');
    }

    // Cleanup
    console.log('3. Cleaning up...');
    await supabase.from('quotes').delete().eq('id', quote.id);
}

test();
