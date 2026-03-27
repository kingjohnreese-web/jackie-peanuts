import nodemailer from "nodemailer";
import { z } from "zod";
import {
  orderEmailTemplate,
  wholesaleEmailTemplate,
  subscriberEmailTemplate,
  broadcastEmailTemplate,
  OrderEmailData,
  WholesaleEmailData,
  SubscriberEmailData,
  BroadcastEmailData,
} from "./templates";
import { ENV } from "./_core/env";

// Validation schemas
export const OrderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  items: z.array(
    z.object({
      productName: z.string(),
      variant: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
    })
  ),
  totalAmount: z.union([z.string(), z.number()]),
  notes: z.string().optional().nullable(),
  orderId: z.number().int().positive(),
});

export const WholesaleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().optional().nullable(),
  message: z.string().min(1, "Message is required"),
});

export const SubscriberSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().optional().nullable(),
});

export const BroadcastSchema = z.object({
  emails: z.array(z.string().email()).min(1, "At least one email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

// Owner notification emails
const OWNER_EMAILS = ["jackiepeanuts.ke@gmail.com", "usoppboy861@gmail.com"];

// Initialize Nodemailer transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    if (!ENV.gmailUser || !ENV.gmailAppPassword) {
      throw new Error("Gmail credentials not configured");
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ENV.gmailUser,
        pass: ENV.gmailAppPassword,
      },
    });
  }
  return transporter;
}

/**
 * Send order notification email to owners
 */
export async function sendOrderNotification(data: OrderEmailData) {
  try {
    const transporter = getTransporter();

    const html = orderEmailTemplate(data);

    const info = await transporter.sendMail({
      from: `"Jackie Peanuts" <${ENV.gmailUser}>`,
      to: OWNER_EMAILS.join(","),
      subject: `New Order #${data.orderId} from ${data.name} - KES ${data.totalAmount}`,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      message: "Order notification sent successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Jackie Peanuts Service] Order notification error:", message);
    throw error;
  }
}

/**
 * Send wholesale inquiry notification email to owners
 */
export async function sendWholesaleNotification(data: WholesaleEmailData) {
  try {
    const transporter = getTransporter();

    const html = wholesaleEmailTemplate(data);

    const info = await transporter.sendMail({
      from: `"Jackie Peanuts" <${ENV.gmailUser}>`,
      to: OWNER_EMAILS.join(","),
      subject: `Wholesale Inquiry from ${data.name}`,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      message: "Wholesale inquiry notification sent successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Jackie Peanuts Service] Wholesale notification error:", message);
    throw error;
  }
}

/**
 * Send subscriber notification email to owners
 */
export async function sendSubscriberNotification(data: SubscriberEmailData) {
  try {
    const transporter = getTransporter();

    const html = subscriberEmailTemplate(data);

    const info = await transporter.sendMail({
      from: `"Jackie Peanuts" <${ENV.gmailUser}>`,
      to: OWNER_EMAILS.join(","),
      subject: `New Subscriber: ${data.email}`,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      message: "Subscriber notification sent successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Jackie Peanuts Service] Subscriber notification error:", message);
    throw error;
  }
}

/**
 * Send broadcast email to multiple recipients
 */
export async function sendBroadcastEmail(data: BroadcastEmailData) {
  try {
    const transporter = getTransporter();

    const html = broadcastEmailTemplate(data.message);

    const info = await transporter.sendMail({
      from: `"Jackie Peanuts" <${ENV.gmailUser}>`,
      to: ENV.gmailUser,
      bcc: data.emails.join(","),
      subject: data.subject,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
      sentCount: data.emails.length,
      message: `Broadcast email sent to ${data.emails.length} recipients`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Jackie Peanuts Service] Broadcast email error:", message);
    throw error;
  }
}
