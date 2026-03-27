import { eq, and, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, emailLogs, InsertEmailLog, verificationCodes, InsertVerificationCode } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Email logging queries
export async function createEmailLog(data: InsertEmailLog) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create email log: database not available");
    return null;
  }

  try {
    const result = await db.insert(emailLogs).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create email log:", error);
    throw error;
  }
}

export async function updateEmailLog(id: number, data: Partial<InsertEmailLog>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update email log: database not available");
    return null;
  }

  try {
    await db.update(emailLogs).set(data).where(eq(emailLogs.id, id));
  } catch (error) {
    console.error("[Database] Failed to update email log:", error);
    throw error;
  }
}

export async function getEmailLogs(limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get email logs: database not available");
    return [];
  }

  try {
    return await db.select().from(emailLogs).orderBy(emailLogs.createdAt).limit(limit);
  } catch (error) {
    console.error("[Database] Failed to get email logs:", error);
    return [];
  }
}

// Verification code queries
export async function createVerificationCode(data: InsertVerificationCode) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create verification code: database not available");
    return null;
  }

  try {
    const result = await db.insert(verificationCodes).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create verification code:", error);
    throw error;
  }
}

export async function getValidVerificationCode(email: string, code: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get verification code: database not available");
    return null;
  }

  try {
    const result = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.email, email),
          eq(verificationCodes.code, code),
          eq(verificationCodes.used, 0),
          gt(verificationCodes.expiresAt, new Date())
        )
      )
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get verification code:", error);
    return null;
  }
}

export async function markVerificationCodeAsUsed(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot mark verification code as used: database not available");
    return null;
  }

  try {
    await db.update(verificationCodes).set({ used: 1 }).where(eq(verificationCodes.id, id));
  } catch (error) {
    console.error("[Database] Failed to mark verification code as used:", error);
    throw error;
  }
}
