import { Card, CardHeader } from "@/components/ui/card";

export default function BoardLoading() {
  return (
    <div
      className="space-y-4 animate-pulse"
      role="status"
      aria-busy="true"
      aria-label="Loading board"
    >
      <span className="sr-only">Loading board…</span>

      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-40 rounded bg-gray-200" aria-hidden="true" />
        <div className="h-8 w-24 rounded bg-gray-200" aria-hidden="true" />
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((col) => (
          <div key={col} className="space-y-3">
            <div className="h-5 w-full rounded bg-gray-200" aria-hidden="true" />
            {[1, 2, 3].map((row) => (
              <Card key={row} className="h-20 p-3">
                <div className="h-3 w-3/4 rounded bg-gray-200" aria-hidden="true" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-200" aria-hidden="true" />
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
