import { Router } from 'express';
import { body, query } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { StockController } from '../controllers/StockController';

const router = Router();

// Stock Levels
router.get('/levels', [
  query('foundation_id').optional().isUUID(),
  query('product_id').optional().isUUID(),
  query('warehouse_id').optional().isUUID()
], authMiddleware, StockController.getStockLevels);

router.get('/levels/:id', authMiddleware, StockController.getStockLevelById);

// Stock Movements
router.post('/movements', [
  body('product_id').notEmpty().isUUID(),
  body('warehouse_id').optional().isUUID(),
  body('movement_type').isIn(['in', 'out', 'transfer', 'adjustment']),
  body('quantity').isFloat({ min: 0 }),
  body('reference_type').optional().isString(),
  body('reference_id').optional().isUUID(),
  body('notes').optional().isString()
], authMiddleware, StockController.createStockMovement);

router.get('/movements', [
  query('foundation_id').optional().isUUID(),
  query('product_id').optional().isUUID(),
  query('warehouse_id').optional().isUUID()
], authMiddleware, StockController.getStockMovements);

// Warehouses
router.get('/warehouses', [
  query('foundation_id').optional().isUUID(),
  query('status').optional().isIn(['all', 'active', 'inactive'])
], authMiddleware, StockController.getWarehouses);

router.get('/warehouses/:id', authMiddleware, StockController.getWarehouseById);

router.post('/warehouses', [
  body('name').notEmpty().isString(),
  body('location').optional().isString(),
  body('description').optional().isString()
], authMiddleware, StockController.createWarehouse);

router.put('/warehouses/:id', [
  body('name').optional().isString(),
  body('location').optional().isString(),
  body('description').optional().isString(),
  body('is_active').optional().isBoolean()
], authMiddleware, StockController.updateWarehouse);

router.delete('/warehouses/:id', authMiddleware, StockController.deleteWarehouse);

export default router;
