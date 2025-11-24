import { Router } from 'express';
import { QuickTextsController } from '../controllers/QuickTextsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', QuickTextsController.getSettings);
router.post('/', QuickTextsController.upsertSettings);
router.put('/', QuickTextsController.upsertSettings);
router.post('/add', QuickTextsController.addEntry);
router.delete('/:id', QuickTextsController.deleteEntry);

export default router;
























