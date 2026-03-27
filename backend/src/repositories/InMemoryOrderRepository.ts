import { v4 as uuid } from 'uuid';
import { IOrderRepository, CreateOrderPayload } from './IOrderRepository';
import { Order, OrderStatus } from '../types';

export class InMemoryOrderRepository implements IOrderRepository {
  private store = new Map<string, Order>();

  async createOrder(data: CreateOrderPayload): Promise<Order> {
    const order: Order = {
      id: uuid(),
      items: data.items,
      customerInfo: data.customerInfo,
      totalPrice: data.totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.store.set(order.id, order);

    return order;
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.store.get(id) ?? null;
  }
}
