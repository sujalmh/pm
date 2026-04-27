import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-gray-100 rounded"></div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 w-12 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="h-64">
          <CardHeader>
            <CardTitle className="h-5 w-32 bg-gray-200 rounded">{" "}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="h-64">
          <CardHeader>
            <CardTitle className="h-5 w-40 bg-gray-200 rounded">{" "}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
