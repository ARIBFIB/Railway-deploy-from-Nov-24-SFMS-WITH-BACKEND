BEGIN;

-- Ensure settings_scope enum includes supplier
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'settings_scope') THEN
    CREATE TYPE settings_scope AS ENUM ('accounting', 'supplier');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS public.supplier_invoice_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  foundation_id uuid NOT NULL REFERENCES public.foundations(id) ON DELETE CASCADE,
  scope settings_scope NOT NULL DEFAULT 'supplier',
  section text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id),
  updated_by uuid REFERENCES public.profiles(id),
  CONSTRAINT supplier_invoice_settings_foundation_id_scope_section_key UNIQUE (foundation_id, scope, section)
);

CREATE INDEX IF NOT EXISTS idx_supplier_invoice_settings_foundation_scope_section
  ON public.supplier_invoice_settings (foundation_id, scope, section);

CREATE INDEX IF NOT EXISTS idx_supplier_invoice_settings_updated_at
  ON public.supplier_invoice_settings (updated_at DESC);

CREATE OR REPLACE FUNCTION public.set_supplier_invoice_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_supplier_invoice_settings_updated_at ON public.supplier_invoice_settings;

CREATE TRIGGER trg_supplier_invoice_settings_updated_at
BEFORE UPDATE ON public.supplier_invoice_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_supplier_invoice_settings_updated_at();

COMMIT;

