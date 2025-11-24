import { Router } from 'express';
import { AccrualsSettingsController } from '../controllers/AccrualsSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', AccrualsSettingsController.getSettings);
router.post('/', AccrualsSettingsController.upsertSettings);
router.put('/', AccrualsSettingsController.upsertSettings);

export default router;

