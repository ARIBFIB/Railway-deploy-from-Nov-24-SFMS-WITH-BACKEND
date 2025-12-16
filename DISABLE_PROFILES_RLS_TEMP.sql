-- ============================================
-- TEMPORARY FIX: DISABLE RLS ON PROFILES
-- ============================================
-- WARNING: This temporarily disables RLS for testing
-- You should re-enable it with proper policies later

-- Disable RLS on profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ============================================
-- AFTER RUNNING THIS:
-- User creation should work!
-- Remember to re-enable RLS later with proper policies
-- ============================================
