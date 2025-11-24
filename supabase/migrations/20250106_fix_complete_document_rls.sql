-- Complete fix for document upload, view, and download RLS issues
-- This migration addresses the service role authentication problem

-- 1. DROP ALL EXISTING PROBLEMATIC POLICIES
-- =====================================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Foundation members can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Foundation members can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Document owners can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Document owners can delete documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete documents" ON storage.objects;

-- Drop existing document table policies
DROP POLICY IF EXISTS "Foundation members can read documents" ON documents;
DROP POLICY IF EXISTS "Foundation members can upload documents" ON documents;
DROP POLICY IF EXISTS "Foundation owners can update documents" ON documents;
DROP POLICY IF EXISTS "Users can view documents for their foundation" ON documents;
DROP POLICY IF EXISTS "Admins can manage documents for their foundation" ON documents;
DROP POLICY IF EXISTS "Allow document access for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document upload for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document update for foundation members and service role" ON documents;
DROP POLICY IF EXISTS "Allow document delete for foundation members and service role" ON documents;

-- Drop existing document_versions table policies
DROP POLICY IF EXISTS "Users can view document versions for their foundation" ON document_versions;
DROP POLICY IF EXISTS "Admins can manage document versions for their foundation" ON document_versions;

-- 2. CREATE NEW HELPER FUNCTIONS FOR SERVICE ROLE SUPPORT
-- =====================================================

-- Function to check if current user is service role
CREATE OR REPLACE FUNCTION is_service_role()
RETURNS boolean AS $$
BEGIN
  -- Service role has no auth.uid() and bypasses RLS
  RETURN auth.uid() IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function to check foundation membership (works with service role)
CREATE OR REPLACE FUNCTION is_foundation_member(foundation_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Allow service role to bypass checks
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

-- Enhanced function to check foundation ownership (works with service role)
CREATE OR REPLACE FUNCTION is_foundation_owner(foundation_id uuid)
RETURNS boolean AS $$
BEGIN
  -- Allow service role to bypass checks
  IF is_service_role() THEN
    RETURN true;
  END IF;
  
  -- Check if user is the owner of the foundation
  RETURN EXISTS (
    SELECT 1 FROM foundations f
    WHERE f.id = $1 AND f.owner_user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function to check admin role (works with service role)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  -- Allow service role to bypass checks
  IF is_service_role() THEN
    RETURN true;
  END IF;
  
  -- Check if user has admin role
  RETURN EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CREATE NEW STORAGE POLICIES
-- =====================================================

-- Policy for viewing documents in storage
CREATE POLICY "Allow document viewing for foundation members and service role"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Service role can view all documents
      is_service_role() OR
      -- Foundation members can view documents from their foundation
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND is_foundation_member(d.foundation_id)
      )
    )
  );

-- Policy for uploading documents to storage
CREATE POLICY "Allow document upload for foundation members and service role"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND (
      -- Service role can upload anywhere
      is_service_role() OR
      -- Foundation members can upload to their foundation folder
      EXISTS (
        SELECT 1 FROM foundation_members fm
        WHERE fm.foundation_id::text = (storage.foldername(name))[1]
        AND fm.user_id = auth.uid()
      )
    )
  );

-- Policy for updating documents in storage
CREATE POLICY "Allow document update for owners and service role"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Service role can update all documents
      is_service_role() OR
      -- Document owners and foundation owners can update
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND (
          d.uploaded_by = auth.uid() OR 
          is_foundation_owner(d.foundation_id)
        )
      )
    )
  );

-- Policy for deleting documents from storage
CREATE POLICY "Allow document delete for owners and service role"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND (
      -- Service role can delete all documents
      is_service_role() OR
      -- Document owners and foundation owners can delete
      EXISTS (
        SELECT 1 FROM documents d
        WHERE d.file_path = name AND (
          d.uploaded_by = auth.uid() OR 
          is_foundation_owner(d.foundation_id)
        )
      )
    )
  );

-- 4. CREATE NEW DOCUMENTS TABLE POLICIES
-- =====================================================

-- Policy for reading documents
CREATE POLICY "Allow document read for foundation members and service role"
  ON documents FOR SELECT
  TO authenticated
  USING (
    -- Service role can read all documents
    is_service_role() OR
    -- Foundation members can read documents from their foundation
    is_foundation_member(foundation_id) OR
    -- Admins can read all documents
    is_admin()
  );

-- Policy for inserting documents
CREATE POLICY "Allow document insert for foundation members and service role"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Service role can insert documents for any foundation
    is_service_role() OR
    -- Foundation members can insert documents for their foundation
    is_foundation_member(foundation_id) OR
    -- Admins can insert documents for any foundation
    is_admin()
  );

