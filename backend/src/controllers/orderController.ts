import { Request, Response, NextFunction } from 'express';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { createOrder as createOrderService, getOrderById as getOrderByIdService } from '../services/orderService';

export function createOrderHandler(repository: IOrderRepository) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items, customerInfo } = req.body;

      const order = await createOrderService({ items, customerInfo }, repository);

      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };
}

export function getOrderByIdHandler(repository: IOrderRepository) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = String(req.params.id);
      const order = await getOrderByIdService(id, repository);
      return res.status(200).json(order);
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: 'Order not found' });
      }
      next(error);
    }
  };
}
