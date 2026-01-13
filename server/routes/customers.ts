import express from 'express';
import { body, param, query } from 'express-validator';
import { CustomerController } from '../controllers/CustomerController';
import { validateRequest } from '../middleware/validation';
import { requireFoundationAccess } from '../middleware/auth';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = express.Router();

// Apply jwtAuthMiddleware to all customer routes
router.use(jwtAuthMiddleware);

// Get all customers for foundation
router.get('/',
  [
    query('foundation_id').isUUID(),
    query('status').optional().isIn(['active', 'inactive']),
    query('customer_type').optional().isIn(['business', 'private'])
  ],
  validateRequest,
  requireFoundationAccess,
  CustomerController.getCustomers
);

// Search customers
router.get('/search',
  [
    query('foundation_id').isUUID(),
    query('q').optional().trim(),
    query('status').optional().isIn(['active', 'inactive'])
  ],
  validateRequest,
  requireFoundationAccess,
  CustomerController.searchCustomers
);

// Get customer by ID
router.get('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  CustomerController.getCustomerById
);

// Create new customer
router.post('/',
  [
    query('foundation_id').isUUID(),
    body('customer_number').trim().notEmpty(),
    body('name').trim().isLength({ min: 2 }),
    body('customer_type').optional().isIn(['business', 'private']),
    body('corporate_personal_id').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']),
    body('industry_code').optional().trim(),
    body('workplace_number').optional().trim(),
    body('store_id').optional().trim(),
    body('notes').optional().trim(),
    body('addresses').optional().isArray(),
    body('contacts').optional().isArray(),
    body('billing_info').optional().isObject(),
    body('e_document_settings').optional().isObject()
  ],
  validateRequest,
  requireFoundationAccess,
  CustomerController.createCustomer
);

// Update customer
router.put('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('name').optional().trim().isLength({ min: 2 }),
    body('customer_type').optional().isIn(['business', 'private']),
    body('corporate_personal_id').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']),
    body('industry_code').optional().trim(),
    body('workplace_number').optional().trim(),
    body('store_id').optional().trim(),
    body('notes').optional().trim(),
    body('addresses').optional().isArray(),
    body('contacts').optional().isArray(),
    body('billing_info').optional().isObject(),
    body('e_document_settings').optional().isObject()
  ],
  validateRequest,
  requireFoundationAccess,
  CustomerController.updateCustomer
);

// Delete customer
router.delete('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  CustomerController.deleteCustomer
);

export default router;
