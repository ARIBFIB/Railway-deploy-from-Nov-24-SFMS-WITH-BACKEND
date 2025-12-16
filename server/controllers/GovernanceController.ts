import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class GovernanceController {
  static getRolesCount = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    const { count, error } = await supabase
      .from('roles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      count: count || 0
    });
  });

  static getRoles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    const { data: roles, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      roles: roles || [],
      total: roles?.length || 0
    });
  });

  static createRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      foundation_id,
      name,
      description,
      permissions
    } = req.body;

    const { data: role, error } = await supabase
      .from('roles')
      .insert({
        name,
        description,
        permissions,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      message: 'Role created successfully',
      role
    });
  });

  static updateRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (permissions) updateData.permissions = permissions;

    const { data: role, error } = await supabase
      .from('roles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    if (!role) {
      throw createError('Role not found', 404);
    }

    res.json({
      message: 'Role updated successfully',
      role
    });
  });

  static deleteRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    console.log('🗑️ Attempting to delete role with ID:', id);

    const { data, error, count } = await supabase
      .from('roles')
      .delete()
      .eq('id', id)
      .select();

    console.log('🗑️ Delete response:', { data, error, count });

    if (error) {
      console.error('❌ Delete error:', error);
      throw createError(error.message, 400);
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No rows deleted - possibly blocked by RLS or role does not exist');
    }

    res.json({
      message: 'Role deleted successfully',
      deleted: data
    });
  });

  static getGovernanceStats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    // 1. Active Roles Count
    const { count: rolesCount } = await supabase
      .from('roles')
      .select('*', { count: 'exact', head: true });

    // 2. Pending Approvals (Workflows with status 'pending')
    const { count: pendingApprovals } = await supabase
      .from('document_workflows')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // 3. Compliance Issues (Items with status 'overdue' or 'pending' with high priority)
    const { count: complianceIssues } = await supabase
      .from('compliance_items')
      .select('*', { count: 'exact', head: true })
      .in('status', ['overdue']);

    // 4. Meetings This Month (Mock for now as meetings table might be separate)
    // You can replace this with actual meetings query later
    const meetingsCount = 2;

    res.json({
      activeRoles: rolesCount || 0,
      pendingApprovals: pendingApprovals || 0,
      complianceIssues: complianceIssues || 0,
      meetingsThisMonth: meetingsCount
    });
  });

  static getDocumentWorkflows = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    const { data: workflows, error } = await supabase
      .from('document_workflows')
      .select(`
        *,
        steps:workflow_steps(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      workflows: workflows || [],
      total: workflows?.length || 0
    });
  });

  static createDocumentWorkflow = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      document_id,
      workflow_type,
      steps
    } = req.body;

    // 1. Create Workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('document_workflows')
      .insert({
        document_id, // Assuming this is passed or handled
        document_name: 'New Document', // Placeholder, should come from request or document lookup
        workflow_type,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (workflowError) {
      throw createError(workflowError.message, 400);
    }

    // 2. Create Steps
    if (steps && steps.length > 0) {
      const stepsData = steps.map((step: any, index: number) => ({
        workflow_id: workflow.id,
        step_order: index + 1,
        assignee_name: step.assignee_name || 'Unassigned',
        action_type: step.action_type || 'review',
        status: 'pending'
      }));

      const { error: stepsError } = await supabase
        .from('workflow_steps')
        .insert(stepsData);

      if (stepsError) {
        // Ideally rollback workflow creation here
        throw createError(stepsError.message, 400);
      }
    }

    res.status(201).json({
      message: 'Document workflow created successfully',
      workflow
    });
  });

  static processWorkflowAction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { step_id, action, comments } = req.body;

    const { data: step, error } = await supabase
      .from('workflow_steps')
      .update({
        status: action === 'approve' ? 'completed' : 'rejected',
        comments,
        completed_at: new Date().toISOString()
      })
      .eq('id', step_id)
      .eq('workflow_id', id)
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.json({
      message: `Workflow step ${action}d successfully`,
      step
    });
  });

  static getComplianceItems = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    const { data: complianceItems, error } = await supabase
      .from('compliance_items')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      compliance_items: complianceItems || [],
      total: complianceItems?.length || 0
    });
  });

  static createComplianceItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const {
      foundation_id,
      regulation_type,
      title,
      description,
      due_date,
      priority,
      assigned_to
    } = req.body;

    const { data: complianceItem, error } = await supabase
      .from('compliance_items')
      .insert({
        foundation_id,
        regulation_type,
        title,
        description,
        due_date,
        priority,
        assigned_to,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw createError(error.message, 400);
    }

    res.status(201).json({
      message: 'Compliance item created successfully',
      compliance_item: complianceItem
    });
  });

  static getAuditLogs = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id, action, target_table } = req.query;

    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        profiles(full_name, email)
      `)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (foundation_id) {
      query = query.eq('foundation_id', foundation_id);
    }
    if (action) {
      query = query.eq('action', action);
    }
    if (target_table) {
      query = query.eq('target_table', target_table);
    }

    const { data: logs, error } = await query;

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      audit_logs: logs || [],
      total: logs?.length || 0
    });
  });

  static getUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { foundation_id } = req.query;

    // Get users from profiles table with their role information
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw createError(error.message, 500);
    }

    res.json({
      users: users || [],
      total: users?.length || 0
    });
  });
}