-- Complete reset and recreate salary_agreements table
-- This will handle any existing conflicting table structure

-- Step 1: Drop existing table and all related objects
DROP TABLE IF EXISTS public.salary_agreements CASCADE;

-- Step 2: Create the fresh salary_agreements table
CREATE TABLE public.salary_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    foundation_id UUID NOT NULL REFERENCES public.foundations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    staff_type VARCHAR(50) NOT NULL,
    agreement_template VARCHAR(100) NOT NULL,
    salary_period VARCHAR(50),
    atf JSONB,
    atk JSONB,
    holiday JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Step 3: Create indexes for better performance
CREATE INDEX idx_salary_agreements_foundation_id ON public.salary_agreements(foundation_id);
CREATE INDEX idx_salary_agreements_name ON public.salary_agreements(name);
CREATE INDEX idx_salary_agreements_staff_type ON public.salary_agreements(staff_type);
CREATE INDEX idx_salary_agreements_is_active ON public.salary_agreements(is_active);
CREATE INDEX idx_salary_agreements_created_at ON public.salary_agreements(created_at);

-- Step 4: Enable RLS (Row Level Security)
ALTER TABLE public.salary_agreements ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for dynamic access
CREATE POLICY "Users can view salary agreements from their foundation" 
    ON public.salary_agreements 
    FOR SELECT 
    USING (
        foundation_id IN (
            SELECT foundation_id 
            FROM public.foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert salary agreements to their foundation" 
    ON public.salary_agreements 
    FOR INSERT 
    WITH CHECK (
        foundation_id IN (
            SELECT foundation_id 
            FROM public.foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update salary agreements in their foundation" 
    ON public.salary_agreements 
    FOR UPDATE 
    USING (
        foundation_id IN (
            SELECT foundation_id 
            FROM public.foundation_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete salary agreements in their foundation" 
    ON public.salary_agreements 
    FOR DELETE 
    USING (
        foundation_id IN (
            SELECT foundation_id 
            FROM public.foundation_members 
            WHERE user_id = auth.uid()
        )
    );

-- Step 6: Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 7: Create trigger to update updated_at timestamp
CREATE TRIGGER update_salary_agreements_updated_at 
    BEFORE UPDATE ON public.salary_agreements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Insert sample data
INSERT INTO public.salary_agreements (
    foundation_id,
    name,
    staff_type,
    agreement_template,
    salary_period,
    atf,
    atk,
    holiday,
    is_active,
    created_by
) VALUES 
(
    '00000000-0000-0000-0000-000000000000',
    'Test Agreement - Dynamic Save',
    'white-collar',
    'Metal',
    'monthly',
    '{"enabled": true, "period": "calendar", "showOnPayslip": true}'::jsonb,
    '{"enabled": false, "period": "calendar", "showOnPayslip": false}'::jsonb,
    '{"earningYear": "current", "startDate": {"day": "1", "month": "January"}, "entitlement": "25", "fullDaysOnly": true, "rule": "equal"}'::jsonb,
    true,
    '00000000-0000-0000-0000-000000000000'
);

-- Verify the table was created correctly
SELECT 'Table created successfully with columns:' as message;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'salary_agreements' 
AND table_schema = 'public'
ORDER BY ordinal_position;