"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface WeekNavigatorProps {
  startDate: string;
  endDate: string;
  prevWeek: string;
  nextWeek: string;
  startLabel: string;
  endLabel: string;
}

export function WeekNavigator({
  prevWeek,
  nextWeek,
  startLabel,
  endLabel,
}: WeekNavigatorProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
      <Link
        href={`/time?week=${prevWeek}`}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Link>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-indigo-500" />
        <span className="text-sm font-semibold text-gray-900">
          {startLabel} — {endLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/time?week=${today}`}
          className="rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          Today
        </Link>
        <Link
          href={`/time?week=${nextWeek}`}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
