-- Fix RLS policies for personnel_categories table
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their foundation's personnel categories" ON personnel_categories;
DROP POLICY IF EXISTS "Users can insert personnel categories for their foundation" ON personnel_categories;
DROP POLICY IF EXISTS "Users can update their foundation's personnel categories" ON personnel_categories;
DROP POLICY IF EXISTS "Users can delete their foundation's personnel categories" ON personnel_categories;

-- Create corrected policies using service_role bypass for backend access
CREATE POLICY "Users can view their foundation's personnel categories"
    ON personnel_categories FOR SELECT
    TO authenticated
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
    TO authenticated
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
    TO authenticated
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
    TO authenticated
    USING (
        foundation_id IN (
            SELECT foundation_id 
            FROM foundation_members 
            WHERE user_id = auth.uid()
            AND (is_active = true OR is_active IS NULL)
        )
    );

-- Verify the policies were created correctly
SELECT 
    pol.polname as policy_name,
    cls.relname as table_name,
    pol.polpermissive as permissive,
    pol.polroles as roles
FROM pg_policy pol
JOIN pg_class cls ON cls.oid = pol.polrelid
WHERE cls.relname = 'personnel_categories';