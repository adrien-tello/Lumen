import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { cartService } from './cart.service';

const uid = (req: Request) => {
  if (!req.user) throw ApiError.unauthorized();
  return req.user.userId;
};

export const cartController = {
  get: asyncHandler(async (req: Request, res: Response) => {
    res.json({ success: true, data: await cartService.get(uid(req)) });
  }),
  addItem: asyncHandler(async (req: Request, res: Response) => {
    const data = await cartService.addItem(uid(req), req.body.productId, req.body.quantity);
    res.status(201).json({ success: true, data });
  }),
  updateItem: asyncHandler(async (req: Request, res: Response) => {
    const data = await cartService.updateItem(uid(req), req.params.productId, req.body.quantity);
    res.json({ success: true, data });
  }),
  removeItem: asyncHandler(async (req: Request, res: Response) => {
    const data = await cartService.removeItem(uid(req), req.params.productId);
    res.json({ success: true, data });
  }),
  clear: asyncHandler(async (req: Request, res: Response) => {
    res.json({ success: true, data: await cartService.clear(uid(req)) });
  }),
};
