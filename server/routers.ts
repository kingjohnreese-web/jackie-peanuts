import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { sendEmail, sendVerificationCode, verifyCode, SendEmailSchema, SendVerificationCodeSchema } from "./email";
import { getEmailLogs } from "./db";
import { TRPCError } from "@trpc/server";
import {
  sendOrderNotification,
  sendWholesaleNotification,
  sendSubscriberNotification,
  sendBroadcastEmail,
  OrderSchema,
  WholesaleSchema,
  SubscriberSchema,
  BroadcastSchema,
} from "./jackie-peanuts-service";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  email: router({
    send: publicProcedure
      .input(SendEmailSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await sendEmail(input);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send email";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),

    sendVerificationCode: publicProcedure
      .input(SendVerificationCodeSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await sendVerificationCode(input);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send verification code";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),

    verifyCode: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          code: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await verifyCode(input.email, input.code);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to verify code";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),

    getLogs: publicProcedure
      .input(
        z.object({
          limit: z.number().int().min(1).max(100).optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          const logs = await getEmailLogs(input.limit || 50);
          return logs;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to get email logs";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),
  }),

  jackiePeanuts: router({
    sendOrder: publicProcedure
      .input(OrderSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await sendOrderNotification(input);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send order notification";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),

    sendWholesale: publicProcedure
      .input(WholesaleSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await sendWholesaleNotification(input);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send wholesale notification";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),

    sendSubscriber: publicProcedure
      .input(SubscriberSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await sendSubscriberNotification(input);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send subscriber notification";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),

    sendBroadcast: publicProcedure
      .input(BroadcastSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await sendBroadcastEmail(input);
          return result;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to send broadcast email";
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
