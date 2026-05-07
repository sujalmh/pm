/** Returns true if the role is MANAGER or ADMIN. */
export function isManagerOrAdmin(role: string): boolean {
  return role === "MANAGER" || role === "ADMIN";
}
