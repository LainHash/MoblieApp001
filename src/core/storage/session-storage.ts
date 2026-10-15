import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_ID_KEY = 'artisan_session_id';
const ACTIVE_BRANCH_KEY = 'artisan_active_branch_id';

let memorySessionId: string | null = null;
let memoryBranchId: string | null = null;

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const sessionStorage = {
  async getOrCreateSessionId(): Promise<string> {
    if (memorySessionId) return memorySessionId;
    try {
      let sessionId = await AsyncStorage.getItem(SESSION_ID_KEY);
      if (!sessionId) {
        sessionId = generateUUID();
        await AsyncStorage.setItem(SESSION_ID_KEY, sessionId);
      }
      memorySessionId = sessionId;
      return sessionId;
    } catch {
      if (!memorySessionId) {
        memorySessionId = generateUUID();
      }
      return memorySessionId;
    }
  },

  async setSessionId(id: string): Promise<void> {
    memorySessionId = id;
    try {
      await AsyncStorage.setItem(SESSION_ID_KEY, id);
    } catch {
      // fallback memory
    }
  },

  async getActiveBranchId(): Promise<string | null> {
    if (memoryBranchId) return memoryBranchId;
    try {
      const branchId = await AsyncStorage.getItem(ACTIVE_BRANCH_KEY);
      memoryBranchId = branchId;
      return branchId;
    } catch {
      return memoryBranchId;
    }
  },

  async setActiveBranchId(branchId: string | null): Promise<void> {
    memoryBranchId = branchId;
    try {
      if (branchId) {
        await AsyncStorage.setItem(ACTIVE_BRANCH_KEY, branchId);
      } else {
        await AsyncStorage.removeItem(ACTIVE_BRANCH_KEY);
      }
    } catch {
      // fallback memory
    }
  },
};
