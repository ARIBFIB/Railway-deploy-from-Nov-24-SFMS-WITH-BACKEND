-- Create facility_register_settings table
CREATE TABLE IF NOT EXISTS facility_register_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    proposed_depreciation_start_date VARCHAR(100) NOT NULL DEFAULT 'Acquisition month',
    create_asset_from_supplier_invoice BOOLEAN DEFAULT false,
    enable_component_depreciation_support BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure one setting per foundation
    UNIQUE(foundation_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_facility_register_settings_foundation_id ON facility_register_settings(foundation_id);
CREATE INDEX IF NOT EXISTS idx_facility_register_settings_created_at ON facility_register_settings(created_at);

-- Enable RLS
ALTER TABLE facility_register_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for facility_register_settings
CREATE POLICY "Users can view facility register settings for their foundation" ON facility_register_settings
    FOR SELECT USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create facility register settings for their foundation" ON facility_register_settings
    FOR INSERT WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update facility register settings for their foundation" ON facility_register_settings
    FOR UPDATE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete facility register settings for their foundation" ON facility_register_settings
    FOR DELETE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_facility_register_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_facility_register_settings_updated_at
    BEFORE UPDATE ON facility_register_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_facility_register_settings_updated_at();

