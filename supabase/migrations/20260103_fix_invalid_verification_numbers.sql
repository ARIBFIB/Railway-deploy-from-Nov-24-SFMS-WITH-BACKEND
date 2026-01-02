-- Fix invalid verification numbers (like FNaN) that were created due to a bug
-- This migration will update invalid verification numbers to valid ones

-- First, find the highest valid number for 'F' series and update all FNaN entries
DO $$
DECLARE
    max_f_number INTEGER;
BEGIN
    -- Find the highest valid number for 'F' series
    SELECT COALESCE(MAX(CAST(NULLIF(regexp_replace(verification_number, '[^0-9]', '', 'g'), '') AS INTEGER)), 0)
    INTO max_f_number
    FROM verifications 
    WHERE verification_series = 'F'
    AND verification_number ~ '^[A-Za-z]+[0-9]+$'  -- Only valid format: letters followed by numbers
    AND verification_number !~ 'NaN';  -- Exclude NaN entries
    
    -- Update all FNaN entries to have valid numbers starting from max_f_number + 1
    UPDATE verifications 
    SET verification_number = 'F' || (max_f_number + ROW_NUMBER() OVER (ORDER BY id))
    WHERE verification_number = 'FNaN';
    
    RAISE NOTICE 'Fixed FNaN entries, starting from F% based on previous max F number %', max_f_number + 1, max_f_number;
    
    -- Find the highest valid number for all other series with NaN entries
    WITH invalid_series AS (
        SELECT DISTINCT verification_series
        FROM verifications
        WHERE verification_number LIKE '%NaN%'
    )
    UPDATE verifications
    SET verification_number = v.verification_series || (COALESCE(max_numbers.max_num, 0) + 
        ROW_NUMBER() OVER (PARTITION BY v.verification_series ORDER BY v.id))
    FROM verifications v
    JOIN invalid_series s ON v.verification_series = s.verification_series
    LEFT JOIN (
        SELECT 
            verification_series,
            COALESCE(MAX(CAST(NULLIF(regexp_replace(verification_number, '[^0-9]', '', 'g'), '') AS INTEGER)), 0) as max_num
        FROM verifications 
        WHERE verification_number !~ 'NaN'  -- Only valid entries
        GROUP BY verification_series
    ) max_numbers ON v.verification_series = max_numbers.verification_series
    WHERE v.verification_number LIKE '%NaN%';
    
    RAISE NOTICE 'Fixed all remaining NaN verification numbers';
END $$;