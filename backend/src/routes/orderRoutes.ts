import { Router } from 'express';
import { validateRequest, CreateOrderSchema } from '../middleware/validateRequest';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';
import { createOrderHandler, getOrderByIdHandler } from '../controllers/orderController';

const router = Router();
const repository = new InMemoryOrderRepository();

router.post('/', validateRequest(CreateOrderSchema), createOrderHandler(repository));
router.get('/:id', getOrderByIdHandler(repository));

export default router;
