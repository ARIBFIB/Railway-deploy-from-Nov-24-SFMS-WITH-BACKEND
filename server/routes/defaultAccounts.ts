import { Router } from 'express';
import { DefaultAccountsController } from '../controllers/DefaultAccountsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', DefaultAccountsController.getSettings('accounting'));
router.post('/', DefaultAccountsController.upsertSettings('accounting'));
router.put('/', DefaultAccountsController.upsertSettings('accounting'));

export default router;

