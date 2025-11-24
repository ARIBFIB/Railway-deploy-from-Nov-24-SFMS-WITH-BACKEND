import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { WageTypesController } from '../controllers/WageTypesController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Wage Types Routes
router.get('/wage-types',
  [
    query('foundation_id').optional().isUUID(),
    query('staff_type').optional().isString(),
    query('agreement_template').optional().isString(),
    query('status').optional().isIn(['all', 'active', 'inactive', 'nameChanged', 'changed'])
  ],
  validateRequest,
  WageTypesController.getWageTypes
);

router.get('/wage-types/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  WageTypesController.getWageTypeById
);

router.post('/wage-types',
  [
    query('foundation_id').isUUID(),
    body('salary_type').notEmpty().isString(),
    body('name').notEmpty().isString(),
    body('category').optional().isString(),
    body('unit').optional().isString(),
    body('formula').optional().isString(),
    body('preliminary_tax').optional().isString(),
    body('employer_contribution').optional().isString(),
    body('preselected_account').optional().isString()
  ],
  validateRequest,
  WageTypesController.createWageType
);

router.put('/wage-types/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('salary_type').optional().isString(),
    body('name').optional().isString(),
    body('category').optional().isString(),
    body('unit').optional().isString(),
    body('formula').optional().isString(),
    body('preliminary_tax').optional().isString(),
    body('employer_contribution').optional().isString(),
    body('preselected_account').optional().isString(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  WageTypesController.updateWageType
);

router.delete('/wage-types/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  WageTypesController.deleteWageType
);

router.patch('/wage-types/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('wage_type_ids').isArray().notEmpty(),
    body('wage_type_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  WageTypesController.bulkUpdateWageTypes
);

// Registration Codes Routes
router.get('/registration-codes',
  [
    query('foundation_id').optional().isUUID(),
    query('status').optional().isIn(['all', 'active', 'inactive'])
  ],
  validateRequest,
  WageTypesController.getRegistrationCodes
);

router.post('/registration-codes',
  [
    query('foundation_id').isUUID(),
    body('code').notEmpty().isString(),
    body('name').notEmpty().isString(),
    body('used').optional().isBoolean(),
    body('employee').optional().isBoolean()
  ],
  validateRequest,
  WageTypesController.createRegistrationCode
);

router.put('/registration-codes/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('code').optional().isString(),
    body('name').optional().isString(),
    body('used').optional().isBoolean(),
    body('employee').optional().isBoolean(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  WageTypesController.updateRegistrationCode
);

router.patch('/registration-codes/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('registration_code_ids').isArray().notEmpty(),
    body('registration_code_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  WageTypesController.bulkUpdateRegistrationCodes
);

// Wage Type Controls Routes
router.get('/wage-type-controls',
  [
    query('foundation_id').optional().isUUID(),
    query('status').optional().isIn(['all', 'active', 'inactive'])
  ],
  validateRequest,
  WageTypesController.getWageTypeControls
);

router.post('/wage-type-controls',
  [
    query('foundation_id').isUUID(),
    body('registration_code').notEmpty().isString(),
    body('day_code').notEmpty().isString(),
    body('salary_type').notEmpty().isString()
  ],
  validateRequest,
  WageTypesController.createWageTypeControl
);

router.put('/wage-type-controls/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('registration_code').optional().isString(),
    body('day_code').optional().isString(),
    body('salary_type').optional().isString(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  WageTypesController.updateWageTypeControl
);

router.patch('/wage-type-controls/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('wage_type_control_ids').isArray().notEmpty(),
    body('wage_type_control_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  WageTypesController.bulkUpdateWageTypeControls
);

export default router;
