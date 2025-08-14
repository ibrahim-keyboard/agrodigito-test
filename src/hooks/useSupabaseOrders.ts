import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order } from '@/type/ecommerce';
import {
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  updateOrderStatus,
} from '@/services/orderService';

// Query keys for orders
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  status: (status: Order['status']) =>
    [...orderKeys.all, 'status', status] as const,
  recent: (limit?: number) => [...orderKeys.all, 'recent', limit] as const,
};

export function useSupabaseOrders() {
  const queryClient = useQueryClient();

  // Fetch all orders
  const ordersQuery = useQuery({
    queryKey: orderKeys.lists(),
    queryFn: getAllOrders,
    staleTime: 1000 * 60 * 2, // 2 minutes for orders
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({
      orderId,
      status,
      note,
    }: {
      orderId: string;
      status: Order['status'];
      note?: string;
    }) => updateOrderStatus(orderId, status, note),
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete order:', error);
    },
  });

  // Helper functions
  const getOrder = (orderId: string): Order | undefined => {
    return ordersQuery.data?.find((order) => order.id === orderId);
  };

  const getOrdersByStatus = (status: Order['status']): Order[] => {
    return ordersQuery.data?.filter((order) => order.status === status) || [];
  };

  const getRecentOrders = (limit: number = 10): Order[] => {
    return (
      ordersQuery.data
        ?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit) || []
    );
  };

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error?.message,
    refetch: ordersQuery.refetch,

    // Mutations
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    deleteOrder: deleteOrderMutation.mutateAsync,

    // Helper functions
    getOrder,
    getOrdersByStatus,
    getRecentOrders,
  };
}

// Hook for a single order
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for orders by status
export function useOrdersByStatus(status: Order['status']) {
  return useQuery({
    queryKey: orderKeys.status(status),
    queryFn: () => getOrdersByStatus(status),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook for recent orders
export function useRecentOrders(limit: number = 10) {
  return useQuery({
    queryKey: orderKeys.recent(limit),
    queryFn: async () => {
      const orders = await getAllOrders();
      return orders
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, limit);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
