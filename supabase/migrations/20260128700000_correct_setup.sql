-- Correct setup based on your actual foundations table structure

-- First, let's see what user IDs are available to use for the foundation
SELECT id as user_id, email FROM auth.users LIMIT 5;

-- Create a foundation member relationship using an existing user
-- We'll use one of the existing foundations and create a member relationship
INSERT INTO public.foundation_members (
    foundation_id,
    user_id,
    role,
    is_active,
    joined_at
) 
SELECT 
    id as foundation_id,
    owner_user_id as user_id,
    'admin' as role,
    true as is_active,
    NOW() as joined_at
FROM public.foundations 
WHERE status = 'active'
LIMIT 1
ON CONFLICT (foundation_id, user_id) DO UPDATE SET
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Drop existing salary_agreements table if it exists
DROP TABLE IF EXISTS public.salary_agreements CASCADE;

-- Create the fresh salary_agreements table
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

-- Create indexes for better performance
CREATE INDEX idx_salary_agreements_foundation_id ON public.salary_agreements(foundation_id);
CREATE INDEX idx_salary_agreements_name ON public.salary_agreements(name);
CREATE INDEX idx_salary_agreements_staff_type ON public.salary_agreements(staff_type);
CREATE INDEX idx_salary_agreements_is_active ON public.salary_agreements(is_active);
CREATE INDEX idx_salary_agreements_created_at ON public.salary_agreements(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.salary_agreements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for dynamic access
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

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_salary_agreements_updated_at 
    BEFORE UPDATE ON public.salary_agreements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data using an existing foundation
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
) 
SELECT 
    f.id as foundation_id,
    'Test Agreement - Dynamic Save' as name,
    'white-collar' as staff_type,
    'Metal' as agreement_template,
    'monthly' as salary_period,
    '{"enabled": true, "period": "calendar", "showOnPayslip": true}'::jsonb as atf,
    '{"enabled": false, "period": "calendar", "showOnPayslip": false}'::jsonb as atk,
    '{"earningYear": "current", "startDate": {"day": "1", "month": "January"}, "entitlement": "25", "fullDaysOnly": true, "rule": "equal"}'::jsonb as holiday,
    true as is_active,
    f.owner_user_id as created_by
FROM public.foundations f
WHERE f.status = 'active'
LIMIT 1;

-- Verify the setup was successful
SELECT 'Setup completed successfully!' as message;
SELECT 
    f.name as foundation_name,
    f.status as foundation_status,
    COUNT(sa.id) as agreements_count
FROM public.foundations f
LEFT JOIN public.salary_agreements sa ON f.id = sa.foundation_id
WHERE f.status = 'active'
GROUP BY f.name, f.status;

-- Show the created agreement
SELECT 'Created agreement:' as info;
SELECT 
    sa.id,
    sa.name,
    sa.staff_type,
    sa.agreement_template,
    sa.is_active,
    f.name as foundation_name
FROM public.salary_agreements sa
JOIN public.foundations f ON sa.foundation_id = f.id
WHERE f.status = 'active';