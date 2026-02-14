// Prisma 7 設定ファイル
// datasource URL と seed コマンドを一元管理
import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(import.meta.dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(import.meta.dirname, "prisma", "migrations"),
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "",
  },
  // @ts-expect-error - PrismaConfig type definition might be outdated
  seed: {
    command: "tsx prisma/seed.ts",
  },
});
