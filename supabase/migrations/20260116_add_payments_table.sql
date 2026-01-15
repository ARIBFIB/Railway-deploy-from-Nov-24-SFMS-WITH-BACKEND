-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SEK',
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(100),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    foundation_id UUID NOT NULL,
    user_id UUID
);

-- Enable Row Level Security for payments table
ALTER TABLE IF EXISTS payments ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (foundation members)
CREATE POLICY "Allow all access for foundation members on payments" ON payments
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

-- Create policy for service role (for admin/bypass access)
CREATE POLICY "Allow all access for service role on payments" ON payments
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_foundation_id ON payments(foundation_id);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON TABLE payments TO postgres, anon, authenticated, service_role;