-- Migration: Create salary_settings table with RLS disabled
-- File: 20250112_create_salary_settings.sql
-- Execute this in Supabase Dashboard -> SQL Editor

-- Create salary_settings table
CREATE TABLE IF NOT EXISTS salary_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    section TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure one setting per foundation and section combination
    UNIQUE(foundation_id, section)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_salary_settings_foundation_id ON salary_settings(foundation_id);
CREATE INDEX IF NOT EXISTS idx_salary_settings_section ON salary_settings(section);
CREATE INDEX IF NOT EXISTS idx_salary_settings_foundation_section ON salary_settings(foundation_id, section);
CREATE INDEX IF NOT EXISTS idx_salary_settings_created_at ON salary_settings(created_at);

-- Disable RLS (Row Level Security disabled as requested)
ALTER TABLE salary_settings DISABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_salary_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_salary_settings_updated_at
    BEFORE UPDATE ON salary_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_salary_settings_updated_at();

