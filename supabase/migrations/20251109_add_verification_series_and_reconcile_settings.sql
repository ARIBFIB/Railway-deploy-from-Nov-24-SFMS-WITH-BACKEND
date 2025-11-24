CREATE TABLE IF NOT EXISTS verification_series_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('accounting','supplier','billing')),
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  manual_accounting BOOLEAN NOT NULL DEFAULT FALSE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  created_by UUID,
  updated_by UUID,
  UNIQUE (foundation_id, category, code)
);

CREATE INDEX IF NOT EXISTS idx_verification_series_settings_foundation_category
  ON verification_series_settings (foundation_id, category);

CREATE TABLE IF NOT EXISTS verification_series_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('accounting','supplier','billing')),
  mapping_key TEXT NOT NULL,
  series_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_by UUID,
  UNIQUE (foundation_id, category, mapping_key)
);

CREATE INDEX IF NOT EXISTS idx_verification_series_mappings_foundation_category
  ON verification_series_mappings (foundation_id, category);

CREATE TABLE IF NOT EXISTS reconcile_account_settings (
  foundation_id UUID PRIMARY KEY REFERENCES foundations(id) ON DELETE CASCADE,
  activate_difference_warning BOOLEAN NOT NULL DEFAULT TRUE,
  max_days_difference INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_by UUID
);

CREATE TABLE IF NOT EXISTS reconcile_account_opening_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
  account TEXT NOT NULL,
  financial_year TEXT,
  balance TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_reconcile_account_opening_balances_foundation
  ON reconcile_account_opening_balances (foundation_id);

