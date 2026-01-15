import express from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /api/payments - Get all payments for a foundation
router.get('/', PaymentController.getAllPayments);

// GET /api/payments/:id - Get a specific payment
router.get('/:id', PaymentController.getPaymentById);

// POST /api/payments - Create a new payment
router.post('/', PaymentController.createPayment);

// PUT /api/payments/:id - Update a payment
router.put('/:id', PaymentController.updatePayment);

// DELETE /api/payments/:id - Delete a payment
router.delete('/:id', PaymentController.deletePayment);

// GET /api/payments/invoice/:invoiceId - Get all payments for a specific invoice
router.get('/invoice/:invoiceId', PaymentController.getPaymentsByInvoice);

export default router;