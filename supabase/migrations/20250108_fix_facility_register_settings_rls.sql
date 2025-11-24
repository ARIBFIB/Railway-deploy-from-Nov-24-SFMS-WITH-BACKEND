-- Fix RLS policies for facility_register_settings
-- Create SECURITY DEFINER functions to bypass RLS for backend operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view facility register settings for their foundation" ON facility_register_settings;
DROP POLICY IF EXISTS "Users can create facility register settings for their foundation" ON facility_register_settings;
DROP POLICY IF EXISTS "Users can update facility register settings for their foundation" ON facility_register_settings;
DROP POLICY IF EXISTS "Users can delete facility register settings for their foundation" ON facility_register_settings;

-- Create updated RLS policies that work with both authenticated users and service role
CREATE POLICY "Users can view facility register settings for their foundation" ON facility_register_settings
    FOR SELECT USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
        OR
        -- Allow service role to read (when auth.uid() is NULL)
        auth.uid() IS NULL
    );

CREATE POLICY "Users can create facility register settings for their foundation" ON facility_register_settings
    FOR INSERT WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
        OR
        -- Allow service role to insert (when auth.uid() is NULL)
        auth.uid() IS NULL
    );

CREATE POLICY "Users can update facility register settings for their foundation" ON facility_register_settings
    FOR UPDATE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
        OR
        -- Allow service role to update (when auth.uid() is NULL)
        auth.uid() IS NULL
    );

CREATE POLICY "Users can delete facility register settings for their foundation" ON facility_register_settings
    FOR DELETE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
        OR
        -- Allow service role to delete (when auth.uid() is NULL)
        auth.uid() IS NULL
    );

-- Create SECURITY DEFINER function for upserting facility register settings
-- This function bypasses RLS and allows backend operations
CREATE OR REPLACE FUNCTION upsert_facility_register_settings(
  p_foundation_id uuid,
  p_proposed_depreciation_start_date varchar(100) DEFAULT 'Acquisition month',
  p_create_asset_from_supplier_invoice boolean DEFAULT false,
  p_enable_component_depreciation_support boolean DEFAULT false,
  p_user_id uuid DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  foundation_id uuid,
  proposed_depreciation_start_date varchar(100),
  create_asset_from_supplier_invoice boolean,
  enable_component_depreciation_support boolean,
  created_at timestamptz,
  updated_at timestamptz,
  created_by uuid,
  updated_by uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_settings facility_register_settings%ROWTYPE;
BEGIN
  -- Check if settings already exist
  SELECT * INTO v_settings
  FROM facility_register_settings
  WHERE foundation_id = p_foundation_id
  LIMIT 1;

  IF v_settings.id IS NOT NULL THEN
    -- Update existing settings
    UPDATE facility_register_settings
    SET
      proposed_depreciation_start_date = p_proposed_depreciation_start_date,
      create_asset_from_supplier_invoice = p_create_asset_from_supplier_invoice,
      enable_component_depreciation_support = p_enable_component_depreciation_support,
      updated_by = p_user_id,
      updated_at = NOW()
    WHERE foundation_id = p_foundation_id
    RETURNING * INTO v_settings;
  ELSE
    -- Insert new settings
    INSERT INTO facility_register_settings (
      foundation_id,
      proposed_depreciation_start_date,
      create_asset_from_supplier_invoice,
      enable_component_depreciation_support,
      created_by,
      updated_by
    ) VALUES (
      p_foundation_id,
      p_proposed_depreciation_start_date,
      p_create_asset_from_supplier_invoice,
      p_enable_component_depreciation_support,
      p_user_id,
      p_user_id
    )
    RETURNING * INTO v_settings;
  END IF;

  -- Return the result
  RETURN QUERY SELECT
    v_settings.id,
    v_settings.foundation_id,
    v_settings.proposed_depreciation_start_date,
    v_settings.create_asset_from_supplier_invoice,
    v_settings.enable_component_depreciation_support,
    v_settings.created_at,
    v_settings.updated_at,
    v_settings.created_by,
    v_settings.updated_by;
END;
$$;

-- Grant execute permission to authenticated users and service role
GRANT EXECUTE ON FUNCTION upsert_facility_register_settings TO authenticated;
GRANT EXECUTE ON FUNCTION upsert_facility_register_settings TO service_role;

