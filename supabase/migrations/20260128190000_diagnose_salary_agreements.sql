-- Diagnostic SQL to check current salary_agreements table structure
-- Run this first to see what columns currently exist

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

-- Check for any existing RLS policies
SELECT 
    policyname,
    tablename,
    permissive,
    roles,
    cmd
FROM pg_policy 
WHERE tablename = 'salary_agreements';

-- Check if RLS is enabled
SELECT 
    relname as table_name,
    relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'salary_agreements';