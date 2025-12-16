-- ============================================
-- CREATE USER_ROLES TABLE
-- ============================================
-- This table links users to governance roles with permissions

-- Create user_governance_roles table
CREATE TABLE IF NOT EXISTS user_governance_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES profiles(id),
  UNIQUE(user_id, role_id)
);

-- Enable RLS
ALTER TABLE user_governance_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own role assignments"
  ON user_governance_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow all authenticated users to manage role assignments"
  ON user_governance_roles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_governance_roles_user_id ON user_governance_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_governance_roles_role_id ON user_governance_roles(role_id);

-- ============================================
-- AFTER RUNNING THIS:
-- Users can be assigned to governance roles with permissions
-- ============================================
