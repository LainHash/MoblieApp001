/**
 * Danh sách toàn bộ Endpoint của RestaurantService Backend
 */
export const ENDPOINTS = {
  GENERAL: {
    HOME: 'api/home',
    ROOT: '',
  },
  AUTH: {
    LOGIN: 'api/Authentication/login',
    REGISTER: 'api/Authentication/register',
    VERIFY_EMAIL: 'api/Authentication/verify-email',
    RESEND_VERIFICATION: 'api/Authentication/resend-verification',
    FORGOT_PASSWORD: 'api/Authentication/forgot-password',
    RESET_PASSWORD: 'api/Authentication/reset-password',
    VERIFY_RESET_OTP: 'api/Authentication/verify-reset-otp',
    CHANGE_PASSWORD: 'api/Authentication/me/change-password',
    LOGOUT: 'api/Authentication/logout',
    LOGOUT_ALL: 'api/Authentication/logout-all',
    REFRESH: 'api/Authentication/refresh',
    ME: 'api/Authentication/me',
    UPDATE_PROFILE: 'api/Authentication/me/profile',
  },
  CATALOG: {
    PRODUCTS: 'api/catalog/Products',
    PRODUCT_BY_ID: (id: string) => `api/catalog/Products/${id}`,
    CATEGORIES: 'api/catalog/categories',
    CATEGORY_BY_ID: (id: string) => `api/catalog/categories/${id}`,
    BRANDS: 'api/catalog/brands',
    UNITS: 'api/catalog/units',
  },
  COMMERCE: {
    CART: 'api/commerce/carts',
    CART_ITEMS: 'api/commerce/carts/items',
    CART_QUANTITY: 'api/commerce/carts/items/quantity',
    WISHLIST: 'api/commerce/wishlists',
    WISHLIST_ITEMS: 'api/commerce/wishlists/items',
    WISHLIST_MOVE_ALL: 'api/commerce/wishlists/move-all-to-cart',
  },
  SALE: {
    ORDERS: 'api/sale/Orders',
    ORDER_BY_ID: (id: string) => `api/sale/Orders/${id}`,
    CHECKOUT: 'api/sale/Orders/checkout',
    PAYMENT_STATUS: (id: string) => `api/sale/Orders/${id}/payment-status`,
    CANCEL_ORDER: (id: string) => `api/sale/Orders/${id}/cancel`,
  },
  TERRITORY: {
    BRANCHES: 'api/territory/Branches',
    BRANCH_BY_ID: (id: string) => `api/territory/Branches/${id}`,
    AREAS: 'api/territory/Areas',
    TABLES: 'api/territory/RestaurantTables',
  },
  STORAGE: {
    IMAGES: 'api/storage/Images',
  },
} as const;
