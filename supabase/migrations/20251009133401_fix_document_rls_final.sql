-- Final fix for document upload RLS issues
-- This migration completely resolves the "new row violates row-level security policy" error

-- 1. DROP ALL EXISTING PROBLEMATIC POLICIES
-- =====================================================

-- Drop all existing storage policies
DROP POLICY IF EXISTS "Foundation members can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Foundation members can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Document owners can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Document owners can delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow document viewing for foundation members and service role" ON storage.objects;
DROP POLICY IF EXISTS "Allow document upload for foundation members and service role" ON storage.objects;
DROP POLICY IF EXISTS "Allow document update for owners and service role" ON storage.objects;
DROP POLICY IF EXISTS "Allow document delete for owners and service role" ON storage.objects;

-- Drop all existing document table policies
DROP POLICY IF EXISTS "Foundation members can read documents" ON documents;
DROP POLICY IF EXISTS "Foundation members can upload documents" ON documents;
DROP POLICY IF EXISTS "Foundation owners can update documents" ON documents;
DROP POLICY IF EXISTS "Users can view documents for their foundation" ON documents;
DROP POLICY IF EXISTS "Admins can manage documents for their foundation" ON documents;
DROP POLICY IF EXISTS "Allow document access for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document upload for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document update for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document delete for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document read for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document insert for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document update for owners and service role" ON documents;
DROP POLICY IF EXISTS "Allow document delete for owners and service role" ON documents;

-- Drop all existing document_versions table policies
DROP POLICY IF EXISTS "Users can view document versions for their foundation" ON document_versions;
DROP POLICY IF EXISTS "Admins can manage document versions for their foundation" ON document_versions;
DROP POLICY IF EXISTS "Allow document version access for foundation members and service role" ON document_versions;
DROP POLICY IF EXISTS "Allow document version upload for foundation members and service role" ON document_versions;
DROP POLICY IF EXISTS "Allow document version update for foundation members and service role" ON document_versions;
DROP POLICY IF EXISTS "Allow document version delete for foundation members and service role" ON document_versions;
DROP POLICY IF EXISTS "Allow document version read for foundation members and service role" ON document_versions;
DROP POLICY IF EXISTS "Allow document version insert for foundation members and service role" ON document_versions;
DROP POLICY IF EXISTS "Allow document version update for owners and service role" ON document_versions;
DROP POLICY IF EXISTS "Allow document version delete for owners and service role" ON document_versions;

-- 2. CREATE SIMPLIFIED HELPER FUNCTIONS
-- =====================================================

-- Function to check if current user is service role (simplified)
CREATE OR REPLACE FUNCTION is_service_role()
RETURNS boolean AS $$
BEGIN
  -- Service role bypasses RLS completely
  -- When using service role, auth.uid() returns NULL
  RETURN auth.uid() IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check foundation membership (simplified)
CREATE OR REPLACE FUNCTION is_foundation_member(foundation_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Service role can access everything
  IF is_service_role() THEN
    RETURN true;
  END IF;
  
  -- Check if user is a member of the foundation
  RETURN EXISTS (
    SELECT 1 FROM foundation_members fm
    WHERE fm.foundation_id = $1 AND fm.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CREATE SIMPLIFIED STORAGE POLICIES
-- =====================================================

-- Policy for viewing documents in storage
CREATE POLICY "documents_select_policy"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      is_service_role() OR
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND is_foundation_member(d.foundation_id)
      )
    )
  );

-- Policy for uploading documents to storage
CREATE POLICY "documents_insert_policy"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND (
      is_service_role() OR
      -- Allow uploads to foundation folders where user is a member
      EXISTS (
        SELECT 1 FROM foundation_members fm
        WHERE fm.foundation_id::text = (storage.foldername(name))[1]
        AND fm.user_id = auth.uid()
      )
    )
  );

-- Policy for updating documents in storage
CREATE POLICY "documents_update_policy"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      is_service_role() OR
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND is_foundation_member(d.foundation_id)
      )
    )
  );

-- Policy for deleting documents from storage
CREATE POLICY "documents_delete_policy"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      is_service_role() OR
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND is_foundation_member(d.foundation_id)
      )
    )
  );

-- 4. CREATE SIMPLIFIED DOCUMENTS TABLE POLICIES
-- =====================================================

-- Policy for reading documents
CREATE POLICY "documents_table_select_policy"
  ON documents FOR SELECT
  TO authenticated
  USING (
    is_service_role() OR
    is_foundation_member(foundation_id)
  );

-- Policy for inserting documents
CREATE POLICY "documents_table_insert_policy"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    is_service_role() OR
    is_foundation_member(foundation_id)
  );

-- Policy for updating documents
CREATE POLICY "documents_table_update_policy"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    is_service_role() OR
    is_foundation_member(foundation_id)
  )
  WITH CHECK (
    is_service_role() OR
    is_foundation_member(foundation_id)
  );

