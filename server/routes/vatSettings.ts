import { Router } from 'express';
import { VATSettingsController } from '../controllers/VATSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

router.use(jwtAuthMiddleware);

// Settings
router.get('/', VATSettingsController.getSettings);
router.post('/', VATSettingsController.upsertSettings);
router.put('/', VATSettingsController.upsertSettings);

// VAT Entries
router.get('/entries', VATSettingsController.getEntries);
router.post('/entries', VATSettingsController.createEntry);
router.put('/entries/:id', VATSettingsController.updateEntry);
router.delete('/entries/:id', VATSettingsController.deleteEntry);

export default router;

