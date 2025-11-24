import express from 'express';
import { body, param, query } from 'express-validator';
import { BillingController } from '../controllers/BillingController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Customer invoices
router.get('/invoices', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('filter').optional().isIn(['all', 'to-handle', 'not-booked', 'unpaid', 'unpaid-overdue', 'final-payment', 'cancelled', 'failed']),
  validateRequest
], BillingController.getCustomerInvoices);

// Payments
router.post('/payments', [
  body('payment_date').isISO8601(),
  body('invoice_number').notEmpty().isString(),
  body('paid_amount').isFloat({ min: 0 }),
  validateRequest
], BillingController.addPayment);

router.get('/payments', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest
], BillingController.getPayments);

router.post('/payments/book', [
  body('payment_ids').isArray({ min: 1 }),
  body('payment_method').notEmpty().isString(),
  validateRequest
], BillingController.bookPayments);

// Reminders
router.get('/reminders', [
  query('filter').optional().isIn(['all-unpaid-overdue', 'reminders-to-send', 'external-management', 'failed']),
  validateRequest
], BillingController.getReminders);

router.post('/reminders/send', [
  body('reminder_ids').isArray({ min: 1 }),
  body('reminder_date').optional().isISO8601(),
  body('print_template').optional().isString(),
  body('language').optional().isString(),
  body('distribution_method').optional().isString(),
  validateRequest
], BillingController.sendReminders);

// Recurring invoices
router.post('/recurring', [
  body('customer_id').isUUID(),
  body('recurring_type').notEmpty().isString(),
  body('frequency').notEmpty().isString(),
  body('start_date').isISO8601(),
  body('end_date').optional().isISO8601(),
  body('items').isArray({ min: 1 }),
  body('invoice_template').optional().isString(),
  body('language').optional().isString(),
  body('distribution_method').optional().isString(),
  validateRequest
], BillingController.createRecurringInvoice);

// Invoice services
router.get('/services', BillingController.getInvoiceServices);

// Statistics
router.get('/stats', BillingController.getBillingStats);

export default router;
