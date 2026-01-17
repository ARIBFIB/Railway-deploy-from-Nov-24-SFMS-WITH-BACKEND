-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic supplier info
    supplier_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    
    -- Additional contact info
    cin_pin VARCHAR(50),
    postcode VARCHAR(20),
    city VARCHAR(100),
    country VARCHAR(100),
    website VARCHAR(255),
    contact_person VARCHAR(255),
    
    -- References & notes
    our_reference VARCHAR(255),
    supplier_reference VARCHAR(255),
    notes TEXT,
    
    -- Payment information
    bank_giro VARCHAR(50),
    plusgiro VARCHAR(50),
    bic VARCHAR(20),
    iban VARCHAR(50),
    account_type VARCHAR(50) DEFAULT 'Bank account',
    bank VARCHAR(100),
    clearing_no VARCHAR(50),
    account_no VARCHAR(50),
    charge_code VARCHAR(50) DEFAULT 'Sender pays',
    disable_payment_file VARCHAR(10) DEFAULT 'No',
    
    -- Visiting address
    visiting_address TEXT,
    visiting_postcode VARCHAR(20),
    visiting_city VARCHAR(100),
    visiting_country VARCHAR(100),
    visiting_country_code VARCHAR(10),
    
    -- Accounting details
    default_offset_account VARCHAR(100),
    coding_template VARCHAR(100),
    item_registration BOOLEAN DEFAULT FALSE,
    rounding_enabled BOOLEAN DEFAULT TRUE,
    vat_type VARCHAR(50),
    vat_number VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'SEK',
    payment_terms VARCHAR(50),
    
    -- Other information
    customer_number VARCHAR(100),
    place_of_work VARCHAR(100),
    industry_code VARCHAR(50),
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Allow full access to own suppliers" ON suppliers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid()
        )
    );

-- Create updated_at trigger
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
CREATE INDEX idx_suppliers_name ON suppliers(supplier_name);
CREATE INDEX idx_suppliers_email ON suppliers(email);
CREATE INDEX idx_suppliers_created_at ON suppliers(created_at);