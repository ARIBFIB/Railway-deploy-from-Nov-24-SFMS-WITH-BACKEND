import { Router } from 'express';
import { AccountingTemplatesController } from '../controllers/AccountingTemplatesController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

// All routes require authentication
router.use(jwtAuthMiddleware);

// Get all templates
router.get('/', AccountingTemplatesController.getTemplates('accounting'));

// Get template by ID
router.get('/:id', AccountingTemplatesController.getTemplateById('accounting'));

// Create template
router.post('/', AccountingTemplatesController.createTemplate('accounting'));

// Update template
router.put('/:id', AccountingTemplatesController.updateTemplate('accounting'));

// Delete template
router.delete('/:id', AccountingTemplatesController.deleteTemplate('accounting'));

export default router;

