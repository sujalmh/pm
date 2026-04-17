"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startSprint, completeSprint } from "@/lib/actions/sprints";
import { IssueStatus, Priority, SprintStatus } from "@/types";

interface SprintIssue {
  id: string;
  issueKey: string;
  title: string;
  status: IssueStatus;
  priority: Priority;
  assignee: { name: string } | null;
}

interface SprintData {
  id: string;
  name: string;
  goal: string | null;
  status: SprintStatus;
  issues: SprintIssue[];
}

export function SprintSection({ sprint, projectKey }: { sprint: SprintData; projectKey: string }) {
  const doneCount = sprint.issues.filter((i) => i.status === "DONE").length;
  const progress = sprint.issues.length > 0 ? Math.round((doneCount / sprint.issues.length) * 100) : 0;

  const handleStartSprint = async () => {
    await startSprint(sprint.id);
  };

  const handleCompleteSprint = async () => {
    await completeSprint(sprint.id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{sprint.name}</CardTitle>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            sprint.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {sprint.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{sprint.issues.length} issues</span>
          {sprint.status === "PLANNED" && (
            <Button variant="secondary" onClick={handleStartSprint} className="text-xs">Start Sprint</Button>
          )}
          {sprint.status === "ACTIVE" && (
            <Button variant="secondary" onClick={handleCompleteSprint} className="text-xs">Complete Sprint</Button>
          )}
        </div>
      </CardHeader>

      {sprint.goal && <p className="mb-2 text-xs text-gray-500">{sprint.goal}</p>}

      {sprint.issues.length > 0 && (
        <>
          <div className="mb-3 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{doneCount} / {sprint.issues.length} done</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100">
              <div
                className="h-1.5 rounded-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {sprint.issues.map((issue) => (
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
            ))}
          </div>
        </>
      )}

      {sprint.issues.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-400">No issues in this sprint</p>
      )}
    </Card>
  );
}
