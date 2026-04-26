"use client";

import { useEffect } from "react";

const POLL_INTERVAL_MS = 5 * 60 * 1_000; // 5 minutes

/**
 * Invisible component that periodically hits /api/reminders so the server
 * can create REMINDER notifications for issues due within 24 hours.
 * Mounted once in the AppLayout — renders nothing.
 */
export function ReminderPoller() {
  useEffect(() => {
    const run = () =>
      fetch("/api/reminders").catch(() => {
        /* silently ignore network errors */
      });

    // Run once on mount, then every 5 minutes
    run();
    const id = setInterval(run, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return null;
}
