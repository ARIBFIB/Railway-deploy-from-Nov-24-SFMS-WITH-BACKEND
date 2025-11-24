import express from 'express';
import { body, param, query } from 'express-validator';
import { TransactionAccountController } from '../controllers/TransactionAccountController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Apply authentication to all routes
router.use(authMiddleware);

// Get all transaction accounts
router.get('/', TransactionAccountController.getTransactionAccounts);

// Get transaction account by ID
router.get('/:id', [
  param('id').isUUID(),
  validateRequest
], TransactionAccountController.getTransactionAccountById);

// Create new transaction account
router.post('/', [
  body('name').notEmpty().isString(),
  body('account_with').optional().isString(),
  body('bank').optional().isString(),
  body('bank_for_international_payments').optional().isString(),
  body('bank_transfer').optional().isString(),
  body('bankgirot_customer_number').optional().isString(),
  body('clearing_number').optional().isString(),
  body('account_number').optional().isString(),
  body('iban').optional().isString(),
  body('bic').optional().isString(),
  body('swish_number').optional().isString(),
  body('accounting_account').optional().isString(),
  validateRequest
], TransactionAccountController.createTransactionAccount);

// Update transaction account
router.put('/:id', [
  param('id').isUUID(),
  body('name').optional().isString(),
  body('account_with').optional().isString(),
  body('bank').optional().isString(),
  body('bank_for_international_payments').optional().isString(),
  body('bank_transfer').optional().isString(),
  body('bankgirot_customer_number').optional().isString(),
  body('clearing_number').optional().isString(),
  body('account_number').optional().isString(),
  body('iban').optional().isString(),
  body('bic').optional().isString(),
  body('swish_number').optional().isString(),
  body('accounting_account').optional().isString(),
  validateRequest
], TransactionAccountController.updateTransactionAccount);

// Delete transaction account
router.delete('/:id', [
  param('id').isUUID(),
  validateRequest
], TransactionAccountController.deleteTransactionAccount);

// Default account configuration
router.get('/config/defaults', TransactionAccountController.getDefaultAccountConfig);

router.put('/config/defaults', [
  body('default_main_account').optional().isString(),
  body('default_account_customer_invoice').optional().isString(),
  body('preselected_salary_account').optional().isString(),
  body('preselected_account_direct_debit').optional().isString(),
  body('linked_to_payment_account').optional().isString(),
  validateRequest
], TransactionAccountController.updateDefaultAccountConfig);

// Test bank connection
router.post('/:id/test-connection', [
  param('id').isUUID(),
  validateRequest
], TransactionAccountController.testBankConnection);

// Get account transactions
router.get('/:id/transactions', [
  param('id').isUUID(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('from_date').optional().isISO8601(),
  query('to_date').optional().isISO8601(),
  validateRequest
], TransactionAccountController.getAccountTransactions);

export default router;
