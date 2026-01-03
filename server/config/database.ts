import { createClient } from '@supabase/supabase-js';
import Environment from './environment';

const env = Environment.load();

const supabaseUrl = env.supabaseUrl;
const supabaseServiceKey = env.supabaseServiceKey;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

// Create Supabase client with service role key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Create client for user operations (with anon key)
const supabaseAnonKey = env.supabaseAnonKey;
if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key. Please check your environment variables.');
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Database connection test
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return false;
  }
};