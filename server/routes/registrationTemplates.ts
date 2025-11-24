import { Router } from 'express';
import { RegistrationTemplatesController } from '../controllers/RegistrationTemplatesController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', RegistrationTemplatesController.getTemplates);
router.get('/:id', RegistrationTemplatesController.getTemplate);
router.post('/', RegistrationTemplatesController.createTemplate);
router.put('/:id', RegistrationTemplatesController.updateTemplate);
router.delete('/:id', RegistrationTemplatesController.deleteTemplate);

export default router;
























