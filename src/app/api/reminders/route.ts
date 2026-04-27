import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkDueDateReminders } from "@/lib/actions/notifications";

/**
 * GET /api/reminders
 *
 * Gated: requires either an active session OR a valid CRON_SECRET header.
 * This prevents unauthenticated callers from triggering the reminder check.
 */
export async function GET(req: NextRequest) {
  // Allow cron/server invocations via shared secret
  const cronSecret = process.env.CRON_SECRET;
  const incomingSecret = req.headers.get("x-cron-secret");

  const hasValidSecret = cronSecret && incomingSecret === cronSecret;

  if (!hasValidSecret) {
    // Fall back to session auth (e.g., admin manually triggering via browser)
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const result = await checkDueDateReminders();
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Reminder check failed:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
