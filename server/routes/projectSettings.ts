import { Router } from 'express';
import { ProjectSettingsController } from '../controllers/ProjectSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', ProjectSettingsController.getSettings);
router.post('/', ProjectSettingsController.upsertSettings);
router.put('/', ProjectSettingsController.upsertSettings);

export default router;

