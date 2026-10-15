import { useCallback, useEffect, useState } from 'react';
import { cartService } from '../services/cart.service';
import { CartItemResponse } from '../types';

export function useCart(branchId?: string) {
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cart = await cartService.getCart(branchId);
      setItems(cart?.cartItems || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const cart = await cartService.getCart(branchId);
        if (!ignore) {
          setItems(cart?.cartItems || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải giỏ hàng');
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

  const addItem = async (productId: string) => {
    try {
      setError(null);
      const updatedCart = await cartService.addItem({ productId });
      setItems(updatedCart?.cartItems || []);
      return updatedCart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể thêm vào giỏ hàng');
      throw err;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setError(null);
      if (quantity <= 0) {
        return await removeItem(productId);
      }
      const updatedCart = await cartService.updateQuantity({ productId, quantity });
      setItems(updatedCart?.cartItems || []);
      return updatedCart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật số lượng');
      throw err;
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setError(null);
      const updatedCart = await cartService.removeItem({ productId });
      setItems(updatedCart?.cartItems || []);
      return updatedCart;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa món khỏi giỏ hàng');
      throw err;
    }
  };

  const totalItemsCount = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  const subtotal = items.reduce(
    (sum, it) => sum + (it.product?.unitPrice || 0) * (it.quantity || 0),
    0
  );

  return {
    items,
    totalItemsCount,
    subtotal,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    refetch: fetchCart,
  };
}
