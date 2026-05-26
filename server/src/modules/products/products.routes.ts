import { Router } from 'express';
import { productsController } from './products.controller';
import { validate } from '../../middleware/validate';
import { requireAuth, requireRole } from '../../middleware/auth';
import {
  listProductsSchema,
  productSlugSchema,
  createProductSchema,
  updateProductSchema,
} from './products.schema';

const router = Router();

// Public
router.get('/', validate(listProductsSchema), productsController.list);
router.get('/:slug', validate(productSlugSchema), productsController.getBySlug);

// Admin-only
router.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validate(createProductSchema),
  productsController.create,
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validate(updateProductSchema),
  productsController.update,
);
router.delete('/:id', requireAuth, requireRole('ADMIN'), productsController.remove);

export default router;
