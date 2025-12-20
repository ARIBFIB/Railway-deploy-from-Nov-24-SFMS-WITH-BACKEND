-- Add comment column to verifications table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='verifications' AND column_name='comment') THEN
        ALTER TABLE verifications ADD COLUMN comment TEXT;
    END IF;
END $$;
