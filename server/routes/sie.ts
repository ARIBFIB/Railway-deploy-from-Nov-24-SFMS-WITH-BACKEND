import { Router } from 'express';
import { body, query } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { SIEController } from '../controllers/SIEController';

const router = Router();

// SIE Imports
router.get('/imports', [
  query('foundation_id').optional().isUUID()
], authMiddleware, SIEController.getImports);

router.get('/imports/:id', authMiddleware, SIEController.getImportById);

router.post('/imports', [
  body('file_name').notEmpty().isString(),
  body('file_content').notEmpty().isString(),
  body('accounting_period_start').optional().isDate(),
  body('accounting_period_end').optional().isDate()
], authMiddleware, SIEController.createImport);

// SIE Exports
router.get('/exports', [
  query('foundation_id').optional().isUUID()
], authMiddleware, SIEController.getExports);

router.get('/exports/:id', authMiddleware, SIEController.getExportById);

router.post('/exports', [
  body('file_name').notEmpty().isString(),
  body('accounting_period_start').optional().isDate(),
  body('accounting_period_end').optional().isDate(),
  body('file_path').optional().isString()
], authMiddleware, SIEController.createExport);

router.get('/exports/:id/download', authMiddleware, SIEController.downloadExport);

export default router;
