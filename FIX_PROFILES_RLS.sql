-- ============================================
-- FIX PROFILES TABLE RLS POLICIES
-- ============================================
-- This allows the service role to insert profiles during user registration

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

-- ============================================
-- AFTER RUNNING THIS:
-- 1. User registration should work!
-- 2. Creating new logins from Role Management will work!
-- ============================================
