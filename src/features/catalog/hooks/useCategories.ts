import { useCallback, useEffect, useState } from 'react';
import { catalogService } from '../services/catalog.service';
import { ProductCategoryResponse } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<ProductCategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await catalogService.getCategories({ pageSize: 50 });
      setCategories(res.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh mục món');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await catalogService.getCategories({ pageSize: 50 });
        if (!ignore) {
          setCategories(res.data || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh mục món');
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
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}
