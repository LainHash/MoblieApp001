import { PaginationParams } from '@/core/api';

export interface ImageDetail {
  id: string;
  altText: string;
  url: string;
}

export interface ProductImageResponse {
  id: string;
  displayOrder?: number;
  isPrimary?: boolean;
  image: ImageDetail;
}

export interface RecipeIngredientResponse {
  id: string;
  ingredientName: string;
  quantity: number;
  unitSymbol: string;
}

export interface RecipeResponse {
  id: string;
  name: string;
  instructions?: string;
  ingredients?: RecipeIngredientResponse[];
}

export enum StockStatus {
  OutOfStock = 0,
  InStock = 1,
  LowStock = 2,
}

export interface ProductResponse {
  id: string;
  name: string;
  description?: string;
  brandName?: string;
  categoryName: string;
  unitSymbol: string;
  unitPrice?: number;
  currency?: string;
  stockStatus: StockStatus;
  primaryImage?: ProductImageResponse;
}

export interface ProductDetailResponse extends ProductResponse {
  productImages: ProductImageResponse[];
  recipes: RecipeResponse[];
}

export interface ProductCategoryResponse {
  id: string;
  name: string;
  description?: string;
}

export interface BrandResponse {
  id: string;
  name: string;
  description?: string;
}

export interface GetAllProductsParams extends PaginationParams {
  categoryId?: string;
  brandId?: string;
  branchId?: string;
}
