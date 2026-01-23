/**
 * iDempiere Authentication Service
 *
 * Handles user authentication, login, logout, and session management
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/authentication
 */

import { getIdempiereClient } from "../client";
import { IDEMPIERE_CONFIG } from "../config";
import type { AuthCompleteResponse, AuthLogoutResponse } from "../types";

/**
 * Authentication Service
 */
export class AuthService {
  private client = getIdempiereClient();

  /**
   * Login with username and password
   * @param username - User's username
   * @param password - User's password
   * @returns Complete auth response with tokens, or null if login failed
   */
  async login(username: string, password: string): Promise<AuthCompleteResponse | null> {
    try {
      const result = await this.client.login(username, password);

      // Reset refresh counter on successful login
      if (result) {
        this.client.resetRefreshCount();
      }

      return result;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  }

  /**
   * Logout current user and invalidate tokens
   * @returns Logout response with summary, or null if logout failed
   */
  async logout(): Promise<AuthLogoutResponse | null> {
    try {
      return await this.client.logout();
    } catch (error) {
      console.error("Logout failed:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   * @returns true if user has valid access token
   */
  isAuthenticated(): boolean {
    return this.client.isAuthenticated();
  }

  /**
   * Get current user information
   * @returns User info from stored session
   */
  getCurrentUser(): {
    userId: number | null;
    clientId: number | null;
    roleId: number | null;
    orgId: number | null;
    language: string | null;
  } {
    return this.client.getCurrentUser();
  }

  /**
   * Refresh the access token using the refresh token
   * @returns New auth data or null if refresh failed
   */
  async refreshToken(): Promise<AuthCompleteResponse | null> {
    try {
      // Get current user info for the refresh request
      const currentUser = this.getCurrentUser();
      const refreshToken = this.getRefreshToken();

      if (!refreshToken || !currentUser.userId || !currentUser.clientId) {
        return null;
      }

      // Call the refresh endpoint directly
      const response = await fetch(`${IDEMPIERE_CONFIG.baseURL}${IDEMPIERE_CONFIG.endpoints.authRefresh}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: refreshToken,
          clientId: currentUser.clientId,
          userId: currentUser.userId,
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as { token: string; refresh_token: string };

      // Store the new tokens
      const completeData: AuthCompleteResponse = {
        token: data.token,
        refresh_token: data.refresh_token,
        userId: currentUser.userId,
        language: currentUser.language ?? "en_US",
        clientId: currentUser.clientId,
        roleId: currentUser.roleId ?? undefined,
        organizationId: currentUser.orgId ?? undefined,
      };

      // Update localStorage with new tokens
      localStorage.setItem("idempiere_token", data.token);
      localStorage.setItem("idempiere_refresh_token", data.refresh_token);
      localStorage.setItem("idempiere_expires_at", String(Date.now() + 60 * 60 * 1000)); // 1 hour

      return completeData;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
  }

  /**
   * Get the current refresh token from localStorage
   */
  private getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("idempiere_refresh_token");
  }
}

/**
 * Singleton instance
 */
let authServiceInstance: AuthService | null = null;

/**
 * Get or create the AuthService singleton
 */
export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
}
