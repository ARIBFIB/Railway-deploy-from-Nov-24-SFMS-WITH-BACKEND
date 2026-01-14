import express from 'express';
import { body, param, query } from 'express-validator';
import { ProductController } from '../controllers/ProductController';
import { validateRequest } from '../middleware/validation';
import { requireFoundationAccess } from '../middleware/auth';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = express.Router();

// Apply authentication to all product routes
router.use(jwtAuthMiddleware);

// Product categories routes
router.get('/categories',
  [
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.getProductCategories
);

router.post('/categories',
  [
    query('foundation_id').isUUID(),
    body('name').trim().isLength({ min: 2 }),
    body('description').optional().trim(),
    body('parent_category_id').optional().isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.createProductCategory
);

// Products routes
router.get('/',
  [
    query('foundation_id').isUUID(),
    query('category_id').optional().isUUID(),
    query('is_active').optional().isBoolean()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.getProducts
);

// Search products
router.get('/search',
  [
    query('foundation_id').isUUID(),
    query('q').optional().trim(),
    query('category_id').optional().isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.searchProducts
);

// Get product by ID
router.get('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.getProductById
);

// Create new product
router.post('/',
  [
    query('foundation_id').isUUID(),
    body('name').trim().isLength({ min: 2 }),
    body('article_number').optional().trim(),
    body('description').optional().trim(),
    body('category_id').optional().isUUID(),
    body('unit').optional().trim(),
    body('purchase_price').optional().isNumeric(),
    body('sell_price').optional().isNumeric(),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('vat_rate').optional().isNumeric(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.createProduct
);

// Update product
router.put('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('name').optional().trim().isLength({ min: 2 }),
    body('article_number').optional().trim(),
    body('description').optional().trim(),
    body('category_id').optional().isUUID(),
    body('unit').optional().trim(),
    body('purchase_price').optional().isNumeric(),
    body('sell_price').optional().isNumeric(),
    body('currency').optional().isLength({ min: 3, max: 3 }),
    body('vat_rate').optional().isNumeric(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.updateProduct
);

// Delete product
router.delete('/:id',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID()
  ],
  validateRequest,
  requireFoundationAccess,
  ProductController.deleteProduct
);

export default router;
