import { prisma } from "@/lib/db";
import { KanbanBoard } from "@/components/board/kanban-board";
import { BoardFilters } from "@/components/board/board-filters";

export const dynamic = "force-dynamic";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; sprint?: string; assignee?: string; priority?: string }>;
}) {
  const filters = await searchParams;

  // Get projects for filter dropdown
  const projects = await prisma.project.findMany({
    where: { status: { not: "ARCHIVED" } },
    select: { id: true, key: true, name: true },
    orderBy: { name: "asc" },
  });

  // Get users for assignee filter
  const users = await prisma.user.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // Build issue query
  const where: Record<string, unknown> = {};
  if (filters.project) where.projectId = filters.project;
  if (filters.sprint) where.sprintId = filters.sprint;
  if (filters.assignee) where.assigneeId = filters.assignee;
  if (filters.priority) where.priority = filters.priority;

  // If a project is selected, get its active sprint issues by default
  if (filters.project && !filters.sprint) {
    const activeSprint = await prisma.sprint.findFirst({
      where: { projectId: filters.project, status: "ACTIVE" },
    });
    if (activeSprint) where.sprintId = activeSprint.id;
  }

  const issues = await prisma.issue.findMany({
    where: Object.keys(where).length > 0 ? where : { sprint: { status: "ACTIVE" } },
    include: {
      assignee: true,
      project: { select: { key: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Get sprints for filter
  const sprints = filters.project
    ? await prisma.sprint.findMany({
        where: { projectId: filters.project, status: { not: "COMPLETED" } },
        select: { id: true, name: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Board</h1>
        <p className="text-sm text-gray-500">Drag issues between columns to update status</p>
      </div>

      <BoardFilters
        projects={projects}
        sprints={sprints}
        users={users}
        current={filters}
      />

      <KanbanBoard issues={issues} />
    </div>
  );
}
