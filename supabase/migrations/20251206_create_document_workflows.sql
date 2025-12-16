-- Create document_workflows table
CREATE TABLE IF NOT EXISTS document_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('approval', 'review', 'signature')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rejected')),
  foundation_id UUID REFERENCES foundations(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workflow_steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES document_workflows(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  assignee_id UUID REFERENCES profiles(id),
  assignee_name TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('review', 'approve', 'sign')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  completed_at TIMESTAMP WITH TIME ZONE,
  comments TEXT,
  digital_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE document_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_workflows
CREATE POLICY "Users can view workflows in their foundation"
  ON document_workflows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create workflows"
  ON document_workflows
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workflows"
  ON document_workflows
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for workflow_steps
CREATE POLICY "Users can view workflow steps"
  ON workflow_steps
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create workflow steps"
  ON workflow_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workflow steps"
  ON workflow_steps
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_document_workflows_foundation ON document_workflows(foundation_id);
CREATE INDEX IF NOT EXISTS idx_document_workflows_status ON document_workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_assignee ON workflow_steps(assignee_id);
