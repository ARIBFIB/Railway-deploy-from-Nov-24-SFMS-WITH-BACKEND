import { Router } from 'express';
import { AccountingViewSettingsController } from '../controllers/AccountingViewSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', AccountingViewSettingsController.getSettings);
router.post('/', AccountingViewSettingsController.upsertSettings);
router.put('/', AccountingViewSettingsController.upsertSettings);

export default router;

