/**
 * Strips accidental quotes and line endings from URL env vars.
 * Common when copying from a .env file into Vercel (e.g. `"http://localhost:3000"\r`).
 */
function sanitizeUrlEnvVar(key: "AUTH_URL" | "NEXTAUTH_URL") {
  const raw = process.env[key];
  if (raw == null || raw === "") return;

  let v = raw.trim().replace(/\r?\n/g, "");
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  process.env[key] = v;
}

sanitizeUrlEnvVar("AUTH_URL");
sanitizeUrlEnvVar("NEXTAUTH_URL");
