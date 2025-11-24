import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { WorkingHoursScheduleController } from '../controllers/WorkingHoursScheduleController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Working Hours Schedules Routes
router.get('/working-hours-schedules',
  [
    query('foundation_id').optional().isUUID(),
    query('status').optional().isIn(['all', 'active', 'inactive']),
    query('search').optional().isString()
  ],
  validateRequest,
  WorkingHoursScheduleController.getWorkingHoursSchedules
);

router.get('/working-hours-schedules/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  WorkingHoursScheduleController.getWorkingHoursScheduleById
);

router.post('/working-hours-schedules',
  [
    query('foundation_id').isUUID(),
    body('schema_id').notEmpty().isString(),
    body('name').notEmpty().isString(),
    body('schedule_length_in_days').optional().isInt(),
    body('number_of_obs').optional().isInt(),
    body('employment_rate').optional().isInt()
  ],
  validateRequest,
  WorkingHoursScheduleController.createWorkingHoursSchedule
);

router.put('/working-hours-schedules/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID(),
    body('schema_id').optional().isString(),
    body('name').optional().isString(),
    body('schedule_length_in_days').optional().isInt(),
    body('number_of_obs').optional().isInt(),
    body('employment_rate').optional().isInt(),
    body('is_active').optional().isBoolean()
  ],
  validateRequest,
  WorkingHoursScheduleController.updateWorkingHoursSchedule
);

router.delete('/working-hours-schedules/:id',
  [
    param('id').isUUID(),
    query('foundation_id').optional().isUUID()
  ],
  validateRequest,
  WorkingHoursScheduleController.deleteWorkingHoursSchedule
);

router.post('/working-hours-schedules/:id/copy',
  [
    param('id').isUUID(),
    query('foundation_id').isUUID(),
    body('name').optional().isString()
  ],
  validateRequest,
  WorkingHoursScheduleController.copyWorkingHoursSchedule
);

router.patch('/working-hours-schedules/bulk-update',
  [
    query('foundation_id').isUUID(),
    body('schedule_ids').isArray().notEmpty(),
    body('schedule_ids.*').isUUID(),
    body('is_active').isBoolean()
  ],
  validateRequest,
  WorkingHoursScheduleController.bulkUpdateWorkingHoursSchedules
);

router.post('/working-hours-schedules/import',
  [
    query('foundation_id').isUUID(),
    body('schedules').isArray().notEmpty(),
    body('schedules.*.schema_id').isString(),
    body('schedules.*.name').isString(),
    body('schedules.*.schedule_length_in_days').optional().isInt(),
    body('schedules.*.number_of_obs').optional().isInt(),
    body('schedules.*.employment_rate').optional().isInt()
  ],
  validateRequest,
  WorkingHoursScheduleController.importWorkingHoursSchedules
);

export default router;
