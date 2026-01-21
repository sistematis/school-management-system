/**
 * iDempiere REST API Client
 *
 * HTTP client with authentication handling, token refresh, and error handling
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/authentication
 */

import { IDEMPIERE_CONFIG } from "./config";
import type {
  AuthCompleteResponse,
  AuthLoginFullRequest,
  AuthLogoutRequest,
  AuthLogoutResponse,
  AuthRefreshRequest,
  AuthRefreshResponse,
  IdempiereError,
} from "./types";

/**
 * Storage keys for localStorage
 */
const STORAGE_KEYS = {
  TOKEN: "idempiere_token",
  REFRESH_TOKEN: "idempiere_refresh_token",
  USER_ID: "idempiere_user_id",
  CLIENT_ID: "idempiere_client_id",
  ROLE_ID: "idempiere_role_id",
  ORG_ID: "idempiere_org_id",
  LANGUAGE: "idempiere_language",
  EXPIRES_AT: "idempiere_expires_at",
} as const;

/**
 * Custom error class for iDempiere API errors
 */
export class IdempiereApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: string,
  ) {
    super(message);
    this.name = "IdempiereApiError";
  }
}

/**
 * iDempiere REST API Client
 */
export class IdempiereClient {
  private baseURL: string;
  private tokenRefreshPromise: Promise<AuthCompleteResponse | null> | null = null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL ?? IDEMPIERE_CONFIG.baseURL;
  }

  /**
   * Get current access token from localStorage
   */
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Get current refresh token from localStorage
   */
  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Store auth data in localStorage
   */
  private storeAuthData(data: AuthCompleteResponse): void {
    if (typeof window === "undefined") return;

    const expiresAt = Date.now() + IDEMPIERE_CONFIG.tokenCacheTime;

    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
    if (data.userId) {
      localStorage.setItem(STORAGE_KEYS.USER_ID, String(data.userId));
    }
    if (data.clientId) {
      localStorage.setItem(STORAGE_KEYS.CLIENT_ID, String(data.clientId));
    }
    if (data.roleId) {
      localStorage.setItem(STORAGE_KEYS.ROLE_ID, String(data.roleId));
    }
    if (data.organizationId) {
      localStorage.setItem(STORAGE_KEYS.ORG_ID, String(data.organizationId));
    }
    if (data.language) {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, data.language);
    }
    localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt));
  }

  /**
   * Clear auth data from localStorage
   */
  private clearAuthData(): void {
    if (typeof window === "undefined") return;

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(): boolean {
    if (typeof window === "undefined") return true;

    const expiresAt = localStorage.getItem(STORAGE_KEYS.EXPIRES_AT);
    if (!expiresAt) return true;

    return Date.now() > Number(expiresAt);
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Add Authorization header if token exists
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) ?? {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(IDEMPIERE_CONFIG.timeout),
      });

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && this.getRefreshToken()) {
        const refreshed = await this.refreshAccessToken();

        if (refreshed) {
          // Retry request with new token
          const retryHeaders: Record<string, string> = {
            ...headers,
            Authorization: `Bearer ${refreshed.token}`,
          };
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
            signal: AbortSignal.timeout(IDEMPIERE_CONFIG.timeout),
          });

          if (!retryResponse.ok) {
            throw await this.handleError(retryResponse);
          }

          return retryResponse.json() as T;
        }
      }

      if (!response.ok) {
        throw await this.handleError(response);
      }

      return response.json() as T;
    } catch (error) {
      if (error instanceof IdempiereApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "TimeoutError" || error.name === "AbortError") {
          throw new IdempiereApiError(408, "TIMEOUT", "Request timeout", error.message);
        }
      }

      throw new IdempiereApiError(500, "NETWORK_ERROR", "Network error occurred", String(error));
    }
  }

  /**
   * Handle API error response
   */
  private async handleError(response: Response): Promise<IdempiereApiError> {
    let errorData: IdempiereError = {
      code: "UNKNOWN_ERROR",
      message: "An unknown error occurred",
      statusCode: response.status,
    };

    try {
      const data = (await response.json()) as IdempiereError;
      errorData = { ...errorData, ...data };
    } catch {
      // Use default error data if JSON parsing fails
      errorData.message = response.statusText || errorData.message;
    }

    return new IdempiereApiError(
      errorData.statusCode ?? response.status,
      errorData.code,
      errorData.message,
      errorData.details,
    );
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<AuthCompleteResponse | null> {
    // Prevent multiple simultaneous refresh attempts
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    this.tokenRefreshPromise = this.performTokenRefresh();

    try {
      return await this.tokenRefreshPromise;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(): Promise<AuthCompleteResponse | null> {
    const refreshToken = this.getRefreshToken();
    const clientId = localStorage.getItem(STORAGE_KEYS.CLIENT_ID);
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);

    if (!refreshToken) {
      this.clearAuthData();
      return null;
    }

    try {
      const body: AuthRefreshRequest = {
        refresh_token: refreshToken,
      };

      if (clientId) {
        body.clientId = Number(clientId);
      }
      if (userId) {
        body.userId = Number(userId);
      }

      const response = await fetch(`${this.baseURL}${IDEMPIERE_CONFIG.endpoints.authRefresh}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(IDEMPIERE_CONFIG.timeout),
      });

      if (!response.ok) {
        this.clearAuthData();
        return null;
      }

      const data = (await response.json()) as AuthRefreshResponse;

      // Create complete response object
      const completeData: AuthCompleteResponse = {
        token: data.token,
        refresh_token: data.refresh_token,
        userId: userId ? Number(userId) : 0,
        language: localStorage.getItem(STORAGE_KEYS.LANGUAGE) ?? "en_US",
        clientId: clientId ? Number(clientId) : undefined,
      };

      this.storeAuthData(completeData);
      return completeData;
    } catch {
      this.clearAuthData();
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  /**
   * Login with username and password
   * Uses one-step login with all parameters as per requirement
   *
   * Request body format:
   * {
   *   "userName": "{{userName}}",
   *   "password": "{{password}}",
   *   "parameters": {
   *     "clientId": {{clientId}},
   *     "roleId": {{roleId}},
   *     "organizationId": {{organizationId}},
   *     "warehouseId": {{warehouseId}},
   *     "language": "{{language}}"
   *   }
   * }
   *
   * Response format:
   * {
   *   "userId": 100,
   *   "language": "en_US",
   *   "menuTreeId": 10,
   *   "token": "eyJraWQiOiJpZGVtcG...",
   *   "refresh_token": "eyJraWQiOiJpZGV..."
   * }
   */
  async login(username: string, password: string): Promise<AuthCompleteResponse | null> {
    try {
      // Single-step login with all parameters as per requirement
      const loginData: AuthLoginFullRequest = {
        userName: username,
        password: password,
        parameters: {
          clientId: IDEMPIERE_CONFIG.clientId,
          roleId: IDEMPIERE_CONFIG.roleId,
          organizationId: IDEMPIERE_CONFIG.organizationId,
          language: IDEMPIERE_CONFIG.language,
        },
      };

      // Add warehouseId if configured
      if (IDEMPIERE_CONFIG.warehouseId) {
        loginData.parameters.warehouseId = IDEMPIERE_CONFIG.warehouseId;
      }

      const completeResponse = await this.request<AuthCompleteResponse>(IDEMPIERE_CONFIG.endpoints.authTokens, {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      this.storeAuthData(completeResponse);
      return completeResponse;
    } catch (_error) {
      this.clearAuthData();
      return null;
    }
  }

  /**
   * Logout and invalidate tokens
   * Returns the logout response or null if logout failed
   */
  async logout(): Promise<AuthLogoutResponse | null> {
    const token = this.getToken();

    if (token) {
      try {
        const response = await fetch(`${this.baseURL}${IDEMPIERE_CONFIG.endpoints.authLogout}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token } satisfies AuthLogoutRequest),
        });

        if (response.ok) {
          const data = (await response.json()) as AuthLogoutResponse;
          this.clearAuthData();
          return data;
        }
      } catch {
        // Ignore logout errors, just clear local data
      }
    }

    this.clearAuthData();
    return null;
  }

  /**
   * Make GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    let url = endpoint;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: "GET" });
  }

  /**
   * Query iDempiere models using OData-style query parameters
   * Supports: $filter, $orderby, $top, $skip, $select, $expand, $valrule, $context, etc.
   *
   * @param endpoint - API endpoint (e.g., "/models/C_BPartner")
   * @param params - Query parameters object with OData-style keys
   * @returns Typed response
   *
   * @example
   * const response = await client.query("/models/C_BPartner", {
   *   "$filter": "Name eq 'John' AND IsActive eq true",
   *   "$orderby": "Created desc",
   *   "$top": 10,
   *   "$select": "Name,Value,EMail"
   * });
   */
  async query<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    let url = endpoint;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: "GET" });
  }

  /**
   * Make POST request
   */
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Make PUT request
   */
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * Make DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Get current user info from localStorage
   */
  getCurrentUser(): {
    userId: number | null;
    clientId: number | null;
    roleId: number | null;
    orgId: number | null;
    language: string | null;
  } {
    if (typeof window === "undefined") {
      return {
        userId: null,
        clientId: null,
        roleId: null,
        orgId: null,
        language: null,
      };
    }

    return {
      userId: localStorage.getItem(STORAGE_KEYS.USER_ID) ? Number(localStorage.getItem(STORAGE_KEYS.USER_ID)) : null,
      clientId: localStorage.getItem(STORAGE_KEYS.CLIENT_ID)
        ? Number(localStorage.getItem(STORAGE_KEYS.CLIENT_ID))
        : null,
      roleId: localStorage.getItem(STORAGE_KEYS.ROLE_ID) ? Number(localStorage.getItem(STORAGE_KEYS.ROLE_ID)) : null,
      orgId: localStorage.getItem(STORAGE_KEYS.ORG_ID) ? Number(localStorage.getItem(STORAGE_KEYS.ORG_ID)) : null,
      language: localStorage.getItem(STORAGE_KEYS.LANGUAGE),
    };
  }
}

/**
 * Singleton instance for client-side use
 */
let clientInstance: IdempiereClient | null = null;

/**
 * Get or create the singleton IdempiereClient instance
 */
export function getIdempiereClient(): IdempiereClient {
  if (!clientInstance) {
    clientInstance = new IdempiereClient();
  }
  return clientInstance;
}
