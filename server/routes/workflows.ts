import express from 'express';
import { body, param, query } from 'express-validator';
import { WorkflowController } from '../controllers/WorkflowController';
import { validateRequest } from '../middleware/validation';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = express.Router();

// Apply JWT authentication middleware to all routes
router.use(jwtAuthMiddleware);

// Get all workflows
router.get('/',
    [
        query('foundation_id').optional().isUUID(),
        query('status').optional().isIn(['pending', 'in_progress', 'completed', 'rejected'])
    ],
    validateRequest,
    WorkflowController.getWorkflows
);

// Get workflow by ID
router.get('/:id',
    [param('id').isUUID()],
    validateRequest,
    WorkflowController.getWorkflowById
);

// Create workflow
router.post('/',
    [
        body('document_id').optional().isUUID(),
        body('document_name').isString().notEmpty(),
        body('document_type').isString().notEmpty(),
        body('workflow_type').isIn(['approval', 'review', 'signature']),
        body('foundation_id').optional().isUUID(),
        body('steps').isArray()
    ],
    validateRequest,
    WorkflowController.createWorkflow
);

// Update workflow step
router.put('/steps/:id',
    [
        param('id').isUUID(),
        body('status').isIn(['pending', 'completed', 'rejected']),
        body('comments').optional().isString(),
        body('digital_signature').optional().isString()
    ],
    validateRequest,
    WorkflowController.updateWorkflowStep
);

// Delete workflow
router.delete('/:id',
    [param('id').isUUID()],
    validateRequest,
    WorkflowController.deleteWorkflow
);

export default router;
