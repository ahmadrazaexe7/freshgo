import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

// Connection pooling is automatic with Prisma and PostgreSQL
// The DATABASE_URL should use connection pooling: postgresql://user:pass@host/db?schema=public

