-- Create asset_register_types table
CREATE TABLE IF NOT EXISTS asset_register_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    number VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    depreciation_type VARCHAR(50) NOT NULL,
    note TEXT,
    asset_account VARCHAR(50),
    depreciation_account VARCHAR(50),
    revaluation_account VARCHAR(50),
    impairment_account VARCHAR(50),
    offsetting_account_for_sales VARCHAR(50),
    accumulated_depreciation VARCHAR(50),
    accumulated_impairment_losses VARCHAR(50),
    capital_gain_on_sale VARCHAR(50),
    capital_loss_sale VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique number per foundation
    UNIQUE(foundation_id, number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_asset_register_types_foundation_id ON asset_register_types(foundation_id);
CREATE INDEX IF NOT EXISTS idx_asset_register_types_number ON asset_register_types(number);
CREATE INDEX IF NOT EXISTS idx_asset_register_types_created_at ON asset_register_types(created_at);

-- Enable RLS
ALTER TABLE asset_register_types ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for asset_register_types
CREATE POLICY "Users can view asset register types for their foundation" ON asset_register_types
    FOR SELECT USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create asset register types for their foundation" ON asset_register_types
    FOR INSERT WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update asset register types for their foundation" ON asset_register_types
    FOR UPDATE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete asset register types for their foundation" ON asset_register_types
    FOR DELETE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_asset_register_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_asset_register_types_updated_at
    BEFORE UPDATE ON asset_register_types
    FOR EACH ROW
    EXECUTE FUNCTION update_asset_register_types_updated_at();

