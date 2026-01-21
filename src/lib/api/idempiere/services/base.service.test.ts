/**
 * Tests for iDempiere Base Service
 *
 * Tests for reusable querying functionality in base service
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { IdempiereBaseService } from "./base.service";

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

// Test service implementation
interface TestEntity {
  id: number;
  Name: string;
  IsActive: boolean;
  Value: string;
}

interface TestAppEntity {
  id: string;
  name: string;
  active: boolean;
  code: string;
}

class TestService extends IdempiereBaseService<TestEntity, TestAppEntity> {
  readonly endpoint = "/models/TestEntity";

  protected transformToAppEntity(entities: TestEntity[]): TestAppEntity[] {
    return entities.map((e) => ({
      id: String(e.id),
      name: e.Name,
      active: e.IsActive,
      code: e.Value,
    }));
  }

  protected transformSingleToAppEntity(entity: TestEntity): TestAppEntity {
    return {
      id: String(entity.id),
      name: entity.Name,
      active: entity.IsActive,
      code: entity.Value,
    };
  }

  protected transformFromAppEntity(appEntity: Partial<TestAppEntity>): Partial<TestEntity> {
    return {
      Name: appEntity.name,
      IsActive: appEntity.active,
      Value: appEntity.code,
    };
  }
}

describe("IdempiereBaseService", () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
    vi.clearAllMocks();

    // Setup default localStorage state for authenticated requests
    localStorageMock.getItem.mockImplementation((key: string) => {
      if (key === "idempiere_token") return "test-token";
      if (key === "idempiere_expires_at") return String(Date.now() + 60000);
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("query", () => {
    it("should query with filter configuration", async () => {
      const { filter } = await import("../query");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [
            { id: 1, Name: "Test 1", IsActive: true, Value: "T1" },
            { id: 2, Name: "Test 2", IsActive: true, Value: "T2" },
          ],
          "page-count": 1,
          "records-size": 2,
          "skip-records": 0,
          "row-count": 2,
        }),
      } as Response);

      const result = await service.query({
        filter: filter("IsActive", "eq", true),
        top: 10,
        skip: 0,
      });

      expect(result.records).toHaveLength(2);
      expect(result.records[0]).toEqual({
        id: "1",
        name: "Test 1",
        active: true,
        code: "T1",
      });
      expect(result.totalRecords).toBe(2);
    });

    it("should query with orderBy configuration", async () => {
      const { orderBy } = await import("../query");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [
            { id: 1, Name: "A", IsActive: true, Value: "T1" },
            { id: 2, Name: "B", IsActive: true, Value: "T2" },
          ],
          "page-count": 1,
          "records-size": 2,
          "skip-records": 0,
          "row-count": 2,
        }),
      } as Response);

      const result = await service.query({
        orderBy: orderBy("Name", "asc"),
      });

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("%24orderby=Name+asc"), expect.any(Object));
    });

    it("should query with expand configuration", async () => {
      const { expand } = await import("../query");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [{ id: 1, Name: "Test", IsActive: true, Value: "T1" }],
          "page-count": 1,
          "records-size": 1,
          "skip-records": 0,
          "row-count": 1,
        }),
      } as Response);

      const result = await service.query({
        expand: expand("RelatedEntity", { select: ["Name"] }),
      });

      // Parentheses are URL-encoded: %28 = (, %29 = )
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("%24expand=RelatedEntity%28%24select%3DName%29"),
        expect.any(Object),
      );
    });

    it("should query with iDempiere-specific options", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [{ id: 1, Name: "Test", IsActive: true, Value: "T1" }],
          "page-count": 1,
          "records-size": 1,
          "skip-records": 0,
          "row-count": 1,
          "sql-command": "SELECT * FROM TestEntity",
        }),
      } as Response);

      const result = await service.query({
        idempiere: {
          showsql: true,
          valrule: 210,
          context: { AD_Org_ID: 11 },
        },
      });

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("showsql=true"), expect.any(Object));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("%24valrule=210"), expect.any(Object));
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("%24context=AD_Org_ID%3A11"), expect.any(Object));
    });

    it("should return empty response on error", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      const result = await service.query({});

      expect(result.records).toEqual([]);
      expect(result.totalRecords).toBe(0);
    });
  });

  describe("getAll", () => {
    it("should get paginated records", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [
            { id: 1, Name: "Test 1", IsActive: true, Value: "T1" },
            { id: 2, Name: "Test 2", IsActive: true, Value: "T2" },
          ],
          "page-count": 1,
          "records-size": 2,
          "skip-records": 0,
          "row-count": 2,
        }),
      } as Response);

      const result = await service.getAll({ page: 1, pageSize: 20 });

      expect(result.records).toHaveLength(2);
      expect(result.page).toBe(1);
      // pageSize comes from the API response ("records-size")
      expect(result.pageSize).toBe(2);
    });
  });

  describe("getById", () => {
    it("should get single record by ID", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          Name: "Test",
          IsActive: true,
          Value: "T1",
        }),
      } as Response);

      const result = await service.getById(1);

      expect(result).toEqual({
        id: "1",
        name: "Test",
        active: true,
        code: "T1",
      });
    });

    it("should return null on error", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Not found"));

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create new record", async () => {
      const newRecord = {
        name: "New Test",
        active: true,
        code: "NT1",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [{ id: 3, Name: "New Test", IsActive: true, Value: "NT1" }],
        }),
      } as Response);

      const result = await service.create(newRecord);

      expect(result).toEqual({
        id: "3",
        name: "New Test",
        active: true,
        code: "NT1",
      });
    });

    it("should return null on error", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Create failed"));

      const result = await service.create({ name: "Test", active: true, code: "T1" });

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update existing record", async () => {
      const updatedRecord = {
        name: "Updated Test",
        active: false,
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [{ id: 1, Name: "Updated Test", IsActive: false, Value: "T1" }],
        }),
      } as Response);

      const result = await service.update(1, updatedRecord);

      expect(result).toEqual({
        id: "1",
        name: "Updated Test",
        active: false,
        code: "T1",
      });
    });

    it("should return null on error", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Update failed"));

      const result = await service.update(1, { name: "Test", active: true });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should deactivate record", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const result = await service.delete(1);

      expect(result).toBe(true);
    });

    it("should return false on error", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Delete failed"));

      const result = await service.delete(1);

      expect(result).toBe(false);
    });
  });

  describe("hardDelete", () => {
    it("should permanently delete record", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      const result = await service.hardDelete(1);

      expect(result).toBe(true);
    });

    it("should return false on error", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Delete failed"));

      const result = await service.hardDelete(1);

      expect(result).toBe(false);
    });
  });

  describe("search", () => {
    it("should search by field using contains", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [
            { id: 1, Name: "Test Match", IsActive: true, Value: "T1" },
            { id: 2, Name: "Another Match", IsActive: true, Value: "T2" },
          ],
          "page-count": 1,
          "records-size": 2,
          "skip-records": 0,
          "row-count": 2,
        }),
      } as Response);

      const result = await service.search("Match");

      // contains(Name,'Match') gets URL-encoded: contains%28Name%2C%27Match%27%29
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("contains%28Name%2C%27Match%27%29"),
        expect.any(Object),
      );
      expect(result.records).toHaveLength(2);
    });

    it("should search by custom field", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [{ id: 1, Name: "Test", IsActive: true, Value: "ABC" }],
          "page-count": 1,
          "records-size": 1,
          "skip-records": 0,
          "row-count": 1,
        }),
      } as Response);

      const result = await service.search("AB", "Value");

      // contains(Value,'AB') gets URL-encoded: contains%28Value%2C%27AB%27%29
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("contains%28Value%2C%27AB%27%29"), expect.any(Object));
    });
  });

  describe("filterBy", () => {
    it("should filter by field with eq operator", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [
            { id: 1, Name: "Test", IsActive: true, Value: "T1" },
            { id: 2, Name: "Test2", IsActive: true, Value: "T2" },
          ],
          "page-count": 1,
          "records-size": 2,
          "skip-records": 0,
          "row-count": 2,
        }),
      } as Response);

      const result = await service.filterBy("IsActive", true);

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("IsActive+eq+true"), expect.any(Object));
      expect(result.records).toHaveLength(2);
    });

    it("should filter by field with gt operator", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [{ id: 1, Name: "Test", IsActive: true, Value: "T1" }],
          "page-count": 1,
          "records-size": 1,
          "skip-records": 0,
          "row-count": 1,
        }),
      } as Response);

      const result = await service.filterBy("id", 100, "gt");

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("id+gt+100"), expect.any(Object));
    });
  });

  describe("sortBy", () => {
    it("should sort by field in ascending order", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [
            { id: 1, Name: "A", IsActive: true, Value: "T1" },
            { id: 2, Name: "B", IsActive: true, Value: "T2" },
          ],
          "page-count": 1,
          "records-size": 2,
          "skip-records": 0,
          "row-count": 2,
        }),
      } as Response);

      const result = await service.sortBy("Name", "asc");

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("%24orderby=Name+asc"), expect.any(Object));
    });

    it("should sort by field in descending order", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          records: [
            { id: 1, Name: "B", IsActive: true, Value: "T1" },
            { id: 2, Name: "A", IsActive: true, Value: "T2" },
          ],
          "page-count": 1,
          "records-size": 2,
          "skip-records": 0,
          "row-count": 2,
        }),
      } as Response);

      const result = await service.sortBy("Name", "desc");

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("%24orderby=Name+desc"), expect.any(Object));
    });
  });
});
