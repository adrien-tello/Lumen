import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { productsService } from './products.service';
import type { ListProductsQuery } from './products.schema';

export const productsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await productsService.list(req.query as unknown as ListProductsQuery);
    res.json({ success: true, ...result });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.getBySlug(req.params.slug);
    res.json({ success: true, data: product });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.create(req.body);
    res.status(201).json({ success: true, data: product });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const product = await productsService.update(req.params.id, req.body);
    res.json({ success: true, data: product });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await productsService.remove(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  }),
};