-- Policy for updating documents
CREATE POLICY "Allow document update for owners and service role"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    -- Service role can update all documents
    is_service_role() OR
    -- Document uploaders can update their own documents
    uploaded_by = auth.uid() OR
    -- Foundation owners can update documents in their foundation
    is_foundation_owner(foundation_id) OR
    -- Admins can update all documents
    is_admin()
  )
  WITH CHECK (
    -- Service role can update all documents
    is_service_role() OR
    -- Document uploaders can update their own documents
    uploaded_by = auth.uid() OR
    -- Foundation owners can update documents in their foundation
    is_foundation_owner(foundation_id) OR
    -- Admins can update all documents
    is_admin()
  );

-- Policy for deleting documents
CREATE POLICY "Allow document delete for owners and service role"
  ON documents FOR DELETE
  TO authenticated
  USING (
    -- Service role can delete all documents
    is_service_role() OR
    -- Document uploaders can delete their own documents
    uploaded_by = auth.uid() OR
    -- Foundation owners can delete documents in their foundation
    is_foundation_owner(foundation_id) OR
    -- Admins can delete all documents
    is_admin()
  );

-- 5. CREATE NEW DOCUMENT_VERSIONS TABLE POLICIES
-- =====================================================

-- Policy for reading document versions
CREATE POLICY "Allow document version read for foundation members and service role"
  ON document_versions FOR SELECT
  TO authenticated
  USING (
    -- Service role can read all document versions
    is_service_role() OR
    -- Foundation members can read versions of documents from their foundation
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_member(d.foundation_id)
    ) OR
    -- Admins can read all document versions
    is_admin()
  );

-- Policy for inserting document versions
CREATE POLICY "Allow document version insert for foundation members and service role"
  ON document_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Service role can insert document versions for any document
    is_service_role() OR
    -- Foundation members can insert versions for documents in their foundation
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_member(d.foundation_id)
    ) OR
    -- Admins can insert document versions for any document
    is_admin()
  );

-- Policy for updating document versions
CREATE POLICY "Allow document version update for owners and service role"
  ON document_versions FOR UPDATE
  TO authenticated
  USING (
    -- Service role can update all document versions
    is_service_role() OR
    -- Version uploaders can update their own versions
    uploaded_by = auth.uid() OR
    -- Foundation owners can update versions for documents in their foundation
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_owner(d.foundation_id)
    ) OR
    -- Admins can update all document versions
    is_admin()
  )
  WITH CHECK (
    -- Service role can update all document versions
    is_service_role() OR
    -- Version uploaders can update their own versions
    uploaded_by = auth.uid() OR
    -- Foundation owners can update versions for documents in their foundation
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_owner(d.foundation_id)
    ) OR
    -- Admins can update all document versions
    is_admin()
  );

-- Policy for deleting document versions
CREATE POLICY "Allow document version delete for owners and service role"
  ON document_versions FOR DELETE
  TO authenticated
  USING (
    -- Service role can delete all document versions
    is_service_role() OR
    -- Version uploaders can delete their own versions
    uploaded_by = auth.uid() OR
    -- Foundation owners can delete versions for documents in their foundation
    EXISTS (
      SELECT 1 FROM documents d
      WHERE d.id = document_id AND is_foundation_owner(d.foundation_id)
    ) OR
    -- Admins can delete all document versions
    is_admin()
  );

-- 6. CREATE RPC FUNCTION FOR DOCUMENT OPERATIONS
-- =====================================================

-- Function to create document with proper authorization
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
  -- Check if user has permission to upload to this foundation
  IF NOT is_service_role() AND NOT is_foundation_member(p_foundation_id) AND NOT is_admin() THEN
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
    now(),
    now()
  ) RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get documents with proper authorization
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
    WHERE is_foundation_member(d.foundation_id) OR is_admin()
      AND (p_foundation_id IS NULL OR d.foundation_id = p_foundation_id)
      AND (p_document_type IS NULL OR d.document_type = p_document_type)
      AND (p_status IS NULL OR d.status = p_status)
    ORDER BY d.created_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. GRANT NECESSARY PERMISSIONS
-- =====================================================

-- Grant execute permissions on the RPC functions
GRANT EXECUTE ON FUNCTION create_document TO authenticated;
GRANT EXECUTE ON FUNCTION get_documents TO authenticated;

-- Ensure storage bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET
  public = false;

-- 8. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_documents_foundation_id ON documents(foundation_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_approved_by ON documents(approved_by);

CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_version_number ON document_versions(version_number);
CREATE INDEX IF NOT EXISTS idx_document_versions_uploaded_by ON document_versions(uploaded_by);

-- 9. VERIFY SETUP
-- =====================================================

-- Test that the functions work correctly
DO $$
BEGIN
  -- This should not raise an error
  PERFORM is_service_role();
  PERFORM is_foundation_member('00000000-0000-0000-0000-000000000000'::uuid);
  PERFORM is_foundation_owner('00000000-0000-0000-0000-000000000000'::uuid);
  PERFORM is_admin();
  
  RAISE NOTICE 'All RLS functions created successfully';
END $$;




