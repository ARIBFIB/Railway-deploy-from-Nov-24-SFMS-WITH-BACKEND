import express from 'express';
import { body, param, query } from 'express-validator';
import { InvoiceController } from '../controllers/InvoiceController';
import { validateRequest } from '../middleware/validation';
import { requireFoundationAccess } from '../middleware/auth';

const router = express.Router();

// Get all invoices for foundation
router.get('/',
  [
    query('foundation_id').isUUID(),
    query('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
    query('customer_id').optional().isUUID(),
    query('invoice_type').optional().isIn(['invoice', 'credit_note', 'debit_note', 'sales', 'purchase'])
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.getInvoices
);

// Get invoice statistics
router.get('/stats',
  [
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.getInvoiceStats
);

// Get invoice by ID
router.get('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.getInvoiceById
);

// Create new invoice
router.post('/',
  [
    query('foundation_id').isUUID(),
    body('customer_id').optional().isUUID(),
    body('order_id').optional().isUUID(),
    body('invoice_date').isISO8601().toDate(),
    body('due_date').optional().isISO8601().toDate(),
    body('payment_terms').optional().trim(),
    body('invoice_type').optional().isIn(['invoice', 'credit_note', 'debit_note', 'sales', 'purchase']),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('notes').optional().trim(),
    body('items').optional().isArray(),
    body('items.*.description').optional().trim(),
    body('items.*.quantity').optional().isNumeric(),
    body('items.*.unit_price').optional().isNumeric(),
    body('items.*.product_id').optional().isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.createInvoice
);

// Update invoice
router.put('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('customer_id').optional().isUUID(),
    body('order_id').optional().isUUID(),
    body('invoice_date').optional().isISO8601().toDate(),
    body('due_date').optional().isISO8601().toDate(),
    body('payment_terms').optional().trim(),
    body('invoice_type').optional().isIn(['invoice', 'credit_note', 'debit_note', 'sales', 'purchase']),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
    body('notes').optional().trim(),
    body('items').optional().isArray()
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.updateInvoice
);

// Delete invoice
router.delete('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.deleteInvoice
);

// Mark invoice as paid
router.patch('/:id/mark-paid',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('payment_method').optional().trim(),
    body('payment_date').optional().isISO8601().toDate(),
    body('reference').optional().trim()
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.markAsPaid
);

// Send invoice
router.patch('/:id/send',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  InvoiceController.sendInvoice
);

export default router;
