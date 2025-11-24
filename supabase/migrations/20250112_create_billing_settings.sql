-- Create billing_settings table
CREATE TABLE IF NOT EXISTS billing_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure one setting per foundation and section combination
    UNIQUE(foundation_id, section)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_billing_settings_foundation_id ON billing_settings(foundation_id);
CREATE INDEX IF NOT EXISTS idx_billing_settings_section ON billing_settings(section);
CREATE INDEX IF NOT EXISTS idx_billing_settings_foundation_section ON billing_settings(foundation_id, section);
CREATE INDEX IF NOT EXISTS idx_billing_settings_created_at ON billing_settings(created_at);

-- Enable RLS
ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for billing_settings
CREATE POLICY "Users can view billing settings for their foundation" ON billing_settings
    FOR SELECT USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create billing settings for their foundation" ON billing_settings
    FOR INSERT WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update billing settings for their foundation" ON billing_settings
    FOR UPDATE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete billing settings for their foundation" ON billing_settings
    FOR DELETE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_billing_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_billing_settings_updated_at
    BEFORE UPDATE ON billing_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_billing_settings_updated_at();

