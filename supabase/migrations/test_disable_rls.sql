-- Temporarily disable RLS on personnel_categories for testing
-- This will help us determine if RLS is the issue
ALTER TABLE personnel_categories DISABLE ROW LEVEL SECURITY;

-- Test the query without RLS
SELECT 'Testing without RLS' as test_name;
SELECT * FROM personnel_categories 
WHERE foundation_id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9'
LIMIT 5;

-- Re-enable RLS after testing
ALTER TABLE personnel_categories ENABLE ROW LEVEL SECURITY;