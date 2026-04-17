import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { BacklogActions } from "@/components/backlog/backlog-actions";
import { SprintSection } from "@/components/backlog/sprint-section";

export const dynamic = "force-dynamic";

export default async function BacklogPage() {
  const projects = await prisma.project.findMany({
    where: { status: { not: "ARCHIVED" } },
    include: {
      sprints: {
        where: { status: { not: "COMPLETED" } },
        include: {
          issues: {
            include: { assignee: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      issues: {
        where: { sprintId: null },
        include: { assignee: true },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Backlog</h1>
          <p className="text-sm text-gray-500">Plan sprints and prioritize work</p>
        </div>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-100 text-xs font-bold text-indigo-700">
              {project.key}
            </div>
            <h2 className="text-sm font-semibold text-gray-900">{project.name}</h2>
            <BacklogActions projectId={project.id} />
          </div>

          {/* Sprints */}
          {project.sprints.map((sprint) => (
            <SprintSection key={sprint.id} sprint={sprint} projectKey={project.key} />
          ))}

          {/* Backlog (unassigned to sprint) */}
          <Card>
            <CardHeader>
              <CardTitle>Backlog</CardTitle>
              <span className="text-xs text-gray-400">{project.issues.length} issues</span>
            </CardHeader>
            <div className="divide-y divide-gray-100">
              {project.issues.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No items in backlog</p>
              ) : (
                project.issues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between py-2.5 px-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-gray-400">{issue.issueKey}</span>
                      <span className="text-sm text-gray-900">{issue.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {issue.assignee && (
                        <span className="text-xs text-gray-500">{issue.assignee.name}</span>
                      )}
                      <PriorityBadge priority={issue.priority} />
                      <StatusBadge status={issue.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
