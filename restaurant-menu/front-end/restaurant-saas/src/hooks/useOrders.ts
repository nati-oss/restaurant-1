import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/services/api';
import type { CreateOrderPayload } from '@/types';

export function useOrder(id: string | number | undefined) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
    refetchInterval: 10_000, // poll every 10s for status updates
  });
}

export function useOrders(params?: { status?: string; restaurant?: number }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.list(params),
    refetchInterval: 15_000,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      estimated_time,
    }: {
      id: number;
      status: string;
      estimated_time?: number;
    }) => ordersApi.updateStatus(id, status, estimated_time),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.setQueryData(['order', String(data.id)], data);
    },
  });
}
