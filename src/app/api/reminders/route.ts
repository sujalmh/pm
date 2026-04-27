import { checkDueDateReminders } from "@/lib/actions/notifications";

/**
 * GET /api/reminders
 * Called by the ReminderPoller client component every 5 minutes.
 * Creates REMINDER notifications for issues due within 24 hours.
 */
export async function GET() {
  try {
    const result = await checkDueDateReminders();
    return Response.json({ ok: true, ...result });
  } catch (err) {
    console.error("[reminders] Error:", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
