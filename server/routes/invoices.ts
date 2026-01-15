import express from 'express';
import { body, param, query } from 'express-validator';
import { InvoiceController } from '../controllers/InvoiceController';
import { validateRequest } from '../middleware/validation';
import { requireFoundationAccess, authMiddleware } from '../middleware/auth';

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
  authMiddleware,
  requireFoundationAccess,
  InvoiceController.getInvoices
);

// Get invoice statistics
router.get('/stats',
  [
    query('foundation_id').isUUID()
  ],
  validateRequest,
  authMiddleware,
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
  authMiddleware,
  requireFoundationAccess,
  InvoiceController.getInvoiceById
);

// Create new invoice
router.post('/',
  [
    query('foundation_id').isUUID(),
    body('customer_id').optional({ nullable: true }).isUUID(),
    body('order_id').optional({ nullable: true }).isUUID(),
    body('invoice_date').isISO8601().toDate(),
    body('due_date').optional({ nullable: true }).isISO8601().toDate(),
    body('payment_terms').optional().trim(),
    body('invoice_type').optional().isIn(['invoice', 'credit_note', 'debit_note', 'sales', 'purchase']),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('invoice_address').optional().trim(),
    body('invoice_address_2').optional().trim(),
    body('postcode').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('cin').optional().trim(),
    body('your_order_number').optional().trim(),
    body('your_reference').optional().trim(),
    body('our_reference').optional().trim(),
    body('delivery_name').optional().trim(),
    body('delivery_address').optional().trim(),
    body('delivery_address_2').optional().trim(),
    body('delivery_postcode').optional().trim(),
    body('delivery_city').optional().trim(),
    body('delivery_country').optional().trim(),
    body('delivery_date').optional({ nullable: true }).isISO8601().toDate(),
    body('delivery_method').optional().trim(),
    body('shipping_fee').optional().isNumeric(),
    body('invoice_fee').optional().isNumeric(),
    body('invoice_discount_percent').optional().isNumeric(),
    body('price_list').optional().trim(),
    body('prices_incl_vat').optional().isBoolean(),
    body('email').optional().isEmail(),
    body('phone').optional().trim(),
    body('notes').optional().trim(),
    // Allow empty items array, and ensure product_id is optional/nullable
    body('items').optional().isArray(),
    body('items.*.description').optional().trim(),
    body('items.*.quantity').optional().isNumeric(),
    body('items.*.unit_price').optional().isNumeric(),
    body('items.*.product_id').optional({ nullable: true }).isUUID()
  ],
  validateRequest,
  authMiddleware,
  requireFoundationAccess,
  InvoiceController.createInvoice
);

// Update invoice
router.put('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('customer_id').optional({ nullable: true }).isUUID(),
    body('order_id').optional({ nullable: true }).isUUID(),
    body('invoice_date').isISO8601().toDate(),
    body('due_date').optional({ nullable: true }).isISO8601().toDate(),
    body('payment_terms').optional().trim(),
    body('invoice_type').optional().isIn(['invoice', 'credit_note', 'debit_note', 'sales', 'purchase']),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('invoice_address').optional().trim(),
    body('invoice_address_2').optional().trim(),
    body('postcode').optional().trim(),
    body('city').optional().trim(),
    body('country').optional().trim(),
    body('cin').optional().trim(),
    body('your_order_number').optional().trim(),
    body('your_reference').optional().trim(),
    body('our_reference').optional().trim(),
    body('delivery_name').optional().trim(),
    body('delivery_address').optional().trim(),
    body('delivery_address_2').optional().trim(),
    body('delivery_postcode').optional().trim(),
    body('delivery_city').optional().trim(),
    body('delivery_country').optional().trim(),
    body('delivery_date').optional({ nullable: true }).isISO8601().toDate(),
    body('delivery_method').optional().trim(),
    body('shipping_fee').optional().isNumeric(),
    body('invoice_fee').optional().isNumeric(),
    body('invoice_discount_percent').optional().isNumeric(),
    body('price_list').optional().trim(),
    body('prices_incl_vat').optional().isBoolean(),
    body('email').optional().isEmail(),
    body('phone').optional().trim(),
    body('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
    body('notes').optional().trim(),
    body('items').optional().isArray()
  ],
  validateRequest,
  authMiddleware,
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
  authMiddleware,
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
  authMiddleware,
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
  authMiddleware,
  requireFoundationAccess,
  InvoiceController.sendInvoice
);

export default router;
