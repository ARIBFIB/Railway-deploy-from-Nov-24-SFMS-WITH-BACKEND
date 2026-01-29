-- Test script to verify table structure
-- Run this in Supabase SQL editor to check current structure

-- Check if is_active column exists in foundation_members
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'foundation_members' 
AND column_name = 'is_active';

-- Check if personnel_categories table exists
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name = 'personnel_categories'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT pol.polname as policyname, cls.relname as tablename, pol.polpermissive as permissiveness, pol.polroles as roles, pol.polqual as qual, pol.polwithcheck as with_check
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname IN ('foundation_members', 'personnel_categories');