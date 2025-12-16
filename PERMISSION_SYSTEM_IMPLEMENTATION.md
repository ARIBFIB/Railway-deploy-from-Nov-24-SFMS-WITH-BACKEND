# Permission System Implementation - Next Steps

## ✅ Completed (Backend):

1. **Database Schema**:
   - Created `user_governance_roles` table to link users to governance roles
   - Migration file: `20251205_create_user_governance_roles.sql`

2. **User Registration**:
   - Updated `AuthController.register` to accept `governance_role_id`
   - Automatically assigns user to governance role when creating account
   - Stores assignment in `user_governance_roles` table

3. **User Login**:
   - Updated `AuthController.login` to fetch user's governance role
   - Fetches permissions from the assigned role
   - Returns `permissions` array and `governance_role` name in login response

4. **Frontend - Role Management**:
   - Updated `handleCreateLogin` to send `governance_role_id` when creating users
   - Users are now properly assigned to governance roles with permissions

## 🔄 To Do (Frontend - Permission Enforcement):

### 1. Run the Migration
**IMPORTANT**: Run this SQL in Supabase Dashboard first:
```sql
-- File: supabase/migrations/20251205_create_user_governance_roles.sql
```

### 2. Create Permissions Context/Hook
Create `src/contexts/PermissionsContext.tsx`:
- Store user permissions from login response
- Provide `hasPermission(permission: string)` function
- Provide `hasAnyPermission(permissions: string[])` function

### 3. Update Auth Context
Modify `src/contexts/AuthContext.tsx`:
- Store `permissions` from login response
- Store `governance_role` from login response
- Pass to PermissionsContext

### 4. Update Sidebar
Modify `src/components/layout/Sidebar.tsx`:
- Import `usePermissions` hook
- Show/hide menu items based on permissions
- Example: Only show "Documents" if user has "create_documents" or "review_documents"

### 5. Add Route Protection
Create `src/components/ProtectedRoute.tsx`:
- Check if user has required permissions
- Redirect to unauthorized page if not

### 6. Permission Mapping
Define permission-to-feature mapping:
```typescript
const PERMISSION_ROUTES = {
  '/documents': ['create_documents', 'review_documents', 'approve_documents'],
  '/meetings': ['schedule_meetings', 'attend_meetings'],
  '/compliance': ['review_compliance', 'manage_compliance'],
  // ... etc
};
```

## 📋 Testing Steps:

1. Run the migration SQL
2. Create a role with specific permissions (e.g., "Document Manager" with only document permissions)
3. Create a user and assign them to that role
4. Login with that user
5. Check browser console - should see permissions array
6. Implement frontend permission checks
7. Verify sidebar only shows allowed items
8. Verify routes are protected

## 🎯 Current Status:

**Backend**: ✅ COMPLETE
- Users can be assigned to governance roles
- Login returns permissions
- All APIs ready

**Frontend**: ⚠️ NEEDS IMPLEMENTATION
- Permission context needed
- Sidebar filtering needed
- Route protection needed

## 📝 Notes:

- The `roleId` in the "Create Login" form should be the ID from the `roles` table (governance roles)
- Permissions are stored as JSONB array in the `roles.permissions` column
- Example permissions: `["create_documents", "review_documents", "approve_documents"]`
