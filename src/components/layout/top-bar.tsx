"use client";

import { Search } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

interface TopBarProps {
  userId: string;
  userName: string | null | undefined;
  role: string;
}

export function TopBar({ userId, userName, role }: TopBarProps) {
  const userInitials = initials(userName ?? "");

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 w-80">
        <Search className="h-4 w-4" />
        <input
          type="text"
          placeholder="Search issues..."
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell userId={userId} />
        <div
          title={`${userName ?? "User"} (${role})`}
          aria-label={`Signed in as ${userName ?? "Unknown"}`}
          className="flex h-8 w-8 cursor-default select-none items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700"
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
}
