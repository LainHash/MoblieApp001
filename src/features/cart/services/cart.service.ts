import { apiClient, ENDPOINTS } from '@/core/api';
import {
  AddCartItemRequest,
  CartResponse,
  RemoveCartItemRequest,
  UpdateCartItemQuantityRequest,
} from '../types';

export const cartService = {
  /**
   * Lấy giỏ hàng hiện tại (hỗ trợ cả khách vãng lai qua X-Session-Id lẫn người dùng đăng nhập)
   */
  async getCart(branchId?: string): Promise<CartResponse> {
    const res = await apiClient.get<CartResponse>(ENDPOINTS.COMMERCE.CART, {
      branchId,
    });
    return res.data;
  },

  /**
   * Thêm một món vào giỏ hàng
   */
  async addItem(payload: AddCartItemRequest): Promise<CartResponse> {
    const res = await apiClient.post<CartResponse>(
      ENDPOINTS.COMMERCE.CART_ITEMS,
      payload
    );
    return res.data;
  },

  /**
   * Cập nhật số lượng của một món trong giỏ hàng
   */
  async updateQuantity(
    payload: UpdateCartItemQuantityRequest
  ): Promise<CartResponse> {
    const res = await apiClient.put<CartResponse>(
      ENDPOINTS.COMMERCE.CART_QUANTITY,
      payload
    );
    return res.data;
  },

  /**
   * Xóa một món khỏi giỏ hàng
   */
  async removeItem(payload: RemoveCartItemRequest): Promise<CartResponse> {
    const res = await apiClient.delete<CartResponse>(
      ENDPOINTS.COMMERCE.CART_ITEMS,
      payload
    );
    return res.data;
  },
};
