import { Router } from 'express';
import { ReconciliationController } from '../controllers/ReconciliationController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtAuthMiddleware);
router.use(setSupabaseContext as any);

// Reconciliation routes
router.get('/ledger-entries', ReconciliationController.getLedgerEntries);

export default router;