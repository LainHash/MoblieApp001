import { ProductResponse } from '@/features/catalog';

export interface WishlistItemResponse {
  id: string;
  product: ProductResponse;
}

export interface WishlistResponse {
  id: string;
  wishlistItems: WishlistItemResponse[];
}

export interface AddWishlistItemRequest {
  productId: string;
}

export interface RemoveWishlistItemRequest {
  productId: string;
}
