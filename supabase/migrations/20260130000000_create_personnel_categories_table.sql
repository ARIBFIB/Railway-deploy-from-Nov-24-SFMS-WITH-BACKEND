-- Create personnel_categories table
CREATE TABLE IF NOT EXISTS personnel_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'Free text field',
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personnel_categories_foundation_id ON personnel_categories(foundation_id);
CREATE INDEX IF NOT EXISTS idx_personnel_categories_name ON personnel_categories(name);

-- Enable RLS (Row Level Security)
ALTER TABLE personnel_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their foundation's personnel categories"
    ON personnel_categories FOR SELECT
    USING (
        foundation_id IN (
            SELECT foundation_id 
            FROM foundation_members 
            WHERE user_id = auth.uid()
            AND (is_active = true OR is_active IS NULL)
        )
    );

CREATE POLICY "Users can insert personnel categories for their foundation"
    ON personnel_categories FOR INSERT
    WITH CHECK (
        foundation_id IN (
            SELECT foundation_id 
            FROM foundation_members 
            WHERE user_id = auth.uid()
            AND (is_active = true OR is_active IS NULL)
        )
    );

CREATE POLICY "Users can update their foundation's personnel categories"
    ON personnel_categories FOR UPDATE
    USING (
        foundation_id IN (
            SELECT foundation_id 
            FROM foundation_members 
            WHERE user_id = auth.uid()
            AND (is_active = true OR is_active IS NULL)
        )
    );

CREATE POLICY "Users can delete their foundation's personnel categories"
    ON personnel_categories FOR DELETE
    USING (
        foundation_id IN (
            SELECT foundation_id 
            FROM foundation_members 
            WHERE user_id = auth.uid()
            AND (is_active = true OR is_active IS NULL)
        )
    );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_personnel_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_personnel_categories_updated_at
    BEFORE UPDATE ON personnel_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_personnel_categories_updated_at();

-- Insert sample data (optional)
-- INSERT INTO personnel_categories (name, type, foundation_id) VALUES
-- ('Department', 'Dropdown', '11111111-1111-1111-1111-111111111111'),
-- ('Position', 'Option buttons', '11111111-1111-1111-1111-111111111111'),
-- ('Location', 'Free text field', '11111111-1111-1111-1111-111111111111');