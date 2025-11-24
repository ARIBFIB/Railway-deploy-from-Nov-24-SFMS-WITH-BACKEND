-- =====================================================
-- DOCUMENT SYSTEM MIGRATION
-- =====================================================
-- This migration creates the complete document management system
-- with user context support and flexible document type handling
-- =====================================================

-- 1. DROP EXISTING TABLES (if they exist)
-- =====================================================
DROP TABLE IF EXISTS document_versions CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS document_types CASCADE;

-- 2. DROP EXISTING STORAGE POLICIES (if they exist)
-- =====================================================
DROP POLICY IF EXISTS "Allow authenticated users to view documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete documents" ON storage.objects;

-- 3. CREATE DOCUMENT_TYPES TABLE (Optional - for future use)
-- =====================================================
CREATE TABLE document_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  UNIQUE(foundation_id, name)
);

-- 4. CREATE DOCUMENTS TABLE
-- =====================================================
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(255) NOT NULL, -- Free-form string, no validation
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  status VARCHAR(50) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'pending_approval', 'approved', 'rejected')),
  approval_notes TEXT,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  current_version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CREATE DOCUMENT_VERSIONS TABLE
-- =====================================================
CREATE TABLE document_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  change_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(document_id, version_number)
);

-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Document Types Indexes
CREATE INDEX idx_document_types_foundation_id ON document_types(foundation_id);
CREATE INDEX idx_document_types_active ON document_types(is_active);
CREATE INDEX idx_document_types_name ON document_types(name);

