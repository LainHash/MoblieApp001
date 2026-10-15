import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '../config/env';
import { sessionStorage } from '../storage/session-storage';
import { tokenStorage } from '../storage/token-storage';
import { ENDPOINTS } from './endpoints';
import { ApiError, ApiResponse } from './types';

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
  _retry?: boolean;
}

class ApiClient {
  public instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    // eslint-disable-next-line import/no-named-as-default-member
    this.instance = axios.create({
      baseURL: ENV.API_BASE_URL.replace(/\/+$/, ''),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 300000,
    });

    this.setupInterceptors();
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  private setupInterceptors() {
    // 1. Request Interceptor: Tự động gắn Authorization và X-Session-Id
    this.instance.interceptors.request.use(
      async (config: ExtendedAxiosRequestConfig) => {
        // Luôn gắn X-Session-Id cho giỏ hàng và danh sách lưu
        const sessionId = await sessionStorage.getOrCreateSessionId();
        if (sessionId) {
          config.headers['X-Session-Id'] = sessionId;
        }

        // Gắn Bearer Token nếu có và không bị skipAuth
        if (!config.skipAuth) {
          const accessToken = await tokenStorage.getAccessToken();
          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: Xử lý 401 refresh token và kiểm tra ApiResponse
    this.instance.interceptors.response.use(
      (response) => {
        const data = response.data as ApiResponse<unknown>;
        if (data && typeof data.isSucceed === 'boolean' && !data.isSucceed) {
          throw new ApiError(
            data.message || 'Thao tác không thành công',
            data.statusCode || response.status,
            data.data
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        // Nếu gặp 401 và chưa từng retry
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !originalRequest.skipAuth
        ) {
          originalRequest._retry = true;
          const refreshToken = await tokenStorage.getRefreshToken();

          if (refreshToken) {
            if (!this.isRefreshing) {
              this.isRefreshing = true;

              try {
                const refreshRes = await axios.post<ApiResponse<{ token: string; refreshToken?: string }>>(
                  `${ENV.API_BASE_URL.replace(/\/+$/, '')}/${ENDPOINTS.AUTH.REFRESH}`,
                  { refreshToken },
                  { headers: { 'Content-Type': 'application/json' } }
                );

                const resData = refreshRes.data;
                if (resData?.isSucceed && resData?.data?.token) {
                  const newAccessToken = resData.data.token;
                  const newRefreshToken = resData.data.refreshToken || refreshToken;
                  await tokenStorage.setTokens(newAccessToken, newRefreshToken);
                  this.onRefreshed(newAccessToken);
                } else {
                  await tokenStorage.clearTokens();
                  throw new ApiError('Phiên đăng nhập đã hết hạn.', 401);
                }
              } catch {
                await tokenStorage.clearTokens();
                throw new ApiError('Phiên đăng nhập đã hết hạn.', 401);
              } finally {
                this.isRefreshing = false;
              }
            }

            return new Promise((resolve, reject) => {
              this.addRefreshSubscriber(async (newToken: string) => {
                try {
                  originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                  const retryRes = await this.instance(originalRequest);
                  resolve(retryRes);
                } catch (retryErr) {
                  reject(retryErr);
                }
              });
            });
          }
        }

        // Chuẩn hóa lỗi AxiosError thành ApiError
        const responseData = error.response?.data as { message?: string } | undefined;
        const msg =
          responseData?.message ||
          error.message ||
          `Lỗi yêu cầu (HTTP ${error.response?.status || 'Unknown'})`;

        return Promise.reject(
          new ApiError(msg, error.response?.status || 0, error.response?.data)
        );
      }
    );
  }

  async get<T>(
    path: string,
    params?: Record<string, unknown>,
    options?: { skipAuth?: boolean; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const res = await this.instance.get<ApiResponse<T>>(path, {
      params,
      ...options,
    } as ExtendedAxiosRequestConfig);
    return res.data;
  }

  async post<T>(
    path: string,
    body?: unknown,
    options?: { skipAuth?: boolean; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const res = await this.instance.post<ApiResponse<T>>(path, body, options as ExtendedAxiosRequestConfig);
    return res.data;
  }

  async put<T>(
    path: string,
    body?: unknown,
    options?: { skipAuth?: boolean; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const res = await this.instance.put<ApiResponse<T>>(path, body, options as ExtendedAxiosRequestConfig);
    return res.data;
  }

  async patch<T>(
    path: string,
    body?: unknown,
    options?: { skipAuth?: boolean; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const res = await this.instance.patch<ApiResponse<T>>(path, body, options as ExtendedAxiosRequestConfig);
    return res.data;
  }

  async delete<T>(
    path: string,
    body?: unknown,
    options?: { skipAuth?: boolean; headers?: Record<string, string> }
  ): Promise<ApiResponse<T>> {
    const res = await this.instance.delete<ApiResponse<T>>(path, {
      data: body,
      ...options,
    } as ExtendedAxiosRequestConfig);
    return res.data;
  }
}

export const apiClient = new ApiClient();
