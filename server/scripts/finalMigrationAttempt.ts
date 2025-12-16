import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import https from 'https';

dotenv.config({ path: path.join(__dirname, '../.env') });

// Helper function to make HTTPS requests (since fetch might not be available)
function makeRequest(url: string, options: any): Promise<{ ok: boolean; status: number; text: () => Promise<string> }> {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = https.request(reqOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    ok: res.statusCode! >= 200 && res.statusCode! < 300,
                    status: res.statusCode!,
                    text: async () => data
                });
            });
        });

        req.on('error', reject);
        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

async function runMigrationViaAPI() {
    console.log('🚀 Attempting to run migration via Supabase Management API...\n');

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('❌ Missing Supabase credentials');
        process.exit(1);
    }

    // Read the SQL
    const sqlFile = path.join(__dirname, '../../FIX_ROLES_TABLE.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf-8');

    // Remove comments and split into individual statements
    const statements = sqlContent
        .split('\n')
        .filter(line => !line.trim().startsWith('--') && line.trim().length > 0)
        .join('\n')
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Try to execute via Supabase REST API
    const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

    for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        console.log(`${i + 1}/${statements.length} Executing: ${statement.substring(0, 60)}...`);

        try {
            const response = await makeRequest(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`
                },
                body: JSON.stringify({ query: statement })
            });

            if (!response.ok) {
                const error = await response.text();
                console.log(`   ⚠️  API method not available: ${error.substring(0, 100)}`);
                break;
            }

            console.log(`   ✅ Success`);
        } catch (error: any) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 MANUAL STEPS REQUIRED');
    console.log('='.repeat(60));
    console.log('\nSupabase does not allow executing raw SQL via API.');
    console.log('You need to run the SQL manually.\n');
    console.log('✅ EASIEST SOLUTION:');
    console.log('   1. Ask your project owner for Supabase dashboard access');
    console.log('   2. OR ask them to run the SQL from: FIX_ROLES_TABLE.sql');
    console.log('\n📧 Send them this message:');
    console.log('   ---');
    console.log('   "Please login to Supabase dashboard and run the SQL');
    console.log('   from FIX_ROLES_TABLE.sql in the SQL Editor."');
    console.log('   ---');
    console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard');
    console.log(`📦 Project: ${projectRef}`);
}

runMigrationViaAPI()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
