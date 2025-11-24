import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { PersonnelController } from '../controllers/PersonnelController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Employee Routes
router.get('/employees',
  [
    query('foundation_id').optional().isUUID(),
    query('status').optional().isIn(['all', 'active', 'inactive', 'notComplete']),
    query('search').optional().isString()
  ],
  validateRequest,
  PersonnelController.getEmployees
);

router.get('/employees/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  PersonnelController.getEmployeeById
);

router.post('/employees',
  [
    query('foundation_id').isUUID(),
    body('employment_id').notEmpty().isString(),
    body('first_name').notEmpty().isString(),
    body('last_name').notEmpty().isString(),
    body('social_security_number').optional().isString(),
    body('staff_type').optional().isString(),
    body('agreement_for_salaries').optional().isString(),
    body('agreement_template').optional().isString(),
    body('salary_form').optional().isString(),
    body('type_of_pay_slip').optional().isString(),
    body('calendar_permissions').optional().isString(),
    body('addresses').optional().isArray(),
    body('bank_details').optional().isObject(),
    body('emergency_contacts').optional().isArray(),
    body('tax_info').optional().isObject(),
    body('holidays').optional().isArray()
  ],
  validateRequest,
  PersonnelController.createEmployee
);

router.put('/employees/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('employment_id').optional().isString(),
    body('first_name').optional().isString(),
    body('last_name').optional().isString(),
    body('social_security_number').optional().isString(),
    body('staff_type').optional().isString(),
    body('agreement_for_salaries').optional().isString(),
    body('agreement_template').optional().isString(),
    body('salary_form').optional().isString(),
    body('type_of_pay_slip').optional().isString(),
    body('calendar_permissions').optional().isString(),
    body('is_active').optional().isBoolean(),
    body('is_complete').optional().isBoolean()
  ],
  validateRequest,
  PersonnelController.updateEmployee
);

router.delete('/employees/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  PersonnelController.deleteEmployee
);

router.patch('/employees/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('employee_ids').isArray().notEmpty(),
    body('employee_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  PersonnelController.bulkUpdateEmployees
);

router.delete('/employees/bulk-delete',
  [
    query('foundation_id').isUUID(),
    body('employee_ids').isArray().notEmpty(),
    body('employee_ids.*').isUUID()
  ],
  validateRequest,
  PersonnelController.bulkDeleteEmployees
);

// Employee Address Routes
router.get('/employees/:employee_id/addresses',
  [
    param('employee_id').isUUID()
  ],
  validateRequest,
  PersonnelController.getEmployeeAddresses
);

router.post('/employees/:employee_id/addresses',
  [
    param('employee_id').isUUID(),
    body('address_type').optional().isString(),
    body('street_address').optional().isString(),
    body('city').optional().isString(),
    body('postal_code').optional().isString(),
    body('country').optional().isString(),
    body('is_primary').optional().isBoolean()
  ],
  validateRequest,
  PersonnelController.createEmployeeAddress
);

// Employee Holiday Routes
router.get('/employees/:employee_id/holidays',
  [
    param('employee_id').isUUID(),
    query('year').optional().isInt()
  ],
  validateRequest,
  PersonnelController.getEmployeeHolidays
);

router.post('/employees/:employee_id/holidays',
  [
    param('employee_id').isUUID(),
    body('year').isInt(),
    body('total_days').optional().isInt(),
    body('used_days').optional().isInt()
  ],
  validateRequest,
  PersonnelController.createEmployeeHoliday
);

router.put('/holidays/:id',
  [
    param('id').isUUID(),
    body('total_days').isInt(),
    body('used_days').isInt()
  ],
  validateRequest,
  PersonnelController.updateEmployeeHoliday
);

export default router;
