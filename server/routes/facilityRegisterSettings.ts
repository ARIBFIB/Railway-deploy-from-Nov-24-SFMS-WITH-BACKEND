import { Router } from 'express';
import { FacilityRegisterSettingsController } from '../controllers/FacilityRegisterSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

// Facility Register Settings routes
router.get('/', FacilityRegisterSettingsController.getSettings);
router.post('/', FacilityRegisterSettingsController.upsertSettings);
router.put('/', FacilityRegisterSettingsController.updateSettings);
router.delete('/', FacilityRegisterSettingsController.deleteSettings);

export default router;

