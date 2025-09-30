import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from "@/lib/api-client";
import { User } from "@shared/types";
import { LoginFormData, RegisterFormData } from "@/lib/validators";
import { toast } from "sonner";
import { immer } from 'zustand/middleware/immer';
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    immer(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        login: async (credentials) => {
          try {
            const { user, token } = await api<{ user: User; token: string }>('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify(credentials),
            });
            set((state) => {
              state.user = user;
              state.token = token;
              state.isAuthenticated = true;
            });
            toast.success("Login successful!");
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast.error(`Login failed: ${errorMessage}`);
            throw error;
          }
        },
        register: async (data) => {
          try {
            await api<User>('/api/auth/register', {
              method: 'POST',
              body: JSON.stringify(data),
            });
            toast.success("Registration successful! Please log in.");
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            toast.error(`Registration failed: ${errorMessage}`);
            throw error;
          }
        },
        logout: () => {
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          });
          toast.info("You have been logged out.");
        },
        updateUser: (data) => {
          set((state) => {
            if (state.user) {
              state.user = { ...state.user, ...data };
            }
          });
        },
      })
    ),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isAuthenticated = !!state.token;
        }
      },
    }
  )
);