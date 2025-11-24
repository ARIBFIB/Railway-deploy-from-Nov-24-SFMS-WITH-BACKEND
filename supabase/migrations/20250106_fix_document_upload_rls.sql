-- Fix RLS policies for document uploads when using service role
-- This migration adds policies that allow service role operations

-- Drop existing policies that are causing issues
DROP POLICY IF EXISTS "Foundation members can upload documents" ON documents;
DROP POLICY IF EXISTS "Admins can manage documents for their foundation" ON documents;

-- Create new policies that work with both user context and service role
-- Policy for SELECT operations
CREATE POLICY "Allow document access for foundation members and service role"
  ON documents FOR SELECT
  TO authenticated
  USING (
    -- Allow if user is foundation member
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );

-- Policy for INSERT operations
CREATE POLICY "Allow document upload for foundation members and service role"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is foundation member
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );

-- Policy for UPDATE operations
CREATE POLICY "Allow document update for foundation members and service role"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    -- Allow if user is foundation member
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );

-- Policy for DELETE operations
CREATE POLICY "Allow document delete for foundation members and service role"
  ON documents FOR DELETE
  TO authenticated
  USING (
    -- Allow if user is foundation member
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );

-- Also fix document_versions table policies
DROP POLICY IF EXISTS "Users can view document versions for their foundation" ON document_versions;
DROP POLICY IF EXISTS "Admins can manage document versions for their foundation" ON document_versions;

-- Create new policies for document_versions
CREATE POLICY "Allow document version access for foundation members and service role"
  ON document_versions FOR SELECT
  TO authenticated
  USING (
    -- Allow if user is foundation member of the document's foundation
    document_id IN (
      SELECT d.id 
      FROM documents d
      JOIN foundation_members fm ON d.foundation_id = fm.foundation_id
      WHERE fm.user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );

CREATE POLICY "Allow document version upload for foundation members and service role"
  ON document_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is foundation member of the document's foundation
    document_id IN (
      SELECT d.id 
      FROM documents d
      JOIN foundation_members fm ON d.foundation_id = fm.foundation_id
      WHERE fm.user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );

CREATE POLICY "Allow document version update for foundation members and service role"
  ON document_versions FOR UPDATE
  TO authenticated
  USING (
    -- Allow if user is foundation member of the document's foundation
    document_id IN (
      SELECT d.id 
      FROM documents d
      JOIN foundation_members fm ON d.foundation_id = fm.foundation_id
      WHERE fm.user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );

CREATE POLICY "Allow document version delete for foundation members and service role"
  ON document_versions FOR DELETE
  TO authenticated
  USING (
    -- Allow if user is foundation member of the document's foundation
    document_id IN (
      SELECT d.id 
      FROM documents d
      JOIN foundation_members fm ON d.foundation_id = fm.foundation_id
      WHERE fm.user_id = auth.uid()
    )
    OR
    -- Allow service role (when auth.uid() is null)
    auth.uid() IS NULL
  );




