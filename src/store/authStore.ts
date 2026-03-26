import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, User } from '../api/memos';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  signIn: async (username, password) => {
    set({ isLoading: true });
    try {
      const { user, access_token, expires_at } = await authApi.signIn(username, password);

      await AsyncStorage.setItem('access_token', access_token);
      await AsyncStorage.setItem('expires_at', expires_at);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await authApi.signOut();
      await AsyncStorage.multiRemove(['access_token', 'user', 'expires_at']);
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      throw error;
    }
  },

  loadUser: async () => {
    const userStr = await AsyncStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    set({ user, isAuthenticated: !!user });
  },
}));
