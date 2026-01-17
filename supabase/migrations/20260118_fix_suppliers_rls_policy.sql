-- Fix suppliers table RLS policy to match the pattern used in customers table
-- The policy should check if the user has access to the foundation

-- Drop the existing policy
DROP POLICY IF EXISTS "Allow full access to own suppliers" ON suppliers;

-- Create new policy that checks foundation membership like the customers table
CREATE POLICY "Allow all access for foundation members on suppliers" ON suppliers
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

-- Also create a service role policy to allow admin access
CREATE POLICY "Allow all access for service role on suppliers" ON suppliers
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);