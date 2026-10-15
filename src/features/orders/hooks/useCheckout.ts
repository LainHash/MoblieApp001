import { useState } from 'react';
import { ordersService } from '../services/orders.service';
import {
  CreateDeliveryOrderRequest,
  DeliveryOrderCheckoutResponse,
} from '../types';

export function useCheckout() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = async (
    payload: CreateDeliveryOrderRequest
  ): Promise<DeliveryOrderCheckoutResponse> => {
    try {
      setIsSubmitting(true);
      setError(null);
      const res = await ordersService.checkout(payload);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đặt hàng không thành công';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOrder,
    isSubmitting,
    error,
  };
}
