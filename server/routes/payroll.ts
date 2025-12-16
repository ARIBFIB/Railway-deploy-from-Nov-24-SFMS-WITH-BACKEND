import express from 'express';
import { PayrollController } from '../controllers/PayrollController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

router.get('/runs', PayrollController.getPayrollRuns);
router.get('/runs/:id', PayrollController.getPayrollRunById);
router.post('/runs', PayrollController.createPayrollRun);
router.post('/runs/:id/calculate', PayrollController.calculatePayrollRun);
router.post('/runs/:id/approve', PayrollController.approvePayrollRun);
router.delete('/runs/:id', PayrollController.deletePayrollRun);

export default router;
