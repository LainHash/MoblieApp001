import { useCallback, useEffect, useState } from 'react';
import { wishlistService } from '../services/wishlist.service';
import { WishlistItemResponse } from '../types';

export function useWishlist(branchId?: string) {
  const [items, setItems] = useState<WishlistItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await wishlistService.getWishlist(branchId);
      setItems(res?.wishlistItems || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách yêu thích');
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await wishlistService.getWishlist(branchId);
        if (!ignore) {
          setItems(res?.wishlistItems || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách yêu thích');
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

  const isFavorite = useCallback(
    (productId: string) => {
      return items.some((it) => it.product?.id === productId);
    },
    [items]
  );

  const toggleFavorite = async (productId: string) => {
    try {
      setError(null);
      if (isFavorite(productId)) {
        const res = await wishlistService.removeItem({ productId });
        setItems(res?.wishlistItems || []);
      } else {
        const res = await wishlistService.addItem({ productId });
        setItems(res?.wishlistItems || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thao tác yêu thích thất bại');
      throw err;
    }
  };

  const moveAllToCart = async () => {
    try {
      setError(null);
      await wishlistService.moveAllToCart();
      await fetchWishlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể chuyển vào giỏ hàng');
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    moveAllToCart,
    refetch: fetchWishlist,
  };
}
