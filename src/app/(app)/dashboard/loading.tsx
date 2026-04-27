import { Card, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div
      className="space-y-6 animate-pulse"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading dashboard…</span>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-24">
            <CardHeader>
              <div className="h-4 w-24 rounded bg-gray-200" aria-hidden="true" />
              <div className="mt-2 h-6 w-12 rounded bg-gray-200" aria-hidden="true" />
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Main content row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-64">
          <CardHeader>
            <div className="h-5 w-32 rounded bg-gray-200" aria-hidden="true" />
          </CardHeader>
        </Card>
        <Card className="h-64">
          <CardHeader>
            <div className="h-5 w-40 rounded bg-gray-200" aria-hidden="true" />
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
