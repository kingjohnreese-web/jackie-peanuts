import { describe, it, expect } from "vitest";
import {
  OrderSchema,
  WholesaleSchema,
  SubscriberSchema,
  BroadcastSchema,
} from "./jackie-peanuts-service";

describe("Jackie Peanuts Email Service Schemas", () => {
  describe("OrderSchema validation", () => {
    it("should validate a valid order", () => {
      const validOrder = {
        name: "John Doe",
        email: "john@example.com",
        phone: "0712345678",
        items: [
          {
            productName: "Roasted Peanuts",
            variant: "Salted",
            quantity: 2,
            price: 500,
          },
        ],
        totalAmount: 1000,
        notes: "Deliver on Monday",
        orderId: 12345,
      };

      const result = OrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it("should reject order with invalid email", () => {
      const invalidOrder = {
        name: "John Doe",
        email: "not-an-email",
        phone: "0712345678",
        items: [],
        totalAmount: 1000,
        orderId: 12345,
      };

      const result = OrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it("should reject order with missing required fields", () => {
      const incompleteOrder = {
        name: "John Doe",
        email: "john@example.com",
        // missing phone, items, totalAmount, orderId
      };

      const result = OrderSchema.safeParse(incompleteOrder);
      expect(result.success).toBe(false);
    });

    it("should accept order with numeric totalAmount", () => {
      const orderWithNumericTotal = {
        name: "John Doe",
        email: "john@example.com",
        phone: "0712345678",
        items: [
          {
            productName: "Peanuts",
            variant: "Salted",
            quantity: 1,
            price: 500,
          },
        ],
        totalAmount: 500,
        orderId: 1,
      };

      const result = OrderSchema.safeParse(orderWithNumericTotal);
      expect(result.success).toBe(true);
    });

    it("should accept order with string totalAmount", () => {
      const orderWithStringTotal = {
        name: "John Doe",
        email: "john@example.com",
        phone: "0712345678",
        items: [
          {
            productName: "Peanuts",
            variant: "Salted",
            quantity: 1,
            price: 500,
          },
        ],
        totalAmount: "500",
        orderId: 1,
      };

      const result = OrderSchema.safeParse(orderWithStringTotal);
      expect(result.success).toBe(true);
    });
  });

  describe("WholesaleSchema validation", () => {
    it("should validate a valid wholesale inquiry", () => {
      const validWholesale = {
        name: "Business Owner",
        email: "business@example.com",
        phone: "0712345678",
        company: "ABC Retail",
        message: "Interested in bulk orders",
      };

      const result = WholesaleSchema.safeParse(validWholesale);
      expect(result.success).toBe(true);
    });

    it("should validate wholesale inquiry without company", () => {
      const wholesaleWithoutCompany = {
        name: "Business Owner",
        email: "business@example.com",
        phone: "0712345678",
        message: "Interested in bulk orders",
      };

      const result = WholesaleSchema.safeParse(wholesaleWithoutCompany);
      expect(result.success).toBe(true);
    });

    it("should reject wholesale inquiry with invalid email", () => {
      const invalidWholesale = {
        name: "Business Owner",
        email: "invalid-email",
        phone: "0712345678",
        message: "Interested in bulk orders",
      };

      const result = WholesaleSchema.safeParse(invalidWholesale);
      expect(result.success).toBe(false);
    });

    it("should reject wholesale inquiry with missing message", () => {
      const missingMessage = {
        name: "Business Owner",
        email: "business@example.com",
        phone: "0712345678",
      };

      const result = WholesaleSchema.safeParse(missingMessage);
      expect(result.success).toBe(false);
    });
  });

  describe("SubscriberSchema validation", () => {
    it("should validate a valid subscriber", () => {
      const validSubscriber = {
        email: "subscriber@example.com",
        name: "John Doe",
      };

      const result = SubscriberSchema.safeParse(validSubscriber);
      expect(result.success).toBe(true);
    });

    it("should validate subscriber without name", () => {
      const subscriberWithoutName = {
        email: "subscriber@example.com",
      };

      const result = SubscriberSchema.safeParse(subscriberWithoutName);
      expect(result.success).toBe(true);
    });

    it("should reject subscriber with invalid email", () => {
      const invalidSubscriber = {
        email: "not-an-email",
        name: "John Doe",
      };

      const result = SubscriberSchema.safeParse(invalidSubscriber);
      expect(result.success).toBe(false);
    });

    it("should reject subscriber with missing email", () => {
      const missingEmail = {
        name: "John Doe",
      };

      const result = SubscriberSchema.safeParse(missingEmail);
      expect(result.success).toBe(false);
    });
  });

  describe("BroadcastSchema validation", () => {
    it("should validate a valid broadcast", () => {
      const validBroadcast = {
        emails: ["user1@example.com", "user2@example.com"],
        subject: "New Product Launch",
        message: "We have a new product!",
      };

      const result = BroadcastSchema.safeParse(validBroadcast);
      expect(result.success).toBe(true);
    });

    it("should reject broadcast with invalid email", () => {
      const invalidBroadcast = {
        emails: ["user1@example.com", "not-an-email"],
        subject: "New Product Launch",
        message: "We have a new product!",
      };

      const result = BroadcastSchema.safeParse(invalidBroadcast);
      expect(result.success).toBe(false);
    });

    it("should reject broadcast with empty emails array", () => {
      const emptyEmails = {
        emails: [],
        subject: "New Product Launch",
        message: "We have a new product!",
      };

      const result = BroadcastSchema.safeParse(emptyEmails);
      expect(result.success).toBe(false);
    });

    it("should reject broadcast with missing subject", () => {
      const missingSubject = {
        emails: ["user1@example.com"],
        message: "We have a new product!",
      };

      const result = BroadcastSchema.safeParse(missingSubject);
      expect(result.success).toBe(false);
    });

    it("should reject broadcast with missing message", () => {
      const missingMessage = {
        emails: ["user1@example.com"],
        subject: "New Product Launch",
      };

      const result = BroadcastSchema.safeParse(missingMessage);
      expect(result.success).toBe(false);
    });
  });
});
