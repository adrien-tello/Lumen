import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiError } from '../../utils/ApiError';
import { ordersService } from './orders.service';

const uid = (req: Request) => {
  if (!req.user) throw ApiError.unauthorized();
  return req.user.userId;
};

export const ordersController = {
  checkout: asyncHandler(async (req: Request, res: Response) => {
    const order = await ordersService.checkout(uid(req), req.body);
    res.status(201).json({ success: true, data: order });
  }),
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json({ success: true, data: await ordersService.listForUser(uid(req)) });
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const order = await ordersService.getById(uid(req), req.params.id);
    res.json({ success: true, data: order });
  }),
};
