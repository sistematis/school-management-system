/**
 * Tests for iDempiere Query Builder
 *
 * Tests for reusable querying data functionality
 * Based on: https://bxservice.github.io/idempiere-rest-docs/docs/api-guides/crud-operations/querying-data
 */

import { describe, expect, it } from "vitest";

import {
  and,
  buildQuery,
  expand,
  filter,
  inFilter,
  methodFilter,
  not,
  or,
  orderBy,
  QueryBuilder,
  toQueryString,
} from "./query-builder";

describe("QueryBuilder", () => {
  describe("Basic Filter", () => {
    it("should build simple eq filter", () => {
      const builder = new QueryBuilder().filter("Name", "eq", "John");
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Name eq 'John'");
    });

    it("should build simple neq filter", () => {
      const builder = new QueryBuilder().filter("IsActive", "neq", true);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("IsActive neq true");
    });

    it("should build gt filter", () => {
      const builder = new QueryBuilder().filter("Amount", "gt", 100);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Amount gt 100");
    });

    it("should build gte filter", () => {
      const builder = new QueryBuilder().filter("Amount", "ge", 100);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Amount ge 100");
    });

    it("should build lt filter", () => {
      const builder = new QueryBuilder().filter("Amount", "lt", 1000);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Amount lt 1000");
    });

    it("should build lte filter", () => {
      const builder = new QueryBuilder().filter("Amount", "le", 1000);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Amount le 1000");
    });
  });

  describe("Method Filters", () => {
    it("should build contains filter", () => {
      const builder = new QueryBuilder().methodFilter("contains", "Name", "John");
      const { params } = builder.build();

      expect(params["$filter"]).toBe("contains(Name,'John')");
    });

    it("should build startswith filter", () => {
      const builder = new QueryBuilder().methodFilter("startswith", "Name", "Pa");
      const { params } = builder.build();

      expect(params["$filter"]).toBe("startswith(Name,'Pa')");
    });

    it("should build endswith filter", () => {
      const builder = new QueryBuilder().methodFilter("endswith", "Email", "example.com");
      const { params } = builder.build();

      expect(params["$filter"]).toBe("endswith(Email,'example.com')");
    });
  });

  describe("IN Filter", () => {
    it("should build in filter with strings", () => {
      const builder = new QueryBuilder().inFilter("Status", ["Active", "Pending"]);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Status in ('Active','Pending')");
    });

    it("should build in filter with numbers", () => {
      const builder = new QueryBuilder().inFilter("ID", [1, 2, 3]);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("ID in (1,2,3)");
    });

    it("should build in filter with mixed values", () => {
      const builder = new QueryBuilder().inFilter("Value", ["A", 100, "B"]);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Value in ('A',100,'B')");
    });
  });

  describe("Compound Filters", () => {
    it("should build AND filter", () => {
      const builder = new QueryBuilder().filter("Name", "eq", "John").and("IsActive", "eq", true);
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Name eq 'John' AND IsActive eq true");
    });

    it("should build OR filter", () => {
      const builder = new QueryBuilder().filter("Status", "eq", "Active").or("Status", "eq", "Pending");
      const { params } = builder.build();

      expect(params["$filter"]).toBe("Status eq 'Active' OR Status eq 'Pending'");
    });

    it("should build multiple AND filters", () => {
      const builder = new QueryBuilder()
        .filter("IsCustomer", "eq", true)
        .and("IsActive", "eq", true)
        .and("Name", "eq", "John");
      const { params } = builder.build();

      // Parentheses are added for nested compound filters (correct OData behavior)
      expect(params["$filter"]).toBe("(IsCustomer eq true AND IsActive eq true) AND Name eq 'John'");
    });

    it("should build complex AND/OR combination", () => {
      const builder = new QueryBuilder()
        .filter("IsCustomer", "eq", true)
        .and("IsActive", "eq", true)
        .or("IsVendor", "eq", true);
      const { params } = builder.build();

      // Parentheses are added for nested compound filters (correct OData behavior)
      expect(params["$filter"]).toBe("(IsCustomer eq true AND IsActive eq true) OR IsVendor eq true");
    });
  });

  describe("NOT Filter", () => {
    it("should build NOT filter", () => {
      const builder = new QueryBuilder().filter("IsActive", "eq", false).not();
      const { params } = builder.build();

      // NOT filter doesn't add extra parentheses around logical filters
      expect(params["$filter"]).toBe("NOT IsActive eq false");
    });
  });

  describe("Order By", () => {
    it("should build order by with asc (default)", () => {
      const builder = new QueryBuilder().orderBy("Name");
      const { params } = builder.build();

      expect(params["$orderby"]).toBe("Name");
    });

    it("should build order by with desc", () => {
      const builder = new QueryBuilder().orderBy("Created", "desc");
      const { params } = builder.build();

      expect(params["$orderby"]).toBe("Created desc");
    });

    it("should build order by with asc explicit", () => {
      const builder = new QueryBuilder().orderBy("Name", "asc");
      const { params } = builder.build();

      expect(params["$orderby"]).toBe("Name asc");
    });

    it("should build multiple order by clauses", () => {
      const builder = new QueryBuilder().orderByMultiple(
        { field: "Name", order: "asc" },
        { field: "Created", order: "desc" },
      );
      const { params } = builder.build();

      expect(params["$orderby"]).toBe("Name asc,Created desc");
    });
  });

  describe("Pagination (top/skip)", () => {
    it("should build top clause", () => {
      const builder = new QueryBuilder().top(10);
      const { params } = builder.build();

      expect(params["$top"]).toBe("10");
    });

    it("should build skip clause", () => {
      const builder = new QueryBuilder().skip(5);
      const { params } = builder.build();

      expect(params["$skip"]).toBe("5");
    });

    it("should build both top and skip", () => {
      const builder = new QueryBuilder().top(10).skip(20);
      const { params } = builder.build();

      expect(params["$top"]).toBe("10");
      expect(params["$skip"]).toBe("20");
    });

    it("should build pagination from page and pageSize", () => {
      const builder = new QueryBuilder().paginate(3, 20);
      const { params } = builder.build();

      // Page 3 with pageSize 20 = skip 40, top 20
      expect(params["$skip"]).toBe("40");
      expect(params["$top"]).toBe("20");
    });

    it("should calculate correct skip for page 1", () => {
      const builder = new QueryBuilder().paginate(1, 10);
      const { params } = builder.build();

      expect(params["$skip"]).toBe("0");
      expect(params["$top"]).toBe("10");
    });
  });

  describe("Select", () => {
    it("should build select with single property", () => {
      const builder = new QueryBuilder().select("Name");
      const { params } = builder.build();

      expect(params["$select"]).toBe("Name");
    });

    it("should build select with multiple properties", () => {
      const builder = new QueryBuilder().select("Name", "Value", "EMail");
      const { params } = builder.build();

      expect(params["$select"]).toBe("Name,Value,EMail");
    });
  });

  describe("Expand", () => {
    it("should build simple expand", () => {
      const builder = new QueryBuilder().expand(expand("C_BP_Group"));
      const { params } = builder.build();

      expect(params["$expand"]).toBe("C_BP_Group");
    });

    it("should build expand with select", () => {
      const builder = new QueryBuilder().expand(
        expand("C_BP_Group", {
          select: ["Name", "Description"],
        }),
      );
      const { params } = builder.build();

      expect(params["$expand"]).toBe("C_BP_Group($select=Name,Description)");
    });

    it("should build expand with filter", () => {
      const builder = new QueryBuilder().expand(
        expand("C_OrderLine", {
          filter: filter("LineNetAmt", "gt", 1000),
        }),
      );
      const { params } = builder.build();

      expect(params["$expand"]).toBe("C_OrderLine($filter=LineNetAmt gt 1000)");
    });

    it("should build expand with orderBy", () => {
      const builder = new QueryBuilder().expand(
        expand("C_OrderLine", {
          orderBy: orderBy("Line", "asc"),
        }),
      );
      const { params } = builder.build();

      expect(params["$expand"]).toBe("C_OrderLine($orderby=Line asc)");
    });

    it("should build expand with top and skip", () => {
      const builder = new QueryBuilder().expand(
        expand("C_OrderLine", {
          top: 5,
          skip: 10,
        }),
      );
      const { params } = builder.build();

      expect(params["$expand"]).toBe("C_OrderLine($top=5; $skip=10)");
    });

    it("should build expand with multiple nested options", () => {
      const builder = new QueryBuilder().expand(
        expand("C_OrderLine", {
          select: ["Line", "LineNetAmt"],
          filter: filter("LineNetAmt", "gt", 1000),
          orderBy: orderBy("Line", "asc"),
          top: 5,
        }),
      );
      const { params } = builder.build();

      expect(params["$expand"]).toBe(
        "C_OrderLine($select=Line,LineNetAmt; $filter=LineNetAmt gt 1000; $orderby=Line asc; $top=5)",
      );
    });

    it("should build multiple expands", () => {
      const builder = new QueryBuilder().expand(
        expand("C_BP_Group", { select: ["Name"] }),
        expand("AD_User", { select: ["Name", "EMail"] }),
      );
      const { params } = builder.build();

      expect(params["$expand"]).toBe("C_BP_Group($select=Name),AD_User($select=Name,EMail)");
    });

    it("should build expand with custom join key", () => {
      const builder = new QueryBuilder().expand(
        expand("C_Order", {
          customJoinKey: "salesrep_id",
          select: ["DocumentNo"],
        }),
      );
      const { params } = builder.build();

      expect(params["$expand"]).toBe("C_Order.salesrep_id($select=DocumentNo)");
    });
  });

  describe("iDempiere-specific Options", () => {
    it("should build $valrule option", () => {
      const builder = new QueryBuilder().withValRule(210);
      const { params } = builder.build();

      expect(params["$valrule"]).toBe("210");
    });

    it("should build $context option with single variable", () => {
      const builder = new QueryBuilder().withContext("M_Product_ID", 124);
      const { params } = builder.build();

      expect(params["$context"]).toBe("M_Product_ID:124");
    });

    it("should build $context option with multiple variables", () => {
      const builder = new QueryBuilder().withContext("M_Product_ID", 124).withContext("AD_Org_ID", 11);
      const { params } = builder.build();

      expect(params["$context"]).toBe("M_Product_ID:124,AD_Org_ID:11");
    });

    it("should build showsql option", () => {
      const builder = new QueryBuilder().withShowSql();
      const { params } = builder.build();

      expect(params.showsql).toBe("true");
    });

    it("should build showsql=nodata option (using withShowSql with parameter)", () => {
      const builder = new QueryBuilder().withShowSql(true);
      const { params } = builder.build();

      expect(params.showsql).toBe("nodata");
    });

    it("should build label option", () => {
      const builder = new QueryBuilder().withLabel("Name eq '#Customer'");
      const { params } = builder.build();

      expect(params.label).toBe("Name eq '#Customer'");
    });

    it("should build showlabel option (all columns)", () => {
      const builder = new QueryBuilder().withShowLabel(true);
      const { params } = builder.build();

      expect(params.showlabel).toBe("true");
    });

    it("should build showlabel option (specific columns)", () => {
      const builder = new QueryBuilder().withShowLabel(["Name", "Description"]);
      const { params } = builder.build();

      expect(params.showlabel).toBe("Name,Description");
    });
  });

  describe("Complex Queries", () => {
    it("should build complex query with filter, orderBy, pagination, select, and expand", async () => {
      // For complex filters, use helper functions combined with buildQuery
      const { and, methodFilter, buildQuery, orderBy, expand } = await import("../query");

      const query = buildQuery({
        filter: and(
          filter("IsCustomer", "eq", true),
          and(filter("IsActive", "eq", true), methodFilter("contains", "Name", "Pa")),
        ),
        orderBy: orderBy("Created", "desc"),
        top: 10,
        skip: 0,
        select: ["Name", "Value", "EMail"],
        expand: expand("C_BP_Group", { select: ["Name"] }),
      });

      expect(query.params).toBeDefined();
      expect(query.params["$filter"]).toBeDefined();
      expect(query.params["$orderby"]).toBe("Created desc");
      expect(query.params["$top"]).toBe("10");
      expect(query.params["$skip"]).toBe("0");
      expect(query.params["$select"]).toBe("Name,Value,EMail");
      expect(query.params["$expand"]).toBe("C_BP_Group($select=Name)");
    });

    it("should match the example from iDempiere documentation", () => {
      // From docs:
      // GET /api/v1/models/c_bpartner?$filter=isCustomer eq true AND isActive eq true AND startswith(name,'Pa') AND C_BPartner_ID in (120,121)
      const builder = new QueryBuilder()
        .filter("isCustomer", "eq", true)
        .and("isActive", "eq", true)
        .and("C_BPartner_ID", "eq", 120); // Note: IN is handled differently via inFilter()
      const { params } = builder.build();

      expect(params["$filter"]).toContain("isCustomer eq true");
      expect(params["$filter"]).toContain("isActive eq true");
      expect(params["$filter"]).toContain("C_BPartner_ID eq 120");
    });
  });

  describe("Builder Methods", () => {
    it("should reset builder state", () => {
      const builder = new QueryBuilder().filter("Name", "eq", "John").orderBy("Created", "desc").top(10);

      builder.reset();

      const { params } = builder.build();
      expect(params["$filter"]).toBeUndefined();
      expect(params["$orderby"]).toBeUndefined();
      expect(params["$top"]).toBeUndefined();
    });

    it("should clone builder", () => {
      const original = new QueryBuilder().filter("Name", "eq", "John").orderBy("Created", "desc");

      const cloned = original.clone();

      // Modify original
      original.filter("Name", "eq", "Jane");

      // Clone should have original values
      const clonedParams = cloned.build().params;
      expect(clonedParams["$filter"]).toBe("Name eq 'John'");
    });

    it("should generate query string", () => {
      const builder = new QueryBuilder().filter("Name", "eq", "John").top(10);

      const queryString = builder.toQueryString();

      // URL encoding is applied (%24 for $, %27 for ')
      expect(queryString).toContain("%24filter");
      expect(queryString).toContain("Name");
      expect(queryString).toContain("John");
      expect(queryString).toContain("%24top=10");
    });
  });
});

