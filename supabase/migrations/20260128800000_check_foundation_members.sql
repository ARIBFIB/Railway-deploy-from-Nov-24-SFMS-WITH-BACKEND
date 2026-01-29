-- Diagnostic: Check foundation_members table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'foundation_members' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any existing foundation members
SELECT COUNT(*) as member_count FROM public.foundation_members;

-- Show existing foundation member data if any
SELECT * FROM public.foundation_members LIMIT 5;