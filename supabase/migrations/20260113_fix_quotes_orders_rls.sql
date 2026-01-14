-- ============================================
-- FIX QUOTES AND ORDERS RLS POLICIES
-- ============================================

-- 1. QUOTES TABLE
ALTER TABLE IF EXISTS quotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on quotes" ON quotes;
DROP POLICY IF EXISTS "Allow all access for service role on quotes" ON quotes;

CREATE POLICY "Allow all access for foundation members on quotes" ON quotes
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

CREATE POLICY "Allow all access for service role on quotes" ON quotes
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 2. QUOTE_ITEMS TABLE
ALTER TABLE IF EXISTS quote_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on quote_items" ON quote_items;
DROP POLICY IF EXISTS "Allow all access for service role on quote_items" ON quote_items;

CREATE POLICY "Allow all access for foundation members on quote_items" ON quote_items
    FOR ALL TO authenticated
    USING (
        quote_id IN (
            SELECT id FROM quotes
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        quote_id IN (
            SELECT id FROM quotes
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Allow all access for service role on quote_items" ON quote_items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. ORDERS TABLE
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on orders" ON orders;
DROP POLICY IF EXISTS "Allow all access for service role on orders" ON orders;

CREATE POLICY "Allow all access for foundation members on orders" ON orders
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

CREATE POLICY "Allow all access for service role on orders" ON orders
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- 4. ORDER_ITEMS TABLE
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access for foundation members on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow all access for service role on order_items" ON order_items;

CREATE POLICY "Allow all access for foundation members on order_items" ON order_items
    FOR ALL TO authenticated
    USING (
        order_id IN (
            SELECT id FROM orders
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    )
    WITH CHECK (
        order_id IN (
            SELECT id FROM orders
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Allow all access for service role on order_items" ON order_items
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);
