-- =====================================================
-- FIX DOCUMENT FOREIGN KEY RELATIONSHIPS
-- =====================================================
-- This migration fixes the foreign key relationships for the document system
-- to enable proper joins with the profiles table
-- =====================================================

-- 1. DROP EXISTING FOREIGN KEY CONSTRAINTS (if they exist)
-- =====================================================
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_uploaded_by_fkey;
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_approved_by_fkey;
ALTER TABLE document_versions DROP CONSTRAINT IF EXISTS document_versions_uploaded_by_fkey;

-- 2. ADD PROPER FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Documents table foreign keys
ALTER TABLE documents 
ADD CONSTRAINT documents_uploaded_by_fkey 
FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE documents 
ADD CONSTRAINT documents_approved_by_fkey 
FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- Document versions table foreign keys
ALTER TABLE document_versions 
ADD CONSTRAINT document_versions_uploaded_by_fkey 
FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. CREATE INDEXES FOR FOREIGN KEYS (if they don't exist)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_approved_by ON documents(approved_by);
CREATE INDEX IF NOT EXISTS idx_document_versions_uploaded_by ON document_versions(uploaded_by);

-- 4. VERIFY FOREIGN KEY CONSTRAINTS
-- =====================================================
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name IN ('documents', 'document_versions')
ORDER BY tc.table_name, tc.constraint_name;

-- 5. SUCCESS MESSAGE
-- =====================================================
SELECT 'Foreign key relationships created successfully!' as status,
       'Document system can now properly join with profiles table.' as message;




