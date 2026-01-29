-- Add a note about encryption requirement for email settings
-- This is a documentation-only migration to remind developers about the encryption requirement

-- Note: The ENCRYPTION_KEY environment variable must be set in production
-- for proper encryption of SMTP passwords. This key should be a 32-byte
-- random string for AES-256 encryption.

-- Example of how to generate an encryption key:
-- node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"

-- The backend controller encrypts SMTP passwords before storing them
-- in the email_settings.smtp_pass_encrypted column.