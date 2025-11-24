-- Fix RLS policies to allow service role access (auth.uid() IS NULL)
-- This migration updates all accounting settings policies to allow backend service role operations
-- Created: 2025-01-10

-- =====================================================
-- ACCOUNTING CERTIFICATE SETTINGS
-- =====================================================

-- accounting_certificate_general_settings
-- Drop all existing policies first
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'accounting_certificate_general_settings') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON accounting_certificate_general_settings';
    END LOOP;
END $$;

CREATE POLICY "Users can manage accounting certificate general settings for their foundation"
  ON accounting_certificate_general_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- accounting_certificate_notices
-- Drop all existing policies first
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'accounting_certificate_notices') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON accounting_certificate_notices';
    END LOOP;
END $$;

CREATE POLICY "Users can manage accounting certificate notices for their foundation"
  ON accounting_certificate_notices
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- DEFAULT ACCOUNTS SETTINGS
-- =====================================================

-- default_accounts
DROP POLICY IF EXISTS "Users can manage default accounts for their foundation" ON default_accounts;
DROP POLICY IF EXISTS "Users can view default accounts for their foundation" ON default_accounts;
CREATE POLICY "Users can manage default accounts for their foundation"
  ON default_accounts
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- default_accounts_settings
DROP POLICY IF EXISTS "Users can manage default accounts for their foundation" ON default_accounts_settings;
CREATE POLICY "Users can manage default accounts settings for their foundation"
  ON default_accounts_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- ACCOUNTING VIEW SETTINGS
-- =====================================================

-- accounting_view_settings
DROP POLICY IF EXISTS "Users can manage accounting view settings for their foundation" ON accounting_view_settings;
CREATE POLICY "Users can manage accounting view settings for their foundation"
  ON accounting_view_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- COST CENTERS SETTINGS
-- =====================================================

-- cost_centers_settings
DROP POLICY IF EXISTS "Users can manage cost centers settings for their foundation" ON cost_centers_settings;
CREATE POLICY "Users can manage cost centers settings for their foundation"
  ON cost_centers_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- QUANTITY ACCOUNTING SETTINGS
-- =====================================================

-- quantity_accounting_settings
DROP POLICY IF EXISTS "Users can manage quantity accounting settings for their foundat" ON quantity_accounting_settings;
CREATE POLICY "Users can manage quantity accounting settings for their foundation"
  ON quantity_accounting_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- VAT SETTINGS
-- =====================================================

-- vat_settings
DROP POLICY IF EXISTS "Users can manage VAT settings for their foundation" ON vat_settings;
CREATE POLICY "Users can manage VAT settings for their foundation"
  ON vat_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- vat_entries
DROP POLICY IF EXISTS "Users can manage VAT entries for their foundation" ON vat_entries;
CREATE POLICY "Users can manage VAT entries for their foundation"
  ON vat_entries
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- ACCRUALS SETTINGS
-- =====================================================

-- accruals_settings
DROP POLICY IF EXISTS "Users can manage accruals settings for their foundation" ON accruals_settings;
CREATE POLICY "Users can manage accruals settings for their foundation"
  ON accruals_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- PROJECT SETTINGS
-- =====================================================

-- project_settings
DROP POLICY IF EXISTS "Users can manage project settings for their foundation" ON project_settings;
CREATE POLICY "Users can manage project settings for their foundation"
  ON project_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- REPORTS SETTINGS
-- =====================================================

-- reports_settings
DROP POLICY IF EXISTS "Users can manage reports settings for their foundation" ON reports_settings;
CREATE POLICY "Users can manage reports settings for their foundation"
  ON reports_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- FINANCIAL YEAR SETTINGS
-- =====================================================

-- financial_year_settings
DROP POLICY IF EXISTS "Users can manage financial year settings for their foundation" ON financial_year_settings;
CREATE POLICY "Users can manage financial year settings for their foundation"
  ON financial_year_settings
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- financial_years
DROP POLICY IF EXISTS "Users can manage financial years for their foundation" ON financial_years;
CREATE POLICY "Users can manage financial years for their foundation"
  ON financial_years
  FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- AUTOMATIC ACCOUNTING
-- =====================================================

-- automatic_accounting
DROP POLICY IF EXISTS "Users can view automatic accounting for their foundation" ON automatic_accounting;
DROP POLICY IF EXISTS "Users can create automatic accounting for their foundation" ON automatic_accounting;
DROP POLICY IF EXISTS "Users can update automatic accounting for their foundation" ON automatic_accounting;
DROP POLICY IF EXISTS "Users can delete automatic accounting for their foundation" ON automatic_accounting;

CREATE POLICY "Users can view automatic accounting for their foundation"
  ON automatic_accounting FOR SELECT
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create automatic accounting for their foundation"
  ON automatic_accounting FOR INSERT
  TO public
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update automatic accounting for their foundation"
  ON automatic_accounting FOR UPDATE
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete automatic accounting for their foundation"
  ON automatic_accounting FOR DELETE
  TO public
  USING (
    auth.uid() IS NULL OR
    foundation_id IN (
      SELECT foundation_id 
      FROM foundation_members 
      WHERE user_id = auth.uid()
    )
  );

-- automatic_accounting_basic_accounts
DROP POLICY IF EXISTS "Users can view basic accounts for their foundation automatic ac" ON automatic_accounting_basic_accounts;
DROP POLICY IF EXISTS "Users can manage basic accounts for their foundation automatic " ON automatic_accounting_basic_accounts;

CREATE POLICY "Users can view basic accounts for their foundation automatic accounting"
  ON automatic_accounting_basic_accounts FOR SELECT
  TO public
  USING (
    (automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )) OR (auth.uid() IS NULL)
  );

CREATE POLICY "Users can manage basic accounts for their foundation automatic accounting"
  ON automatic_accounting_basic_accounts FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- automatic_accounting_formulas
DROP POLICY IF EXISTS "Users can view formulas for their foundation automatic accounti" ON automatic_accounting_formulas;
DROP POLICY IF EXISTS "Users can manage formulas for their foundation automatic accoun" ON automatic_accounting_formulas;

CREATE POLICY "Users can view formulas for their foundation automatic accounting"
  ON automatic_accounting_formulas FOR SELECT
  TO public
  USING (
    (automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )) OR (auth.uid() IS NULL)
  );

CREATE POLICY "Users can manage formulas for their foundation automatic accounting"
  ON automatic_accounting_formulas FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )
  );

-- automatic_accounting_transactions
DROP POLICY IF EXISTS "Users can view transactions for their foundation automatic acco" ON automatic_accounting_transactions;
DROP POLICY IF EXISTS "Users can manage transactions for their foundation automatic ac" ON automatic_accounting_transactions;

CREATE POLICY "Users can view transactions for their foundation automatic accounting"
  ON automatic_accounting_transactions FOR SELECT
  TO public
  USING (
    (automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )) OR (auth.uid() IS NULL)
  );

CREATE POLICY "Users can manage transactions for their foundation automatic accounting"
  ON automatic_accounting_transactions FOR ALL
  TO public
  USING (
    auth.uid() IS NULL OR
    automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    auth.uid() IS NULL OR
    automatic_accounting_id IN (
      SELECT id 
      FROM automatic_accounting 
      WHERE foundation_id IN (
        SELECT foundation_id 
        FROM foundation_members 
        WHERE user_id = auth.uid()
      )
    )
  );

