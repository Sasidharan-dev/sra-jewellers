import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
};

export function getPrisma() {
  if (!process.env.DATABASE_URL) return undefined;
  if (!globalForPrisma.pool)
    globalForPrisma.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 2,
    });
  if (!globalForPrisma.prisma)
    globalForPrisma.prisma = new PrismaClient({
      adapter: new PrismaPg(globalForPrisma.pool),
    });
  return globalForPrisma.prisma;
}
