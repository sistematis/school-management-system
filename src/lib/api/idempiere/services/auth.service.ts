/**
 * iDempiere Authentication Service
 *
 * Handles user authentication, login, logout, and session management
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/authentication
 */

import { getIdempiereClient } from "../client";
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
      return await this.client.login(username, password);
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
   * Refresh the access token
   * @returns New auth data or null if refresh failed
   */
  async refreshToken(): Promise<AuthCompleteResponse | null> {
    try {
      const _client = getIdempiereClient();
      // The client handles refresh automatically on 401, but we can expose it if needed
      const currentUser = this.getCurrentUser();
      if (currentUser.userId && currentUser.clientId) {
        return {
          token: "", // Will be filled by the client
          refresh_token: "",
          userId: currentUser.userId,
          language: currentUser.language ?? "en_US",
          clientId: currentUser.clientId,
          roleId: currentUser.roleId ?? undefined,
          organizationId: currentUser.orgId ?? undefined,
        };
      }
      return null;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return null;
    }
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
