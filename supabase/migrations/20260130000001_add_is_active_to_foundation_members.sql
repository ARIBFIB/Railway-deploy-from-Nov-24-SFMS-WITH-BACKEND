-- Add is_active column to foundation_members table
ALTER TABLE foundation_members 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing records to have is_active = true
UPDATE foundation_members 
SET is_active = true 
WHERE is_active IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_foundation_members_is_active 
ON foundation_members(is_active);

-- Update RLS policies to use is_active column
DROP POLICY IF EXISTS "Users can view foundation members" ON foundation_members;
CREATE POLICY "Users can view foundation members" 
ON foundation_members FOR SELECT 
USING (
    foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid() 
        AND is_active = true
    )
);

DROP POLICY IF EXISTS "Users can insert foundation members for their foundation" ON foundation_members;
CREATE POLICY "Users can insert foundation members for their foundation" 
ON foundation_members FOR INSERT 
WITH CHECK (
    foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid() 
        AND is_active = true
    )
);

DROP POLICY IF EXISTS "Users can update foundation members for their foundation" ON foundation_members;
CREATE POLICY "Users can update foundation members for their foundation" 
ON foundation_members FOR UPDATE 
USING (
    foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid() 
        AND is_active = true
    )
);

DROP POLICY IF EXISTS "Users can delete foundation members for their foundation" ON foundation_members;
CREATE POLICY "Users can delete foundation members for their foundation" 
ON foundation_members FOR DELETE 
USING (
    foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid() 
        AND is_active = true
    )
);