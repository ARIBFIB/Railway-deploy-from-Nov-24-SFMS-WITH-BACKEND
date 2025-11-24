import { Router } from 'express';
import { AssetRegisterTypeController } from '../controllers/AssetRegisterTypeController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

// Asset Register Types routes
router.get('/', AssetRegisterTypeController.getAssetRegisterTypes);
router.get('/:id', AssetRegisterTypeController.getAssetRegisterTypeById);
router.post('/', AssetRegisterTypeController.createAssetRegisterType);
router.put('/:id', AssetRegisterTypeController.updateAssetRegisterType);
router.delete('/:id', AssetRegisterTypeController.deleteAssetRegisterType);

export default router;

