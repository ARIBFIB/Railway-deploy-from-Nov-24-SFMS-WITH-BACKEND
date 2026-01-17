-- Alter existing suppliers table to match requirements
-- Adding all required columns for supplier management

-- Add supplier_name column if it doesn't exist, populate from name if it does
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='supplier_name') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='name') THEN
      ALTER TABLE suppliers ADD COLUMN supplier_name TEXT;
      UPDATE suppliers SET supplier_name = name;
      ALTER TABLE suppliers DROP COLUMN name;
    ELSE
      ALTER TABLE suppliers ADD COLUMN supplier_name TEXT NOT NULL;
    END IF;
  END IF;
END $$;

-- Add missing columns for contact information
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS cin_pin VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS postcode VARCHAR(20);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);

-- Add columns for references and notes
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS our_reference VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS supplier_reference VARCHAR(255);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add payment information columns
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank_giro VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS plusgiro VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bic VARCHAR(20);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS iban VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'Bank account';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS bank VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS clearing_no VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS account_no VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS charge_code VARCHAR(50) DEFAULT 'Sender pays';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS disable_payment_file VARCHAR(10) DEFAULT 'No';

-- Add visiting address columns
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS visiting_address TEXT;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS visiting_postcode VARCHAR(20);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS visiting_city VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS visiting_country VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS visiting_country_code VARCHAR(10);

-- Add accounting details columns
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS default_offset_account VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS coding_template VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS item_registration BOOLEAN DEFAULT FALSE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS rounding_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS vat_type VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS vat_number VARCHAR(50);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'SEK';
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS payment_terms VARCHAR(50);

-- Add other information columns
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS customer_number VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS place_of_work VARCHAR(100);
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS industry_code VARCHAR(50);

-- Handle corporate_personal_id which is equivalent to cin_pin
-- If we don't have cin_pin but have corporate_personal_id, rename it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='cin_pin') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='suppliers' AND column_name='corporate_personal_id') THEN
      ALTER TABLE suppliers RENAME COLUMN corporate_personal_id TO cin_pin;
    ELSE
      ALTER TABLE suppliers ADD COLUMN cin_pin VARCHAR(50);
    END IF;
  END IF;
END $$;

-- The table already has created_at and updated_at columns with TIMESTAMPTZ type
-- No need to add new columns, just ensure the trigger exists

-- Update the updated_at trigger if it doesn't exist
-- First drop if exists and recreate
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(supplier_name);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_created_at ON suppliers(created_at);

-- Enable Row Level Security (RLS) if not already enabled
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='suppliers' AND policyname='Allow full access to own suppliers') THEN
        CREATE POLICY "Allow full access to own suppliers" ON suppliers
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM profiles 
                    WHERE profiles.id = auth.uid()
                )
            );
    END IF;
END $$;