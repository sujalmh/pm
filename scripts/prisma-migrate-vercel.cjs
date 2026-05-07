/**
 * Runs `prisma migrate deploy`. If deploy fails (e.g. P3009 failed migration),
 * attempts recovery then retries once.
 */
const { spawnSync } = require("child_process");

function migrateDeploy() {
  const r = spawnSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  return r.status === 0;
}

if (migrateDeploy()) {
  process.exit(0);
}

console.warn(
  "[prisma-migrate-vercel] migrate deploy failed; attempting recovery for 20250507120000_init …",
);

const id = "20250507120000_init";

spawnSync("npx", ["prisma", "migrate", "resolve", "--applied", id], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if (!migrateDeploy()) {
  console.warn(
    "[prisma-migrate-vercel] retry failed; trying resolve --rolled-back …",
  );
  spawnSync("npx", ["prisma", "migrate", "resolve", "--rolled-back", id], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (!migrateDeploy()) {
    process.exit(1);
  }
}
