-- Add html_template column to email_settings table
ALTER TABLE email_settings ADD COLUMN IF NOT EXISTS default_html_template TEXT DEFAULT '<p>This is a test email to verify your SMTP configuration.</p>';

-- Update the comment for the table
COMMENT ON COLUMN email_settings.default_html_template IS 'Default HTML template for test emails and notifications';