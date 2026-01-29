import { Router } from 'express';
import { EmailSettingsController } from '../controllers/EmailSettingsController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { Await } from 'react-router-dom';

const router = Router();

// All routes require authentication
router.use(jwtAuthMiddleware);

// Get SMTP configuration
router.get('/smtp', EmailSettingsController.getSMTPConfig);

// Update SMTP configuration
router.post('/smtp', EmailSettingsController.updateSMTPConfig);
router.put('/smtp', EmailSettingsController.updateSMTPConfig);

// Test email configuration
router.post('/test', EmailSettingsController.testEmail);

export default router;