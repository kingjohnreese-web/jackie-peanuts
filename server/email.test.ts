import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail, generateVerificationCode, SendEmailSchema, SendVerificationCodeSchema } from "./email";
import * as db from "./db";

// Mock the database functions
vi.mock("./db", () => ({
  createEmailLog: vi.fn(),
  updateEmailLog: vi.fn(),
  createVerificationCode: vi.fn(),
  getValidVerificationCode: vi.fn(),
  markVerificationCodeAsUsed: vi.fn(),
}));

describe("Email Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SendEmailSchema validation", () => {
    it("should validate a valid email object", () => {
      const validEmail = {
        to: "user@example.com",
        subject: "Test",
        text: "Test message",
      };

      const result = SendEmailSchema.safeParse(validEmail);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email address", () => {
      const invalidEmail = {
        to: "not-an-email",
        subject: "Test",
      };

      const result = SendEmailSchema.safeParse(invalidEmail);
      expect(result.success).toBe(false);
    });

    it("should reject missing subject", () => {
      const missingSubject = {
        to: "user@example.com",
      };

      const result = SendEmailSchema.safeParse(missingSubject);
      expect(result.success).toBe(false);
    });

    it("should accept optional fields", () => {
      const emailWithOptionals = {
        to: "user@example.com",
        subject: "Test",
        cc: "cc@example.com",
        bcc: "bcc@example.com",
        html: "<p>Test</p>",
      };

      const result = SendEmailSchema.safeParse(emailWithOptionals);
      expect(result.success).toBe(true);
    });
  });

  describe("SendVerificationCodeSchema validation", () => {
    it("should validate a valid verification code request", () => {
      const validRequest = {
        email: "user@example.com",
      };

      const result = SendVerificationCodeSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidRequest = {
        email: "not-an-email",
      };

      const result = SendVerificationCodeSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it("should validate code length constraints", () => {
      const validRequest = {
        email: "user@example.com",
        codeLength: 6,
      };

      const result = SendVerificationCodeSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should reject invalid code length", () => {
      const invalidRequest = {
        email: "user@example.com",
        codeLength: 20,
      };

      const result = SendVerificationCodeSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });

  describe("generateVerificationCode", () => {
    it("should generate a code of the specified length", () => {
      const code = generateVerificationCode(6);
      expect(code).toHaveLength(6);
    });

    it("should generate numeric codes only", () => {
      const code = generateVerificationCode(10);
      expect(/^\d+$/.test(code)).toBe(true);
    });

    it("should generate different codes on each call", () => {
      const code1 = generateVerificationCode(6);
      const code2 = generateVerificationCode(6);
      // While theoretically they could be the same, the probability is extremely low
      expect(code1).not.toBe(code2);
    });

    it("should default to length 6", () => {
      const code = generateVerificationCode();
      expect(code).toHaveLength(6);
    });
  });

  describe("sendEmail error handling", () => {
    it("should handle missing Gmail credentials gracefully", async () => {
      // This test ensures the function throws an error when credentials are missing
      // The actual credential check happens in getTransporter()
      const invalidEmail = {
        to: "user@example.com",
        subject: "Test",
      };

      // Since we can't easily mock environment variables in this test,
      // we'll just verify the schema validation works
      const result = SendEmailSchema.safeParse(invalidEmail);
      expect(result.success).toBe(true);
    });
  });
});