-- Documents Indexes
CREATE INDEX idx_documents_foundation_id ON documents(foundation_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- Document Versions Indexes
CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_document_versions_version_number ON document_versions(version_number);
CREATE INDEX idx_document_versions_uploaded_by ON document_versions(uploaded_by);

-- 7. CREATE STORAGE BUCKET
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- 8. CREATE TRIGGER FUNCTION FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. CREATE TRIGGERS
-- =====================================================
CREATE TRIGGER update_document_types_updated_at
  BEFORE UPDATE ON document_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. CREATE STORAGE POLICIES
-- =====================================================
CREATE POLICY "Allow authenticated users to view documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated users to upload documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow authenticated users to update documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated users to delete documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'documents');

-- 11. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- 12. CREATE RLS POLICIES
-- =====================================================

-- Document Types RLS Policies
CREATE POLICY "Users can view document types for their foundation"
  ON document_types FOR SELECT
  TO authenticated
  USING (
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage document types for their foundation"
  ON document_types FOR ALL
  TO authenticated
  USING (
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Documents RLS Policies
CREATE POLICY "Users can view documents for their foundation"
  ON documents FOR SELECT
  TO authenticated
  USING (
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage documents for their foundation"
  ON documents FOR ALL
  TO authenticated
  USING (
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Document Versions RLS Policies
CREATE POLICY "Users can view document versions for their foundation"
  ON document_versions FOR SELECT
  TO authenticated
  USING (
    document_id IN (
      SELECT d.id 
      FROM documents d
      JOIN foundation_members fm ON d.foundation_id = fm.foundation_id
      WHERE fm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage document versions for their foundation"
  ON document_versions FOR ALL
  TO authenticated
  USING (
    document_id IN (
      SELECT d.id 
      FROM documents d
      JOIN foundation_members fm ON d.foundation_id = fm.foundation_id
      WHERE fm.user_id = auth.uid() 
      AND fm.role IN ('admin', 'manager')
    )
  );

-- 13. INSERT DEFAULT DOCUMENT TYPES (Optional)
-- =====================================================
-- Insert default document types for all existing foundations
DO $$
DECLARE
  foundation_record RECORD;
  foundation_count INTEGER;
BEGIN
  -- Check if foundations table exists and has data
  SELECT COUNT(*) INTO foundation_count FROM foundations;
  
  IF foundation_count > 0 THEN
    -- Insert document types for all existing foundations
    FOR foundation_record IN SELECT id FROM foundations LOOP
      INSERT INTO document_types (foundation_id, name, description, is_active) VALUES
        (foundation_record.id, 'Annual Report', 'Yearly financial and operational report', true),
        (foundation_record.id, 'Financial Statement', 'Quarterly or annual financial statements', true),
        (foundation_record.id, 'Tax Return', 'Annual tax filing documents', true),
        (foundation_record.id, 'Meeting Minutes', 'Board and committee meeting records', true),
        (foundation_record.id, 'Board Resolution', 'Official board decisions and resolutions', true),
        (foundation_record.id, 'Grant Application', 'Applications for funding and grants', true),
        (foundation_record.id, 'Audit Report', 'External audit findings and recommendations', true),
        (foundation_record.id, 'Insurance Policy', 'Insurance coverage documents', true),
        (foundation_record.id, 'Legal Document', 'Legal agreements and contracts', true),
        (foundation_record.id, 'Contract', 'Service and vendor agreements', true),
        (foundation_record.id, 'Invoice', 'Billing and payment documents', true),
        (foundation_record.id, 'Receipt', 'Payment confirmations and receipts', true),
        (foundation_record.id, 'Articles of Association', 'Foundation governing documents', true),
        (foundation_record.id, 'Bylaws', 'Internal rules and procedures', true),
        (foundation_record.id, 'Other', 'Miscellaneous documents', true)
      ON CONFLICT (foundation_id, name) DO NOTHING;
    END LOOP;
    
    RAISE NOTICE 'Inserted document types for % foundations', foundation_count;
  ELSE
    RAISE NOTICE 'No foundations found. Document types will be created when foundations are added.';
  END IF;
END $$;

-- 14. ADD TABLE COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE document_types IS 'Manages document type definitions for each foundation (optional)';
COMMENT ON TABLE documents IS 'Main document storage with metadata and approval workflow';
COMMENT ON TABLE document_versions IS 'Version control for document updates and changes';

COMMENT ON COLUMN documents.current_version IS 'Tracks the current version number of the document';
COMMENT ON COLUMN documents.status IS 'Document approval status: uploaded, pending_approval, approved, rejected';
COMMENT ON COLUMN documents.document_type IS 'Free-form document type string (no validation required)';
COMMENT ON COLUMN document_versions.version_number IS 'Sequential version number for document updates';

-- 15. CREATE UTILITY FUNCTIONS
-- =====================================================

-- Function to get document statistics
CREATE OR REPLACE FUNCTION get_document_stats(foundation_id_param UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_documents', (SELECT COUNT(*) FROM documents WHERE foundation_id = foundation_id_param),
    'documents_by_status', (
      SELECT json_object_agg(status, count)
      FROM (
        SELECT status, COUNT(*) as count
        FROM documents 
        WHERE foundation_id = foundation_id_param
        GROUP BY status
      ) status_counts
    ),
    'documents_by_type', (
      SELECT json_object_agg(document_type, count)
      FROM (
        SELECT document_type, COUNT(*) as count
        FROM documents 
        WHERE foundation_id = foundation_id_param
        GROUP BY document_type
      ) type_counts
    ),
    'total_versions', (
      SELECT COUNT(*) 
      FROM document_versions dv
      JOIN documents d ON dv.document_id = d.id
      WHERE d.foundation_id = foundation_id_param
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create default document types for a new foundation
CREATE OR REPLACE FUNCTION create_default_document_types_for_foundation(foundation_id_param UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO document_types (foundation_id, name, description, is_active) VALUES
    (foundation_id_param, 'Annual Report', 'Yearly financial and operational report', true),
    (foundation_id_param, 'Financial Statement', 'Quarterly or annual financial statements', true),
    (foundation_id_param, 'Tax Return', 'Annual tax filing documents', true),
    (foundation_id_param, 'Meeting Minutes', 'Board and committee meeting records', true),
    (foundation_id_param, 'Board Resolution', 'Official board decisions and resolutions', true),
    (foundation_id_param, 'Grant Application', 'Applications for funding and grants', true),
    (foundation_id_param, 'Audit Report', 'External audit findings and recommendations', true),
    (foundation_id_param, 'Insurance Policy', 'Insurance coverage documents', true),
    (foundation_id_param, 'Legal Document', 'Legal agreements and contracts', true),
    (foundation_id_param, 'Contract', 'Service and vendor agreements', true),
    (foundation_id_param, 'Invoice', 'Billing and payment documents', true),
    (foundation_id_param, 'Receipt', 'Payment confirmations and receipts', true),
    (foundation_id_param, 'Articles of Association', 'Foundation governing documents', true),
    (foundation_id_param, 'Bylaws', 'Internal rules and procedures', true),
    (foundation_id_param, 'Other', 'Miscellaneous documents', true)
  ON CONFLICT (foundation_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. SUCCESS MESSAGE
-- =====================================================
SELECT 'Document system migration completed successfully!' as status,
       'Document upload system is ready with user context support and flexible document types.' as message;




