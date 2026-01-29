-- Diagnostic: Check foundations table structure first
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'foundations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if there are any existing foundations
SELECT COUNT(*) as foundation_count FROM public.foundations;

-- Show existing foundation data if any
SELECT * FROM public.foundations LIMIT 5;