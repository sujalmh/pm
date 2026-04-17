import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getProjectByKey } from "@/lib/actions/projects";
import { CreateIssueButton } from "@/components/issues/create-issue-button";
import { IssueTable } from "@/components/issues/issue-table";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const project = await getProjectByKey(key);

  if (!project) return notFound();

  const activeSprint = project.sprints.find((s) => s.status === "ACTIVE");
  const members = project.team.members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
  }));
  const sprints = project.sprints.map((s) => ({ id: s.id, name: s.name }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-lg font-bold text-indigo-700">
            {key}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-sm text-gray-500">
              {project.team.name} {activeSprint ? `· ${activeSprint.name}` : ""}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Settings</Button>
          <CreateIssueButton
            projectId={project.id}
            members={members}
            sprints={sprints}
          />
        </div>
      </div>

      <p className="text-sm text-gray-600">{project.description}</p>

      {/* Issues table */}
      <Card className="p-0 overflow-hidden">
        <IssueTable
          issues={project.issues}
          project={{ name: project.name, key: project.key }}
        />
      </Card>
    </div>
  );
}
