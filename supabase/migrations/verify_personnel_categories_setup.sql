-- Simple verification script for personnel categories setup
-- Run this after applying migrations to verify everything is working

-- 1. Check if foundation_members has is_active column
SELECT 
    'foundation_members has is_active column' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'foundation_members' 
            AND column_name = 'is_active'
        ) THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 2. Check if personnel_categories table exists
SELECT 
    'personnel_categories table exists' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'personnel_categories'
        ) THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 3. Check if personnel_categories has required columns
SELECT 
    'personnel_categories has required columns' as check_name,
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.columns 
            WHERE table_name = 'personnel_categories' 
            AND column_name IN ('id', 'name', 'type', 'foundation_id', 'created_at', 'updated_at')
        ) = 6 THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 4. Check if RLS is enabled on personnel_categories
SELECT 
    'personnel_categories RLS enabled' as check_name,
    CASE 
        WHEN (
            SELECT relrowsecurity FROM pg_class 
            WHERE relname = 'personnel_categories'
        ) = true THEN 'PASS' 
        ELSE 'FAIL' 
    END as result;

-- 5. Count RLS policies on personnel_categories
SELECT 
    'Number of RLS policies on personnel_categories' as check_name,
    COUNT(*) as policy_count
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname = 'personnel_categories';

-- 6. Show sample data (if any)
SELECT 'Sample personnel categories data' as info;
SELECT id, name, type, foundation_id 
FROM personnel_categories 
LIMIT 5;