import { create } from "zustand";

import { getMe } from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  initialized: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  initialized: false,

  setAuth: (user, token) => {
    localStorage.setItem("token", token);

    set({
      user,
      token,
      initialized: true,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  initializeAuth: async () => {
    const token = get().token;

    if (!token) {
      set({ initialized: true });
      return;
    }

    try {
      const response = await getMe();

      set({
        user: response.data.user,
        initialized: true,
      });
    } catch {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        initialized: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      initialized: true,
    });
  },
}));
