-- Create supplier invoices table
CREATE TABLE IF NOT EXISTS supplier_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    supplier_invoice_number TEXT,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'SEK',
    status TEXT NOT NULL CHECK (status IN ('received', 'under_review', 'approved', 'rejected', 'paid')),
    notes TEXT,
    document_path TEXT,
    received_by UUID REFERENCES profiles(id),
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create supplier invoice items table
CREATE TABLE IF NOT EXISTS supplier_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_invoice_id UUID NOT NULL REFERENCES supplier_invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(15, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5, 2) DEFAULT 25,
    line_total DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payroll runs table
CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    payroll_period_start DATE NOT NULL,
    payroll_period_end DATE NOT NULL,
    pay_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'calculated', 'approved', 'paid', 'cancelled')) DEFAULT 'draft',
    total_gross_pay DECIMAL(15, 2) DEFAULT 0,
    total_deductions DECIMAL(15, 2) DEFAULT 0,
    total_net_pay DECIMAL(15, 2) DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'SEK',
    employee_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payroll entries table
CREATE TABLE IF NOT EXISTS payroll_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id),
    gross_pay DECIMAL(15, 2) NOT NULL DEFAULT 0,
    tax_deduction DECIMAL(15, 2) NOT NULL DEFAULT 0,
    social_security_deduction DECIMAL(15, 2) NOT NULL DEFAULT 0,
    other_deductions DECIMAL(15, 2) DEFAULT 0,
    total_deductions DECIMAL(15, 2) GENERATED ALWAYS AS (tax_deduction + social_security_deduction + other_deductions) STORED,
    net_pay DECIMAL(15, 2) GENERATED ALWAYS AS (gross_pay - (tax_deduction + social_security_deduction + other_deductions)) STORED,
    hours_worked DECIMAL(10, 2),
    overtime_hours DECIMAL(10, 2),
    bonus_amount DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_supplier_invoices_foundation ON supplier_invoices(foundation_id);
CREATE INDEX IF NOT EXISTS idx_supplier_invoices_status ON supplier_invoices(status);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_foundation ON payroll_runs(foundation_id);
CREATE INDEX IF NOT EXISTS idx_payroll_entries_run ON payroll_entries(payroll_run_id);
CREATE INDEX IF NOT EXISTS idx_payroll_entries_employee ON payroll_entries(employee_id);

-- Add RLS Policies
ALTER TABLE supplier_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_entries ENABLE ROW LEVEL SECURITY;

-- Standard RLS policies (viewable by foundation members)
CREATE POLICY "Users can view supplier invoices of their foundation"
    ON supplier_invoices FOR SELECT
    USING (foundation_id IN (
        SELECT foundation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can insert supplier invoices for their foundation"
    ON supplier_invoices FOR INSERT
    WITH CHECK (foundation_id IN (
        SELECT foundation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update supplier invoices of their foundation"
    ON supplier_invoices FOR UPDATE
    USING (foundation_id IN (
        SELECT foundation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can delete supplier invoices of their foundation"
    ON supplier_invoices FOR DELETE
    USING (foundation_id IN (
        SELECT foundation_id FROM profiles WHERE id = auth.uid()
    ));

-- Items rely on parent access usually, but specific policies are safer
CREATE POLICY "Users can view supplier invoice items of their foundation"
    ON supplier_invoice_items FOR SELECT
    USING (supplier_invoice_id IN (
        SELECT id FROM supplier_invoices WHERE foundation_id IN (
            SELECT foundation_id FROM profiles WHERE id = auth.uid()
        )
    ));
    
CREATE POLICY "Users can insert supplier invoice items of their foundation"
    ON supplier_invoice_items FOR INSERT
    WITH CHECK (supplier_invoice_id IN (
        SELECT id FROM supplier_invoices WHERE foundation_id IN (
            SELECT foundation_id FROM profiles WHERE id = auth.uid()
        )
    ));

-- Payroll RLS
CREATE POLICY "Users can view payroll runs of their foundation"
    ON payroll_runs FOR SELECT
    USING (foundation_id IN (
        SELECT foundation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can manage payroll runs for their foundation"
    ON payroll_runs FOR ALL
    USING (foundation_id IN (
        SELECT foundation_id FROM profiles WHERE id = auth.uid()
    ));

CREATE POLICY "Users can view payroll entries of their foundation"
    ON payroll_entries FOR SELECT
    USING (payroll_run_id IN (
        SELECT id FROM payroll_runs WHERE foundation_id IN (
            SELECT foundation_id FROM profiles WHERE id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage payroll entries for their foundation"
    ON payroll_entries FOR ALL
    USING (payroll_run_id IN (
        SELECT id FROM payroll_runs WHERE foundation_id IN (
            SELECT foundation_id FROM profiles WHERE id = auth.uid()
        )
    ));
