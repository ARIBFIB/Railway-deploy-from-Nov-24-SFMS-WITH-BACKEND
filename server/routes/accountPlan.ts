import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { AccountPlanController } from '../controllers/AccountPlanController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Purchase Categories Routes
router.get('/purchase-categories',
  [
    query('foundation_id').optional().isUUID(),
    query('status').optional().isIn(['all', 'active', 'inactive'])
  ],
  validateRequest,
  AccountPlanController.getPurchaseCategories
);

router.get('/purchase-categories/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  AccountPlanController.getPurchaseCategoryById
);

router.post('/purchase-categories',
  [
    query('foundation_id').isUUID(),
    body('name').notEmpty().isString(),
    body('icon').optional().isString(),
    body('description').optional().isString(),
    body('is_expanded').optional().isBoolean(),
    body('is_locked').optional().isBoolean()
  ],
  validateRequest,
  AccountPlanController.createPurchaseCategory
);

router.put('/purchase-categories/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('name').optional().isString(),
    body('icon').optional().isString(),
    body('description').optional().isString(),
    body('is_expanded').optional().isBoolean(),
    body('is_locked').optional().isBoolean(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  AccountPlanController.updatePurchaseCategory
);

router.delete('/purchase-categories/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  AccountPlanController.deletePurchaseCategory
);

router.patch('/purchase-categories/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('category_ids').isArray().notEmpty(),
    body('category_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  AccountPlanController.bulkUpdateCategories
);

router.delete('/purchase-categories/bulk-delete',
  [
    query('foundation_id').isUUID(),
    body('category_ids').isArray().notEmpty(),
    body('category_ids.*').isUUID()
  ],
  validateRequest,
  AccountPlanController.bulkDeleteCategories
);

// Purchase Types Routes
router.get('/purchase-types',
  [
    query('foundation_id').optional().isUUID(),
    query('category_id').optional().isUUID(),
    query('status').optional().isIn(['all', 'active', 'inactive'])
  ],
  validateRequest,
  AccountPlanController.getPurchaseTypes
);

router.get('/purchase-types/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  AccountPlanController.getPurchaseTypeById
);

router.post('/purchase-types',
  [
    query('foundation_id').isUUID(),
    body('category_id').isUUID(),
    body('name').notEmpty().isString(),
    body('account').notEmpty().isString(),
    body('account_name').notEmpty().isString(),
    body('is_locked').optional().isBoolean()
  ],
  validateRequest,
  AccountPlanController.createPurchaseType
);

router.put('/purchase-types/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('category_id').optional().isUUID(),
    body('name').optional().isString(),
    body('account').optional().isString(),
    body('account_name').optional().isString(),
    body('is_locked').optional().isBoolean(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  AccountPlanController.updatePurchaseType
);

router.delete('/purchase-types/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  AccountPlanController.deletePurchaseType
);

router.patch('/purchase-types/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('purchase_type_ids').isArray().notEmpty(),
    body('purchase_type_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  AccountPlanController.bulkUpdatePurchaseTypes
);

router.delete('/purchase-types/bulk-delete',
  [
    query('foundation_id').isUUID(),
    body('purchase_type_ids').isArray().notEmpty(),
    body('purchase_type_ids.*').isUUID()
  ],
  validateRequest,
  AccountPlanController.bulkDeletePurchaseTypes
);

export default router;
