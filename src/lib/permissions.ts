import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Role } from "@/generated/prisma/client";

export type { Role };
export { isManagerOrAdmin } from "./role";

/**
 * Requires the user to be authenticated.
 * Redirects to /login if not authenticated.
 * Returns the typed session user.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user;
}

/**
 * Requires the user to have one of the given roles.
 * Throws a 403 error if the user does not have the required role.
 */
export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role as Role)) {
    throw new Error("Forbidden: insufficient role");
  }
  return user;
}
