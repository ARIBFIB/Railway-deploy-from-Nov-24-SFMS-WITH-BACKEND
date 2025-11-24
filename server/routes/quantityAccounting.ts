import { Router } from 'express';
import { QuantityAccountingSettingsController } from '../controllers/QuantityAccountingSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', QuantityAccountingSettingsController.getSettings);
router.post('/', QuantityAccountingSettingsController.upsertSettings);
router.put('/', QuantityAccountingSettingsController.upsertSettings);

export default router;

