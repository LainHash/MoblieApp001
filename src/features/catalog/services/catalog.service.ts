import { apiClient, ENDPOINTS, PaginationParams, PaginationResult } from '@/core/api';
import {
  BrandResponse,
  GetAllProductsParams,
  ProductCategoryResponse,
  ProductDetailResponse,
  ProductResponse,
} from '../types';

export const catalogService = {
  /**
   * Lấy danh sách sản phẩm theo bộ lọc (category, brand, branch, search keyword, paging)
   */
  async getProducts(
    params?: GetAllProductsParams
  ): Promise<PaginationResult<ProductResponse[]>> {
    const res = await apiClient.get<ProductResponse[]>(
      ENDPOINTS.CATALOG.PRODUCTS,
      params as Record<string, unknown>
    );
    return res as PaginationResult<ProductResponse[]>;
  },

  /**
   * Lấy chi tiết món ăn theo ID (kèm slider ảnh & công thức nếu có)
   */
  async getProductById(id: string, branchId?: string): Promise<ProductDetailResponse> {
    const res = await apiClient.get<ProductDetailResponse>(
      ENDPOINTS.CATALOG.PRODUCT_BY_ID(id),
      { branchId }
    );
    return res.data;
  },

  /**
   * Lấy danh mục món ăn (Pizza, Burger, v.v.)
   */
  async getCategories(
    params?: PaginationParams
  ): Promise<PaginationResult<ProductCategoryResponse[]>> {
    const res = await apiClient.get<ProductCategoryResponse[]>(
      ENDPOINTS.CATALOG.CATEGORIES,
      params as Record<string, unknown>
    );
    return res as PaginationResult<ProductCategoryResponse[]>;
  },

  /**
   * Lấy danh sách thương hiệu món
   */
  async getBrands(
    params?: PaginationParams
  ): Promise<PaginationResult<BrandResponse[]>> {
    const res = await apiClient.get<BrandResponse[]>(
      ENDPOINTS.CATALOG.BRANDS,
      params as Record<string, unknown>
    );
    return res as PaginationResult<BrandResponse[]>;
  },
};
