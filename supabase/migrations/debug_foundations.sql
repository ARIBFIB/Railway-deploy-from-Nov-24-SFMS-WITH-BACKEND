-- Debug script to check available foundations and foundation members
-- Run this in Supabase SQL editor to see what data exists

-- Check all foundations
SELECT 'All Foundations' as info;
SELECT id, name, created_at 
FROM foundations 
ORDER BY created_at DESC;

-- Check foundation members for the user in the error
SELECT 'Foundation members for user 807065b8-2e0f-414f-9ac1-a7796a968c3f' as info;
SELECT fm.foundation_id, f.name as foundation_name, fm.user_id, fm.is_active
FROM foundation_members fm
LEFT JOIN foundations f ON fm.foundation_id = f.id
WHERE fm.user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f';

-- Check if the problematic foundation exists
SELECT 'Checking foundation 47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9' as info;
SELECT id, name, created_at 
FROM foundations 
WHERE id = '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';

-- If no foundations exist, create a test foundation
-- Uncomment the following lines if you need to create a foundation:
/*
INSERT INTO foundations (id, name, created_at, updated_at) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Test Foundation', NOW(), NOW());

INSERT INTO foundation_members (foundation_id, user_id, is_active, created_at, updated_at)
VALUES ('11111111-1111-1111-1111-111111111111', '807065b8-2e0f-414f-9ac1-a7796a968c3f', true, NOW(), NOW());
*/