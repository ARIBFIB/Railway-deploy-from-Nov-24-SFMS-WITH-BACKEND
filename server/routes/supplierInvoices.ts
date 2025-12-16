import express from 'express';
import { SupplierInvoiceController } from '../controllers/SupplierInvoiceController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/', SupplierInvoiceController.getSupplierInvoices);
router.get('/:id', SupplierInvoiceController.getSupplierInvoiceById);
router.post('/', SupplierInvoiceController.createSupplierInvoice);
router.put('/:id', SupplierInvoiceController.updateSupplierInvoice);
router.delete('/:id', SupplierInvoiceController.deleteSupplierInvoice);
router.post('/:id/approve', SupplierInvoiceController.approveSupplierInvoice);
router.post('/:id/reject', SupplierInvoiceController.rejectSupplierInvoice);

export default router;
