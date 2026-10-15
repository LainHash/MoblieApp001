import { apiClient, ENDPOINTS, PaginationResult } from '@/core/api';
import {
  CreateDeliveryOrderRequest,
  DeliveryOrderCheckoutResponse,
  GetAllOrdersParams,
  OrderDetailResponse,
  OrderPaymentStatusResponse,
  OrderResponse,
} from '../types';

export const ordersService = {
  /**
   * Tạo đơn hàng giao tận nơi và lấy thông tin thanh toán VietQR (SePay)
   */
  async checkout(
    payload: CreateDeliveryOrderRequest
  ): Promise<DeliveryOrderCheckoutResponse> {
    const res = await apiClient.post<DeliveryOrderCheckoutResponse>(
      ENDPOINTS.SALE.CHECKOUT,
      payload
    );
    return res.data;
  },

  /**
   * Lấy danh sách lịch sử đơn hàng có phân trang
   */
  async getOrders(
    params?: GetAllOrdersParams
  ): Promise<PaginationResult<OrderResponse[]>> {
    const res = await apiClient.get<OrderResponse[]>(
      ENDPOINTS.SALE.ORDERS,
      params as Record<string, unknown>
    );
    return res as PaginationResult<OrderResponse[]>;
  },

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  async getOrderById(id: string): Promise<OrderDetailResponse> {
    const res = await apiClient.get<OrderDetailResponse>(
      ENDPOINTS.SALE.ORDER_BY_ID(id)
    );
    return res.data;
  },

  /**
   * Kiểm tra trạng thái thanh toán của đơn hàng (dùng để polling sau khi quét mã QR)
   */
  async getPaymentStatus(id: string): Promise<OrderPaymentStatusResponse> {
    const res = await apiClient.get<OrderPaymentStatusResponse>(
      ENDPOINTS.SALE.PAYMENT_STATUS(id)
    );
    return res.data;
  },

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(id: string): Promise<void> {
    await apiClient.post(ENDPOINTS.SALE.CANCEL_ORDER(id));
  },
};
