-- ============================================
-- COPY THIS ENTIRE FILE AND PASTE IT INTO
-- SUPABASE DASHBOARD > SQL EDITOR > RUN
-- ============================================

-- Create roles table for governance role management
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  user_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read roles
CREATE POLICY "Allow authenticated users to read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to insert roles
CREATE POLICY "Allow service role to insert roles"
  ON roles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy to allow service role to update roles
CREATE POLICY "Allow service role to update roles"
  ON roles
  FOR UPDATE
  TO service_role
  USING (true);

-- Create policy to allow service role to delete roles
CREATE POLICY "Allow service role to delete roles"
  ON roles
  FOR DELETE
  TO service_role
  USING (true);

-- Insert some default governance roles
INSERT INTO roles (name, description, permissions, user_count) VALUES
  ('Board Chairman', 'Full governance authority with approval rights', '["approve_documents", "schedule_meetings", "manage_users", "view_all_data"]'::jsonb, 0),
  ('Board Member', 'Standard board member with review and voting rights', '["review_documents", "attend_meetings", "view_foundation_data"]'::jsonb, 0),
  ('Secretary', 'Administrative role for meeting and document management', '["create_minutes", "manage_documents", "schedule_meetings"]'::jsonb, 0),
  ('Auditor', 'External auditor with read-only access to compliance data', '["view_audit_trails", "review_compliance", "generate_reports"]'::jsonb, 0)
ON CONFLICT DO NOTHING;

-- ============================================
-- AFTER RUNNING THIS:
-- 1. Refresh your app
-- 2. Go to Role Management page
-- 3. You should see 4 default roles
-- 4. Create, Edit, Delete should all work!
-- ============================================
