import { useCallback, useEffect, useState } from 'react';
import { tokenStorage } from '@/core/storage';
import { authService } from '../services/auth.service';
import { AuthenticationResponse, LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const [user, setUser] = useState<AuthenticationResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      setIsAuthenticated(Boolean(token));
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const token = await tokenStorage.getAccessToken();
        if (!ignore) {
          setIsAuthenticated(Boolean(token));
        }
      } catch {
        if (!ignore) {
          setIsAuthenticated(false);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, []);

  const login = async (payload: LoginRequest): Promise<AuthenticationResponse> => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authService.login(payload);
      setUser(res);
      setIsAuthenticated(true);
      return res;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng nhập không thành công';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.register(payload);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đăng ký không thành công';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };
}
