import { useCallback, useEffect, useState } from 'react';
import { ordersService } from '../services/orders.service';
import { OrderResponse, OrderStatus } from '../types';

export type OrderTab = 'all' | 'active' | 'completed' | 'cancelled';

export function useOrders(initialTab: OrderTab = 'all', branchId?: string) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [activeTab, setActiveTab] = useState<OrderTab>(initialTab);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await ordersService.getOrders({
        branchId,
        pageSize: 50,
      });
      setOrders(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await ordersService.getOrders({
          branchId,
          pageSize: 50,
        });
        if (!ignore) {
          setOrders(res.data || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách đơn hàng');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [branchId]);

  const cancelOrder = async (orderId: string) => {
    try {
      setError(null);
      await ordersService.cancelOrder(orderId);
      await fetchOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hủy đơn hàng thất bại');
      throw err;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') {
      return (
        order.status === OrderStatus.Pending ||
        order.status === OrderStatus.Confirmed ||
        order.status === OrderStatus.Processing ||
        order.status === OrderStatus.ReadyForPickup ||
        order.status === OrderStatus.Delivering
      );
    }
    if (activeTab === 'completed') {
      return order.status === OrderStatus.Completed;
    }
    if (activeTab === 'cancelled') {
      return order.status === OrderStatus.Cancelled;
    }
    return true;
  });

  return {
    orders: filteredOrders,
    rawOrders: orders,
    activeTab,
    setActiveTab,
    isLoading,
    error,
    cancelOrder,
    refetch: fetchOrders,
  };
}
