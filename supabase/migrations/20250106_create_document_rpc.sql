-- Create RPC function to bypass RLS for document creation
-- This function allows the service role to create documents without RLS restrictions

CREATE OR REPLACE FUNCTION create_document(
  p_foundation_id uuid,
  p_document_type varchar(255),
  p_uploaded_by uuid,
  p_file_name text,
  p_file_path text,
  p_file_size bigint,
  p_mime_type text,
  p_status varchar(50) DEFAULT 'uploaded',
  p_approval_notes text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  foundation_id uuid,
  uploaded_by uuid,
  document_type varchar(255),
  file_name text,
  file_path text,
  file_size bigint,
  mime_type text,
  status varchar(50),
  approval_notes text,
  approved_by uuid,
  approved_at timestamptz,
  current_version integer,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_document documents%ROWTYPE;
BEGIN
  -- Insert the document record
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
    p_status,
    p_approval_notes,
    1,
    now(),
    now()
  ) RETURNING * INTO new_document;

  -- Return the created document
  RETURN QUERY SELECT 
    new_document.id,
    new_document.foundation_id,
    new_document.uploaded_by,
    new_document.document_type,
    new_document.file_name,
    new_document.file_path,
    new_document.file_size,
    new_document.mime_type,
    new_document.status,
    new_document.approval_notes,
    new_document.approved_by,
    new_document.approved_at,
    new_document.current_version,
    new_document.created_at,
    new_document.updated_at;
END;
$$;




