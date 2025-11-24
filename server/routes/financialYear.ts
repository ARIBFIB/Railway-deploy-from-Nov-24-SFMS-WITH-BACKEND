import { Router } from 'express';
import { FinancialYearSettingsController } from '../controllers/FinancialYearSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

// Settings
router.get('/', FinancialYearSettingsController.getSettings);
router.post('/', FinancialYearSettingsController.upsertSettings);
router.put('/', FinancialYearSettingsController.upsertSettings);

// Financial Years
router.get('/years', FinancialYearSettingsController.getYears);
router.post('/years', FinancialYearSettingsController.createYear);
router.put('/years/:id', FinancialYearSettingsController.updateYear);
router.delete('/years/:id', FinancialYearSettingsController.deleteYear);
router.put('/years/:id/toggle-preselected', FinancialYearSettingsController.togglePreselected);

export default router;

