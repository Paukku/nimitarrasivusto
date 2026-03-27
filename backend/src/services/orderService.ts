import { IOrderRepository } from '../repositories/IOrderRepository';
import { CartItem, CustomerInfo, Order, OrderItem } from '../types';

export const UNIT_PRICE = 10.0;

export function calculateTotalPrice(items: Array<Pick<OrderItem, 'quantity'>>): number {
  return items.reduce((sum, item) => sum + item.quantity * UNIT_PRICE, 0);
}

export async function createOrder(
  data: { items: OrderItem[]; customerInfo: CustomerInfo },
  repository: IOrderRepository
): Promise<Order> {
  const totalPrice = calculateTotalPrice(data.items.map((item) => ({ quantity: item.quantity })));

  return repository.createOrder({
    items: data.items,
    customerInfo: data.customerInfo,
    totalPrice,
  });
}

export async function getOrderById(id: string, repository: IOrderRepository): Promise<Order> {
  const order = await repository.getOrderById(id);
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
}