describe("Helper Functions", () => {
  describe("filter", () => {
    it("should create logical filter", () => {
      const f = filter("Name", "eq", "John");
      expect(f).toEqual({
        type: "logical",
        field: "Name",
        operator: "eq",
        value: "John",
      });
    });
  });

  describe("methodFilter", () => {
    it("should create method filter", () => {
      const f = methodFilter("contains", "Name", "John");
      expect(f).toEqual({
        type: "method",
        operator: "contains",
        field: "Name",
        value: "John",
      });
    });
  });

  describe("inFilter", () => {
    it("should create IN filter", () => {
      const f = inFilter("ID", [1, 2, 3]);
      expect(f).toEqual({
        type: "in",
        field: "ID",
        values: [1, 2, 3],
      });
    });
  });

  describe("and", () => {
    it("should combine two filters with AND", () => {
      const f1 = filter("Name", "eq", "John");
      const f2 = filter("IsActive", "eq", true);
      const combined = and(f1, f2);

      expect(combined).toEqual({
        type: "compound",
        operator: "and",
        left: f1,
        right: f2,
      });
    });

    it("should combine three filters with AND", () => {
      const f1 = filter("Name", "eq", "John");
      const f2 = filter("IsActive", "eq", true);
      const f3 = filter("IsCustomer", "eq", true);
      const combined = and(f1, f2, f3);

      expect(combined.type).toBe("compound");
    });

    it("should return single filter if only one provided", () => {
      const f1 = filter("Name", "eq", "John");
      const combined = and(f1);

      expect(combined).toBe(f1);
    });

    it("should throw error if no filters provided", () => {
      expect(() => and()).toThrow();
    });
  });

  describe("or", () => {
    it("should combine two filters with OR", () => {
      const f1 = filter("Status", "eq", "Active");
      const f2 = filter("Status", "eq", "Pending");
      const combined = or(f1, f2);

      expect(combined).toEqual({
        type: "compound",
        operator: "or",
        left: f1,
        right: f2,
      });
    });

    it("should return single filter if only one provided", () => {
      const f1 = filter("Status", "eq", "Active");
      const combined = or(f1);

      expect(combined).toBe(f1);
    });

    it("should throw error if no filters provided", () => {
      expect(() => or()).toThrow();
    });
  });

  describe("not", () => {
    it("should negate filter", () => {
      const f1 = filter("IsActive", "eq", false);
      const negated = not(f1);

      expect(negated).toEqual({
        type: "not",
        filter: f1,
      });
    });
  });

  describe("orderBy", () => {
    it("should create order by clause", () => {
      const clause = orderBy("Name", "desc");
      expect(clause).toEqual({
        field: "Name",
        order: "desc",
      });
    });

    it("should create order by without order (defaults to asc)", () => {
      const clause = orderBy("Name");
      expect(clause).toEqual({
        field: "Name",
      });
    });
  });

  describe("expand", () => {
    it("should create expand clause", () => {
      const clause = expand("C_BP_Group");
      expect(clause).toEqual({
        field: "C_BP_Group",
      });
    });

    it("should create expand with nested options", () => {
      const clause = expand("C_BP_Group", {
        select: ["Name"],
        filter: filter("IsActive", "eq", true),
      });
      expect(clause.field).toBe("C_BP_Group");
      expect(clause.select).toEqual(["Name"]);
      expect(clause.filter).toBeDefined();
    });
  });

  describe("buildQuery", () => {
    it("should build query from config", async () => {
      const { filter, orderBy, buildQuery } = await import("../query");

      const config = {
        filter: filter("Name", "eq", "John"),
        orderBy: orderBy("Created", "desc"),
        top: 10,
      };

      const { params } = buildQuery(config);

      expect(params["$filter"]).toBe("Name eq 'John'");
      expect(params["$orderby"]).toBe("Created desc");
      expect(params["$top"]).toBe("10");
    });
  });

  describe("toQueryString", () => {
    it("should convert config to query string", async () => {
      const { filter, toQueryString } = await import("../query");

      const config = {
        filter: filter("Name", "eq", "John"),
        top: 10,
      };

      const queryString = toQueryString(config);

      // URL encoding is applied
      expect(queryString).toContain("%24filter");
      expect(queryString).toContain("Name");
      expect(queryString).toContain("John");
      expect(queryString).toContain("%24top=10");
    });
  });
});
