import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

// Bulk operations
router.patch('/bulk/status', AccountController.bulkUpdateStatus);
router.delete('/bulk', AccountController.bulkDelete);

// Account CRUD routes
router.post('/', AccountController.createAccount);
router.get('/', AccountController.getAccounts);
router.get('/:id', AccountController.getAccountById);
router.put('/:id', AccountController.updateAccount);
router.delete('/:id', AccountController.deleteAccount);

export default router;
