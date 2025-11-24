-- Create chart_of_accounts table
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    account_number VARCHAR(20) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    vat_code VARCHAR(10),
    sru VARCHAR(10),
    atm VARCHAR(10),
    opening_balance DECIMAL(15,2) DEFAULT 0.00,
    budget DECIMAL(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    automatic_accounting TEXT,
    suggest_debit_credit VARCHAR(10) CHECK (suggest_debit_credit IN ('debit', 'credit')),
    transaction_info VARCHAR(20) CHECK (transaction_info IN ('mandatory', 'allowed', 'not_allowed')),
    suggest_transaction_info TEXT,
    budget_distribution VARCHAR(10) CHECK (budget_distribution IN ('sek', 'percent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique account numbers per foundation
    UNIQUE(foundation_id, account_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_foundation_id ON chart_of_accounts(foundation_id);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_account_number ON chart_of_accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_is_active ON chart_of_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_chart_of_accounts_created_at ON chart_of_accounts(created_at);

-- Create budget_rows table for budget distribution
CREATE TABLE IF NOT EXISTS budget_rows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chart_of_account_id UUID NOT NULL REFERENCES chart_of_accounts(id) ON DELETE CASCADE,
    cost_center VARCHAR(100) NOT NULL,
    annual_budget DECIMAL(15,2) DEFAULT 0.00,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    jan DECIMAL(15,2) DEFAULT 0.00,
    feb DECIMAL(15,2) DEFAULT 0.00,
    mar DECIMAL(15,2) DEFAULT 0.00,
    apr DECIMAL(15,2) DEFAULT 0.00,
    may DECIMAL(15,2) DEFAULT 0.00,
    jun DECIMAL(15,2) DEFAULT 0.00,
    jul DECIMAL(15,2) DEFAULT 0.00,
    aug DECIMAL(15,2) DEFAULT 0.00,
    sep DECIMAL(15,2) DEFAULT 0.00,
    oct DECIMAL(15,2) DEFAULT 0.00,
    nov DECIMAL(15,2) DEFAULT 0.00,
    dec DECIMAL(15,2) DEFAULT 0.00,
    christmas DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for budget_rows
CREATE INDEX IF NOT EXISTS idx_budget_rows_chart_of_account_id ON budget_rows(chart_of_account_id);

-- Enable RLS
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_rows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chart_of_accounts
CREATE POLICY "Users can view accounts for their foundation" ON chart_of_accounts
    FOR SELECT USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create accounts for their foundation" ON chart_of_accounts
    FOR INSERT WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update accounts for their foundation" ON chart_of_accounts
    FOR UPDATE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete accounts for their foundation" ON chart_of_accounts
    FOR DELETE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for budget_rows
CREATE POLICY "Users can view budget rows for their foundation accounts" ON budget_rows
    FOR SELECT USING (
        chart_of_account_id IN (
            SELECT id FROM chart_of_accounts 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create budget rows for their foundation accounts" ON budget_rows
    FOR INSERT WITH CHECK (
        chart_of_account_id IN (
            SELECT id FROM chart_of_accounts 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update budget rows for their foundation accounts" ON budget_rows
    FOR UPDATE USING (
        chart_of_account_id IN (
            SELECT id FROM chart_of_accounts 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete budget rows for their foundation accounts" ON budget_rows
    FOR DELETE USING (
        chart_of_account_id IN (
            SELECT id FROM chart_of_accounts 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chart_of_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_chart_of_accounts_updated_at
    BEFORE UPDATE ON chart_of_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_chart_of_accounts_updated_at();

-- Create function to update budget_rows updated_at timestamp
CREATE OR REPLACE FUNCTION update_budget_rows_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for budget_rows updated_at
CREATE TRIGGER update_budget_rows_updated_at
    BEFORE UPDATE ON budget_rows
    FOR EACH ROW
    EXECUTE FUNCTION update_budget_rows_updated_at();
