import { useMutation, useQuery } from '@tanstack/react-query';
import { Order, CreateOrderPayload } from '../types';
import * as api from '../api/orders';

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => api.createOrder(payload),
  });
}

export function useGetOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => (id ? api.getOrder(id) : Promise.reject(new Error('No order ID'))),
    enabled: !!id,
  });
}
