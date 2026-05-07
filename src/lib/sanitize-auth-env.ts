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

/**
 * On Vercel, AUTH_URL is often pasted as `http://localhost:3000`, which breaks
 * post-login redirects. Prefer the deployment host when env points at localhost.
 */
function fixAuthBaseUrlOnVercel() {
  if (process.env.VERCEL !== "1") return;

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (!vercelHost) return;

  const base = `https://${vercelHost.replace(/^https?:\/\//, "")}`;

  const isBroken = (url: string | undefined) =>
    !url ||
    url.includes("localhost") ||
    url.includes("127.0.0.1");

  if (isBroken(process.env.AUTH_URL)) {
    process.env.AUTH_URL = base;
  }
  if (isBroken(process.env.NEXTAUTH_URL)) {
    process.env.NEXTAUTH_URL = base;
  }
}

fixAuthBaseUrlOnVercel();
