import { apiClient, ENDPOINTS } from '@/core/api';
import { tokenStorage } from '@/core/storage';
import {
  AuthenticationResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyPasswordResetOtpRequest,
  VerifyPasswordResetOtpResponse,
} from '../types';

export const authService = {
  /**
   * Đăng nhập tài khoản bằng Email/Username và Mật khẩu
   */
  async login(payload: LoginRequest): Promise<AuthenticationResponse> {
    const res = await apiClient.post<AuthenticationResponse>(
      ENDPOINTS.AUTH.LOGIN,
      payload,
      { skipAuth: true }
    );

    if (res.data?.token && res.data?.refreshToken) {
      await tokenStorage.setTokens(res.data.token, res.data.refreshToken);
    }

    return res.data;
  },

  /**
   * Đăng ký tài khoản mới
   */
  async register(payload: RegisterRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.REGISTER, payload, { skipAuth: true });
  },

  /**
   * Xác thực mã OTP gửi về Email khi đăng ký
   */
  async verifyEmail(payload: VerifyEmailRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, payload, { skipAuth: true });
  },

  /**
   * Gửi lại mã OTP kích hoạt tài khoản
   */
  async resendVerification(email: string): Promise<void> {
    await apiClient.post(
      ENDPOINTS.AUTH.RESEND_VERIFICATION,
      { email },
      { skipAuth: true }
    );
  },

  /**
   * Yêu cầu gửi OTP quên mật khẩu
   */
  async forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, payload, { skipAuth: true });
  },

  /**
   * Xác thực mã OTP quên mật khẩu và nhận resetToken
   */
  async verifyResetOtp(
    payload: VerifyPasswordResetOtpRequest
  ): Promise<VerifyPasswordResetOtpResponse> {
    const res = await apiClient.post<VerifyPasswordResetOtpResponse>(
      ENDPOINTS.AUTH.VERIFY_RESET_OTP,
      payload,
      { skipAuth: true }
    );
    return res.data;
  },

  /**
   * Đặt lại mật khẩu mới bằng resetToken
   */
  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload, { skipAuth: true });
  },

  /**
   * Đổi mật khẩu cho người dùng hiện tại (yêu cầu Bearer Token)
   */
  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, payload);
  },

  /**
   * Đăng xuất tài khoản và xóa Token lưu trữ
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        await apiClient.post(ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch {
      // Bỏ qua lỗi server khi logout để đảm bảo client luôn sạch
    } finally {
      await tokenStorage.clearTokens();
    }
  },
};
