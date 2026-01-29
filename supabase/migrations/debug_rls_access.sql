-- Check if the user has proper foundation membership
SELECT 
    fm.foundation_id, 
    f.name as foundation_name, 
    fm.user_id, 
    fm.is_active,
    fm.created_at
FROM foundation_members fm
JOIN foundations f ON fm.foundation_id = f.id
WHERE fm.user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f';

-- Check if auth.uid() returns the correct user ID
SELECT auth.uid() as current_user_id;

-- Test the RLS policy condition directly
SELECT 
    'RLS Policy Test' as test_name,
    foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
        AND (is_active = true OR is_active IS NULL)
    ) as can_access
FROM personnel_categories
WHERE foundation_id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9'
LIMIT 1;