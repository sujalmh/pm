"use client";

import { Bell, Search } from "lucide-react";

export function TopBar() {
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
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
          SA
        </div>
      </div>
    </header>
  );
}
