import { apiClient, ENDPOINTS } from '@/core/api';
import {
  PersonalProfileResponse,
  UpdatePersonalProfileRequest,
  UserAccountResponse,
} from '../types';

export const userService = {
  /**
   * Lấy thông tin tài khoản hiện tại (id, email, username, role)
   */
  async getMe(): Promise<UserAccountResponse> {
    const res = await apiClient.get<UserAccountResponse>(ENDPOINTS.AUTH.ME);
    return res.data;
  },

  /**
   * Cập nhật thông tin hồ sơ cá nhân của người dùng hiện tại
   */
  async updateProfile(
    payload: UpdatePersonalProfileRequest
  ): Promise<PersonalProfileResponse> {
    const res = await apiClient.put<PersonalProfileResponse>(
      ENDPOINTS.AUTH.UPDATE_PROFILE,
      payload
    );
    return res.data;
  },
};
