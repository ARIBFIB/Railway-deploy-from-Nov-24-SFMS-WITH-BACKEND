-- Check if personnel_categories table exists and its structure
SELECT 'Table existence check' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'personnel_categories';

-- Check columns in personnel_categories table
SELECT 'Personnel categories table structure' as info;
SELECT 
    column_name,
    is_nullable,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'personnel_categories'
ORDER BY ordinal_position;

-- Check if any data exists
SELECT 'Sample data check' as info;
SELECT * FROM personnel_categories LIMIT 5;

-- Check RLS policies on personnel_categories
SELECT 'RLS policies check' as info;
SELECT 
    pol.polname as policy_name,
    cls.relname as table_name,
    pol.polpermissive as permissive,
    pol.polroles as roles
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname = 'personnel_categories';