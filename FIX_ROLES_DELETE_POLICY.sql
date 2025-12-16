-- ============================================
-- FIX ROLES TABLE DELETE POLICY
-- ============================================
-- This adds missing policies for INSERT, UPDATE, and DELETE on roles table

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Anyone can read roles" ON roles;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON roles;
DROP POLICY IF EXISTS "Allow service role to insert roles" ON roles;
DROP POLICY IF EXISTS "Allow service role to update roles" ON roles;
DROP POLICY IF EXISTS "Allow service role to delete roles" ON roles;

-- Create comprehensive policies for roles table
-- Allow all authenticated users to read roles
CREATE POLICY "Allow authenticated users to read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert roles (for now - can be restricted later)
CREATE POLICY "Allow authenticated users to insert roles"
  ON roles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update roles (for now - can be restricted later)
CREATE POLICY "Allow authenticated users to update roles"
  ON roles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete roles (for now - can be restricted later)
CREATE POLICY "Allow authenticated users to delete roles"
  ON roles
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- AFTER RUNNING THIS:
-- 1. Role deletion should work!
-- 2. You can restrict these policies later based on user roles
-- ============================================
