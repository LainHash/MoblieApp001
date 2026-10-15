import { apiClient, ENDPOINTS } from '@/core/api';
import { HomeResponse } from '../types';

export const homeService = {
  /**
   * Lấy toàn bộ dữ liệu tổng hợp cho trang chủ (sản phẩm nổi bật, danh mục, thương hiệu, chi nhánh)
   */
  async getHomeData(branchId?: string): Promise<HomeResponse> {
    const res = await apiClient.get<HomeResponse>(ENDPOINTS.GENERAL.HOME, {
      branchId,
    });
    return res.data;
  },
};
