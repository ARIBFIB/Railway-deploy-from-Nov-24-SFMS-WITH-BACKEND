import express from 'express';
import { body, param, query } from 'express-validator';
import { ArticlesController } from '../controllers/ArticlesController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Get all articles
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('filter').optional().isIn(['all', 'active', 'inactive']),
  validateRequest
], ArticlesController.getArticles);

// Get article by ID
router.get('/:id', [
  param('id').isUUID(),
  validateRequest
], ArticlesController.getArticleById);

// Create new article
router.post('/', [
  body('item_no').optional().isString(),
  body('name').notEmpty().isString(),
  body('starting_price').isFloat({ min: 0 }),
  body('estimated_cost').isFloat({ min: 0 }),
  body('in_stock').isInt({ min: 0 }),
  body('reserved').isInt({ min: 0 }),
  body('disposable').isInt({ min: 0 }),
  body('storage_location').optional().isString(),
  body('stock_value').isFloat({ min: 0 }),
  body('is_active').optional().isBoolean(),
  validateRequest
], ArticlesController.createArticle);

// Update article
router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().isString(),
  body('starting_price').optional().isFloat({ min: 0 }),
  body('estimated_cost').optional().isFloat({ min: 0 }),
  body('in_stock').optional().isInt({ min: 0 }),
  body('reserved').optional().isInt({ min: 0 }),
  body('disposable').optional().isInt({ min: 0 }),
  body('storage_location').optional().isString(),
  body('stock_value').optional().isFloat({ min: 0 }),
  body('is_active').optional().isBoolean(),
  validateRequest
], ArticlesController.updateArticle);

// Delete article
router.delete('/:id', [
  param('id').isUUID(),
  validateRequest
], ArticlesController.deleteArticle);

// Bulk operations
router.post('/bulk-update', [
  body('article_ids').isArray({ min: 1 }),
  body('action').isIn(['activate', 'deactivate', 'update_prices']),
  body('data').optional().isObject(),
  validateRequest
], ArticlesController.bulkUpdateArticles);

// Search articles
router.get('/search', [
  query('q').notEmpty().isString(),
  validateRequest
], ArticlesController.searchArticles);

export default router;
