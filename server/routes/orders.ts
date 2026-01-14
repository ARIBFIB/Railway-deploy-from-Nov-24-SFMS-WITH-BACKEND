import express from 'express';
import { body, param, query } from 'express-validator';
import { OrderController } from '../controllers/OrderController';
import { validateRequest } from '../middleware/validation';
import { requireFoundationAccess } from '../middleware/auth';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = express.Router();

// Apply authentication to all order routes
router.use(jwtAuthMiddleware);

// Get all orders for foundation
router.get('/',
  [
    query('foundation_id').isUUID(),
    query('status').optional().isIn(['draft', 'sent', 'confirmed', 'invoiced', 'cancelled']),
    query('customer_id').optional().isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  OrderController.getOrders
);

// Get order by ID
router.get('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  OrderController.getOrderById
);

// Create new order
router.post('/',
  [
    query('foundation_id').isUUID(),
    body('customer_id').optional().isUUID(),
    body('order_date').isISO8601().toDate(),
    body('delivery_date').optional().isISO8601().toDate(),
    body('order_type').optional().isIn(['order', 'quote']),
    body('payment_terms').optional().trim(),
    body('our_reference').optional().trim(),
    body('your_order_number').optional().trim(),
    body('your_reference').optional().trim(),
    body('labels').optional().trim(),
    body('price_list').optional().trim(),
    body('prices_incl_vat').optional().isBoolean(),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('items').optional().isArray(),
    body('items.*.description').optional().trim(),
    body('items.*.ordered_quantity').optional().isNumeric(),
    body('items.*.unit_price').optional().isNumeric(),
    body('items.*.product_id').optional().isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  OrderController.createOrder
);

// Update order
router.put('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('customer_id').optional().isUUID(),
    body('order_date').optional().isISO8601().toDate(),
    body('delivery_date').optional().isISO8601().toDate(),
    body('order_type').optional().isIn(['order', 'quote']),
    body('payment_terms').optional().trim(),
    body('our_reference').optional().trim(),
    body('your_order_number').optional().trim(),
    body('your_reference').optional().trim(),
    body('labels').optional().trim(),
    body('price_list').optional().trim(),
    body('prices_incl_vat').optional().isBoolean(),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('status').optional().isIn(['draft', 'sent', 'confirmed', 'invoiced', 'cancelled']),
    body('items').optional().isArray()
  ],
  validateRequest,
  requireFoundationAccess,
  OrderController.updateOrder
);

// Delete order
router.delete('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  OrderController.deleteOrder
);

// Update delivery status
router.patch('/:id/delivery',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('delivered_quantities').isArray(),
    body('delivered_quantities.*.item_id').isUUID(),
    body('delivered_quantities.*.delivered_quantity').isFloat({ min: 0 })
  ],
  validateRequest,
  requireFoundationAccess,
  OrderController.updateDeliveryStatus
);

// Convert order to invoice
router.post('/:id/convert-to-invoice',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  OrderController.convertToInvoice
);

export default router;
