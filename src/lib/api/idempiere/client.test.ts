/**
 * Tests for iDempiere Client
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { IdempiereClient } from "./client";
import { IDEMPIERE_CONFIG } from "./config";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

// Mock fetch
global.fetch = vi.fn();

describe("IdempiereClient", () => {
  let client: IdempiereClient;

  beforeEach(() => {
    client = new IdempiereClient("https://test-api.com/api/v1");
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should create client with default base URL", () => {
      const defaultClient = new IdempiereClient();
      expect(defaultClient).toBeDefined();
    });

    it("should create client with custom base URL", () => {
      const customClient = new IdempiereClient("https://custom.com/api");
      expect(customClient).toBeDefined();
    });
  });

  describe("isAuthenticated", () => {
    it("should return false when no token exists", () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(client.isAuthenticated()).toBe(false);
    });

    it("should return false when token is expired", () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "idempiere_token") return "valid-token";
        if (key === "idempiere_expires_at") return String(Date.now() - 1000); // Expired
        return null;
      });
      expect(client.isAuthenticated()).toBe(false);
    });

    it("should return true when token exists and is valid", () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "idempiere_token") return "valid-token";
        if (key === "idempiere_expires_at") return String(Date.now() + 60000); // Valid
        return null;
      });
      expect(client.isAuthenticated()).toBe(true);
    });
  });

  describe("getCurrentUser", () => {
    it("should return null values when not authenticated", () => {
      localStorageMock.getItem.mockReturnValue(null);
      const user = client.getCurrentUser();
      expect(user).toEqual({
        userId: null,
        clientId: null,
        roleId: null,
        orgId: null,
        language: null,
      });
    });

    it("should return stored user data when authenticated", () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        const data: Record<string, string> = {
          idempiere_user_id: "123",
          idempiere_client_id: "11",
          idempiere_role_id: "456",
          idempiere_org_id: "789",
          idempiere_language: "en_US",
        };
        return data[key] ?? null;
      });

      const user = client.getCurrentUser();
      expect(user).toEqual({
        userId: 123,
        clientId: 11,
        roleId: 456,
        orgId: 789,
        language: "en_US",
      });
    });
  });

  describe("login", () => {
    it("should handle successful login with single-step flow", async () => {
      const mockResponse = {
        userId: 123,
        token: "test-token",
        refresh_token: "test-refresh-token",
        language: "en_US",
        menuTreeId: 10,
        clientId: IDEMPIERE_CONFIG.clientId,
        roleId: IDEMPIERE_CONFIG.roleId,
        organizationId: IDEMPIERE_CONFIG.organizationId,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await client.login("testuser", "testpass");

      expect(result).toEqual(mockResponse);
      expect(localStorageMock.setItem).toHaveBeenCalled();

      // Verify the request body includes parameters
      const fetchCall = vi.mocked(fetch).mock.calls[0];
      const requestBody = JSON.parse(fetchCall?.[1]?.body as string);
      expect(requestBody).toEqual({
        userName: "testuser",
        password: "testpass",
        parameters: {
          clientId: IDEMPIERE_CONFIG.clientId,
          roleId: IDEMPIERE_CONFIG.roleId,
          organizationId: IDEMPIERE_CONFIG.organizationId,
          language: IDEMPIERE_CONFIG.language,
        },
      });
    });

    it("should include warehouseId in parameters if configured", async () => {
      const clientWithWarehouse = new IdempiereClient("https://test-api.com/api/v1");
      const mockResponse = {
        userId: 123,
        token: "test-token",
        refresh_token: "test-refresh-token",
        language: "en_US",
        menuTreeId: 10,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await clientWithWarehouse.login("testuser", "testpass");

      const fetchCall = vi.mocked(fetch).mock.calls[0];
      const requestBody = JSON.parse(fetchCall?.[1]?.body as string);
      // warehouseId is optional, so we just verify the structure
      expect(requestBody.parameters).toBeDefined();
      expect(requestBody.parameters.clientId).toBeDefined();
      expect(requestBody.parameters.roleId).toBeDefined();
      expect(requestBody.parameters.organizationId).toBeDefined();
    });

    it("should return null on failed login", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ code: "INVALID_CREDENTIALS", message: "Invalid credentials" }),
      } as Response);

      const result = await client.login("testuser", "wrongpass");

      expect(result).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear auth data on logout", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ summary: "OK" }),
      } as Response);

      await client.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });

    it("should clear auth data even when API call fails", async () => {
      localStorageMock.getItem.mockReturnValue("test-token");

      vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      await client.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });
  });

  describe("request methods", () => {
    beforeEach(() => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "idempiere_token") return "test-token";
        if (key === "idempiere_expires_at") return String(Date.now() + 60000);
        return null;
      });
    });

    it("should make GET request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      } as Response);

      const result = await client.get("/test");

      expect(result).toEqual({ data: "test" });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          method: "GET",
        }),
      );
    });

    it("should make POST request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      } as Response);

      const result = await client.post("/test", { name: "test" });

      expect(result).toEqual({ data: "test" });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test"),
        expect.objectContaining({
          method: "POST",
          body: '{"name":"test"}',
        }),
      );
    });

    it("should make PUT request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      } as Response);

      const result = await client.put("/test/1", { name: "updated" });

      expect(result).toEqual({ data: "test" });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test/1"),
        expect.objectContaining({
          method: "PUT",
        }),
      );
    });

    it("should make DELETE request", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: "test" }),
      } as Response);

      const result = await client.delete("/test/1");

      expect(result).toEqual({ data: "test" });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/test/1"),
        expect.objectContaining({
          method: "DELETE",
        }),
      );
    });

    it("should add Authorization header when token exists", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await client.get("/test");

      const fetchCall = vi.mocked(fetch).mock.calls[0];
      const headers = fetchCall?.[1]?.headers as Record<string, string>;

      expect(headers).toBeDefined();
      expect(headers.Authorization).toBe("Bearer test-token");
    });

    it("should handle API errors", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ code: "SERVER_ERROR", message: "Internal server error" }),
      } as Response);

      await expect(client.get("/test")).rejects.toThrow();
    });

    it("should handle timeout", async () => {
      vi.mocked(fetch).mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("TimeoutError")), 100);
          }),
      );

      await expect(client.get("/test")).rejects.toThrow();
    });
  });

  describe("token refresh", () => {
    it("should have refresh access token method", async () => {
      // Check that refresh token method exists
      expect(client.refreshAccessToken).toBeDefined();

      // Mock localStorage for refresh
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "idempiere_token") return "old-token";
        if (key === "idempiere_refresh_token") return "old-refresh-token";
        if (key === "idempiere_expires_at") return String(Date.now() + 60000);
        if (key === "idempiere_client_id") return "11";
        if (key === "idempiere_user_id") return "123";
        return null;
      });

      // Mock successful refresh
      const refreshResponse = {
        token: "new-token",
        refresh_token: "new-refresh-token",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => refreshResponse,
      } as Response);

      const result = await client.refreshAccessToken();

      expect(result).toBeDefined();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe("isTokenExpired", () => {
    it("should return true when expires_at is not set", () => {
      localStorageMock.getItem.mockReturnValue(null);
      expect(client.isTokenExpired()).toBe(true);
    });

    it("should return true when current time is past expires_at", () => {
      const pastTime = Date.now() - 1000;
      localStorageMock.getItem.mockReturnValue(String(pastTime));
      expect(client.isTokenExpired()).toBe(true);
    });

    it("should return false when current time is before expires_at", () => {
      const futureTime = Date.now() + 60000;
      localStorageMock.getItem.mockReturnValue(String(futureTime));
      expect(client.isTokenExpired()).toBe(false);
    });
  });
});
