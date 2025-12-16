-- ============================================
-- FIX PROFILES TABLE RLS POLICIES
-- ============================================
-- Migration: 20251205_fix_profiles_rls_policies
-- Description: Fix RLS policies to allow service role to create profiles during user registration

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies that allow service role operations
-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow service role and users to insert profiles
CREATE POLICY "Allow profile creation"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow all inserts (service role will handle this)

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
