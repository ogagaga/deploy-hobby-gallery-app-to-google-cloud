// Prisma Client 初期化 - Prisma 7 (ドライバーアダプター使用)
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({
      adapter,
      log: ["query"],
    })
  })()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
