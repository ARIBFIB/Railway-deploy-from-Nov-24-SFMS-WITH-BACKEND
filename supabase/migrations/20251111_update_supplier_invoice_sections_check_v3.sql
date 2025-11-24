BEGIN;

ALTER TABLE public.supplier_invoice_settings
  DROP CONSTRAINT IF EXISTS supplier_invoice_settings_section_check;

ALTER TABLE public.supplier_invoice_settings
  ADD CONSTRAINT supplier_invoice_settings_section_check
  CHECK (
    section = ANY (
      ARRAY[
        'deviations-writeoffs'::text,
        'payment-methods-terms'::text,
        'coverage'::text,
        'digital-flow-einvoice'::text,
        'digital-flow-interpretation'::text,
        'cost-centers'::text,
        'supplier-invoice-certificate-general'::text,
        'supplier-invoice-test-notifications'::text,
        'supplier-vat'::text,
        'number-sequences-ocr'::text,
        'supplier-accruals'::text,
        'price-list-units'::text,
        'supplier-project'::text,
        'supplier-reports'::text
      ]
    )
  );

COMMIT;
BEGIN;

ALTER TABLE public.supplier_invoice_settings
  DROP CONSTRAINT IF EXISTS supplier_invoice_settings_section_check;

ALTER TABLE public.supplier_invoice_settings
  ADD CONSTRAINT supplier_invoice_settings_section_check
  CHECK (
    section = ANY (
      ARRAY[
        'deviations-writeoffs'::text,
        'payment-methods-terms'::text,
        'coverage'::text,
        'digital-flow-einvoice'::text,
        'digital-flow-interpretation'::text,
        'cost-centers'::text,
        'supplier-invoice-certificate-general'::text,
        'supplier-invoice-test-notifications'::text,
        'supplier-vat'::text,
        'number-sequences-ocr'::text,
        'supplier-accruals'::text,
        'price-list-units'::text,
        'supplier-project'::text,
        'supplier-reports'::text
      ]
    )
  );

COMMIT;
BEGIN;

ALTER TABLE public.supplier_invoice_settings
  DROP CONSTRAINT IF EXISTS supplier_invoice_settings_section_check;

ALTER TABLE public.supplier_invoice_settings
  ADD CONSTRAINT supplier_invoice_settings_section_check
  CHECK (
    section = ANY (
      ARRAY[
        'deviations-writeoffs'::text,
        'payment-methods-terms'::text,
        'coverage'::text,
        'digital-flow-einvoice'::text,
        'digital-flow-interpretation'::text,
        'cost-centers'::text,
        'supplier-invoice-certificate-general'::text,
        'supplier-invoice-test-notifications'::text,
        'supplier-vat'::text,
        'number-sequences-ocr'::text,
        'supplier-accruals'::text,
        'price-list-units'::text,
        'supplier-project'::text,
        'supplier-reports'::text
      ]
    )
  );

COMMIT;
BEGIN;

ALTER TABLE public.supplier_invoice_settings
  DROP CONSTRAINT IF EXISTS supplier_invoice_settings_section_check;

ALTER TABLE public.supplier_invoice_settings
  ADD CONSTRAINT supplier_invoice_settings_section_check
  CHECK (
    section = ANY (
      ARRAY[
        'deviations-writeoffs'::text,
        'payment-methods-terms'::text,
        'coverage'::text,
        'digital-flow-einvoice'::text,
        'digital-flow-interpretation'::text,
        'cost-centers'::text,
        'supplier-invoice-certificate-general'::text,
        'supplier-invoice-test-notifications'::text,
        'supplier-vat'::text,
        'number-sequences-ocr'::text,
        'supplier-accruals'::text,
        'price-list-units'::text,
        'supplier-project'::text,
        'supplier-reports'::text
      ]
    )
  );

COMMIT;
BEGIN;

ALTER TABLE public.supplier_invoice_settings
  DROP CONSTRAINT IF EXISTS supplier_invoice_settings_section_check;

ALTER TABLE public.supplier_invoice_settings
  ADD CONSTRAINT supplier_invoice_settings_section_check
  CHECK (
    section = ANY (
      ARRAY[
        'deviations-writeoffs'::text,
        'payment-methods-terms'::text,
        'coverage'::text,
        'digital-flow-einvoice'::text,
        'digital-flow-interpretation'::text,
        'cost-centers'::text,
        'supplier-invoice-certificate-general'::text,
        'supplier-invoice-test-notifications'::text,
        'supplier-vat'::text,
        'number-sequences-ocr'::text,
        'supplier-accruals'::text,
        'price-list-units'::text,
        'supplier-project'::text,
        'supplier-reports'::text
      ]
    )
  );

COMMIT;
BEGIN;

ALTER TABLE public.supplier_invoice_settings
  DROP CONSTRAINT IF EXISTS supplier_invoice_settings_section_check;

ALTER TABLE public.supplier_invoice_settings
  ADD CONSTRAINT supplier_invoice_settings_section_check
  CHECK (
    section = ANY (
      ARRAY[
        'deviations-writeoffs'::text,
        'payment-methods-terms'::text,
        'coverage'::text,
        'digital-flow-einvoice'::text,
        'digital-flow-interpretation'::text,
        'cost-centers'::text,
        'supplier-invoice-certificate-general'::text,
        'supplier-invoice-test-notifications'::text,
        'supplier-vat'::text,
        'number-sequences-ocr'::text,
        'supplier-accruals'::text,
        'price-list-units'::text,
        'supplier-project'::text,
        'supplier-reports'::text
      ]
    )
  );

COMMIT;

