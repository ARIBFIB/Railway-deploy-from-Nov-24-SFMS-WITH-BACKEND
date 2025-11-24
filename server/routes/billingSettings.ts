import { Router } from 'express';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';
import { BillingSettingsController } from '../controllers/BillingSettingsController';

const router = Router();

router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

router.get(
  '/billing',
  BillingSettingsController.getAllSections
);

router.get(
  '/billing/:section',
  BillingSettingsController.getSection
);

router.put(
  '/billing/:section',
  BillingSettingsController.upsertSection
);

export default router;

