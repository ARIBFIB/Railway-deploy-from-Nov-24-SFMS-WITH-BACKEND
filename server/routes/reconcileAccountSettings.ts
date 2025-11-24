import { Router } from 'express';
import { ReconcileAccountSettingsController } from '../controllers/ReconcileAccountSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', ReconcileAccountSettingsController.getSettings);
router.put('/', ReconcileAccountSettingsController.saveSettings);
router.post('/', ReconcileAccountSettingsController.saveSettings);

export default router;

