/**
 * Apply migrations and seed using env from a file (default: .env.production.local).
 * Usage: node scripts/provision-db.cjs
 *    or:  DOTENV_CONFIG_PATH=.env.local node scripts/provision-db.cjs
 */
const path = require("path");
const { execSync } = require("child_process");
const dotenv = require("dotenv");

const envFile =
  process.env.DOTENV_CONFIG_PATH ||
  path.join(__dirname, "..", ".env.production.local");

const result = dotenv.config({ path: envFile });
if (result.error) {
  console.error("Failed to load env file:", envFile, result.error.message);
  process.exit(1);
}

/** Fix Vercel/dotenv pulls that leave quotes or `"\r\n` inside the URL. */
function sanitizeDatabaseUrl(url) {
  if (!url) return url;
  let u = String(url).trim();
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

const rawUrl =
  process.env.DIRECT_URL ||
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!rawUrl) {
  console.error(
    "No database URL: set DATABASE_URL or DIRECT_URL in",
    envFile,
  );
  process.exit(1);
}

process.env.DATABASE_URL = sanitizeDatabaseUrl(rawUrl);

const opts = { stdio: "inherit", env: { ...process.env } };

console.log("→ prisma migrate deploy");
execSync("npx prisma migrate deploy", opts);

console.log("→ prisma db seed");
execSync("npx prisma db seed", opts);

console.log("Done.");
