import express from 'express';
import { body, param, query } from 'express-validator';
import { AssetController } from '../controllers/AssetController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { upload } from '../middleware/upload';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Get all assets
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('status').optional().isIn(['all', 'not-started', 'activated', 'written-off', 'discarded', 'sold', 'cancelled']),
  validateRequest
], AssetController.getAssets);

// Get asset by ID
router.get('/:id', [
  param('id').isUUID(),
  validateRequest
], AssetController.getAssetById);

// Create new asset
router.post('/', [
  body('asset_number').optional().isString(),
  body('name').notEmpty().isString(),
  body('asset_type').notEmpty().isString(),
  body('linked_to_asset_group').optional().isString(),
  body('acquisition_value').isFloat({ min: 0 }),
  body('estimated_residual_value').isFloat({ min: 0 }),
  body('acquisition_date').isISO8601(),
  body('depreciation_start').isISO8601(),
  body('useful_life_years').isInt({ min: 0 }),
  body('useful_life_months').isInt({ min: 0 }),
  body('depreciation_method').isIn(['Straight', 'Irregular']),
  body('id_number').optional().isString(),
  body('manufacturer_brand').optional().isString(),
  body('insured_with').optional().isString(),
  body('insurance_number').optional().isString(),
  body('group').optional().isString(),
  body('room').optional().isString(),
  body('investment').optional().isString(),
  body('section').optional().isString(),
  body('notes').optional().isString(),
  body('image_url').optional().isString(),
  validateRequest
], AssetController.createAsset);

// Update asset
router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().isString(),
  body('asset_type').optional().isString(),
  body('linked_to_asset_group').optional().isString(),
  body('acquisition_value').optional().isFloat({ min: 0 }),
  body('estimated_residual_value').optional().isFloat({ min: 0 }),
  body('acquisition_date').optional().isISO8601(),
  body('depreciation_start').optional().isISO8601(),
  body('useful_life_years').optional().isInt({ min: 0 }),
  body('useful_life_months').optional().isInt({ min: 0 }),
  body('depreciation_method').optional().isIn(['Straight', 'Irregular']),
  body('id_number').optional().isString(),
  body('manufacturer_brand').optional().isString(),
  body('insured_with').optional().isString(),
  body('insurance_number').optional().isString(),
  body('group').optional().isString(),
  body('room').optional().isString(),
  body('investment').optional().isString(),
  body('section').optional().isString(),
  body('notes').optional().isString(),
  body('image_url').optional().isString(),
  body('status').optional().isIn(['not-started', 'activated', 'written-off', 'discarded', 'sold', 'cancelled']),
  validateRequest
], AssetController.updateAsset);

// Delete asset
router.delete('/:id', [
  param('id').isUUID(),
  validateRequest
], AssetController.deleteAsset);

// Get depreciation schedule
router.get('/:id/depreciation-schedule', [
  param('id').isUUID(),
  query('view').optional().isIn(['year', 'month']),
  validateRequest
], AssetController.getDepreciationSchedule);

// Perform depreciation
router.post('/depreciation', [
  body('asset_ids').isArray({ min: 1 }),
  body('write_off_empty_date').isISO8601(),
  body('transaction_date').isISO8601(),
  body('print_report').optional().isBoolean(),
  validateRequest
], AssetController.performDepreciation);

// Upload asset image
router.post('/:id/image', [
  param('id').isUUID(),
  upload.single('image'),
  validateRequest
], AssetController.uploadAssetImage);

export default router;
