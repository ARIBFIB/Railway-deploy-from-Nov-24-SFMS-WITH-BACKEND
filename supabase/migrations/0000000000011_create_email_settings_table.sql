-- Create email_settings table
CREATE TABLE IF NOT EXISTS email_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    smtp_host TEXT NOT NULL,
    smtp_port INTEGER NOT NULL DEFAULT 587,
    smtp_user TEXT NOT NULL,
    smtp_pass_encrypted TEXT NOT NULL,  -- Encrypted password
    smtp_secure BOOLEAN NOT NULL DEFAULT FALSE,
    sender_email TEXT NOT NULL,
    sender_name TEXT NOT NULL DEFAULT 'Foundation Management System',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one email setting per foundation
    UNIQUE(foundation_id)
);

-- Create indexes for performance
CREATE INDEX idx_email_settings_foundation_id ON email_settings(foundation_id);

-- Enable RLS (Row Level Security)
ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

-- Create policies to restrict access based on foundation membership
CREATE POLICY "Users can view their foundation's email settings" ON email_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM foundation_members fm
            WHERE fm.foundation_id = email_settings.foundation_id
            AND fm.user_id = auth.uid()
        )
    );

CREATE POLICY "Foundation admins can insert email settings" ON email_settings
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM foundation_members fm
            WHERE fm.foundation_id = email_settings.foundation_id
            AND fm.user_id = auth.uid()
            AND (fm.role = 'admin' OR fm.role = 'superadmin')
        )
    );

CREATE POLICY "Foundation admins can update email settings" ON email_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM foundation_members fm
            WHERE fm.foundation_id = email_settings.foundation_id
            AND fm.user_id = auth.uid()
            AND (fm.role = 'admin' OR fm.role = 'superadmin')
        )
    );

CREATE POLICY "Foundation admins can delete email settings" ON email_settings
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM foundation_members fm
            WHERE fm.foundation_id = email_settings.foundation_id
            AND fm.user_id = auth.uid()
            AND (fm.role = 'admin' OR fm.role = 'superadmin')
        )
    );

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to update the updated_at column
CREATE TRIGGER update_email_settings_updated_at 
    BEFORE UPDATE ON email_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON email_settings TO service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE email_settings TO anon, authenticated;