import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './server/.env' });

// Get the database connection string from Supabase
// You'll need to get this from your Supabase dashboard
// Go to Settings -> Database -> Connection String
const connectionString = process.env.SUPABASE_DB_URL || 'postgresql://postgres:[YOUR_PASSWORD]@db.mzojxrxkcizngvvntyho.supabase.co:5432/postgres';

console.log('Connecting to database...');

const client = new Client({
  connectionString: connectionString,
});

async function applyMigration() {
  try {
    await client.connect();
    console.log('Connected to database successfully!');

    // Check if account_type column exists
    console.log('Checking if account_type column exists...');
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'chart_of_accounts' 
      AND column_name = 'account_type';
    `;
    
    const result = await client.query(checkColumnQuery);
    
    if (result.rows.length > 0) {
      console.log('account_type column already exists. Skipping column addition.');
    } else {
      console.log('account_type column does not exist. Adding it now...');
      
      // Add the account_type column
      const addColumnQuery = `
        ALTER TABLE chart_of_accounts 
        ADD COLUMN account_type TEXT NOT NULL DEFAULT 'asset' 
        CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense'));
      `;
      
      await client.query(addColumnQuery);
      console.log('account_type column added successfully!');
    }

    // Update existing records with appropriate values based on account number patterns
    console.log('Updating existing records...');
    
    // Asset accounts (typically 1xxx)
    const assetUpdateQuery = `
      UPDATE chart_of_accounts 
      SET account_type = 'asset' 
      WHERE account_number LIKE '1%';
    `;
    await client.query(assetUpdateQuery);
    console.log('Updated asset accounts (1xxx)');

    // Liability accounts (typically 2xxx)
    const liabilityUpdateQuery = `
      UPDATE chart_of_accounts 
      SET account_type = 'liability' 
      WHERE account_number LIKE '2%';
    `;
    await client.query(liabilityUpdateQuery);
    console.log('Updated liability accounts (2xxx)');

    // Equity accounts (typically 3xxx)
    const equityUpdateQuery = `
      UPDATE chart_of_accounts 
      SET account_type = 'equity' 
      WHERE account_number LIKE '3%';
    `;
    await client.query(equityUpdateQuery);
    console.log('Updated equity accounts (3xxx)');

    // Revenue accounts (typically 4xxx)
    const revenueUpdateQuery = `
      UPDATE chart_of_accounts 
      SET account_type = 'revenue' 
      WHERE account_number LIKE '4%';
    `;
    await client.query(revenueUpdateQuery);
    console.log('Updated revenue accounts (4xxx)');

    // Expense accounts (typically 5xxx, 6xxx, 7xxx, 8xxx)
    const expenseUpdateQuery = `
      UPDATE chart_of_accounts 
      SET account_type = 'expense' 
      WHERE account_number LIKE '5%' 
      OR account_number LIKE '6%' 
      OR account_number LIKE '7%' 
      OR account_number LIKE '8%';
    `;
    await client.query(expenseUpdateQuery);
    console.log('Updated expense accounts (5xxx, 6xxx, 7xxx, 8xxx)');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.end();
  }
}

applyMigration();