-- ============================================
-- CONSOLIDATED MIGRATION SCRIPT
-- ============================================
-- Run this script in Supabase Dashboard SQL Editor
-- This applies all pending migrations for governance features

-- ============================================
-- 1. FIX PROFILES TABLE RLS POLICIES
-- ============================================
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies that allow service role operations
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. FIX ROLES TABLE SCHEMA AND POLICIES
-- ============================================
-- Add missing columns
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing roles
UPDATE roles 
SET permissions = '["view_all_data"]'::jsonb 
WHERE permissions IS NULL OR permissions = '[]'::jsonb;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read roles" ON roles;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON roles;
DROP POLICY IF EXISTS "Allow authenticated users to insert roles" ON roles;
DROP POLICY IF EXISTS "Allow authenticated users to update roles" ON roles;
DROP POLICY IF EXISTS "Allow authenticated users to delete roles" ON roles;
DROP POLICY IF EXISTS "Allow service role to insert roles" ON roles;
DROP POLICY IF EXISTS "Allow service role to update roles" ON roles;
DROP POLICY IF EXISTS "Allow service role to delete roles" ON roles;

-- Create new policies
CREATE POLICY "Allow authenticated users to read roles"
  ON roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert roles"
  ON roles FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update roles"
  ON roles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete roles"
  ON roles FOR DELETE TO authenticated USING (true);

-- Insert default governance roles
INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Board Chairman', 'Full governance authority with approval rights', 
       '["approve_documents", "schedule_meetings", "manage_users", "view_all_data"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Board Chairman');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Board Member', 'Standard board member with review and voting rights', 
       '["review_documents", "attend_meetings", "view_foundation_data"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Board Member');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Secretary', 'Administrative role for meeting and document management', 
       '["create_minutes", "manage_documents", "schedule_meetings"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Secretary');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Auditor', 'External auditor with read-only access to compliance data', 
       '["view_audit_trails", "review_compliance", "generate_reports"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Auditor');

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
SELECT 'All migrations applied successfully!' as status;