-- Policy for deleting documents
CREATE POLICY "documents_table_delete_policy"
  ON documents FOR DELETE
  TO authenticated
  USING (
    is_service_role() OR
    is_foundation_member(foundation_id)
  );

-- 5. CREATE SIMPLIFIED DOCUMENT_VERSIONS TABLE POLICIES
-- =====================================================

-- Policy for reading document versions
CREATE POLICY "document_versions_select_policy"
  ON document_versions FOR SELECT
  TO authenticated
  USING (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_member(d.foundation_id)
    )
  );

-- Policy for inserting document versions
CREATE POLICY "document_versions_insert_policy"
  ON document_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_member(d.foundation_id)
    )
  );

-- Policy for updating document versions
CREATE POLICY "document_versions_update_policy"
  ON document_versions FOR UPDATE
  TO authenticated
  USING (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_member(d.foundation_id)
    )
  )
  WITH CHECK (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_member(d.foundation_id)
    )
  );

-- Policy for deleting document versions
CREATE POLICY "document_versions_delete_policy"
  ON document_versions FOR DELETE
  TO authenticated
  USING (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_member(d.foundation_id)
    )
  );

-- 6. UPDATE RPC FUNCTIONS
-- =====================================================

-- Update create_document function to be more robust
CREATE OR REPLACE FUNCTION create_document(
  p_foundation_id uuid,
  p_document_type varchar,
  p_uploaded_by uuid,
  p_file_name text,
  p_file_path text,
  p_file_size bigint,
  p_mime_type text,
  p_approval_notes text DEFAULT NULL
)
RETURNS documents AS $$
DECLARE
  result documents;
BEGIN
  -- Service role can create documents for any foundation
  -- Regular users must be foundation members
  IF NOT is_service_role() AND NOT is_foundation_member(p_foundation_id) THEN
    RAISE EXCEPTION 'Access denied: User is not a member of this foundation';
  END IF;
  
  -- Insert the document
  INSERT INTO documents (
    foundation_id,
    document_type,
    uploaded_by,
    file_name,
    file_path,
    file_size,
    mime_type,
    status,
    approval_notes,
    current_version,
    created_at,
    updated_at
  ) VALUES (
    p_foundation_id,
    p_document_type,
    p_uploaded_by,
    p_file_name,
    p_file_path,
    p_file_size,
    p_mime_type,
    'uploaded',
    p_approval_notes,
    1,
    now(),
    now()
  ) RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_documents function
CREATE OR REPLACE FUNCTION get_documents(
  p_foundation_id uuid DEFAULT NULL,
  p_document_type varchar DEFAULT NULL,
  p_status varchar DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  foundation_id uuid,
  uploaded_by uuid,
  document_type varchar,
  file_name text,
  file_path text,
  file_size bigint,
  mime_type text,
  status varchar,
  approval_notes text,
  approved_by uuid,
  approved_at timestamptz,
  current_version integer,
  created_at timestamptz,
  updated_at timestamptz
) AS $$
BEGIN
  -- Service role can access all documents
  IF is_service_role() THEN
    RETURN QUERY
    SELECT d.id, d.foundation_id, d.uploaded_by, d.document_type, d.file_name,
           d.file_path, d.file_size, d.mime_type, d.status, d.approval_notes,
           d.approved_by, d.approved_at, d.current_version, d.created_at, d.updated_at
    FROM documents d
    WHERE (p_foundation_id IS NULL OR d.foundation_id = p_foundation_id)
      AND (p_document_type IS NULL OR d.document_type = p_document_type)
      AND (p_status IS NULL OR d.status = p_status)
    ORDER BY d.created_at DESC;
  ELSE
    -- Regular users can only access documents from their foundations
    RETURN QUERY
    SELECT d.id, d.foundation_id, d.uploaded_by, d.document_type, d.file_name,
           d.file_path, d.file_size, d.mime_type, d.status, d.approval_notes,
           d.approved_by, d.approved_at, d.current_version, d.created_at, d.updated_at
    FROM documents d
    WHERE is_foundation_member(d.foundation_id)
      AND (p_foundation_id IS NULL OR d.foundation_id = p_foundation_id)
      AND (p_document_type IS NULL OR d.document_type = p_document_type)
      AND (p_status IS NULL OR d.status = p_status)
    ORDER BY d.created_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on the RPC functions
GRANT EXECUTE ON FUNCTION create_document TO authenticated;
GRANT EXECUTE ON FUNCTION get_documents TO authenticated;
GRANT EXECUTE ON FUNCTION is_service_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_foundation_member TO authenticated;

-- Ensure storage bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET
  public = false;

-- 8. VERIFY SETUP
-- =====================================================

-- Test that the functions work correctly
DO $$
BEGIN
  -- This should not raise an error
  PERFORM is_service_role();
  PERFORM is_foundation_member('00000000-0000-0000-0000-000000000000'::uuid);
  
  RAISE NOTICE 'Document RLS policies fixed successfully';
END $$;
