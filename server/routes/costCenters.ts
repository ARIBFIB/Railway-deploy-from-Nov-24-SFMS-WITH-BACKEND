import { Router } from 'express';
import { CostCentersSettingsController } from '../controllers/CostCentersSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', CostCentersSettingsController.getSettings);
router.post('/', CostCentersSettingsController.upsertSettings);
router.put('/', CostCentersSettingsController.upsertSettings);

export default router;

