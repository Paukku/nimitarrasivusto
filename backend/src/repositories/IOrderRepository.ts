import { CustomerInfo, Order, OrderItem } from '../types';

export interface CreateOrderPayload {
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalPrice: number;
}

export interface IOrderRepository {
  createOrder(data: Omit<CreateOrderPayload, 'totalPrice'> & { totalPrice: number }): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
}
