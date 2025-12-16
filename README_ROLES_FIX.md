# ROLES TABLE FIX - INSTRUCTIONS

## Problem
The `roles` table exists in Supabase but is missing required columns:
- `permissions` (JSONB)
- `user_count` (INTEGER)

## Current Table Structure
```
id: INTEGER (not UUID)
name: VARCHAR
description: TEXT
created_at: TIMESTAMP
```

## What Needs to Be Done

**Someone with Supabase dashboard access needs to run the SQL from `FIX_ROLES_TABLE.sql`**

## Supabase Dashboard Credentials Needed

Ask the project owner for:
1. **Supabase Dashboard URL**: https://supabase.com/dashboard
2. **Login email/password** for the Supabase account
3. **Project**: mzojxrxkcizngvvntyho

## Steps for Person with Access

1. Login to https://supabase.com/dashboard
2. Select project: `mzojxrxkcizngvvntyho`
3. Click "SQL Editor" in left sidebar
4. Click "New query"
5. Copy and paste the SQL from `FIX_ROLES_TABLE.sql`
6. Click "Run"
7. Done! ✅

## Alternative: If No Dashboard Access Available

The SQL commands that need to be run:

```sql
-- Add missing columns
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS user_count INTEGER DEFAULT 0;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing roles
UPDATE roles SET permissions = '["view_all_data"]'::jsonb WHERE permissions IS NULL;

-- Insert default roles
INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Board Chairman', 'Full governance authority with approval rights', '["approve_documents", "schedule_meetings", "manage_users", "view_all_data"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Board Chairman');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Board Member', 'Standard board member with review and voting rights', '["review_documents", "attend_meetings", "view_foundation_data"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Board Member');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Secretary', 'Administrative role for meeting and document management', '["create_minutes", "manage_documents", "schedule_meetings"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Secretary');

INSERT INTO roles (name, description, permissions, user_count) 
SELECT 'Auditor', 'External auditor with read-only access to compliance data', '["view_audit_trails", "review_compliance", "generate_reports"]'::jsonb, 0
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Auditor');
```

## After SQL is Run

1. Refresh the app in browser
2. Go to Role Management page
3. Everything should work:
   - ✅ Create roles
   - ✅ Edit roles
   - ✅ Delete roles
   - ✅ Dashboard count updates

## Files Created for You

- `FIX_ROLES_TABLE.sql` - SQL to fix the table
- `RUN_THIS_IN_SUPABASE.sql` - Full migration (if starting fresh)

## Contact

Ask your project owner or database administrator for Supabase dashboard access.
