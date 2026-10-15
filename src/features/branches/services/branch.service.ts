import { apiClient, ENDPOINTS, PaginationParams, PaginationResult } from '@/core/api';
import { BranchResponse } from '../types';

export const branchService = {
  /**
   * Lấy danh sách các chi nhánh nhà hàng
   */
  async getBranches(
    params?: PaginationParams
  ): Promise<PaginationResult<BranchResponse[]>> {
    const res = await apiClient.get<BranchResponse[]>(
      ENDPOINTS.TERRITORY.BRANCHES,
      params as Record<string, unknown>
    );
    return res as PaginationResult<BranchResponse[]>;
  },

  /**
   * Lấy chi tiết thông tin một chi nhánh theo ID
   */
  async getBranchById(id: string): Promise<BranchResponse> {
    const res = await apiClient.get<BranchResponse>(
      ENDPOINTS.TERRITORY.BRANCH_BY_ID(id)
    );
    return res.data;
  },
};
