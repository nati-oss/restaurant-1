import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/types';

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('auth_token', token);
        set({ token, user });
      },
      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({ token: null, user: null });
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'auth-store' }
  )
);
