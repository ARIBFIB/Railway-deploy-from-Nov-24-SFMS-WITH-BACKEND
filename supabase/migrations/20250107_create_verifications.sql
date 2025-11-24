-- Create verifications table
CREATE TABLE IF NOT EXISTS verifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foundation_id UUID NOT NULL REFERENCES foundations(id) ON DELETE CASCADE,
    verification_number VARCHAR(50) NOT NULL,
    verification_series VARCHAR(10) NOT NULL,
    accounting_date DATE NOT NULL,
    description TEXT,
    accounting_template VARCHAR(255),
    amount DECIMAL(15,2) DEFAULT 0.00,
    total_debit DECIMAL(15,2) DEFAULT 0.00,
    total_credit DECIMAL(15,2) DEFAULT 0.00,
    difference DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'cancelled')),
    has_person BOOLEAN DEFAULT false,
    has_comment BOOLEAN DEFAULT false,
    has_gallery BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    
    UNIQUE(foundation_id, verification_number)
);

-- Create verification_entries table (journal entries)
CREATE TABLE IF NOT EXISTS verification_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verification_id UUID NOT NULL REFERENCES verifications(id) ON DELETE CASCADE,
    account_id UUID REFERENCES chart_of_accounts(id) ON DELETE SET NULL,
    account_number VARCHAR(20),
    account_name VARCHAR(255),
    transaction_info VARCHAR(255),
    debit DECIMAL(15,2) DEFAULT 0.00,
    credit DECIMAL(15,2) DEFAULT 0.00,
    balance DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Create verification_images table for image attachments
CREATE TABLE IF NOT EXISTS verification_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    verification_id UUID NOT NULL REFERENCES verifications(id) ON DELETE CASCADE,
    verification_entry_id UUID REFERENCES verification_entries(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_name VARCHAR(255),
    image_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verifications_foundation_id ON verifications(foundation_id);
CREATE INDEX IF NOT EXISTS idx_verifications_verification_number ON verifications(verification_number);
CREATE INDEX IF NOT EXISTS idx_verifications_accounting_date ON verifications(accounting_date);
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verification_entries_verification_id ON verification_entries(verification_id);
CREATE INDEX IF NOT EXISTS idx_verification_entries_account_id ON verification_entries(account_id);
CREATE INDEX IF NOT EXISTS idx_verification_images_verification_id ON verification_images(verification_id);
CREATE INDEX IF NOT EXISTS idx_verification_images_verification_entry_id ON verification_images(verification_entry_id);

-- Create RLS policies for verifications
CREATE POLICY "Users can view verifications for their foundation" ON verifications
    FOR SELECT USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create verifications for their foundation" ON verifications
    FOR INSERT WITH CHECK (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update verifications for their foundation" ON verifications
    FOR UPDATE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete verifications for their foundation" ON verifications
    FOR DELETE USING (
        foundation_id IN (
            SELECT foundation_id FROM foundation_members 
            WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for verification_entries
CREATE POLICY "Users can view verification entries for their foundation" ON verification_entries
    FOR SELECT USING (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create verification entries for their foundation" ON verification_entries
    FOR INSERT WITH CHECK (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update verification entries for their foundation" ON verification_entries
    FOR UPDATE USING (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete verification entries for their foundation" ON verification_entries
    FOR DELETE USING (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Create RLS policies for verification_images
CREATE POLICY "Users can view verification images for their foundation" ON verification_images
    FOR SELECT USING (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can create verification images for their foundation" ON verification_images
    FOR INSERT WITH CHECK (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update verification images for their foundation" ON verification_images
    FOR UPDATE USING (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete verification images for their foundation" ON verification_images
    FOR DELETE USING (
        verification_id IN (
            SELECT id FROM verifications 
            WHERE foundation_id IN (
                SELECT foundation_id FROM foundation_members 
                WHERE user_id = auth.uid()
            )
        )
    );

-- Enable RLS
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_images ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON verifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_entries_updated_at BEFORE UPDATE ON verification_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


