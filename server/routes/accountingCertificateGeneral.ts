import { Router } from 'express';
import { AccountingCertificateGeneralSettingsController } from '../controllers/AccountingCertificateGeneralSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', AccountingCertificateGeneralSettingsController.getSettings);
router.post('/', AccountingCertificateGeneralSettingsController.upsertSettings);
router.put('/', AccountingCertificateGeneralSettingsController.upsertSettings);

export default router;

