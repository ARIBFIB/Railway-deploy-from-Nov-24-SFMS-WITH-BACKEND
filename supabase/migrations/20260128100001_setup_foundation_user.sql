-- Setup test foundation and user for dynamic salary agreements
-- This ensures there's a foundation and user relationship for testing

-- Insert test foundation
INSERT INTO public.foundations (
    id,
    name,
    organization_number,
    address,
    postal_code,
    city,
    country,
    phone,
    email,
    is_active,
    created_by
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Dynamic Test Foundation',
    '556677-8899',
    '123 Test Street',
    '12345',
    'Test City',
    'Sweden',
    '+46 70 123 45 67',
    'test@company.com',
    true,
    '00000000-0000-0000-0000-000000000000'
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();

-- Ensure foundation member relationship exists
INSERT INTO public.foundation_members (
    foundation_id,
    user_id,
    role,
    is_active,
    joined_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000000',
    'admin',
    true,
    NOW()
) ON CONFLICT (foundation_id, user_id) DO UPDATE SET
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Create a function to get user foundation ID (for API usage)
CREATE OR REPLACE FUNCTION get_user_foundation_id()
RETURNS UUID AS $$
DECLARE
    user_foundation_id UUID;
BEGIN
    SELECT fm.foundation_id INTO user_foundation_id
    FROM public.foundation_members fm
    WHERE fm.user_id = auth.uid()
    LIMIT 1;
    
    RETURN user_foundation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.salary_agreements TO anon, authenticated;
GRANT ALL ON public.foundations TO anon, authenticated;
GRANT ALL ON public.foundation_members TO anon, authenticated;