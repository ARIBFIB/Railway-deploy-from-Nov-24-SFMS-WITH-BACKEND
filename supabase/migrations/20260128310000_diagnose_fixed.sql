-- Corrected diagnostic SQL to check current database state
-- This fixes the column name error and provides proper diagnostics

-- Check if table exists and show its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'salary_agreements' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any existing rows
SELECT COUNT(*) as total_rows FROM public.salary_agreements;

-- Show first few rows if they exist
SELECT * FROM public.salary_agreements LIMIT 3;

-- Check for any existing RLS policies (corrected column name)
SELECT 
    polname,
    polrelid::regclass as tablename,
    polroles,
    polcmd
FROM pg_policy 
WHERE polrelid = 'salary_agreements'::regclass;

-- Check if RLS is enabled
SELECT 
    relname as table_name,
    relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'salary_agreements';

-- Check for any existing triggers
SELECT 
    tgname as trigger_name,
    tgtype as trigger_type
FROM pg_trigger 
WHERE tgrelid = 'salary_agreements'::regclass;