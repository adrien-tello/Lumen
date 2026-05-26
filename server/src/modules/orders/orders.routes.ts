import { Router } from 'express';
import { ordersController } from './orders.controller';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { checkoutSchema } from './orders.schema';

const router = Router();
router.use(requireAuth);

router.post('/checkout', validate(checkoutSchema), ordersController.checkout);
router.get('/', ordersController.list);
router.get('/:id', ordersController.getById);

export default router;
