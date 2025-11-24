import { Router } from 'express';
import { LockingPeriodSettingsController } from '../controllers/LockingPeriodSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', LockingPeriodSettingsController.getSettings);
router.post('/', LockingPeriodSettingsController.upsertSettings);
router.put('/', LockingPeriodSettingsController.upsertSettings);

export default router;
























