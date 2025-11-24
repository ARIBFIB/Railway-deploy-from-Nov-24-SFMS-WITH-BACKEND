import { Router } from 'express';
import { TrustedSendersStorageController } from '../controllers/TrustedSendersStorageController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

// All routes require authentication
router.use(jwtAuthMiddleware);

// Get settings
router.get('/', TrustedSendersStorageController.getSettings('accounting'));

// Upsert settings
router.post('/', TrustedSendersStorageController.upsertSettings('accounting'));
router.put('/', TrustedSendersStorageController.upsertSettings('accounting'));

// Trusted domains
router.post('/domains', TrustedSendersStorageController.addTrustedDomain('accounting'));
router.delete('/domains/:id', TrustedSendersStorageController.deleteTrustedDomain('accounting'));

// Trusted email addresses
router.post('/trusted-emails', TrustedSendersStorageController.addTrustedEmail('accounting'));
router.delete('/trusted-emails/:id', TrustedSendersStorageController.deleteTrustedEmail('accounting'));

// Rejected email addresses
router.post('/rejected-emails', TrustedSendersStorageController.addRejectedEmail('accounting'));
router.delete('/rejected-emails/:id', TrustedSendersStorageController.deleteRejectedEmail('accounting'));

export default router;

