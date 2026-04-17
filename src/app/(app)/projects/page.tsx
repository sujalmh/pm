import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectStatus } from "@/types";
import { getProjects, getTeams } from "@/lib/actions/projects";
import { CreateProjectButton } from "@/components/projects/create-project-button";

export const dynamic = "force-dynamic";

const statusColors: Record<ProjectStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PLANNING: "bg-blue-100 text-blue-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

export default async function ProjectsPage() {
  const [projects, teams] = await Promise.all([getProjects(), getTeams()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500">
            {projects.length} projects in your workspace
          </p>
        </div>
        <CreateProjectButton teams={teams.map((t) => ({ id: t.id, name: t.name }))} />
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.key}`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-100 text-sm font-bold text-indigo-700">
                    {project.key}
                  </div>
                  <div>
                    <CardTitle>{project.name}</CardTitle>
                    <p className="text-xs text-gray-500">{project.team.name}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[project.status]}`}
                >
                  {project.status}
                </span>
              </CardHeader>
              <p className="text-sm text-gray-600">{project.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>{project._count.issues} issues</span>
                <span>Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "—"}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
