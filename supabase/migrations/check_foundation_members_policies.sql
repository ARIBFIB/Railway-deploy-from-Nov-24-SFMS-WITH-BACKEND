-- Check RLS policies on foundation_members table to identify recursion
SELECT 
    'foundation_members RLS policies' as info,
    pol.polname as policy_name,
    pol.polpermissive as permissive,
    pol.polroles as roles,
    pol.polqual as qualification_condition,
    pol.polwithcheck as with_check_condition
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname = 'foundation_members';

-- Check if foundation_members has RLS enabled
SELECT 
    'foundation_members RLS status' as info,
    relname as table_name,
    relrowsecurity as rls_enabled
FROM pg_class 
WHERE relname = 'foundation_members';

-- Check the actual policy definitions that might cause recursion
SELECT 
    'Policy details for debugging' as info,
    pol.polname,
    pg_get_expr(pol.polqual, pol.polrelid) as qual_expression,
    pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname = 'foundation_members';