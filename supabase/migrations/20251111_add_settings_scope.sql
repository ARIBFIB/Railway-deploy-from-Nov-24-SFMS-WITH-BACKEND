BEGIN;

-- Create settings_scope enum if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'settings_scope') THEN
    CREATE TYPE settings_scope AS ENUM ('accounting', 'supplier');
  END IF;
END$$;

-- Automatic accounting scope support
ALTER TABLE automatic_accounting
  ADD COLUMN IF NOT EXISTS scope settings_scope NOT NULL DEFAULT 'accounting';

ALTER TABLE automatic_accounting
  DROP CONSTRAINT IF EXISTS automatic_accounting_foundation_id_number_key;
ALTER TABLE automatic_accounting
  ADD CONSTRAINT automatic_accounting_foundation_id_scope_number_key UNIQUE (foundation_id, scope, number);

CREATE INDEX IF NOT EXISTS idx_automatic_accounting_foundation_scope ON automatic_accounting(foundation_id, scope);

-- Trusted senders storage scope support
ALTER TABLE trusted_senders_storage
  ADD COLUMN IF NOT EXISTS scope settings_scope NOT NULL DEFAULT 'accounting';
ALTER TABLE trusted_senders_storage
  DROP CONSTRAINT IF EXISTS trusted_senders_storage_foundation_id_key;
ALTER TABLE trusted_senders_storage
  ADD CONSTRAINT trusted_senders_storage_foundation_id_scope_key UNIQUE (foundation_id, scope);
CREATE INDEX IF NOT EXISTS idx_trusted_senders_storage_foundation_scope ON trusted_senders_storage(foundation_id, scope);

ALTER TABLE trusted_domains
  ADD COLUMN IF NOT EXISTS scope settings_scope NOT NULL DEFAULT 'accounting';
CREATE INDEX IF NOT EXISTS idx_trusted_domains_foundation_scope ON trusted_domains(foundation_id, scope);
DELETE FROM trusted_domains td
USING trusted_domains td2
WHERE td.foundation_id = td2.foundation_id
  AND td.scope = td2.scope
  AND td.domain = td2.domain
  AND td.ctid > td2.ctid;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trusted_domains_unique_scope_domain'
  ) THEN
    ALTER TABLE trusted_domains
      ADD CONSTRAINT trusted_domains_unique_scope_domain UNIQUE (foundation_id, scope, domain);
  END IF;
END$$;

ALTER TABLE trusted_email_addresses
  ADD COLUMN IF NOT EXISTS scope settings_scope NOT NULL DEFAULT 'accounting';
CREATE INDEX IF NOT EXISTS idx_trusted_email_addresses_foundation_scope ON trusted_email_addresses(foundation_id, scope);
DELETE FROM trusted_email_addresses tea
USING trusted_email_addresses tea2
WHERE tea.foundation_id = tea2.foundation_id
  AND tea.scope = tea2.scope
  AND tea.email = tea2.email
  AND tea.ctid > tea2.ctid;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'trusted_email_addresses_unique_scope_email'
  ) THEN
    ALTER TABLE trusted_email_addresses
      ADD CONSTRAINT trusted_email_addresses_unique_scope_email UNIQUE (foundation_id, scope, email);
  END IF;
END$$;

ALTER TABLE rejected_email_addresses
  ADD COLUMN IF NOT EXISTS scope settings_scope NOT NULL DEFAULT 'accounting';
CREATE INDEX IF NOT EXISTS idx_rejected_email_addresses_foundation_scope ON rejected_email_addresses(foundation_id, scope);
DELETE FROM rejected_email_addresses rea
USING rejected_email_addresses rea2
WHERE rea.foundation_id = rea2.foundation_id
  AND rea.scope = rea2.scope
  AND rea.email = rea2.email
  AND rea.ctid > rea2.ctid;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rejected_email_addresses_unique_scope_email'
  ) THEN
    ALTER TABLE rejected_email_addresses
      ADD CONSTRAINT rejected_email_addresses_unique_scope_email UNIQUE (foundation_id, scope, email);
  END IF;
END$$;

-- Default accounts scope support
ALTER TABLE default_accounts
  ADD COLUMN IF NOT EXISTS scope settings_scope NOT NULL DEFAULT 'accounting';
ALTER TABLE default_accounts
  DROP CONSTRAINT IF EXISTS default_accounts_foundation_id_key;
ALTER TABLE default_accounts
  ADD CONSTRAINT default_accounts_foundation_id_scope_key UNIQUE (foundation_id, scope);
CREATE INDEX IF NOT EXISTS idx_default_accounts_foundation_scope ON default_accounts(foundation_id, scope);

-- Accounting templates scope support
ALTER TABLE accounting_templates
  ADD COLUMN IF NOT EXISTS scope settings_scope NOT NULL DEFAULT 'accounting';
CREATE INDEX IF NOT EXISTS idx_accounting_templates_foundation_scope ON accounting_templates(foundation_id, scope);

COMMIT;










