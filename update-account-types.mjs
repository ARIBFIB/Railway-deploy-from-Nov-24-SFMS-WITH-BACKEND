import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './server/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Please check your environment variables.');
  process.exit(1);
}

// Create Supabase client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateAccountTypes() {
  console.log('Updating account types based on account number patterns...');

  try {
    // Asset accounts (typically 1xxx)
    console.log('Updating asset accounts (1xxx)...');
    const { data: assetData, error: assetError } = await supabase
      .from('chart_of_accounts')
      .update({ account_type: 'asset' })
      .ilike('account_number', '1%');
    
    if (assetError) {
      console.error('Error updating asset accounts:', assetError);
    } else {
      console.log(`Updated asset accounts:`, assetData);
    }

    // Liability accounts (typically 2xxx)
    console.log('Updating liability accounts (2xxx)...');
    const { data: liabilityData, error: liabilityError } = await supabase
      .from('chart_of_accounts')
      .update({ account_type: 'liability' })
      .ilike('account_number', '2%');
    
    if (liabilityError) {
      console.error('Error updating liability accounts:', liabilityError);
    } else {
      console.log(`Updated liability accounts:`, liabilityData);
    }

    // Equity accounts (typically 3xxx)
    console.log('Updating equity accounts (3xxx)...');
    const { data: equityData, error: equityError } = await supabase
      .from('chart_of_accounts')
      .update({ account_type: 'equity' })
      .ilike('account_number', '3%');
    
    if (equityError) {
      console.error('Error updating equity accounts:', equityError);
    } else {
      console.log(`Updated equity accounts:`, equityData);
    }

    // Revenue accounts (typically 4xxx)
    console.log('Updating revenue accounts (4xxx)...');
    const { data: revenueData, error: revenueError } = await supabase
      .from('chart_of_accounts')
      .update({ account_type: 'revenue' })
      .ilike('account_number', '4%');
    
    if (revenueError) {
      console.error('Error updating revenue accounts:', revenueError);
    } else {
      console.log(`Updated revenue accounts:`, revenueData);
    }

    // Expense accounts (typically 5xxx, 6xxx, 7xxx, 8xxx)
    console.log('Updating expense accounts (5xxx, 6xxx, 7xxx, 8xxx)...');
    const { data: expenseData, error: expenseError } = await supabase
      .from('chart_of_accounts')
      .update({ account_type: 'expense' })
      .or('account_number.ilike.5%,account_number.ilike.6%,account_number.ilike.7%,account_number.ilike.8%');
    
    if (expenseError) {
      console.error('Error updating expense accounts:', expenseError);
    } else {
      console.log(`Updated expense accounts:`, expenseData);
    }

    console.log('Account type updates completed!');
  } catch (error) {
    console.error('Account type updates failed:', error);
  }
}

updateAccountTypes();