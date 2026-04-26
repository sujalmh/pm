"use client";

import { Bell, CheckCheck, X, Info, AtSign, Clock } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMyNotifications,
  markAllRead,
  markNotificationRead,
} from "@/lib/actions/notifications";

type Notification = Awaited<ReturnType<typeof getMyNotifications>>[number];

const typeConfig = {
  ASSIGNED: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  MENTIONED: {
    icon: AtSign,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  REMINDER: {
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
};

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch {
      // silently fail — bell is non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + 30-second polling
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications, userId]);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  async function handleMarkAllRead() {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        id="notification-bell"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          id="notification-panel"
          className="absolute right-0 top-10 z-50 w-96 rounded-xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-900">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="mx-auto mb-2 h-8 w-8 text-gray-200" />
                <p className="text-sm text-gray-400">All caught up!</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${
                      !n.read ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm leading-snug ${
                          !n.read
                            ? "font-medium text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {n.message}
                      </p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>

                    {/* Unread dot / mark-read button */}
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        title="Mark as read"
                        className="mt-1 shrink-0 rounded-full p-1 text-gray-300 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2 text-center">
              <p className="text-[11px] text-gray-400">
                Showing last {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
