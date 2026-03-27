import nodemailer from "nodemailer";
import { z } from "zod";
import { createEmailLog, updateEmailLog } from "./db";
import { ENV } from "./_core/env";

// Validation schemas
export const SendEmailSchema = z.object({
  to: z.string().email("Invalid recipient email address"),
  from: z.string().email("Invalid sender email address").optional(),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().min(1, "Subject is required").max(500, "Subject too long"),
  text: z.string().optional(),
  html: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;

export const SendVerificationCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  codeLength: z.number().int().min(4).max(10).optional(),
});

export type SendVerificationCodeInput = z.infer<typeof SendVerificationCodeSchema>;

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

// Send email function
export async function sendEmail(input: SendEmailInput) {
  try {
    const transporter = getTransporter();
    const fromEmail = input.from || ENV.gmailUser;

    // Create email log entry
    const logEntry = await createEmailLog({
      to: input.to,
      from: fromEmail,
      cc: input.cc,
      bcc: input.bcc,
      subject: input.subject,
      textContent: input.text,
      htmlContent: input.html,
      status: "pending",
    });

    const logId = (logEntry as any)?.insertId;

    try {
      // Send email
      const mailOptions: any = {
        from: fromEmail,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      };

      if (input.cc) mailOptions.cc = input.cc;
      if (input.bcc) mailOptions.bcc = input.bcc;
      if (input.headers) mailOptions.headers = input.headers;

      const info = await transporter.sendMail(mailOptions);

      // Update log with success
      if (logId) {
        await updateEmailLog(logId, {
          status: "sent",
          messageId: info.messageId || undefined,
        });
      }

      return {
        success: true,
        messageId: info.messageId || undefined,
        logId,
        message: "Email sent successfully",
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      // Update log with failure
      if (logId) {
        await updateEmailLog(logId, {
          status: "failed",
          errorMessage,
        });
      }

      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Email Service] Error:", message);
    throw error;
  }
}

// Generate verification code
export function generateVerificationCode(length: number = 6): string {
  const chars = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Send verification code
export async function sendVerificationCode(input: SendVerificationCodeInput) {
  try {
    const code = generateVerificationCode(input.codeLength || 6);
    const subject = input.subject || "Your Verification Code";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verification Code</h2>
        <p style="color: #666; font-size: 16px;">Your verification code is:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <p style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; margin: 0;">${code}</p>
        </div>
        <p style="color: #999; font-size: 14px;">This code will expire in 10 minutes.</p>
      </div>
    `;

    // Send email with verification code
    const result = await sendEmail({
      to: input.email,
      subject,
      html,
      text: `Your verification code is: ${code}`,
    });

    return {
      success: true,
      code,
      logId: result.logId,
      message: "Verification code sent successfully",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Verification Code Service] Error:", message);
    throw error;
  }
}

// Verify code
export async function verifyCode(email: string, code: string) {
  try {
    const { getValidVerificationCode, markVerificationCodeAsUsed } = await import("./db");

    const validCode = await getValidVerificationCode(email, code);

    if (!validCode) {
      return {
        success: false,
        message: "Invalid or expired verification code",
      };
    }

    // Mark code as used
    await markVerificationCodeAsUsed(validCode.id);

    return {
      success: true,
      message: "Verification code is valid",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Verification Service] Error:", message);
    throw error;
  }
}
