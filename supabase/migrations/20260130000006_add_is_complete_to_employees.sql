-- Add missing is_complete column to employees table
-- This fixes the "column employees.is_complete does not exist" error

-- Add the is_complete column if it doesn't exist
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS is_complete BOOLEAN DEFAULT true;

-- Update existing records to have is_complete = true
UPDATE employees 
SET is_complete = true 
WHERE is_complete IS NULL;

-- Verify the column was added
SELECT 'Employees table structure after adding is_complete' as info;
SELECT 
    column_name,
    is_nullable,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'employees' 
AND column_name = 'is_complete';