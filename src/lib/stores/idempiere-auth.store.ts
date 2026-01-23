/**
 * iDempiere Authentication Store (Zustand)
 *
 * Manages authentication state for iDempiere REST API
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAuthService } from "../api/idempiere/services/auth.service";

/**
 * Cookie name for authentication status (used by middleware/proxy)
 */
const AUTH_COOKIE_NAME = "idempiere_authenticated";

/**
 * Set authentication cookie (for middleware to check)
 */
function setAuthCookie(): void {
  if (typeof window === "undefined") return;
  // Set a cookie that expires in 30 days
  const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
  document.cookie = `${AUTH_COOKIE_NAME}=true; path=/; max-age=${maxAge}; SameSite=lax`;
}

/**
 * Clear authentication cookie
 */
function clearAuthCookie(): void {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

/**
 * Authentication state interface
 */
interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean; // Track initial auth check on app load
  isRefreshing: boolean; // Track if token is currently being refreshed
  refreshCount: number; // Track number of successful refreshes in current session
  user: {
    userId: number | null;
    clientId: number | null;
    roleId: number | null;
    orgId: number | null;
    language: string | null;
  } | null;
  token: string | null;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
  refreshToken: () => Promise<boolean>;
  setRefreshing: (isRefreshing: boolean) => void;
}

/**
 * Create the authentication store
 */
export const useIdempiereAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: true, // Start with true - checking auth on app load
      isRefreshing: false,
      refreshCount: 0,
      user: null,
      token: null,
      error: null,

      /**
       * Login with username and password
       */
      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const authService = getAuthService();
          const authData = await authService.login(username, password);

          if (authData) {
            const currentUser = authService.getCurrentUser();

            set({
              isAuthenticated: true,
              isLoading: false,
              user: currentUser,
              token: authData.token,
              error: null,
            });

            // Set authentication cookie for middleware
            setAuthCookie();

            return true;
          }

          set({
            isAuthenticated: false,
            isLoading: false,
            error: "Invalid username or password",
          });

          return false;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Login failed";

          set({
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          return false;
        }
      },

      /**
       * Logout current user
       */
      logout: async () => {
        set({ isLoading: true });

        try {
          const authService = getAuthService();
          await authService.logout();

          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null,
            error: null,
          });

          // Clear authentication cookie
          clearAuthCookie();
        } catch (_error) {
          // Clear local state even if logout API call fails
          set({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            token: null,
            error: null,
          });

          // Still clear the cookie on error
          clearAuthCookie();
        }
      },

      /**
       * Check authentication status on app load
       * Attempts to refresh token if expired but refresh token exists
       */
      checkAuth: async () => {
        const authService = getAuthService();
        const isAuth = authService.isAuthenticated();

        if (isAuth) {
          const currentUser = authService.getCurrentUser();

          set({
            isAuthenticated: true,
            isCheckingAuth: false,
            user: currentUser,
            token: localStorage.getItem("idempiere_token"),
          });

          // Set authentication cookie for middleware
          setAuthCookie();
        } else {
          // Check if we have a refresh token to attempt refresh
          const refreshToken = localStorage.getItem("idempiere_refresh_token");
          const hasAccessToken = !!localStorage.getItem("idempiere_token");

          // If we have an access token that's expired AND a refresh token, try to refresh
          if (hasAccessToken && refreshToken) {
            try {
              const success = await get().refreshToken();
              if (success) {
                // Refresh succeeded, auth state is now updated
                return;
              }
            } catch {
              // Refresh failed, fall through to logout
            }
          }

          // No valid token or refresh failed - clear state
          set({
            isAuthenticated: false,
            isCheckingAuth: false,
            user: null,
            token: null,
          });

          // Clear the authentication cookie
          clearAuthCookie();
        }
      },

      /**
       * Clear error message
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Refresh access token
       */
      refreshToken: async () => {
        try {
          const authService = getAuthService();
          const authData = await authService.refreshToken();

          if (authData) {
            const currentUser = authService.getCurrentUser();

            set({
              isAuthenticated: true,
              user: currentUser,
              token: authData.token,
            });

            return true;
          }

          // If refresh failed, logout
          await get().logout();
          return false;
        } catch (_error) {
          await get().logout();
          return false;
        }
      },

      /**
       * Set refreshing state for UI feedback
       */
      setRefreshing: (isRefreshing: boolean) => {
        set({ isRefreshing });
      },
    }),
    {
      name: "idempiere-auth-storage",
      // Persist all auth state including isAuthenticated
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isCheckingAuth: state.isCheckingAuth,
        isRefreshing: state.isRefreshing,
        refreshCount: state.refreshCount,
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

/**
 * Selector hooks for common use cases
 */
export const useIsAuthenticated = () => useIdempiereAuth((state) => state.isAuthenticated);
export const useAuthUser = () => useIdempiereAuth((state) => state.user);
export const useAuthLoading = () => useIdempiereAuth((state) => state.isLoading);
export const useAuthError = () => useIdempiereAuth((state) => state.error);
