-- ============================================
-- NUCLEAR FIX FOR CUSTOMER RLS POLICIES
-- ============================================
-- Run this in your Supabase SQL Editor if you are still getting 
-- "new row violates row-level security policy"

-- OPTION A: RE-APPLY OPEN POLICIES (Try this first)
-- This grants full access to authenticated users and the service role.

-- Enable RLS just to be sure we are configuring it
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_billing_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_e_document_settings ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename LIKE 'customer%') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- Create wide-open policies for development
-- These allow anyone with a valid login (authenticated) or the backend (service_role) to do anything.

-- Customers
CREATE POLICY "Open Access Customers" ON customers FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- Related Tables
CREATE POLICY "Open Access Addresses" ON customer_addresses FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Open Access Contacts" ON customer_contacts FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Open Access Billing" ON customer_billing_info FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Open Access E-Docs" ON customer_e_document_settings FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

-- OPTION B: THE NUCLEAR OPTION (Uncomment if Option A fails)
-- This completely disables RLS for these tables.
/*
ALTER TABLE IF EXISTS customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_billing_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customer_e_document_settings DISABLE ROW LEVEL SECURITY;
*/

-- IMPORTANT: Also ensure the service_role has permissions to the sequences 
-- and tables if they were created by a different user.
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
