-- Check foundations table structure to understand required fields
SELECT 
    column_name,
    is_nullable,
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name = 'foundations'
ORDER BY ordinal_position;

-- Check existing foundations data
SELECT 'Existing foundations' as info;
SELECT id, name, owner_user_id, status, created_at 
FROM foundations 
ORDER BY created_at DESC;

-- Check foundation members structure
SELECT 'Foundation members structure' as info;
SELECT 
    column_name,
    is_nullable,
    data_type
FROM information_schema.columns 
WHERE table_name = 'foundation_members'
ORDER BY ordinal_position;