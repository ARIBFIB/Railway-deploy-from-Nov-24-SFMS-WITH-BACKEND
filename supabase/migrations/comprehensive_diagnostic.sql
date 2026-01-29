-- Comprehensive check of personnel_categories table and related data
-- Run this to diagnose the exact issue

-- 1. Check if personnel_categories table exists and its structure
SELECT 'Table structure check' as info;
\d personnel_categories;

-- 2. Check if any data exists in the table
SELECT 'Data count check' as info;
SELECT COUNT(*) as total_records FROM personnel_categories;

-- 3. Check data for the specific foundation
SELECT 'Foundation-specific data check' as info;
SELECT * FROM personnel_categories 
WHERE foundation_id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

-- 4. Check foundation membership for the user
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

-- 5. Check if the foundation exists
SELECT 'Foundation existence check' as info;
SELECT id, name, owner_user_id, status 
FROM foundations 
WHERE id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

-- 6. Test a simple insert to see if there are any constraint violations
SELECT 'Insert test preparation' as info;
-- This will show us if there are any issues with the table structure
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'personnel_categories'
ORDER BY ordinal_position;