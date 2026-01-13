import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { jwtAuthMiddleware } from '../middleware/jwtAuth';

const router = Router();

// All routes are protected by JWT authentication
router.use(jwtAuthMiddleware);

// Item routes
router.post('/', ItemController.createItem);
router.get('/', ItemController.getItems);
router.get('/:id', ItemController.getItemById);
router.put('/:id', ItemController.updateItem);
router.delete('/:id', ItemController.deleteItem);

export default router;
