// Node.js script to explore your Supabase database
// Usage: node explore-db.js

const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Database connection details
const DB_HOST = 'db.mzojxrxkcizngvvntyho.supabase.co';
const DB_PORT = '5432';
const DB_NAME = 'postgres';
const DB_USER = 'postgres';

// You'll need to get these from your Supabase dashboard
const SUPABASE_URL = 'https://mzojxrxkcizngvvntyho.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Get this from your Supabase dashboard

console.log('=== Supabase Database Explorer ===\n');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Function to explore tables using Supabase client
async function exploreWithSupabase() {
    console.log('To use this method, you need to:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Go to Settings > API');
    console.log('3. Copy your anon/public key');
    console.log('4. Replace "your-anon-key-here" in this script\n');
    
    const anonKey = await askQuestion('Enter your Supabase anon key (or press Enter to skip): ');
    
    if (!anonKey || anonKey === 'your-anon-key-here') {
        console.log('Skipping Supabase client method...\n');
        return;
    }
    
    try {
        const supabase = createClient(SUPABASE_URL, anonKey);
        
        console.log('Connected to Supabase! Exploring tables...\n');
        
        // Get all tables
        const { data: tables, error } = await supabase
            .from('information_schema.tables')
            .select('table_name, table_type')
            .eq('table_schema', 'public');
            
        if (error) {
            console.error('Error fetching tables:', error.message);
            return;
        }
        
        console.log('=== Available Tables ===');
        tables.forEach(table => {
            console.log(`• ${table.table_name} (${table.table_type})`);
        });
        
        console.log('\n=== Sample Data from Each Table ===');
        
        for (const table of tables) {
            if (table.table_type === 'BASE TABLE') {
                console.log(`\n--- ${table.table_name} ---`);
                try {
                    const { data, error } = await supabase
                        .from(table.table_name)
                        .select('*')
                        .limit(3);
                        
                    if (error) {
                        console.log(`Error: ${error.message}`);
                    } else {
                        console.log(`Rows: ${data.length}`);
                        if (data.length > 0) {
                            console.log('Sample data:', JSON.stringify(data, null, 2));
                        }
                    }
                } catch (err) {
                    console.log(`Error accessing ${table.table_name}: ${err.message}`);
                }
            }
        }
        
    } catch (error) {
        console.error('Error connecting to Supabase:', error.message);
    }
}

// Function to show direct connection commands
function showDirectConnectionCommands() {
    console.log('=== Direct Database Connection Commands ===\n');
    
    console.log('1. Using psql (PostgreSQL client):');
    console.log(`   psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}\n`);
    
    console.log('2. Using Supabase CLI:');
    console.log('   npx supabase db pull                    # Pull schema from remote');
    console.log('   npx supabase db dump --data-only        # Dump data only');
    console.log('   npx supabase db dump --schema-only      # Dump schema only');
    console.log('   npx supabase db dump                    # Dump everything\n');
    
    console.log('3. Useful psql commands once connected:');
    console.log('   \\dt                    # List all tables');
    console.log('   \\d table_name         # Describe a specific table');
    console.log('   \\dn                   # List all schemas');
    console.log('   \\l                    # List all databases');
    console.log('   \\q                    # Quit psql\n');
    
    console.log('4. Useful SQL queries:');
    console.log('   SELECT * FROM information_schema.tables WHERE table_schema = \'public\';');
    console.log('   SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'your_table\';');
    console.log('   SELECT COUNT(*) FROM your_table;');
}

// Main function
async function main() {
    console.log('Database Connection Details:');
    console.log(`Host: ${DB_HOST}`);
    console.log(`Port: ${DB_PORT}`);
    console.log(`Database: ${DB_NAME}`);
    console.log(`User: ${DB_USER}\n`);
    
    const choice = await askQuestion('Choose an option:\n1. Explore with Supabase client\n2. Show direct connection commands\n3. Both\nEnter choice (1-3): ');
    
    switch (choice) {
        case '1':
            await exploreWithSupabase();
            break;
        case '2':
            showDirectConnectionCommands();
            break;
        case '3':
            await exploreWithSupabase();
            showDirectConnectionCommands();
            break;
        default:
            console.log('Invalid choice. Showing direct connection commands...\n');
            showDirectConnectionCommands();
    }
    
    rl.close();
}

// Run the main function
main().catch(console.error);
