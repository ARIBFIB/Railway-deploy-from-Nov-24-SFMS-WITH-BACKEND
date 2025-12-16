-- ============================================
-- RUN THIS SQL TO FIX THE ROLES TABLE
-- ============================================
-- This will add the missing columns to the existing roles table

-- Add permissions column (JSONB array)
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;

-- Add user_count column
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0;

-- Add updated_at column
ALTER TABLE roles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing roles with default permissions
UPDATE roles 
SET permissions = '["view_all_data"]'::jsonb 
WHERE permissions IS NULL OR permissions = '[]'::jsonb;

-- Insert default governance roles if they don't exist
INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Board Chairman', 'Full governance authority with approval rights', '["approve_documents", "schedule_meetings", "manage_users", "view_all_data"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Board Chairman');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Board Member', 'Standard board member with review and voting rights', '["review_documents", "attend_meetings", "view_foundation_data"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Board Member');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Secretary', 'Administrative role for meeting and document management', '["create_minutes", "manage_documents", "schedule_meetings"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Secretary');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Auditor', 'External auditor with read-only access to compliance data', '["view_audit_trails", "review_compliance", "generate_reports"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Auditor');

-- ============================================
-- AFTER RUNNING THIS:
-- 1. Refresh your app
-- 2. Role Management should work!
-- ============================================
