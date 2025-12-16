# ✅ HOW TO CREATE DOCUMENT WORKFLOWS - FRONTEND GUIDE

## 📍 WHERE TO CREATE WORKFLOWS:

### **File Location:**
```
src/components/governance/DocumentWorkflow.tsx
```

### **How to Access:**
1. Login to the application
2. Go to **Governance** page
3. Click on **Document Workflows** tab
4. Click **"Create Workflow"** button (top right)

## 🎯 WHAT I ADDED:

### **1. Create Workflow Button**
- Located in the header of Document Workflows page
- Opens a modal form when clicked

### **2. Create Workflow Form**
The form includes:
- **Document Name** - Name of the document (e.g., "Board Resolution - Q1 Budget")
- **Document Type** - Select from dropdown:
  - Board Resolution
  - Financial Statement
  - Bylaws
  - Articles of Association
  - Other
- **Workflow Type** - Select from dropdown:
  - Approval Workflow
  - Review Workflow
  - Signature Workflow
- **Workflow Steps** - Add multiple steps:
  - Assignee Name (who will perform the action)
  - Action Type (Review / Approve / Sign)
  - Can add/remove steps dynamically

### **3. Features:**
- ✅ Add multiple workflow steps
- ✅ Remove steps (if more than one)
- ✅ Validation (all fields required)
- ✅ Auto-refresh after creation
- ✅ Success/error messages

## 📋 HOW TO USE:

### **Step 1: Click "Create Workflow"**
```
Location: Top right of Document Workflows page
Button: "Create Workflow" with Plus icon
```

### **Step 2: Fill in the Form**

**Example:**
```
Document Name: Board Resolution - Q1 Budget Approval
Document Type: Board Resolution
Workflow Type: Approval Workflow

Steps:
  Step 1:
    - Assignee Name: John Secretary
    - Action Type: Review
  
  Step 2:
    - Assignee Name: Jane Chairman
    - Action Type: Approve
  
  Step 3:
    - Assignee Name: Board Members
    - Action Type: Sign
```

### **Step 3: Click "Create Workflow"**
- Form validates all fields
- Sends data to API
- Shows success message
- Refreshes workflow list
- Closes modal

## 🔧 TECHNICAL DETAILS:

### **API Endpoint:**
```
POST /api/workflows
```

### **Request Body:**
```json
{
  "document_name": "Board Resolution - Q1 Budget Approval",
  "document_type": "board_resolution",
  "workflow_type": "approval",
  "steps": [
    {
      "assignee_name": "John Secretary",
      "assignee_id": "",
      "action_type": "review"
    },
    {
      "assignee_name": "Jane Chairman",
      "assignee_id": "",
      "action_type": "approve"
    },
    {
      "assignee_name": "Board Members",
      "assignee_id": "",
      "action_type": "sign"
    }
  ]
}
```

### **Response:**
```json
{
  "message": "Workflow created successfully",
  "workflow": {
    "id": "uuid",
    "document_name": "...",
    "status": "pending",
    ...
  }
}
```

## 🎨 UI COMPONENTS USED:

1. **Modal** - For the create form
2. **Button** - Create Workflow button with Plus icon
3. **Input fields** - Text inputs for names
4. **Select dropdowns** - For document type, workflow type, action type
5. **Dynamic step management** - Add/Remove steps

## 📝 FORM VALIDATION:

- ✅ Document name is required
- ✅ All assignee names must be filled
- ✅ At least one step is required
- ✅ Shows alert if validation fails

## 🔄 WORKFLOW LIFECYCLE:

1. **Created** → Status: `pending`
2. **In Progress** → Status: `in_progress` (when first step is completed)
3. **Completed** → Status: `completed` (when all steps are completed)
4. **Rejected** → Status: `rejected` (if any step is rejected)

## 💡 TIPS:

### **Best Practices:**
1. Use clear, descriptive document names
2. Add steps in logical order (review → approve → sign)
3. Assign specific people to each step
4. Use appropriate action types for each step

### **Common Workflows:**

**Approval Workflow:**
```
Step 1: Review (Secretary)
Step 2: Approve (Chairman)
Step 3: Sign (Board Members)
```

**Review Workflow:**
```
Step 1: Review (Department Head)
Step 2: Review (Finance Team)
Step 3: Approve (Director)
```

**Signature Workflow:**
```
Step 1: Review (Legal Team)
Step 2: Sign (CEO)
Step 3: Sign (Board Chairman)
```

## 🐛 TROUBLESHOOTING:

### **If "Create Workflow" button doesn't appear:**
- Check if you're on the Document Workflows tab
- Refresh the page
- Check browser console for errors

### **If form submission fails:**
- Check all required fields are filled
- Check browser console for API errors
- Verify backend server is running
- Check database migration was run

### **If workflows don't appear after creation:**
- Refresh the page
- Check browser console
- Verify API response was successful

## 📸 SCREENSHOTS:

### **Create Workflow Button:**
```
+----------------------------------+
| Document Workflows    [+ Create] |
| Track document approval...       |
+----------------------------------+
```

### **Create Workflow Form:**
```
+--------------------------------+
| Create Document Workflow    [X]|
+--------------------------------+
| Document Name *                |
| [Board Resolution - Q1...]     |
|                                |
| Document Type *                |
| [Board Resolution ▼]           |
|                                |
| Workflow Type *                |
| [Approval Workflow ▼]          |
|                                |
| Workflow Steps *    [+ Add]    |
| ┌─ Step 1 ──────────[Remove]─┐ |
| │ Assignee: [John Secretary]  │ |
| │ Action: [Review ▼]          │ |
| └─────────────────────────────┘ |
|                                |
| [Cancel] [Create Workflow]     |
+--------------------------------+
```

---

**You can now create workflows directly from the frontend!** 🎉

**File to edit:** `src/components/governance/DocumentWorkflow.tsx`
