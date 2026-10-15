import { useCallback, useEffect, useState } from 'react';
import { tokenStorage } from '@/core/storage';
import { userService } from '../services/user.service';
import {
  PersonalProfileResponse,
  UpdatePersonalProfileRequest,
  UserAccountResponse,
} from '../types';

export function useUserProfile() {
  const [user, setUser] = useState<UserAccountResponse | null>(null);
  const [profile, setProfile] = useState<PersonalProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        setUser(null);
        setProfile(null);
        return;
      }
      const userData = await userService.getMe();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const token = await tokenStorage.getAccessToken();
        if (!token) {
          if (!ignore) {
            setUser(null);
            setProfile(null);
          }
          return;
        }
        const userData = await userService.getMe();
        if (!ignore) {
          setUser(userData);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Không thể tải thông tin tài khoản');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  const updateProfile = async (
    payload: UpdatePersonalProfileRequest
  ): Promise<PersonalProfileResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const updated = await userService.updateProfile(payload);
      setProfile(updated);
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cập nhật hồ sơ thất bại';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
  };
}
