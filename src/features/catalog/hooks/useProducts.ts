import { useCallback, useEffect, useState } from 'react';
import { catalogService } from '../services/catalog.service';
import { GetAllProductsParams, ProductResponse } from '../types';

export function useProducts(initialParams?: GetAllProductsParams) {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(initialParams?.page || 1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (params?: GetAllProductsParams) => {
      try {
        setIsLoading(true);
        setError(null);
        const queryParams: GetAllProductsParams = {
          pageSize: 20,
          ...initialParams,
          ...params,
        };
        const res = await catalogService.getProducts(queryParams);
        setProducts(res.data || []);
        setTotalItems(res.totalItems || 0);
        setTotalPages(res.totalPages || 1);
        setPage(res.indexPage || 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách món ăn');
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      initialParams?.categoryId,
      initialParams?.brandId,
      initialParams?.branchId,
      initialParams?.keyword,
    ]
  );

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const queryParams: GetAllProductsParams = {
          pageSize: 20,
          ...initialParams,
        };
        const res = await catalogService.getProducts(queryParams);
        if (!ignore) {
          setProducts(res.data || []);
          setTotalItems(res.totalItems || 0);
          setTotalPages(res.totalPages || 1);
          setPage(res.indexPage || 1);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải danh sách món ăn');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialParams?.categoryId,
    initialParams?.brandId,
    initialParams?.branchId,
    initialParams?.keyword,
  ]);

  return {
    products,
    totalItems,
    totalPages,
    page,
    isLoading,
    error,
    refetch: fetchProducts,
    setPage,
  };
}
