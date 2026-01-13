-- Create items table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    item_number TEXT NOT NULL,
    ean TEXT,
    name TEXT NOT NULL,
    supplier TEXT,
    manufacturer TEXT,
    manufacturer_item_number TEXT,
    unit TEXT DEFAULT 'pcs',
    notes TEXT,
    active BOOLEAN DEFAULT true,
    item_package BOOLEAN DEFAULT false,
    item_type TEXT DEFAULT 'goods' CHECK (item_type IN ('goods', 'service', 'other')),
    stock_item BOOLEAN DEFAULT true,
    external_webshop BOOLEAN DEFAULT false,
    discontinued BOOLEAN DEFAULT false,
    bulky BOOLEAN DEFAULT false,
    sale_account TEXT DEFAULT '3001',
    vat TEXT DEFAULT '25',
    sales_se_reverse_charge TEXT,
    sales_eu_reverse_charge TEXT DEFAULT '3108',
    sales_eu_subject_to_vat TEXT DEFAULT '3106',
    sales_export TEXT DEFAULT '3105',
    purchase_account TEXT DEFAULT '4000',
    cost_calculation DECIMAL DEFAULT 0.00,
    stock_value DECIMAL DEFAULT 0.00,
    in_warehouse INTEGER DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_amount INTEGER DEFAULT 0,
    order_point INTEGER DEFAULT 0,
    stock_location TEXT,
    width_mm DECIMAL,
    height_mm DECIMAL,
    depth_mm DECIMAL,
    weight_grams DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_items_foundation_id ON items(foundation_id);
CREATE INDEX idx_items_item_number ON items(item_number);
CREATE INDEX idx_items_active ON items(active);
CREATE INDEX idx_items_supplier ON items(supplier);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow access back to members of the foundation
CREATE POLICY "Allow all access for foundation members" ON items
    FOR ALL TO authenticated
    USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members
            WHERE user_id = auth.uid()
        )
    );

-- Explicitly allow service role (though it should bypass by default)
CREATE POLICY "Allow all access for service role" ON items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();