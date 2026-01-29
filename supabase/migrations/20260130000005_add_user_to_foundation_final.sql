-- Add user as member of existing foundation - Final corrected version
-- This adds the user to the existing System Administration foundation
-- Using only the columns that exist in foundation_members table

-- First, let's check what columns actually exist in foundation_members
SELECT 'Foundation members table structure' as info;
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'foundation_members'
ORDER BY ordinal_position;

-- Add the user as a member of the System Administration foundation
-- Using only the actual columns that exist
INSERT INTO foundation_members (foundation_id, user_id, is_active, created_at)
VALUES ('47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9', '807065b8-2e0f-414f-9ac1-a7796a968c3f', true, NOW())
ON CONFLICT (foundation_id, user_id) DO UPDATE 
SET is_active = true;

-- Verify the insertion worked
SELECT 'Foundation membership verification' as info;
SELECT 
    fm.foundation_id, 
    f.name as foundation_name, 
    fm.user_id, 
    fm.is_active,
    fm.created_at
FROM foundation_members fm
JOIN foundations f ON fm.foundation_id = f.id
WHERE fm.user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f';

-- Show all foundations the user has access to
SELECT 'All foundations for user' as info;
SELECT 
    f.id,
    f.name,
    f.owner_user_id,
    f.status,
    fm.is_active as member_active
FROM foundations f
JOIN foundation_members fm ON f.id = fm.foundation_id
WHERE fm.user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f';