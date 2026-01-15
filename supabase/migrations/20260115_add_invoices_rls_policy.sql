-- ============================================
-- ADD RLS POLICIES FOR INVOICES TABLE
-- ============================================

-- Enable Row Level Security for invoices table
ALTER TABLE IF EXISTS invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all access for foundation members on invoices" ON invoices;
DROP POLICY IF EXISTS "Allow all access for service role on invoices" ON invoices;

-- Create policy for authenticated users (foundation members)
CREATE POLICY "Allow all access for foundation members on invoices" ON invoices
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

-- Create specific policy for updating invoice status (separate policy to allow status changes)
CREATE POLICY "Allow status updates for foundation members on invoices" ON invoices
    FOR UPDATE TO authenticated
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

-- Create policy for service role (for admin/bypass access)
CREATE POLICY "Allow all access for service role on invoices" ON invoices
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- ADD RLS POLICIES FOR INVOICE_ITEMS TABLE
-- ============================================

-- Enable Row Level Security for invoice_items table
ALTER TABLE IF EXISTS invoice_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all access for foundation members on invoice_items" ON invoice_items;
DROP POLICY IF EXISTS "Allow all access for service role on invoice_items" ON invoice_items;

-- Create policy for authenticated users (foundation members)
CREATE POLICY "Allow all access for foundation members on invoice_items" ON invoice_items
    FOR ALL TO authenticated
    USING (
        invoice_id IN (
            SELECT id FROM invoices
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        invoice_id IN (
            SELECT id FROM invoices
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create specific policy for updating invoice_items (separate policy to allow updates)
CREATE POLICY "Allow updates for foundation members on invoice_items" ON invoice_items
    FOR UPDATE TO authenticated
    USING (
        invoice_id IN (
            SELECT id FROM invoices
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        invoice_id IN (
            SELECT id FROM invoices
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create policy for service role (for admin/bypass access)
CREATE POLICY "Allow all access for service role on invoice_items" ON invoice_items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);