BEGIN;

-- Add 'quote-order' to the settings_scope enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'quote-order' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'settings_scope')
  ) THEN
    ALTER TYPE settings_scope ADD VALUE 'quote-order';
  END IF;
END$$;

COMMIT;

