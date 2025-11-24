import { Router } from 'express';
import { AutomaticAccountingController } from '../controllers/AutomaticAccountingController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

// Automatic Accounting routes
router.get('/', AutomaticAccountingController.getAutomaticAccountingEntries('accounting'));
router.get('/:id', AutomaticAccountingController.getAutomaticAccountingEntryById('accounting'));
router.post('/', AutomaticAccountingController.createAutomaticAccountingEntry('accounting'));
router.put('/:id', AutomaticAccountingController.updateAutomaticAccountingEntry('accounting'));
router.delete('/:id', AutomaticAccountingController.deleteAutomaticAccountingEntry('accounting'));

export default router;

