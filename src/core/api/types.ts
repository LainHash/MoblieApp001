/**
 * Định dạng phản hồi chuẩn bọc từ RestaurantService .NET Backend (Result<T>)
 */
export interface ApiResponse<T = void> {
  isSucceed: boolean;
  message: string;
  statusCode: number;
  data: T;
}

/**
 * Định dạng phản hồi phân trang từ Backend (PaginationResult<T>)
 */
export interface PaginationResult<T> extends ApiResponse<T> {
  totalItems: number;
  totalPages: number;
  indexPage: number;
  pageSize: number;
}

/**
 * Các tham số truy vấn phân trang gửi lên Backend (PaginationQuery)
 */
export interface PaginationParams {
  keyword?: string;
  sortField?: string;
  isAscending?: boolean;
  page?: number;
  pageSize?: number;
}

/**
 * Lớp lỗi chuẩn hóa khi gọi API
 */
export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(message: string, statusCode = 500, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}
