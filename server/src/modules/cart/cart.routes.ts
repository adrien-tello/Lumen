import { Router } from 'express';
import { cartController } from './cart.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { addItemSchema, updateItemSchema } from './cart.schema';

const router = Router();

// Every cart route requires authentication.
router.use(requireAuth);

router.get('/', cartController.get);
router.post('/items', validate(addItemSchema), cartController.addItem);
router.patch('/items/:productId', validate(updateItemSchema), cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);
router.delete('/', cartController.clear);

export default router;
