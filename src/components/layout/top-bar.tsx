"use client";

import { Search } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface TopBarProps {
  userId: string;
  name: string;
  role: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TopBar({ userId, name, role }: TopBarProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-500 w-80">
        <Search className="h-4 w-4" />
        <input
          type="text"
          placeholder="Search issues..."
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <NotificationBell userId={userId} />

        {/* Avatar */}
        <div
          title={`${name} (${role})`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 cursor-default select-none"
        >
          {initials(name)}
        </div>
      </div>
    </header>
  );
}
