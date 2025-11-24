-- Create automatic_accounting table
CREATE TABLE IF NOT EXISTS automatic_accounting (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    number VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account VARCHAR(50),
    any_amount VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique number per foundation
    UNIQUE(foundation_id, number)
);

-- Create automatic_accounting_basic_accounts table for basic accounts
CREATE TABLE IF NOT EXISTS automatic_accounting_basic_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    automatic_accounting_id UUID NOT NULL REFERENCES automatic_accounting(id) ON DELETE CASCADE,
    account VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automatic_accounting_formulas table for formulas
CREATE TABLE IF NOT EXISTS automatic_accounting_formulas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    automatic_accounting_id UUID NOT NULL REFERENCES automatic_accounting(id) ON DELETE CASCADE,
    formula TEXT,
    account VARCHAR(50),
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create automatic_accounting_transactions table for automatic posting lines
CREATE TABLE IF NOT EXISTS automatic_accounting_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    automatic_accounting_id UUID NOT NULL REFERENCES automatic_accounting(id) ON DELETE CASCADE,
    account VARCHAR(50),
    name VARCHAR(255),
    debit VARCHAR(50),
    credit VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_automatic_accounting_foundation_id ON automatic_accounting(foundation_id);
CREATE INDEX IF NOT EXISTS idx_automatic_accounting_number ON automatic_accounting(number);
CREATE INDEX IF NOT EXISTS idx_automatic_accounting_basic_accounts_automatic_accounting_id ON automatic_accounting_basic_accounts(automatic_accounting_id);
CREATE INDEX IF NOT EXISTS idx_automatic_accounting_formulas_automatic_accounting_id ON automatic_accounting_formulas(automatic_accounting_id);
CREATE INDEX IF NOT EXISTS idx_automatic_accounting_transactions_automatic_accounting_id ON automatic_accounting_transactions(automatic_accounting_id);

-- Enable RLS
ALTER TABLE automatic_accounting ENABLE ROW LEVEL SECURITY;
ALTER TABLE automatic_accounting_basic_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automatic_accounting_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE automatic_accounting_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for automatic_accounting
CREATE POLICY "Users can view automatic accounting for their foundation" ON automatic_accounting
    FOR SELECT USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create automatic accounting for their foundation" ON automatic_accounting
    FOR INSERT WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update automatic accounting for their foundation" ON automatic_accounting
    FOR UPDATE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete automatic accounting for their foundation" ON automatic_accounting
    FOR DELETE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for automatic_accounting_basic_accounts
CREATE POLICY "Users can view basic accounts for their foundation automatic accounting" ON automatic_accounting_basic_accounts
    FOR SELECT USING (
        automatic_accounting_id IN (
            SELECT id FROM automatic_accounting 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage basic accounts for their foundation automatic accounting" ON automatic_accounting_basic_accounts
    FOR ALL USING (
        automatic_accounting_id IN (
            SELECT id FROM automatic_accounting 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create RLS policies for automatic_accounting_formulas
CREATE POLICY "Users can view formulas for their foundation automatic accounting" ON automatic_accounting_formulas
    FOR SELECT USING (
        automatic_accounting_id IN (
            SELECT id FROM automatic_accounting 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage formulas for their foundation automatic accounting" ON automatic_accounting_formulas
    FOR ALL USING (
        automatic_accounting_id IN (
            SELECT id FROM automatic_accounting 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create RLS policies for automatic_accounting_transactions
CREATE POLICY "Users can view transactions for their foundation automatic accounting" ON automatic_accounting_transactions
    FOR SELECT USING (
        automatic_accounting_id IN (
            SELECT id FROM automatic_accounting 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can manage transactions for their foundation automatic accounting" ON automatic_accounting_transactions
    FOR ALL USING (
        automatic_accounting_id IN (
            SELECT id FROM automatic_accounting 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_automatic_accounting_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_automatic_accounting_updated_at
    BEFORE UPDATE ON automatic_accounting
    FOR EACH ROW
    EXECUTE FUNCTION update_automatic_accounting_updated_at();

CREATE TRIGGER update_automatic_accounting_basic_accounts_updated_at
    BEFORE UPDATE ON automatic_accounting_basic_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_automatic_accounting_updated_at();

CREATE TRIGGER update_automatic_accounting_formulas_updated_at
    BEFORE UPDATE ON automatic_accounting_formulas
    FOR EACH ROW
    EXECUTE FUNCTION update_automatic_accounting_updated_at();

CREATE TRIGGER update_automatic_accounting_transactions_updated_at
    BEFORE UPDATE ON automatic_accounting_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_automatic_accounting_updated_at();

