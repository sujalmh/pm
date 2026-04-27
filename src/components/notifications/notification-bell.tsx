"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Check, CheckCheck, RefreshCw } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/actions/notifications";

type Notification = Awaited<ReturnType<typeof getNotifications>>[number];

const POLL_INTERVAL_MS = 30_000;

const typeConfig = {
  ASSIGNED: { label: "Assigned", className: "bg-blue-100 text-blue-700" },
  MENTIONED: { label: "Mentioned", className: "bg-purple-100 text-purple-700" },
  REMINDER: { label: "Reminder", className: "bg-amber-100 text-amber-700" },
} as const;

const fallbackConfig = {
  label: "Notification",
  className: "bg-gray-100 text-gray-700",
};

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      // Silently fail — UI degradation is acceptable here
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    function startPolling() {
      if (intervalId) return;
      intervalId = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    }

    function stopPolling() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        // Re-fetch immediately when tab becomes visible
        fetchNotifications();
        startPolling();
      } else {
        stopPolling();
      }
    }

    // Only poll when the tab is visible (avoids N×tabs server load)
    if (document.visibilityState === "visible") {
      startPolling();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // fetchNotifications is stable (useCallback with no deps)
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  async function handleMarkAllRead() {
    setLoading(true);
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        id="notification-bell-button"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />

          {/* Dropdown panel */}
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
              <span className="text-sm font-semibold text-gray-800">
                Notifications
              </span>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Refresh notifications"
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  onClick={fetchNotifications}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                {unreadCount > 0 && (
                  <button
                    aria-label="Mark all as read"
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
                    onClick={handleMarkAllRead}
                    disabled={loading}
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-gray-400">
                  No notifications
                </li>
              ) : (
                notifications.map((n) => {
                  const cfg = typeConfig[n.type as keyof typeof typeConfig] ?? fallbackConfig;
                  return (
                    <li
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 text-sm transition-colors ${
                        n.read ? "bg-white" : "bg-indigo-50/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${cfg.className}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="flex-1 text-gray-700 leading-snug">
                        {n.message}
                      </span>
                      {!n.read && (
                        <button
                          aria-label="Mark as read"
                          className="shrink-0 rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                          onClick={() => handleMarkRead(n.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
