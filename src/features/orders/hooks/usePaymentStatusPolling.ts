import { useEffect, useRef, useState } from 'react';
import { ordersService } from '../services/orders.service';
import { OrderPaymentStatusResponse } from '../types';

interface UsePaymentStatusPollingOptions {
  orderId?: string;
  intervalMs?: number;
  maxAttempts?: number;
  enabled?: boolean;
  onSuccess?: (status: OrderPaymentStatusResponse) => void;
}

export function usePaymentStatusPolling({
  orderId,
  intervalMs = 3000,
  maxAttempts = 100, // Tối đa 5 phút
  enabled = true,
  onSuccess,
}: UsePaymentStatusPollingOptions) {
  const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatusResponse | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isPolling, setIsPolling] = useState<boolean>(Boolean(orderId && enabled));
  const attemptsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!orderId || !enabled || isPaid) {
      return;
    }

    attemptsRef.current = 0;
    let ignore = false;

    const checkStatus = async () => {
      try {
        attemptsRef.current += 1;
        const res = await ordersService.getPaymentStatus(orderId);
        if (ignore) return;

        setPaymentStatus(res);

        if (res.isPaid) {
          setIsPaid(true);
          setIsPolling(false);
          onSuccess?.(res);
          return;
        }

        if (attemptsRef.current >= maxAttempts) {
          setIsPolling(false);
          return;
        }

        timerRef.current = setTimeout(checkStatus, intervalMs);
      } catch {
        if (ignore) return;
        if (attemptsRef.current < maxAttempts) {
          timerRef.current = setTimeout(checkStatus, intervalMs);
        } else {
          setIsPolling(false);
        }
      }
    };

    checkStatus();

    return () => {
      ignore = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [orderId, enabled, isPaid, intervalMs, maxAttempts, onSuccess]);

  return {
    paymentStatus,
    isPaid,
    isPolling,
  };
}
