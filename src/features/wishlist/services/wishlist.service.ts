import { apiClient, ENDPOINTS } from '@/core/api';
import {
  AddWishlistItemRequest,
  RemoveWishlistItemRequest,
  WishlistResponse,
} from '../types';

export const wishlistService = {
  /**
   * Lấy danh sách các món ăn đã lưu / yêu thích
   */
  async getWishlist(branchId?: string): Promise<WishlistResponse> {
    const res = await apiClient.get<WishlistResponse>(
      ENDPOINTS.COMMERCE.WISHLIST,
      { branchId }
    );
    return res.data;
  },

  /**
   * Thêm món vào danh sách yêu thích
   */
  async addItem(payload: AddWishlistItemRequest): Promise<WishlistResponse> {
    const res = await apiClient.post<WishlistResponse>(
      ENDPOINTS.COMMERCE.WISHLIST_ITEMS,
      payload
    );
    return res.data;
  },

  /**
   * Xóa món khỏi danh sách yêu thích
   */
  async removeItem(payload: RemoveWishlistItemRequest): Promise<WishlistResponse> {
    const res = await apiClient.delete<WishlistResponse>(
      ENDPOINTS.COMMERCE.WISHLIST_ITEMS,
      payload
    );
    return res.data;
  },

  /**
   * Chuyển tất cả các món trong danh sách yêu thích vào giỏ hàng
   */
  async moveAllToCart(): Promise<void> {
    await apiClient.post(ENDPOINTS.COMMERCE.WISHLIST_MOVE_ALL);
  },
};
