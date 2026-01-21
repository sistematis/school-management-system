/**
 * Tests for iDempiere Business Partner Service
 *
 * Tests for reusable querying functionality in BusinessPartnerService
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BusinessPartnerService, getBusinessPartnerService } from "./business-partner.service";

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

// Helper function to get the URL from fetch calls
function getFetchUrl(): string {
  const fetchCall = vi.mocked(fetch).mock.calls[0];
  return fetchCall?.[0] as string;
}

// Sample response data
const mockBusinessPartners = [
  {
    id: 1000002,
    uid: "6aae956e-e32e-4b5a-80db-4bd331b2a17c",
    C_BPartner_ID: 1000002,
    AD_Client_ID: {
      propertyLabel: "Tenant",
      id: 1000000,
      identifier: "SISTEMATIS (GROUP)",
      "model-name": "ad_client",
    },
    AD_Org_ID: {
      propertyLabel: "Organization",
      id: 0,
      identifier: "*",
      "model-name": "ad_org",
    },
    IsActive: true,
    Created: "2025-04-09T08:39:35Z",
    Updated: "2025-04-09T08:39:35Z",
    Value: "10A-001",
    Name: "SISTEMATIS Admin",
    IsCustomer: true,
    IsEmployee: false,
    IsVendor: false,
    IsProspect: true,
    C_BP_Group_ID: {
      propertyLabel: "Business Partner Group",
      id: 1000000,
      identifier: "Grade 10 - Section A",
      "model-name": "c_bp_group",
    },
    EMail: "admin@sistematis.com",
    Phone: "123-456-7890",
    Birthday: "2008-05-15",
  },
];

const mockODataResponse = {
  "page-count": 3,
  "records-size": 1,
  "skip-records": 0,
  "row-count": 3,
  "array-count": 0,
  records: mockBusinessPartners,
};

describe("BusinessPartnerService", () => {
  let service: BusinessPartnerService;

  beforeEach(() => {
    service = new BusinessPartnerService();
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

  describe("queryWithConfig", () => {
    it("should query with full QueryBuilder configuration", async () => {
      const { QueryBuilder, filter, and, orderBy } = await import("../query");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      // Pass the QueryBuilder instance directly (do not call .build())
      const queryBuilder = new QueryBuilder()
        .filter("Name", "eq", "Test")
        .and("IsActive", "eq", true)
        .orderBy("Created", "desc")
        .top(10);

      const result = await service.queryWithConfig(queryBuilder);

      expect(result.records).toHaveLength(1);
      expect(result.records[0]?.firstName).toBe("SISTEMATIS");

      const url = getFetchUrl();
      expect(url).toContain("%24filter=Name+eq+%27Test%27+AND+IsActive+eq+true");
      expect(url).toContain("%24orderby=Created+desc");
      expect(url).toContain("%24top=10");
    });
  });

  describe("queryWithFilter", () => {
    it("should query with filter condition", async () => {
      const { filter, and } = await import("../query");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.queryWithFilter(
        and(filter("IsCustomer", "eq", true), filter("IsActive", "eq", true)),
        { page: 1, pageSize: 20 },
      );

      expect(result.records).toHaveLength(1);

      const url = getFetchUrl();
      expect(url).toContain("IsCustomer+eq+true+AND+IsActive+eq+true");
      expect(url).toContain("%24top=20");
      expect(url).toContain("%24skip=0");
    });
  });

  describe("queryWithOrderBy", () => {
    it("should query with order by clause", async () => {
      const { orderBy } = await import("../query");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.queryWithOrderBy(orderBy("Name", "asc"));

      const url = getFetchUrl();
      expect(url).toContain("%24orderby=Name+asc");
    });
  });

  describe("queryWithExpand", () => {
    it("should query with expand clause", async () => {
      const { expand } = await import("../query");

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.queryWithExpand(expand("C_BP_Group", { select: ["Name", "Description"] }));

      // Parentheses are URL-encoded: %28 = (, %29 = )
      const url = getFetchUrl();
      expect(url).toContain("%24expand=C_BP_Group%28%24select%3DName%2CDescription%29");
    });
  });

  describe("getActiveCustomers", () => {
    it("should get active customers (students)", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getActiveCustomers();

      const url = getFetchUrl();
      expect(url).toContain("IsCustomer+eq+true+AND+IsActive+eq+true");
      expect(result.records).toHaveLength(1);
      expect(result.records[0]?.id).toBe("10A-001");
    });
  });

  describe("getActiveEmployees", () => {
    it("should get active employees", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getActiveEmployees();

      const url = getFetchUrl();
      expect(url).toContain("IsEmployee+eq+true+AND+IsActive+eq+true");
    });
  });

  describe("getActiveVendors", () => {
    it("should get active vendors", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getActiveVendors();

      const url = getFetchUrl();
      expect(url).toContain("IsVendor+eq+true+AND+IsActive+eq+true");
    });
  });

  describe("searchByName", () => {
    it("should search by name using contains", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.searchByName("Admin");

      const url = getFetchUrl();
      expect(url).toContain("contains%28Name%2C%27Admin%27%29");
    });
  });

  describe("searchByEmail", () => {
    it("should search by email using contains", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.searchByEmail("sistematis");

      const url = getFetchUrl();
      expect(url).toContain("contains%28EMail%2C%27sistematis%27%29");
      // Should also include IsActive filter
      expect(url).toContain("AND");
    });
  });

  describe("getByBpGroupId", () => {
    it("should get students by BP Group ID", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getByBpGroupId(1000000);

      const url = getFetchUrl();
      expect(url).toContain("C_BP_Group_ID+eq+1000000");
    });
  });

  describe("getByValues", () => {
    it("should get students by multiple Value values using IN filter", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getByValues(["10A-001", "10A-002", "10A-003"]);

      const url = getFetchUrl();
      expect(url).toContain("Value+in+%28%2710A-001%27%2C%2710A-002%27%2C%2710A-003%27%29");
    });
  });

  describe("getCreatedAfter", () => {
    it("should get students created after a specific date", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getCreatedAfter("2025-01-01T00:00:00Z");

      const url = getFetchUrl();
      expect(url).toContain("Created+ge+%272025-01-01T00%3A00%3A00Z%27");
    });
  });

  describe("getCreatedBefore", () => {
    it("should get students created before a specific date", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getCreatedBefore("2025-12-31T23:59:59Z");

      const url = getFetchUrl();
      expect(url).toContain("Created+le+%272025-12-31T23%3A59%3A59Z%27");
    });
  });

  describe("getNameStartingWith", () => {
    it("should get students with name starting with prefix", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockODataResponse,
      } as Response);

      const result = await service.getNameStartingWith("John");

      const url = getFetchUrl();
      expect(url).toContain("startswith%28Name%2C%27John%27%29");
    });
  });

  describe("queryWithOptions", () => {
    it("should query with iDempiere-specific options", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...mockODataResponse,
          "sql-command": "SELECT * FROM C_BPartner WHERE...",
        }),
      } as Response);

      const result = await service.queryWithOptions({
        showsql: true,
        valrule: 210,
        context: { AD_Org_ID: 11 },
      });

      const url = getFetchUrl();
      expect(url).toContain("showsql=true");
      expect(url).toContain("%24valrule=210");
      expect(url).toContain("%24context=AD_Org_ID%3A11");
    });
  });

  describe("CRUD Methods", () => {
    describe("getStudents", () => {
      it("should get paginated list of students", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockODataResponse,
        } as Response);

        const result = await service.getStudents({ page: 1, pageSize: 20 });

        expect(result.records).toHaveLength(1);
        expect(result.page).toBe(1);
        expect(result.totalRecords).toBe(3);
      });
    });

    describe("getStudentById", () => {
      it("should get single student by ID", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockBusinessPartners[0],
        } as Response);

        const result = await service.getStudentById(1000002);

        expect(result).not.toBeNull();
        expect(result?.id).toBe("10A-001");
        expect(result?.firstName).toBe("SISTEMATIS");
      });

      it("should return null when not found", async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error("Not found"));

        const result = await service.getStudentById(999);

        expect(result).toBeNull();
      });
    });

    describe("getStudentByValue", () => {
      it("should get single student by Value", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockODataResponse,
        } as Response);

        const result = await service.getStudentByValue("10A-001");

        expect(result).not.toBeNull();
        expect(result?.id).toBe("10A-001");
      });

      it("should return null when value not found", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            "page-count": 0,
            "records-size": 0,
            "skip-records": 0,
            "row-count": 0,
            records: [],
          }),
        } as Response);

        const result = await service.getStudentByValue("NOTFOUND");

        expect(result).toBeNull();
      });
    });

    describe("createStudent", () => {
      it("should create new student", async () => {
        const newStudent = {
          id: "10A-002",
          firstName: "John",
          lastName: "Doe",
          initials: "JD",
          grade: "Grade 10 - Section A",
          status: "active" as const,
        };

        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              {
                ...mockBusinessPartners[0],
                id: 1000003,
                C_BPartner_ID: 1000003,
                Value: "10A-002",
                Name: "John Doe",
              },
            ],
          }),
        } as Response);

        const result = await service.createStudent(newStudent);

        expect(result).not.toBeNull();
        expect(result?.firstName).toBe("John");
      });
    });

    describe("updateStudent", () => {
      it("should update existing student", async () => {
        const updatedData = {
          firstName: "Jane",
          lastName: "Smith",
          initials: "JS",
          grade: "Grade 10 - Section A",
          status: "active" as const,
        };

        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            records: [
              {
                ...mockBusinessPartners[0],
                Name: "Jane Smith",
              },
            ],
          }),
        } as Response);

        const result = await service.updateStudent(1000002, updatedData);

        expect(result).not.toBeNull();
        expect(result?.firstName).toBe("Jane");
      });
    });

    describe("deleteStudent", () => {
      it("should deactivate student", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        } as Response);

        const result = await service.deleteStudent(1000002);

        expect(result).toBe(true);
      });

      it("should return false on error", async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error("Delete failed"));

        const result = await service.deleteStudent(1000002);

        expect(result).toBe(false);
      });
    });
  });

  describe("getBusinessPartnerService singleton", () => {
    it("should return singleton instance", () => {
      const instance1 = getBusinessPartnerService();
      const instance2 = getBusinessPartnerService();

      expect(instance1).toBe(instance2);
      expect(instance1).toBeInstanceOf(BusinessPartnerService);
    });
  });
});
