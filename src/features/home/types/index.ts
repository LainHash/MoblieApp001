import { BranchResponse } from '@/features/branches';
import {
  BrandResponse,
  ProductCategoryResponse,
  ProductResponse,
} from '@/features/catalog';

export interface HomeResponse {
  products: ProductResponse[];
  brands: BrandResponse[];
  productCategories: ProductCategoryResponse[];
  branches: BranchResponse[];
}
