-- =====================================================
-- CREATE DOCUMENTS_PROFILES_1 TABLE
-- =====================================================
-- This migration creates the documents_profiles_1 table
-- which appears to be a junction table linking documents with profiles
-- =====================================================

-- 1. DROP EXISTING TABLE (if it exists)
-- =====================================================
DROP TABLE IF EXISTS documents_profiles_1 CASCADE;

-- 2. CREATE DOCUMENTS_PROFILES_1 TABLE
-- =====================================================
CREATE TABLE documents_profiles_1 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id),
  UNIQUE(document_id, profile_id)
);

-- 3. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_documents_profiles_1_document_id ON documents_profiles_1(document_id);
CREATE INDEX idx_documents_profiles_1_profile_id ON documents_profiles_1(profile_id);
CREATE INDEX idx_documents_profiles_1_created_at ON documents_profiles_1(created_at);

-- 4. CREATE TRIGGER FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_documents_profiles_1_updated_at
  BEFORE UPDATE ON documents_profiles_1
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE documents_profiles_1 ENABLE ROW LEVEL SECURITY;

-- 6. CREATE RLS POLICIES
-- =====================================================

-- Users can view documents_profiles_1 for their foundation
CREATE POLICY "Users can view documents_profiles_1 for their foundation"
  ON documents_profiles_1 FOR SELECT
  TO authenticated
  USING (
    document_id IN (
      SELECT d.id 
      FROM documents d
      JOIN foundation_members fm ON d.foundation_id = fm.foundation_id
      WHERE fm.user_id = auth.uid()
    )
  );

-- Admins can manage documents_profiles_1 for their foundation
CREATE POLICY "Admins can manage documents_profiles_1 for their foundation"
  ON documents_profiles_1 FOR ALL
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

-- 7. ADD TABLE COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE documents_profiles_1 IS 'Junction table linking documents with profiles for access control or collaboration';
COMMENT ON COLUMN documents_profiles_1.document_id IS 'Reference to the document';
COMMENT ON COLUMN documents_profiles_1.profile_id IS 'Reference to the profile/user';
COMMENT ON COLUMN documents_profiles_1.created_by IS 'User who created this relationship';
COMMENT ON COLUMN documents_profiles_1.updated_by IS 'User who last updated this relationship';

-- 8. SUCCESS MESSAGE
-- =====================================================
SELECT 'documents_profiles_1 table created successfully!' as status,
       'Junction table is ready for linking documents with profiles.' as message;






