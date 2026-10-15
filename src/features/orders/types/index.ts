import { PaginationParams } from '@/core/api';

export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Processing = 2,
  ReadyForPickup = 3,
  Delivering = 4,
  Completed = 5,
  Cancelled = 6,
}

export enum OrderType {
  DineIn = 0,
  TakeAway = 1,
  Delivery = 2,
}

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
  note?: string;
}

export interface CreateDeliveryOrderRequest {
  branchId: string;
  deliveryAddress: string;
  note?: string;
  deliveryFee?: number;
  items?: CreateOrderItemRequest[];
}

export interface PaymentQrResponse {
  provider: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  transferContent: string;
  qrCodeUrl: string;
  expiresAt: string;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  total: number;
  note?: string;
}

export interface OrderDetailResponse {
  id: string;
  orderCode: string;
  customerId?: string;
  customerName?: string;
  branchId: string;
  branchCode?: string;
  status: OrderStatus;
  type: OrderType;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  note?: string;
  deliveryAddress?: string;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
  orderItems?: OrderItemResponse[];
}

export interface DeliveryOrderCheckoutResponse {
  order: OrderDetailResponse;
  payment: PaymentQrResponse;
}

export interface OrderPaymentStatusResponse {
  orderId: string;
  orderCode: string;
  status: OrderStatus;
  isPaid: boolean;
  totalAmount: number;
  paidAt?: string;
}

export interface OrderResponse {
  id: string;
  orderCode: string;
  customerId?: string;
  customerName?: string;
  branchId: string;
  branchCode?: string;
  status: OrderStatus;
  type: OrderType;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
  note?: string;
  deliveryAddress?: string;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllOrdersParams extends PaginationParams {
  status?: OrderStatus;
  branchId?: string;
}
