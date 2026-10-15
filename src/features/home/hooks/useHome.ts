import { useCallback, useEffect, useState } from 'react';
import { homeService } from '../services/home.service';
import { HomeResponse } from '../types';

export function useHome(branchId?: string) {
  const [data, setData] = useState<HomeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHome = useCallback(
    async (refresh = false) => {
      try {
        if (refresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setError(null);
        const homeData = await homeService.getHomeData(branchId);
        setData(homeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu trang chủ');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [branchId]
  );

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const homeData = await homeService.getHomeData(branchId);
        if (!ignore) {
          setData(homeData);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu trang chủ');
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

  const onRefresh = () => {
    fetchHome(true);
  };

  return {
    data,
    products: data?.products || [],
    categories: data?.productCategories || [],
    brands: data?.brands || [],
    branches: data?.branches || [],
    isLoading,
    isRefreshing,
    error,
    refetch: fetchHome,
    onRefresh,
  };
}
