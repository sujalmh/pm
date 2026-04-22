import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import Link from "next/link";
import { getDashboardData } from "@/lib/actions/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    return <div className="p-6">User not found</div>;
  }

  const { stats, myTasks, urgentTasks, projectProgress } = data;

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

      <div className="grid grid-cols-2 gap-6">
        {/* My tasks */}
        <Card>
          <CardHeader>
            <CardTitle>My Open Tasks</CardTitle>
            <Link
              href="/board"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              View Board →
            </Link>
          </CardHeader>
          {myTasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No open tasks assigned to you.</p>
          ) : (
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
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
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
          )}
        </Card>

        {/* Overdue and Due Soon Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue & Due Soon</CardTitle>
          </CardHeader>
          {urgentTasks.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">No urgent tasks.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {urgentTasks.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                return (
                  <div
                    key={task.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400">
                        {task.issueKey}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-orange-600'}`}>
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}
                      </span>
                      <StatusBadge status={task.status} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Projects summary */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Active Sprints Progress</h2>
        {projectProgress.length === 0 ? (
          <p className="text-sm text-gray-500">No active sprints.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {projectProgress.map((project) => (
              <Card key={project.projectId}>
                <CardHeader>
                  <CardTitle>{project.projectName}</CardTitle>
                  <span className="text-xs text-gray-400">{project.projectKey}</span>
                </CardHeader>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{project.sprintName}</span>
                    <span>{project.done} / {project.total} done</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${project.pct}%` }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
