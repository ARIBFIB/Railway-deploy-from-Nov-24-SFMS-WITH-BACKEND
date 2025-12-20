-- Add account_type column to chart_of_accounts table
ALTER TABLE chart_of_accounts 
ADD COLUMN IF NOT EXISTS account_type TEXT NOT NULL DEFAULT 'asset' 
CHECK (account_type IN ('asset', 'liability', 'equity', 'revenue', 'expense'));

-- Update existing records to have appropriate default values based on account numbers
-- Asset accounts (typically 1xxx)
UPDATE chart_of_accounts 
SET account_type = 'asset' 
WHERE account_number LIKE '1%' AND (account_type IS NULL OR account_type = '');

-- Liability accounts (typically 2xxx)
UPDATE chart_of_accounts 
SET account_type = 'liability' 
WHERE account_number LIKE '2%' AND (account_type IS NULL OR account_type = '');

-- Equity accounts (typically 3xxx)
UPDATE chart_of_accounts 
SET account_type = 'equity' 
WHERE account_number LIKE '3%' AND (account_type IS NULL OR account_type = '');

-- Revenue accounts (typically 4xxx)
UPDATE chart_of_accounts 
SET account_type = 'revenue' 
WHERE account_number LIKE '4%' AND (account_type IS NULL OR account_type = '');

-- Expense accounts (typically 5xxx, 6xxx, 7xxx, 8xxx)
UPDATE chart_of_accounts 
SET account_type = 'expense' 
WHERE account_number LIKE '5%' OR account_number LIKE '6%' OR account_number LIKE '7%' OR account_number LIKE '8%' 
AND (account_type IS NULL OR account_type = '');