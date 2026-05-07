import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/** Strip quotes / line-ending junk from Vercel or `.env` copy-paste mistakes. */
function sanitizeDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  let u = url.trim();
  while (
    (u.startsWith('"') && u.endsWith('"')) ||
    (u.startsWith("'") && u.endsWith("'"))
  ) {
    u = u.slice(1, -1).trim();
  }
  u = u.replace(/"\s*(\\r\\n|\r\n|\\r|\\n)*$/g, "");
  u = u.replace(/\\r\\n$/g, "").replace(/\r\n$/g, "").trim();
  return u;
}

for (const key of [
  "DATABASE_URL",
  "DIRECT_URL",
  "DIRECT_DATABASE_URL",
] as const) {
  const v = process.env[key];
  if (v) {
    const s = sanitizeDatabaseUrl(v);
    if (s) process.env[key] = s;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
