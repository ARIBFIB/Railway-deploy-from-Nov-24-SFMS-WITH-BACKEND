import { Router } from 'express';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';
import { QuoteOrderSettingsController } from '../controllers/QuoteOrderSettingsController';

const router = Router();

router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

router.get(
  '/invoice',
  QuoteOrderSettingsController.getAllSections
);

router.get(
  '/invoice/:section',
  QuoteOrderSettingsController.getSection
);

router.put(
  '/invoice/:section',
  QuoteOrderSettingsController.upsertSection
);

export default router;


