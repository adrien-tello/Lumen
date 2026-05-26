import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { categoriesService } from './categories.service';

export const categoriesController = {
  list: asyncHandler(async (_req: Request, res: Response) => {
    const data = await categoriesService.list();
    res.json({ success: true, data });
  }),
  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const data = await categoriesService.getBySlug(req.params.slug);
    res.json({ success: true, data });
  }),
};
