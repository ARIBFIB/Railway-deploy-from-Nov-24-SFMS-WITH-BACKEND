-- Create staff table for employee management system
CREATE TABLE IF NOT EXISTS staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employment_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  personal_id TEXT UNIQUE NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  nationality TEXT,
  marital_status TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  emergency_contact TEXT,
  next_of_kin_name TEXT,
  next_of_kin_relationship TEXT,
  next_of_kin_phone TEXT,
  next_of_kin_email TEXT,
  admin_rights BOOLEAN DEFAULT FALSE,
  view_only BOOLEAN DEFAULT FALSE,
  edit_permissions BOOLEAN DEFAULT FALSE,
  access_to_payroll BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on the staff table
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS to allow authenticated users to view and manage staff
CREATE POLICY "Allow authenticated users to view staff members" ON staff
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert staff members" ON staff
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update staff members" ON staff
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete staff members" ON staff
  FOR DELETE TO authenticated
  USING (true);

-- Create indexes for better performance on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_staff_employment_id ON staff(employment_id);
CREATE INDEX IF NOT EXISTS idx_staff_personal_id ON staff(personal_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_first_name ON staff(first_name);
CREATE INDEX IF NOT EXISTS idx_staff_last_name ON staff(last_name);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();