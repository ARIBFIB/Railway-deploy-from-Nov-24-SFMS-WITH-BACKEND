import express from 'express';
import { body, param, query } from 'express-validator';
import { SupplierController } from '../controllers/SupplierController';
import { validateRequest } from '../middleware/validation';
import { requireFoundationAccess } from '../middleware/auth';

const router = express.Router();

// Get all suppliers for foundation
router.get('/',
  [
    query('foundation_id').isUUID(),
    query('status').optional().isIn(['active', 'inactive'])
  ],
  validateRequest,
  requireFoundationAccess,
  SupplierController.getSuppliers
);

// Search suppliers
router.get('/search',
  [
    query('foundation_id').isUUID(),
    query('q').optional().trim(),
    query('status').optional().isIn(['active', 'inactive'])
  ],
  validateRequest,
  requireFoundationAccess,
  SupplierController.searchSuppliers
);

// Get supplier by ID
router.get('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  SupplierController.getSupplierById
);

// Create new supplier
router.post('/',
  [
    query('foundation_id').isUUID(),
    body('supplier_number').trim().notEmpty(),
    body('name').trim().isLength({ min: 2 }),
    body('corporate_personal_id').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']),
    body('industry_code').optional().trim(),
    body('notes').optional().trim(),
    body('addresses').optional().isArray(),
    body('contacts').optional().isArray()
  ],
  validateRequest,
  requireFoundationAccess,
  SupplierController.createSupplier
);

// Update supplier
router.put('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('name').optional().trim().isLength({ min: 2 }),
    body('supplier_number').optional().trim(),
    body('corporate_personal_id').optional().trim(),
    body('status').optional().isIn(['active', 'inactive']),
    body('industry_code').optional().trim(),
    body('notes').optional().trim(),
    body('addresses').optional().isArray(),
    body('contacts').optional().isArray()
  ],
  validateRequest,
  requireFoundationAccess,
  SupplierController.updateSupplier
);

// Delete supplier
router.delete('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  SupplierController.deleteSupplier
);

export default router;
