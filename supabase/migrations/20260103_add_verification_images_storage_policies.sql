-- Create verification-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-images',
  'verification-images',
  false,
  52428800,  -- 50MB in bytes
  '{image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml}'
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for verification-images storage bucket
-- Policy for authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload verification images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'verification-images'
  AND (auth.role() = 'authenticated')
);

-- Policy for authenticated users to view images in their foundation
CREATE POLICY "Allow authenticated users to view verification images" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'verification-images'
  AND (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM persistent_image_gallery pig
      JOIN foundation_members fm ON fm.foundation_id = pig.foundation_id
      WHERE fm.user_id = auth.uid()
      AND pig.file_path = name
    )
  )
);

-- Policy for authenticated users to update their images
CREATE POLICY "Allow authenticated users to update verification images" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'verification-images'
  AND (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM persistent_image_gallery pig
      JOIN foundation_members fm ON fm.foundation_id = pig.foundation_id
      WHERE fm.user_id = auth.uid()
      AND pig.file_path = name
    )
  )
);

-- Policy for authenticated users to delete their images
CREATE POLICY "Allow authenticated users to delete verification images" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'verification-images'
  AND (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM persistent_image_gallery pig
      JOIN foundation_members fm ON fm.foundation_id = pig.foundation_id
      WHERE fm.user_id = auth.uid()
      AND pig.file_path = name
    )
  )
);