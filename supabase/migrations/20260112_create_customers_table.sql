-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
  customer_number TEXT NOT NULL,
  customer_type TEXT DEFAULT 'business' CHECK (customer_type IN ('business', 'private')),
  corporate_personal_id TEXT,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  industry_code TEXT,
  workplace_number TEXT,
  store_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(foundation_id, customer_number)
);

-- Customer addresses table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_type TEXT DEFAULT 'billing' CHECK (address_type IN ('billing', 'delivery')),
  name TEXT,
  address TEXT,
  address2 TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT,
  country_code TEXT,
  is_primary BOOLEAN DEFAULT FALSE
);

-- Customer contacts table
CREATE TABLE IF NOT EXISTS customer_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  phone TEXT,
  phone2 TEXT,
  fax TEXT,
  email TEXT,
  web_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_contacts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_foundation_id ON customers(foundation_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer_id ON customer_contacts(customer_id);

-- Create policies for RLS
CREATE POLICY "Users can view their own customers" ON customers
  FOR SELECT USING (
    auth.uid() IN (
      SELECT profiles.id FROM profiles 
      JOIN foundations ON profiles.id = foundations.owner_user_id 
      WHERE foundations.id = customers.foundation_id
    )
  );

CREATE POLICY "Users can insert their own customers" ON customers
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT foundations.owner_user_id FROM foundations 
      WHERE foundations.id = customers.foundation_id
    )
  );

CREATE POLICY "Users can update their own customers" ON customers
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT profiles.id FROM profiles 
      JOIN foundations ON profiles.id = foundations.owner_user_id 
      WHERE foundations.id = customers.foundation_id
    )
  );

CREATE POLICY "Users can delete their own customers" ON customers
  FOR DELETE USING (
    auth.uid() IN (
      SELECT profiles.id FROM profiles 
      JOIN foundations ON profiles.id = foundations.owner_user_id 
      WHERE foundations.id = customers.foundation_id
    )
  );