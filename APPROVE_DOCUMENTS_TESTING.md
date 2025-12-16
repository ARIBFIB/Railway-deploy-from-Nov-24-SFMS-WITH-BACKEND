# ✅ APPROVE DOCUMENTS PERMISSION - TESTING GUIDE

## 🎯 What Was Implemented:

### **Frontend Changes:**
1. ✅ Added "Approve" button to DocumentsPage
2. ✅ Button only shows if user has `approve_documents` permission
3. ✅ Button hidden if document is already approved
4. ✅ Added `handleApproveDocument` function to call API

### **Backend Changes:**
1. ✅ Added `approveDocument` method in DocumentController
2. ✅ Added POST `/api/documents/:id/approve` route
3. ✅ Updates document status to 'approved'
4. ✅ Records who approved and when

## 📋 HOW TO TEST:

### **Step 1: Create Role with Approve Permission**
1. Login as admin
2. Go to Governance → Role Management
3. Click "Create Role"
4. Name: "Document Approver"
5. Description: "Can approve documents"
6. **Check ONLY this permission:**
   - ✅ approve documents
7. Click "Create Role"

### **Step 2: Create User with Document Approver Role**
1. Click "Create Login"
2. Select Role: "Document Approver"
3. Email: `approver@example.com`
4. Password: `Approver123`
5. Click "Create Login"

### **Step 3: Upload a Document (as admin)**
1. Go to Documents page
2. Click "Upload Document"
3. Upload any PDF file
4. Document Type: "Board Resolution"
5. Click "Upload"
6. Document should appear with status "uploaded"

### **Step 4: Test Approval (as Document Approver)**
1. **Logout** from admin
2. **Login** as `approver@example.com` / `Approver123`
3. Check sidebar:
   - ✅ Should see: Documents, Profile
   - ❌ Should NOT see: Dashboard, Meetings, Financial, etc.
4. Go to Documents page
5. You should see the uploaded document
6. **Look for "Approve" button** next to View/Download buttons
7. Click "Approve"
8. Document status should change to "approved"
9. "Approve" button should disappear

### **Step 5: Verify Permission Enforcement**
1. Create another role "Document Viewer" with ONLY:
   - ✅ review documents (NOT approve)
2. Create user with this role
3. Login as that user
4. Go to Documents
5. **"Approve" button should NOT appear** (no permission)

## ✅ EXPECTED RESULTS:

### **With `approve_documents` Permission:**
- ✅ Sidebar shows Documents page
- ✅ Can view documents list
- ✅ "Approve" button appears on non-approved documents
- ✅ Can click Approve and document status changes
- ✅ Approve button disappears after approval

### **Without `approve_documents` Permission:**
- ✅ May or may not see Documents (depends on other permissions)
- ❌ "Approve" button does NOT appear
- ✅ Can still View/Download (if they have access to Documents)

## 🔍 DEBUGGING:

### **If Approve button doesn't show:**
1. Check browser console:
   ```javascript
   const userData = JSON.parse(localStorage.getItem('user_data'));
   console.log('Permissions:', userData.permissions);
   ```
2. Should include `"approve_documents"` in array
3. If not, check backend login response
4. Verify user is assigned to correct role in database

### **If API call fails:**
1. Check Network tab in browser DevTools
2. Look for POST request to `/api/documents/{id}/approve`
3. Check response status and error message
4. Verify backend server is running

### **Database Check:**
```sql
-- Check if user has governance role
SELECT * FROM user_governance_roles WHERE user_id = 'USER_ID';

-- Check role permissions
SELECT * FROM roles WHERE id = ROLE_ID;

-- Check document status
SELECT id, file_name, status, approved_by, approved_at 
FROM documents 
WHERE id = 'DOCUMENT_ID';
```

## 🎯 SUCCESS CRITERIA:

✅ Role created with approve_documents permission
✅ User assigned to that role
✅ User logs in and permissions are in localStorage
✅ Sidebar shows only allowed pages
✅ Approve button appears on documents
✅ Clicking Approve updates document status
✅ Users without permission don't see button

## 📝 NOTES:

- The permission system is **fully dynamic**
- Permissions are checked in **real-time** from localStorage
- No page refresh needed after permission changes (user must re-login)
- Backend validates permissions via JWT token
- Frontend hides UI elements based on permissions

---

**This is the first permission implementation. Once this works, we can implement the other 14 permissions using the same pattern!** 🚀
