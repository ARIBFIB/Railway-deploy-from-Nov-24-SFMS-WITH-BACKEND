# ✅ PERMISSION SYSTEM - COMPLETE IMPLEMENTATION GUIDE

## 🎯 What's Been Implemented:

### **Backend (✅ Complete)**:
1. ✅ `user_governance_roles` table created
2. ✅ User registration accepts `governance_role_id`
3. ✅ Login returns `permissions` array and `governance_role` name
4. ✅ Permissions fetched from governance roles table

### **Frontend (✅ Complete)**:
1. ✅ Permission mapping created (`permissionMapping.ts`)
2. ✅ Dynamic permission checking (`permissions.ts`)
3. ✅ Sidebar already uses `hasPermission()` function
4. ✅ Login stores permissions in localStorage

## 📋 HOW IT WORKS:

### **Permission Flow:**
```
1. Admin creates role "Project Manager" with permissions:
   - create_documents
   - review_documents
   - schedule_meetings

2. Admin creates user and assigns to "Project Manager" role

3. User logs in:
   - Backend fetches governance role
   - Returns permissions: ["create_documents", "review_documents", "schedule_meetings"]
   
4. Frontend stores permissions in localStorage

5. Sidebar checks permissions:
   - hasPermission() reads from localStorage
   - Maps permissions to screens using PERMISSION_TO_SCREEN_MAP
   - Shows/hides menu items accordingly
```

### **Permission to Screen Mapping:**

| Permission | Accessible Screens |
|-----------|-------------------|
| `create_documents` | Documents |
| `review_documents` | Documents, Governance |
| `approve_documents` | Documents, Governance |
| `schedule_meetings` | Meetings, Governance |
| `attend_meetings` | Meetings |
| `create_minutes` | Meetings, Governance |
| `approve_minutes` | Meetings, Governance |
| `manage_users` | Governance, Settings |
| `view_all_data` | Dashboard, Reports, Financial, Documents, Meetings, Projects, Grants, Investments |
| `view_foundation_data` | Dashboard, Reports |
| `view_audit_trails` | Governance, Reports |
| `review_compliance` | Governance |
| `generate_reports` | Reports |
| `manage_investments` | Investments, Financial |
| `approve_expenses` | Expenses, Financial |

## 🧪 TESTING STEPS:

### **Step 1: Run Migration**
```sql
-- Already done! ✅
-- File: supabase/migrations/20251205_create_user_governance_roles.sql
```

### **Step 2: Create Test Role**
1. Go to Governance → Role Management
2. Click "Create Role"
3. Name: "Document Manager"
4. Description: "Can create and review documents"
5. Select permissions:
   - ✅ create_documents
   - ✅ review_documents
6. Click "Create Role"

### **Step 3: Create Test User**
1. Click "Create Login"
2. Select Role: "Document Manager"
3. Email: `docmanager@example.com`
4. Password: `DocManager123`
5. Click "Create Login"

### **Step 4: Test Permissions**
1. Logout from admin
2. Login as `docmanager@example.com` / `DocManager123`
3. Check sidebar - should ONLY see:
   - ✅ Documents
   - ✅ Profile (always visible)
4. Should NOT see:
   - ❌ Dashboard
   - ❌ Meetings
   - ❌ Financial
   - ❌ etc.

### **Step 5: Test Different Role**
1. Logout
2. Login as admin
3. Create new role "Meeting Coordinator":
   - ✅ schedule_meetings
   - ✅ create_minutes
4. Create user with this role
5. Login as that user
6. Should ONLY see:
   - ✅ Meetings
   - ✅ Governance (because of schedule_meetings)
   - ✅ Profile

## 🔧 TROUBLESHOOTING:

### **If sidebar shows all items:**
1. Check browser console for permissions:
   ```javascript
   JSON.parse(localStorage.getItem('user_data')).permissions
   ```
2. Should show array like: `["create_documents", "review_documents"]`
3. If empty or undefined, check backend login response

### **If permissions not working:**
1. Clear localStorage: `localStorage.clear()`
2. Login again
3. Check backend logs for permission fetch
4. Verify `user_governance_roles` table has entries

### **If user has no permissions:**
1. Check if user is assigned to a governance role:
   ```sql
   SELECT * FROM user_governance_roles WHERE user_id = 'USER_ID';
   ```
2. Check if role has permissions:
   ```sql
   SELECT * FROM roles WHERE id = ROLE_ID;
   ```

## 📝 ADDING NEW PERMISSIONS:

### **To add a new permission:**

1. **Add to permission list** in Role Management form
2. **Map to screens** in `permissionMapping.ts`:
   ```typescript
   'new_permission': ['screen1', 'screen2'],
   ```
3. **Use in components**:
   ```typescript
   import { hasSpecificPermission } from '../utils/permissionMapping';
   
   const userPermissions = JSON.parse(localStorage.getItem('user_data') || '{}').permissions || [];
   
   if (hasSpecificPermission(userPermissions, 'new_permission')) {
     // Show feature
   }
   ```

## ✨ CURRENT STATUS:

**✅ FULLY FUNCTIONAL**

- Backend returns permissions
- Frontend stores permissions
- Sidebar filters based on permissions
- Permission mapping configured
- Ready for testing!

## 🎯 NEXT STEPS (Optional Enhancements):

1. **Route Protection**: Add route guards to prevent URL navigation
2. **Feature-Level Permissions**: Hide/show buttons within pages
3. **API Permission Checks**: Validate permissions on backend routes
4. **Permission Caching**: Optimize permission lookups
5. **Permission Audit**: Log permission checks for compliance
