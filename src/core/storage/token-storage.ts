import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS_TOKEN_KEY = 'artisan_access_token';
const REFRESH_TOKEN_KEY = 'artisan_refresh_token';

let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    if (memoryAccessToken) return memoryAccessToken;
    try {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      memoryAccessToken = token;
      return token;
    } catch {
      return memoryAccessToken;
    }
  },

  async setAccessToken(token: string | null): Promise<void> {
    memoryAccessToken = token;
    try {
      if (token) {
        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    } catch {
      // In-memory fallback
    }
  },

  async getRefreshToken(): Promise<string | null> {
    if (memoryRefreshToken) return memoryRefreshToken;
    try {
      const token = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      memoryRefreshToken = token;
      return token;
    } catch {
      return memoryRefreshToken;
    }
  },

  async setRefreshToken(token: string | null): Promise<void> {
    memoryRefreshToken = token;
    try {
      if (token) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
      } else {
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch {
      // In-memory fallback
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.setAccessToken(accessToken),
      this.setRefreshToken(refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      this.setAccessToken(null),
      this.setRefreshToken(null),
    ]);
  },
};
