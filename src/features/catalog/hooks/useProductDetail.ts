import { useCallback, useEffect, useState } from 'react';
import { catalogService } from '../services/catalog.service';
import { ProductDetailResponse } from '../types';

export function useProductDetail(productId?: string, branchId?: string) {
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await catalogService.getProductById(productId, branchId);
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải chi tiết món ăn');
    } finally {
      setIsLoading(false);
    }
  }, [productId, branchId]);

  useEffect(() => {
    let ignore = false;
    async function load() {
      if (!productId) {
        setProduct(null);
        setIsLoading(false);
        return;
      }

      try {
        const data = await catalogService.getProductById(productId, branchId);
        if (!ignore) {
          setProduct(data);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải chi tiết món ăn');
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
  }, [productId, branchId]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchDetail,
  };
}
