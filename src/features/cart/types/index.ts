import { ProductResponse } from '@/features/catalog';

export interface CartItemResponse {
  id: string;
  product: ProductResponse;
  quantity: number;
}

export interface CartResponse {
  id: string;
  cartItems: CartItemResponse[];
}

export interface AddCartItemRequest {
  productId: string;
}

export interface UpdateCartItemQuantityRequest {
  productId: string;
  quantity: number;
}

export interface RemoveCartItemRequest {
  productId: string;
}
