import { Router } from 'express';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';
import { SupplierInvoiceSettingsController } from '../controllers/SupplierInvoiceSettingsController';

const router = Router();

router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

router.get(
  '/invoice',
  SupplierInvoiceSettingsController.getAllSections('accounting')
);

router.get(
  '/invoice/:section',
  SupplierInvoiceSettingsController.getSection('accounting')
);

router.put(
  '/invoice/:section',
  SupplierInvoiceSettingsController.upsertSection('accounting')
);

export default router;

