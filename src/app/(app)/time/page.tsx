import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeeklyTimeSummary } from "@/lib/actions/worklogs";
import { WeekNavigator } from "@/components/time/week-navigator";

export const dynamic = "force-dynamic";

function getWeekRange(dateStr?: string) {
  const base = dateStr ? new Date(dateStr) : new Date();
  const day = base.getDay();
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { start: monday, end: sunday };
}

function formatMinutes(m: number) {
  const h = Math.floor(m / 60);
  const mins = m % 60;
  if (h === 0) return `${mins}m`;
  if (mins === 0) return `${h}h`;
  return `${h}h ${mins}m`;
}

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function TimePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const { start, end } = getWeekRange(week);
  const { worklogs, totalMinutes, dailyTotals } = await getWeeklyTimeSummary(start, end);

  // Build day columns
  const days: { date: string; label: string; dayName: string; minutes: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().split("T")[0];
    days.push({
      date: key,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      dayName: dayNames[i],
      minutes: dailyTotals[key] || 0,
    });
  }

  const maxMinutes = Math.max(...days.map((d) => d.minutes), 60);

  // Previous/next week dates
  const prevWeek = new Date(start);
  prevWeek.setDate(prevWeek.getDate() - 7);
  const nextWeek = new Date(start);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Time Tracking</h1>
          <p className="text-sm text-gray-500">Your weekly time summary</p>
        </div>
      </div>

      {/* Week navigation */}
      <WeekNavigator
        startDate={start.toISOString().split("T")[0]}
        endDate={end.toISOString().split("T")[0]}
        prevWeek={prevWeek.toISOString().split("T")[0]}
        nextWeek={nextWeek.toISOString().split("T")[0]}
        startLabel={start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        endLabel={end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <p className="text-xs font-medium text-gray-500">Total This Week</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">{formatMinutes(totalMinutes)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-gray-500">Work Entries</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{worklogs.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-gray-500">Daily Average</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {days.filter((d) => d.minutes > 0).length > 0
              ? formatMinutes(Math.round(totalMinutes / days.filter((d) => d.minutes > 0).length))
              : "0m"}
          </p>
        </Card>
      </div>

      {/* Daily bar chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
          <span className="text-xs text-gray-400">{formatMinutes(totalMinutes)} total</span>
        </CardHeader>
        <div className="flex items-end gap-2 h-40">
          {days.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-gray-500">
                {day.minutes > 0 ? formatMinutes(day.minutes) : ""}
              </span>
              <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                <div
                  className={`w-8 rounded-t transition-all duration-300 ${
                    day.minutes > 0 ? "bg-indigo-500" : "bg-gray-100"
                  }`}
                  style={{
                    height: day.minutes > 0 ? `${Math.max(8, (day.minutes / maxMinutes) * 120)}px` : "4px",
                  }}
                />
              </div>
              <span className="text-[10px] font-medium text-gray-500">{day.dayName}</span>
              <span className="text-[9px] text-gray-400">{day.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Work log entries */}
      <Card>
        <CardHeader>
          <CardTitle>Work Log Entries</CardTitle>
        </CardHeader>
        {worklogs.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No time logged this week. Open an issue to start logging time.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {worklogs.map((w) => (
              <div key={w.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-100 text-xs font-bold text-indigo-700">
                    {formatMinutes(w.durationMinutes)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">{w.issue.issueKey}</span>
                      <span className="text-sm font-medium text-gray-900">{w.issue.title}</span>
                    </div>
                    {w.note && (
                      <p className="text-xs text-gray-500 mt-0.5">{w.note}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{w.issue.project.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(w.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
