/**
 * Cấu hình biến môi trường toàn cục cho MobileApp
 */
export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    process.env.EXPO_API_BASE_URL ||
    'https://api-restaurantservice-00i7.onrender.com',
} as const;
