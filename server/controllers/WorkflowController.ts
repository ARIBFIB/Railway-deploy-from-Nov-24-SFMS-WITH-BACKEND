import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { JWTRequest } from '../middleware/jwtAuth';

export class WorkflowController {
    // Get all workflows
    static getWorkflows = asyncHandler(async (req: JWTRequest, res: Response) => {
        const { foundation_id, status } = req.query;

        let query = supabase
            .from('document_workflows')
            .select(`
        *,
        workflow_steps (
          *,
          profiles!workflow_steps_assignee_id_fkey (
            full_name,
            email
          )
        )
      `)
            .order('created_at', { ascending: false });

        if (foundation_id || req.user?.foundation_id) {
            query = query.eq('foundation_id', foundation_id || req.user?.foundation_id);
        }

        if (status) {
            query = query.eq('status', status);
        }

        const { data: workflows, error } = await query;

        if (error) {
            throw createError(error.message, 500);
        }

        res.json({
            workflows: workflows || [],
            total: workflows?.length || 0
        });
    });

    // Get workflow by ID
    static getWorkflowById = asyncHandler(async (req: JWTRequest, res: Response) => {
        const { id } = req.params;

        const { data: workflow, error } = await supabase
            .from('document_workflows')
            .select(`
        *,
        workflow_steps (
          *,
          profiles!workflow_steps_assignee_id_fkey (
            full_name,
            email
          )
        )
      `)
            .eq('id', id)
            .single();

        if (error) {
            throw createError('Workflow not found', 404);
        }

        res.json({ workflow });
    });

    // Create workflow
    static createWorkflow = asyncHandler(async (req: JWTRequest, res: Response) => {
        const {
            document_id,
            document_name,
            document_type,
            workflow_type,
            foundation_id,
            steps
        } = req.body;

        // Create workflow
        const { data: workflow, error: workflowError } = await supabase
            .from('document_workflows')
            .insert({
                document_id,
                document_name,
                document_type,
                workflow_type,
                foundation_id: foundation_id || req.user?.foundation_id,
                created_by: req.user?.user_id,
                status: 'pending'
            })
            .select()
            .single();

        if (workflowError) {
            throw createError(workflowError.message, 400);
        }

        // Create workflow steps
        if (steps && steps.length > 0) {
            const stepsToInsert = steps.map((step: any, index: number) => ({
                workflow_id: workflow.id,
                step_order: index + 1,
                assignee_id: step.assignee_id && step.assignee_id.trim() !== '' ? step.assignee_id : null,
                assignee_name: step.assignee_name,
                action_type: step.action_type,
                status: 'pending'
            }));

            const { error: stepsError } = await supabase
                .from('workflow_steps')
                .insert(stepsToInsert);

            if (stepsError) {
                // Rollback workflow creation
                await supabase.from('document_workflows').delete().eq('id', workflow.id);
                throw createError(stepsError.message, 400);
            }
        }

        // Fetch complete workflow with steps
        const { data: completeWorkflow } = await supabase
            .from('document_workflows')
            .select(`
        *,
        workflow_steps (*)
      `)
            .eq('id', workflow.id)
            .single();

        res.status(201).json({
            message: 'Workflow created successfully',
            workflow: completeWorkflow
        });
    });

    // Update workflow step
    static updateWorkflowStep = asyncHandler(async (req: JWTRequest, res: Response) => {
        const { id } = req.params;
        const { status, comments, digital_signature } = req.body;

        // Update step
        const { data: step, error: stepError } = await supabase
            .from('workflow_steps')
            .update({
                status,
                comments,
                digital_signature,
                completed_at: status === 'completed' || status === 'rejected' ? new Date().toISOString() : null
            })
            .eq('id', id)
            .select()
            .single();

        if (stepError) {
            throw createError(stepError.message, 400);
        }

        // Get workflow to update its status
        const { data: workflowSteps } = await supabase
            .from('workflow_steps')
            .select('*')
            .eq('workflow_id', step.workflow_id);

        if (workflowSteps) {
            const allCompleted = workflowSteps.every(s => s.status === 'completed');
            const hasRejected = workflowSteps.some(s => s.status === 'rejected');
            const hasPending = workflowSteps.some(s => s.status === 'pending');

            let workflowStatus = 'in_progress';
            if (allCompleted) workflowStatus = 'completed';
            else if (hasRejected) workflowStatus = 'rejected';
            else if (hasPending) workflowStatus = 'in_progress';

            await supabase
                .from('document_workflows')
                .update({
                    status: workflowStatus,
                    completed_at: allCompleted ? new Date().toISOString() : null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', step.workflow_id);
        }

        res.json({
            message: 'Workflow step updated successfully',
            step
        });
    });

    // Delete workflow
    static deleteWorkflow = asyncHandler(async (req: JWTRequest, res: Response) => {
        const { id } = req.params;

        const { error } = await supabase
            .from('document_workflows')
            .delete()
            .eq('id', id);

        if (error) {
            throw createError(error.message, 400);
        }

        res.json({ message: 'Workflow deleted successfully' });
    });
}
