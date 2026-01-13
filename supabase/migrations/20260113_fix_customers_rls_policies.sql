-- ============================================
-- FIX CUSTOMER RLS POLICIES
-- ============================================

-- 1. CUSTOMERS TABLE
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert their own customers" ON customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON customers;
DROP POLICY IF EXISTS "Allow all access for foundation members on customers" ON customers;
DROP POLICY IF EXISTS "Allow all access for service role on customers" ON customers;

CREATE POLICY "Allow all access for foundation members on customers" ON customers
    FOR ALL TO authenticated
    USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Allow all access for service role on customers" ON customers
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. CUSTOMER ADDRESSES TABLE
ALTER TABLE IF EXISTS customer_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on customer_addresses" ON customer_addresses;
DROP POLICY IF EXISTS "Allow all access for service role on customer_addresses" ON customer_addresses;

CREATE POLICY "Allow all access for foundation members on customer_addresses" ON customer_addresses
    FOR ALL TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Allow all access for service role on customer_addresses" ON customer_addresses
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. CUSTOMER CONTACTS TABLE
ALTER TABLE IF EXISTS customer_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on customer_contacts" ON customer_contacts;
DROP POLICY IF EXISTS "Allow all access for service role on customer_contacts" ON customer_contacts;

CREATE POLICY "Allow all access for foundation members on customer_contacts" ON customer_contacts
    FOR ALL TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Allow all access for service role on customer_contacts" ON customer_contacts
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. CUSTOMER BILLING INFO TABLE
ALTER TABLE IF EXISTS customer_billing_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on customer_billing_info" ON customer_billing_info;
DROP POLICY IF EXISTS "Allow all access for service role on customer_billing_info" ON customer_billing_info;

CREATE POLICY "Allow all access for foundation members on customer_billing_info" ON customer_billing_info
    FOR ALL TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Allow all access for service role on customer_billing_info" ON customer_billing_info
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. CUSTOMER E-DOCUMENT SETTINGS TABLE
ALTER TABLE IF EXISTS customer_e_document_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on customer_e_document_settings" ON customer_e_document_settings;
DROP POLICY IF EXISTS "Allow all access for service role on customer_e_document_settings" ON customer_e_document_settings;

CREATE POLICY "Allow all access for foundation members on customer_e_document_settings" ON customer_e_document_settings
    FOR ALL TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        customer_id IN (
            SELECT id FROM customers
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Allow all access for service role on customer_e_document_settings" ON customer_e_document_settings
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
