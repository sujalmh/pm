import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { IssueStatus, Priority } from "@/types";
import Link from "next/link";

// Static demo data for initial dashboard — will be replaced with DB queries
const myTasks = [
  {
    id: "1",
    issueKey: "AGR-2",
    title: "Implement request routing",
    status: "TODO" as IssueStatus,
    priority: "HIGH" as Priority,
    project: "API Gateway Rebuild",
  },
  {
    id: "2",
    issueKey: "AGR-6",
    title: "Auth middleware with JWT validation",
    status: "REVIEW" as IssueStatus,
    priority: "HIGH" as Priority,
    project: "API Gateway Rebuild",
  },
  {
    id: "3",
    issueKey: "CPV2-2",
    title: "Homepage redesign",
    status: "TODO" as IssueStatus,
    priority: "HIGH" as Priority,
    project: "Customer Portal v2",
  },
];

const stats = [
  { label: "Open Issues", value: "8", color: "text-blue-600" },
  { label: "In Progress", value: "2", color: "text-yellow-600" },
  { label: "In Review", value: "1", color: "text-purple-600" },
  { label: "Done This Sprint", value: "2", color: "text-green-600" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your work</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* My tasks */}
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
          <Link
            href="/board"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            View Board →
          </Link>
        </CardHeader>
        <div className="divide-y divide-gray-100">
          {myTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-400">
                  {task.issueKey}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Projects summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>API Gateway Rebuild</CardTitle>
            <span className="text-xs text-gray-400">AGR</span>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Sprint 1 Progress</span>
              <span>3 / 5 done</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-green-500" style={{ width: "60%" }} />
            </div>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Portal v2</CardTitle>
            <span className="text-xs text-gray-400">CPV2</span>
          </CardHeader>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Sprint 1 Progress</span>
              <span>1 / 4 done</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-green-500" style={{ width: "25%" }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
