import express from 'express';
import { body, param, query } from 'express-validator';
import { QuoteController } from '../controllers/QuoteController';
import { validateRequest } from '../middleware/validation';
import { requireFoundationAccess } from '../middleware/auth';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = express.Router();

// Apply authentication to all quote routes
router.use(jwtAuthMiddleware);

// Get all quotes for foundation
router.get('/',
  [
    query('foundation_id').isUUID(),
    query('status').optional().isIn(['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted']),
    query('customer_id').optional().isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  QuoteController.getQuotes
);

// Get quote by ID
router.get('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  QuoteController.getQuoteById
);

// Create new quote
router.post('/',
  [
    query('foundation_id').isUUID(),
    body('customer_id').optional().isUUID(),
    body('quote_date').isISO8601().toDate(),
    body('valid_until').optional().isISO8601().toDate(),
    body('delivery_date').optional().isISO8601().toDate(),
    body('quote_text').optional().trim(),
    body('use_as_order_text').optional().isBoolean(),
    body('shipping_fee').optional().isNumeric(),
    body('invoice_fee').optional().isNumeric(),
    body('invoice_discount').optional().isNumeric(),
    body('print_template').optional().trim(),
    body('language').optional().trim(),
    body('distribution_method').optional().trim(),
    body('items').optional().isArray(),
    body('items.*.description').optional().trim(),
    body('items.*.quantity').optional().isNumeric(),
    body('items.*.unit_price').optional().isNumeric(),
    body('items.*.product_id').optional().isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  QuoteController.createQuote
);

// Update quote
router.put('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('customer_id').optional().isUUID(),
    body('quote_date').optional().isISO8601().toDate(),
    body('valid_until').optional().isISO8601().toDate(),
    body('delivery_date').optional().isISO8601().toDate(),
    body('quote_text').optional().trim(),
    body('use_as_order_text').optional().isBoolean(),
    body('shipping_fee').optional().isNumeric(),
    body('invoice_fee').optional().isNumeric(),
    body('invoice_discount').optional().isNumeric(),
    body('print_template').optional().trim(),
    body('language').optional().trim(),
    body('distribution_method').optional().trim(),
    body('status').optional().isIn(['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted']),
    body('items').optional().isArray()
  ],
  validateRequest,
  requireFoundationAccess,
  QuoteController.updateQuote
);

// Delete quote
router.delete('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  QuoteController.deleteQuote
);

// Convert quote to order
router.post('/:id/convert-to-order',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  QuoteController.convertToOrder
);

export default router;
