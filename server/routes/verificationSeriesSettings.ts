import { Router } from 'express';
import { VerificationSeriesSettingsController } from '../controllers/VerificationSeriesSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', VerificationSeriesSettingsController.getSettings);
router.put('/', VerificationSeriesSettingsController.saveSettings);
router.post('/', VerificationSeriesSettingsController.saveSettings);

export default router;

