-- Create document_workflows table
CREATE TABLE IF NOT EXISTS document_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID, -- References documents table (assuming it exists)
  document_name VARCHAR(255) NOT NULL,
  workflow_type VARCHAR(50) NOT NULL CHECK (workflow_type IN ('approval', 'review', 'signature')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow_steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES document_workflows(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  assignee_name VARCHAR(255),
  assignee_id UUID, -- Could reference profiles table
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('review', 'approve', 'sign')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  comments TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_items table
CREATE TABLE IF NOT EXISTS compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID, -- References foundations table
  regulation_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'compliant', 'overdue')),
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE document_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified for now - allow all authenticated users)
CREATE POLICY "Allow authenticated users to read workflows" ON document_workflows FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert workflows" ON document_workflows FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update workflows" ON document_workflows FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read steps" ON workflow_steps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert steps" ON workflow_steps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update steps" ON workflow_steps FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read compliance" ON compliance_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert compliance" ON compliance_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update compliance" ON compliance_items FOR UPDATE TO authenticated USING (true);

-- Insert Sample Data for Dashboard

-- 1. Document Workflows
INSERT INTO document_workflows (id, document_name, workflow_type, status, created_at) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Board Resolution - Q1 Budget', 'approval', 'pending', NOW() - INTERVAL '2 days'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Annual Financial Statement', 'signature', 'completed', NOW() - INTERVAL '5 days');

-- 2. Workflow Steps
INSERT INTO workflow_steps (workflow_id, step_order, assignee_name, action_type, status, completed_at) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Board Chairman', 'approve', 'pending', NULL),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1, 'Auditor', 'sign', 'completed', NOW() - INTERVAL '1 day');

-- 3. Compliance Items
INSERT INTO compliance_items (title, description, due_date, status, priority, regulation_type) VALUES
  ('Board member registration', 'Register new board members with Bolagsverket', NOW() - INTERVAL '2 days', 'overdue', 'high', 'bolagsverket'),
  ('Annual reports & tax filing', 'Submit annual report', NOW() + INTERVAL '15 days', 'pending', 'critical', 'skatteverket'),
  ('GDPR Review', 'Annual review of data processing', NOW() + INTERVAL '45 days', 'compliant', 'medium', 'other');

-- Insert 11 more compliant items to match the dashboard number "12"
INSERT INTO compliance_items (title, description, due_date, status, priority, regulation_type) 
SELECT 'Compliance Check ' || generate_series, 'Routine check', NOW() - INTERVAL '1 month', 'compliant', 'low', 'internal'
FROM generate_series(1, 11);

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID,
  user_id UUID,
  action VARCHAR(50) NOT NULL,
  target_table VARCHAR(50),
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document_workflows table
CREATE TABLE IF NOT EXISTS document_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID, -- References documents table (assuming it exists)
  document_name VARCHAR(255) NOT NULL,
  workflow_type VARCHAR(50) NOT NULL CHECK (workflow_type IN ('approval', 'review', 'signature')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow_steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES document_workflows(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  assignee_name VARCHAR(255),
  assignee_id UUID, -- Could reference profiles table
  action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('review', 'approve', 'sign')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  comments TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create compliance_items table
CREATE TABLE IF NOT EXISTS compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID, -- References foundations table
  regulation_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'compliant', 'overdue')),
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assigned_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE document_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_items ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified for now - allow all authenticated users)
CREATE POLICY "Allow authenticated users to read workflows" ON document_workflows FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert workflows" ON document_workflows FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update workflows" ON document_workflows FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read steps" ON workflow_steps FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert steps" ON workflow_steps FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update steps" ON workflow_steps FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read compliance" ON compliance_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert compliance" ON compliance_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated users to update compliance" ON compliance_items FOR UPDATE TO authenticated USING (true);

-- Insert Sample Data for Dashboard

-- 1. Document Workflows
INSERT INTO document_workflows (id, document_name, workflow_type, status, created_at) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Board Resolution - Q1 Budget', 'approval', 'pending', NOW() - INTERVAL '2 days'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Annual Financial Statement', 'signature', 'completed', NOW() - INTERVAL '5 days');

-- 2. Workflow Steps
INSERT INTO workflow_steps (workflow_id, step_order, assignee_name, action_type, status, completed_at) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Board Chairman', 'approve', 'pending', NULL),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1, 'Auditor', 'sign', 'completed', NOW() - INTERVAL '1 day');

-- 3. Compliance Items
INSERT INTO compliance_items (title, description, due_date, status, priority, regulation_type) VALUES
  ('Board member registration', 'Register new board members with Bolagsverket', NOW() - INTERVAL '2 days', 'overdue', 'high', 'bolagsverket'),
  ('Annual reports & tax filing', 'Submit annual report', NOW() + INTERVAL '15 days', 'pending', 'critical', 'skatteverket'),
  ('GDPR Review', 'Annual review of data processing', NOW() + INTERVAL '45 days', 'compliant', 'medium', 'other');

-- Insert 11 more compliant items to match the dashboard number "12"
INSERT INTO compliance_items (title, description, due_date, status, priority, regulation_type) 
SELECT 'Compliance Check ' || generate_series, 'Routine check', NOW() - INTERVAL '1 month', 'compliant', 'low', 'internal'
FROM generate_series(1, 11);

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID,
  user_id UUID,
  action VARCHAR(50) NOT NULL,
  target_table VARCHAR(50),
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist (handling potential schema mismatches)
DO $$
BEGIN
    BEGIN
        ALTER TABLE audit_logs ADD COLUMN target_table VARCHAR(50);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE audit_logs ADD COLUMN details JSONB DEFAULT '{}'::jsonb;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE audit_logs ADD COLUMN ip_address INET;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE audit_logs ADD COLUMN foundation_id UUID;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
END $$;

-- Enable RLS for audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs
-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to read audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "Allow authenticated users to insert audit_logs" ON audit_logs;

CREATE POLICY "Allow authenticated users to read audit_logs" ON audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert audit_logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Insert Sample Audit Logs (using JSONB for details)
INSERT INTO audit_logs (action, target_table, details, timestamp) VALUES
  ('login', 'auth', '{"message": "User logged in successfully"}'::jsonb, NOW() - INTERVAL '2 hours'),
  ('create', 'document_workflows', '{"message": "Document workflow completed: Board Resolution"}'::jsonb, NOW() - INTERVAL '1 day'),
  ('create', 'compliance_items', '{"message": "New compliance deadline added: Tax filing"}'::jsonb, NOW() - INTERVAL '3 days'),
  ('update', 'roles', '{"message": "Updated Board Member permissions"}'::jsonb, NOW() - INTERVAL '5 days'),
  ('delete', 'document_workflows', '{"message": "Deleted draft workflow"}'::jsonb, NOW() - INTERVAL '1 week');
