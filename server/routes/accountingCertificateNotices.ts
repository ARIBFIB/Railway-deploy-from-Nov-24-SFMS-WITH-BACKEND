import { Router } from 'express';
import { AccountingCertificateNoticesController } from '../controllers/AccountingCertificateNoticesController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

router.get('/', AccountingCertificateNoticesController.getSettings);
router.post('/', AccountingCertificateNoticesController.upsertSettings);
router.put('/', AccountingCertificateNoticesController.upsertSettings);

export default router;

