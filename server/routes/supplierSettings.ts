import { Router } from 'express';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';
import { setSupabaseContext } from '../middleware/supabaseContext';
import { AutomaticAccountingController } from '../controllers/AutomaticAccountingController';
import { TrustedSendersStorageController } from '../controllers/TrustedSendersStorageController';
import { DefaultAccountsController } from '../controllers/DefaultAccountsController';
import { AccountingTemplatesController } from '../controllers/AccountingTemplatesController';
import { SupplierInvoiceSettingsController } from '../controllers/SupplierInvoiceSettingsController';

const router = Router();

router.use(jwtAuthMiddleware as any);
router.use(setSupabaseContext as any);

// Automatic accounting
router.get(
  '/automatic-accounting',
  AutomaticAccountingController.getAutomaticAccountingEntries('supplier')
);
router.get(
  '/automatic-accounting/:id',
  AutomaticAccountingController.getAutomaticAccountingEntryById('supplier')
);
router.post(
  '/automatic-accounting',
  AutomaticAccountingController.createAutomaticAccountingEntry('supplier')
);
router.put(
  '/automatic-accounting/:id',
  AutomaticAccountingController.updateAutomaticAccountingEntry('supplier')
);
router.delete(
  '/automatic-accounting/:id',
  AutomaticAccountingController.deleteAutomaticAccountingEntry('supplier')
);

// Trusted senders & storage
router.get(
  '/trusted-senders-storage',
  TrustedSendersStorageController.getSettings('supplier')
);
router.post(
  '/trusted-senders-storage',
  TrustedSendersStorageController.upsertSettings('supplier')
);
router.put(
  '/trusted-senders-storage',
  TrustedSendersStorageController.upsertSettings('supplier')
);
router.post(
  '/trusted-senders-storage/domains',
  TrustedSendersStorageController.addTrustedDomain('supplier')
);
router.delete(
  '/trusted-senders-storage/domains/:id',
  TrustedSendersStorageController.deleteTrustedDomain('supplier')
);
router.post(
  '/trusted-senders-storage/trusted-emails',
  TrustedSendersStorageController.addTrustedEmail('supplier')
);
router.delete(
  '/trusted-senders-storage/trusted-emails/:id',
  TrustedSendersStorageController.deleteTrustedEmail('supplier')
);
router.post(
  '/trusted-senders-storage/rejected-emails',
  TrustedSendersStorageController.addRejectedEmail('supplier')
);
router.delete(
  '/trusted-senders-storage/rejected-emails/:id',
  TrustedSendersStorageController.deleteRejectedEmail('supplier')
);

// Default accounts
router.get(
  '/default-accounts',
  DefaultAccountsController.getSettings('supplier')
);
router.post(
  '/default-accounts',
  DefaultAccountsController.upsertSettings('supplier')
);
router.put(
  '/default-accounts',
  DefaultAccountsController.upsertSettings('supplier')
);

// Accounting templates
router.get(
  '/accounting-templates',
  AccountingTemplatesController.getTemplates('supplier')
);
router.get(
  '/accounting-templates/:id',
  AccountingTemplatesController.getTemplateById('supplier')
);
router.post(
  '/accounting-templates',
  AccountingTemplatesController.createTemplate('supplier')
);
router.put(
  '/accounting-templates/:id',
  AccountingTemplatesController.updateTemplate('supplier')
);
router.delete(
  '/accounting-templates/:id',
  AccountingTemplatesController.deleteTemplate('supplier')
);

// Supplier invoice settings sections
router.get(
  '/invoice',
  SupplierInvoiceSettingsController.getAllSections('supplier')
);
router.get(
  '/invoice/:section',
  SupplierInvoiceSettingsController.getSection('supplier')
);
router.put(
  '/invoice/:section',
  SupplierInvoiceSettingsController.upsertSection('supplier')
);

export default router;

