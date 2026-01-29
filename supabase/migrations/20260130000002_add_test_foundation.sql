-- Create test foundation and member if they don't exist
-- This ensures there's always a foundation available for testing

-- Insert test foundation if it doesn't exist
INSERT INTO foundations (id, name, created_at, updated_at)
SELECT '11111111-1111-1111-1111-111111111111', 'Test Foundation', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM foundations WHERE id = '11111111-1111-1111-1111-111111111111'
);

-- Insert test foundation member if it doesn't exist
-- Using the user ID from the error log
INSERT INTO foundation_members (foundation_id, user_id, is_active, created_at, updated_at)
SELECT '11111111-1111-1111-1111-111111111111', '807065b8-2e0f-414f-9ac1-a7796a968c3f', true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM foundation_members 
    WHERE foundation_id = '11111111-1111-1111-1111-111111111111' 
    AND user_id = '807065b8-2e0f-414f-9ac1-a7796a968c3f'
);

-- Also insert a generic test user member for flexibility
INSERT INTO foundation_members (foundation_id, user_id, is_active, created_at, updated_at)
SELECT '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', true, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM foundation_members 
    WHERE foundation_id = '11111111-1111-1111-1111-111111111111' 
    AND user_id = '00000000-0000-0000-0000-000000000000'
);