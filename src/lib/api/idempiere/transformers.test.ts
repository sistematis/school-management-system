/**
 * Tests for iDempiere Transformers
 */

import { describe, expect, it } from "vitest";

import {
  filterStudentsByGrade,
  filterStudentsBySearch,
  transformBPartnersToStudents,
  transformBPartnerToStudent,
  transformStudentToBPartner,
} from "./transformers";
import type { BusinessPartner } from "./types";

describe("Transformers", () => {
  describe("transformBPartnerToStudent", () => {
    it("should transform basic Business Partner to Student", () => {
      const bPartner: BusinessPartner = {
        C_BPartner_ID: 1000001,
        Value: "10A-001",
        Name: "John Smith",
        EMail: "john.smith@student.edu",
        Phone: "+62 812 3456 7890",
        Birthday: "2010-05-15",
        IsActive: true,
        C_BP_Group: {
          C_BP_Group_ID: 100001,
          Name: "Grade 10 - Section A",
        },
        AD_User: [
          {
            AD_User_ID: 100001,
            Name: "Robert Smith",
            IsActive: true,
          },
        ],
      };

      const student = transformBPartnerToStudent(bPartner);

      expect(student.id).toBe("10A-001");
      expect(student.firstName).toBe("John");
      expect(student.lastName).toBe("Smith");
      expect(student.initials).toBe("JS");
      expect(student.email).toBe("john.smith@student.edu");
      expect(student.phone).toBe("+62 812 3456 7890");
      expect(student.dateOfBirth).toBe("2010-05-15");
      expect(student.status).toBe("active");
      expect(student.grade).toBe("Grade 10 - Section A");
      expect(student.parentName).toBe("Robert Smith");
    });

    it("should handle missing optional fields", () => {
      const bPartner: BusinessPartner = {
        C_BPartner_ID: 1000002,
        Value: "09A-015",
        Name: "Sarah Johnson",
        IsActive: true,
      };

      const student = transformBPartnerToStudent(bPartner);

      expect(student.id).toBe("09A-015");
      expect(student.firstName).toBe("Sarah");
      expect(student.lastName).toBe("Johnson");
      expect(student.initials).toBe("SJ");
      expect(student.email).toBeUndefined();
      expect(student.phone).toBeUndefined();
      expect(student.parentName).toBeUndefined();
    });

    it("should set status to inactive when IsActive is false", () => {
      const bPartner: BusinessPartner = {
        C_BPartner_ID: 1000003,
        Value: "11B-023",
        Name: "Michael Chen",
        IsActive: false,
      };

      const student = transformBPartnerToStudent(bPartner);

      expect(student.status).toBe("inactive");
    });

    it("should handle single name correctly", () => {
      const bPartner: BusinessPartner = {
        C_BPartner_ID: 1000004,
        Value: "10A-004",
        Name: "Madonna",
        IsActive: true,
      };

      const student = transformBPartnerToStudent(bPartner);

      expect(student.firstName).toBe("Madonna");
      expect(student.lastName).toBe("");
      expect(student.initials).toBe("M");
    });

    it("should handle multi-part names", () => {
      const bPartner: BusinessPartner = {
        C_BPartner_ID: 1000005,
        Value: "12A-005",
        Name: "John Michael Smith Jr",
        IsActive: true,
      };

      const student = transformBPartnerToStudent(bPartner);

      expect(student.firstName).toBe("John");
      expect(student.lastName).toBe("Michael Smith Jr");
      expect(student.initials).toBe("JM");
    });

    it("should normalize various grade formats", () => {
      const testCases = [
        { bpGroupName: "Grade 10 - Section A", expected: "Grade 10 - Section A" },
        { bpGroupName: "10th Grade - A", expected: "Grade 10 - Section A" },
        { bpGroupName: "Class 11-B", expected: "Grade 11 - Section B" },
        { bpGroupName: "9A", expected: "Grade 9 - Section A" },
      ];

      testCases.forEach(({ bpGroupName, expected }) => {
        const bPartner: BusinessPartner = {
          C_BPartner_ID: 1,
          Value: "TEST-001",
          Name: "Test Student",
          IsActive: true,
          C_BP_Group: {
            C_BP_Group_ID: 1,
            Name: bpGroupName,
          },
        };

        const student = transformBPartnerToStudent(bPartner);
        expect(student.grade).toBe(expected);
      });
    });
  });

  describe("transformBPartnersToStudents", () => {
    it("should transform array of Business Partners to Students", () => {
      const bPartners: BusinessPartner[] = [
        {
          C_BPartner_ID: 1000001,
          Value: "10A-001",
          Name: "John Smith",
          IsActive: true,
        },
        {
          C_BPartner_ID: 1000002,
          Value: "09A-015",
          Name: "Sarah Johnson",
          IsActive: true,
        },
      ];

      const students = transformBPartnersToStudents(bPartners);

      expect(students).toHaveLength(2);
      expect(students[0]?.id).toBe("10A-001");
      expect(students[1]?.id).toBe("09A-015");
    });

    it("should handle empty array", () => {
      const students = transformBPartnersToStudents([]);
      expect(students).toEqual([]);
    });
  });

  describe("transformStudentToBPartner", () => {
    it("should transform Student to Business Partner for create/update", () => {
      const student = {
        id: "10A-001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@student.edu",
        phone: "+62 812 3456 7890",
        dateOfBirth: "2010-05-15",
        status: "active" as const,
        emergencyContact: "Jane Smith",
        allergies: "Peanuts",
        medicalConditions: "Asthma",
      };

      const bPartner = transformStudentToBPartner(student);

      expect(bPartner.Value).toBe("10A-001");
      expect(bPartner.Name).toBe("John Smith");
      expect(bPartner.EMail).toBe("john.smith@student.edu");
      expect(bPartner.Phone).toBe("+62 812 3456 7890");
      expect(bPartner.Birthday).toBe("2010-05-15");
      expect(bPartner.IsActive).toBe(true);
      expect(bPartner.parentContact).toBe("Jane Smith");
      expect(bPartner.allergies).toBe("Peanuts");
      expect(bPartner.medicalConditions).toBe("Asthma");
    });

    it("should handle inactive status", () => {
      const student = {
        id: "10A-002",
        firstName: "Jane",
        lastName: "Doe",
        status: "inactive" as const,
      };

      const bPartner = transformStudentToBPartner(student);

      expect(bPartner.IsActive).toBe(false);
    });

    it("should handle partial student data", () => {
      const student = {
        firstName: "Test",
        lastName: "Student",
      };

      const bPartner = transformStudentToBPartner(student);

      expect(bPartner.Name).toBe("Test Student");
      expect(bPartner.Value).toBe("");
    });
  });

  describe("filterStudentsByGrade", () => {
    const mockStudents = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        initials: "JD",
        grade: "Grade 9 - Section A",
        status: "active" as const,
      },
      {
        id: "2",
        firstName: "Jane",
        lastName: "Smith",
        initials: "JS",
        grade: "Grade 10 - Section A",
        status: "active" as const,
      },
      {
        id: "3",
        firstName: "Bob",
        lastName: "Johnson",
        initials: "BJ",
        grade: "Grade 10 - Section B",
        status: "active" as const,
      },
    ] as const;

    it("should return all students when grade is 'all'", () => {
      const result = filterStudentsByGrade(mockStudents, "all");
      expect(result).toHaveLength(3);
    });

    it("should filter students by exact grade match", () => {
      const result = filterStudentsByGrade(mockStudents, "Grade 10 - Section A");
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("2");
    });

    it("should filter students by partial grade match", () => {
      const result = filterStudentsByGrade(mockStudents, "10");
      expect(result).toHaveLength(2);
      expect(result.every((s) => s.grade.includes("10"))).toBe(true);
    });
  });

  describe("filterStudentsBySearch", () => {
    const mockStudents = [
      {
        id: "10A-001",
        firstName: "John",
        lastName: "Smith",
        initials: "JS",
        email: "john.smith@student.edu",
        grade: "Grade 10 - Section A",
        status: "active" as const,
      },
      {
        id: "09A-015",
        firstName: "Sarah",
        lastName: "Johnson",
        initials: "SJ",
        email: "sarah.j@student.edu",
        grade: "Grade 9 - Section A",
        status: "active" as const,
      },
      {
        id: "11B-023",
        firstName: "Michael",
        lastName: "Chen",
        initials: "MC",
        email: "michael.c@student.edu",
        grade: "Grade 11 - Section B",
        status: "active" as const,
      },
    ] as const;

    it("should return all students when search term is empty", () => {
      const result = filterStudentsBySearch(mockStudents, "");
      expect(result).toHaveLength(3);
    });

    it("should search by first name", () => {
      const result = filterStudentsBySearch(mockStudents, "john");
      expect(result).toHaveLength(2); // John Smith, Sarah Johnson
      expect(result.some((s) => s.firstName === "John")).toBe(true);
      expect(result.some((s) => s.lastName === "Johnson")).toBe(true);
    });

    it("should search by student ID", () => {
      const result = filterStudentsBySearch(mockStudents, "10A-001");
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("10A-001");
    });

    it("should search by email", () => {
      const result = filterStudentsBySearch(mockStudents, "john.smith");
      expect(result).toHaveLength(1);
      expect(result[0]?.email).toBe("john.smith@student.edu");
    });

    it("should be case insensitive", () => {
      const result = filterStudentsBySearch(mockStudents, "JOHN");
      expect(result).toHaveLength(2);
    });

    it("should handle whitespace in search term", () => {
      const result = filterStudentsBySearch(mockStudents, "  john  ");
      expect(result).toHaveLength(2);
    });
  });
});
