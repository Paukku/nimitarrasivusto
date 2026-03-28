import { CreateOrderSchema, Order } from '../types';

const API_URL = '/api';

export async function createOrder(payload: CreateOrderSchema): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Tilauksen luominen epäonnistui');
  }

  return response.json();
}

export async function getOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Tilauksen haku epäonnistui');
  }

  return response.json();
}
