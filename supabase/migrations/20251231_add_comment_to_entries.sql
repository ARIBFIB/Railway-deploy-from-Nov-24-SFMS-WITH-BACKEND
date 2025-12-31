-- Migration: Add comment column to verification_entries
-- This column will store row-level comments for account reconciliation.

ALTER TABLE verification_entries ADD COLUMN IF NOT EXISTS comment TEXT;

COMMENT ON COLUMN verification_entries.comment IS 'Row-level comments for account reconciliation';
