-- Add user as member of existing foundation
-- This fixes the "Invalid foundation_id" error by ensuring the user has access

-- Add the user as a member of the System Administration foundation
INSERT INTO foundation_members (foundation_id, user_id, is_active, created_at, updated_at)
SELECT '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9', '807065b8-2e0f-414f-9ac1-a7796a968c3f', true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM foundation_members 
    WHERE foundation_id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9' 
    AND user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f'
);

-- Verify the insertion worked
SELECT 'Foundation membership verification' as info;
SELECT fm.foundation_id, f.name as foundation_name, fm.user_id, fm.is_active
FROM foundation_members fm
JOIN foundations f ON fm.foundation_id = f.id
WHERE fm.user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f';