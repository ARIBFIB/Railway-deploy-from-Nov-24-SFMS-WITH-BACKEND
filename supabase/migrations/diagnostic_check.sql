-- Comprehensive check of personnel_categories table and related data
-- Run this in Supabase SQL editor to diagnose the exact issue

-- 1. Check if personnel_categories table exists
SELECT 'Table existence check' as info;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'personnel_categories'
) as table_exists;

-- 2. Check table structure
SELECT 'Table structure check' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'personnel_categories'
ORDER BY ordinal_position;

-- 3. Check if any data exists in the table
SELECT 'Data count check' as info;
SELECT COUNT(*) as total_records FROM personnel_categories;

-- 4. Check data for the specific foundation
SELECT 'Foundation-specific data check' as info;
SELECT * FROM personnel_categories 
WHERE foundation_id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

-- 5. Check foundation membership for the user
SELECT 'Foundation membership check' as info;
SELECT 
    fm.foundation_id, 
    f.name as foundation_name, 
    fm.user_id, 
    fm.is_active,
    fm.created_at
FROM foundation_members fm
JOIN foundations f ON fm.foundation_id = f.id
WHERE fm.user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f';

-- 6. Check if the foundation exists
SELECT 'Foundation existence check' as info;
SELECT id, name, owner_user_id, status 
FROM foundations 
WHERE id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

-- 7. Test a simple query to see if there are any constraint issues
SELECT 'Constraint check' as info;
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_name = 'personnel_categories';

-- 8. Check RLS status
SELECT 'RLS status check' as info;
SELECT 
    relname as table_name,
    relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'personnel_categories';

-- 9. Try a simple insert test (will be rolled back)
SELECT 'Insert test' as info;
-- This is just to check the structure, not actually insert
SELECT 'Structure validation only' as message;