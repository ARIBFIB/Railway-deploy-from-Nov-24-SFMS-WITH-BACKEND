import { Router } from 'express';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';
import { SalarySettingsController } from '../controllers/SalarySettingsController';

const router = Router();

router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

router.get(
  '/salary',
  SalarySettingsController.getAllSections
);

router.get(
  '/salary/:section',
  SalarySettingsController.getSection
);

router.put(
  '/salary/:section',
  SalarySettingsController.upsertSection
);

export default router;

