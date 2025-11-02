import { create } from 'zustand';
import type { UserResponse } from '../services/api';

interface AuthState {
  // State
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: UserResponse, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: UserResponse) => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  // Actions
  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  initAuth: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userStr = localStorage.getItem('user');
    
    if (accessToken && refreshToken && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        get().logout();
      }
    }
  },
}));

