import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { SalaryAgreementsController } from '../controllers/SalaryAgreementsController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Salary Agreements Routes
router.get('/salary-agreements',
  [
    query('foundation_id').optional().isUUID(),
    query('search').optional().isString()
  ],
  validateRequest,
  SalaryAgreementsController.getSalaryAgreements
);

router.get('/salary-agreements/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  SalaryAgreementsController.getSalaryAgreementById
);

router.post('/salary-agreements',
  [
    query('foundation_id').isUUID(),
    body('name').notEmpty().isString(),
    body('staff_type').notEmpty().isString(),
    body('agreement_template').notEmpty().isString(),
    body('description').optional().isString()
  ],
  validateRequest,
  SalaryAgreementsController.createSalaryAgreement
);

router.put('/salary-agreements/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('name').optional().isString(),
    body('staff_type').optional().isString(),
    body('agreement_template').optional().isString(),
    body('description').optional().isString(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  SalaryAgreementsController.updateSalaryAgreement
);

router.delete('/salary-agreements/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  SalaryAgreementsController.deleteSalaryAgreement
);

router.post('/salary-agreements/:id/copy',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('name').optional().isString()
  ],
  validateRequest,
  SalaryAgreementsController.copySalaryAgreement
);

router.patch('/salary-agreements/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('salary_agreement_ids').isArray().notEmpty(),
    body('salary_agreement_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  SalaryAgreementsController.bulkUpdateSalaryAgreements
);

export default router;
