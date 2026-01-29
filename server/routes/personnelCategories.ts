import { Router } from 'express';
import { PersonnelCategoriesController } from '../controllers/personnelCategoriesController';

const router = Router();

/**
 * @route GET /api/personnel-categories
 * @desc Get all personnel categories for a foundation
 * @access Private
 */
router.get('/', PersonnelCategoriesController.list);

/**
 * @route GET /api/personnel-categories/:id
 * @desc Get a specific personnel category
 * @access Private
 */
router.get('/:id', PersonnelCategoriesController.getById);

/**
 * @route POST /api/personnel-categories
 * @desc Create a new personnel category
 * @access Private
 */
router.post('/', PersonnelCategoriesController.create);

/**
 * @route PUT /api/personnel-categories/:id
 * @desc Update a personnel category
 * @access Private
 */
router.put('/:id', PersonnelCategoriesController.update);

/**
 * @route DELETE /api/personnel-categories/:id
 * @desc Delete a personnel category
 * @access Private
 */
router.delete('/:id', PersonnelCategoriesController.delete);

export default router;