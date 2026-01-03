-- Create persistent_image_gallery table for storing unlinked images
CREATE TABLE IF NOT EXISTS persistent_image_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_name VARCHAR(255) NOT NULL,
  image_size INTEGER,
  mime_type VARCHAR(100),
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id),
  is_linked BOOLEAN DEFAULT FALSE,
  linked_verification_id UUID REFERENCES verifications(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_persistent_image_gallery_foundation ON persistent_image_gallery(foundation_id);
CREATE INDEX idx_persistent_image_gallery_user ON persistent_image_gallery(uploaded_by);
CREATE INDEX idx_persistent_image_gallery_linked ON persistent_image_gallery(is_linked, linked_verification_id);

-- RLS policies for persistent_image_gallery
ALTER TABLE persistent_image_gallery ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view images in their foundation
CREATE POLICY "persistent_image_gallery_view_policy" ON persistent_image_gallery
  FOR SELECT TO authenticated
  USING (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM foundation_members fm
      WHERE fm.foundation_id = persistent_image_gallery.foundation_id
      AND fm.user_id = auth.uid()
    )
  );

-- Policy: Users can insert images in their foundation
CREATE POLICY "persistent_image_gallery_insert_policy" ON persistent_image_gallery
  FOR INSERT TO authenticated
  WITH CHECK (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM foundation_members fm
      WHERE fm.foundation_id = persistent_image_gallery.foundation_id
      AND fm.user_id = auth.uid()
    )
  );

-- Policy: Users can update images in their foundation
CREATE POLICY "persistent_image_gallery_update_policy" ON persistent_image_gallery
  FOR UPDATE TO authenticated
  USING (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM foundation_members fm
      WHERE fm.foundation_id = persistent_image_gallery.foundation_id
      AND fm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM foundation_members fm
      WHERE fm.foundation_id = persistent_image_gallery.foundation_id
      AND fm.user_id = auth.uid()
    )
  );

-- Policy: Users can delete images in their foundation
CREATE POLICY "persistent_image_gallery_delete_policy" ON persistent_image_gallery
  FOR DELETE TO authenticated
  USING (
    is_service_role() OR
    EXISTS (
      SELECT 1 FROM foundation_members fm
      WHERE fm.foundation_id = persistent_image_gallery.foundation_id
      AND fm.user_id = auth.uid()
    )
  );

-- Add column to verifications table to track if they have gallery images
-- (this may already exist, but adding it here for completeness)
ALTER TABLE verifications 
ADD COLUMN IF NOT EXISTS has_gallery BOOLEAN DEFAULT FALSE;

-- Update the has_gallery column in verifications based on verification_images
UPDATE verifications 
SET has_gallery = true 
WHERE id IN (
  SELECT DISTINCT verification_id 
  FROM verification_images
);