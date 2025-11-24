import { Router } from 'express';
import { ReportsSettingsController } from '../controllers/ReportsSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', ReportsSettingsController.getSettings);
router.post('/', ReportsSettingsController.upsertSettings);
router.put('/', ReportsSettingsController.upsertSettings);

export default router;

