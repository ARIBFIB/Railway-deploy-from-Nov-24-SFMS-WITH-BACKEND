
import dotenv from 'dotenv';
import path from 'path';
import jwt from 'jsonwebtoken';

dotenv.config({ path: path.join(__dirname, 'server', '.env') });

const serviceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Checking Service Key...');

if (!serviceKey) {
    console.error('❌ Service Key not found in environment variables');
    process.exit(1);
}

try {
    const decoded: any = jwt.decode(serviceKey);
    console.log('Key Role:', decoded.role);
    if (decoded.role === 'service_role') {
        console.log('✅ Key is a valid SERVICE ROLE key.');
    } else {
        console.error('❌ Key is NOT a service role key. It is:', decoded.role);
    }
} catch (error) {
    console.error('❌ Failed to decode key:', error);
}
