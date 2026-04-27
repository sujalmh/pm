import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
};

/** Redirect to /login if not authenticated, otherwise return the session user. */
export async function requireAuth(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user as SessionUser;
}

/** Require specific roles; throws a plain error (caught by error boundary) if denied. */
export async function requireRole(...roles: string[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden: insufficient permissions");
  }
  return user;
}

/** Inline helper — no async needed on the client. */
export function isManagerOrAdmin(role: string): boolean {
  return role === "ADMIN" || role === "MANAGER";
}
