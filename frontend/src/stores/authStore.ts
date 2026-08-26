import { create } from 'zustand';
import { AuthUser, LoginRequest, RegisterRequest } from '../types/auth';
import { authApi } from '../services/authApi';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('myos_token'),
  isAuthenticated: false,
  isInitializing: true,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authApi.login(credentials);
      if (data.token) {
        localStorage.setItem('myos_token', data.token);
        set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Đăng nhập không thành công',
      });
      throw err;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register(data);
      set({ isLoading: false, error: null });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      set({
        isLoading: false,
        error: errorObj.message || 'Đăng ký không thành công',
      });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('myos_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitializing: false,
      error: null,
    });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('myos_token');
    if (!token) {
      set({ isInitializing: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const data = await authApi.getMe();
      set({
        user: data.user,
        token,
        isAuthenticated: true,
        isInitializing: false,
      });
    } catch {
      get().logout();
    }
  },
}));