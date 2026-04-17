"use client";

import { useState } from "react";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { IssueDetailPanel } from "@/components/issues/issue-detail-panel";
import { IssueStatus, Priority, IssueType } from "@/types";

interface IssueRow {
  id: string;
  issueKey: string;
  title: string;
  description: string | null;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  storyPoints: number | null;
  originalEstimateMinutes: number | null;
  dueDate: Date | null;
  createdAt: Date;
  assignee: { name: string } | null;
  reporter: { name: string };
  sprint: { name: string } | null;
}

interface Props {
  issues: IssueRow[];
  project: { name: string; key: string };
}

const typeIcons: Record<IssueType, { color: string; label: string }> = {
  EPIC: { color: "bg-purple-500", label: "E" },
  STORY: { color: "bg-green-500", label: "S" },
  TASK: { color: "bg-blue-500", label: "T" },
  BUG: { color: "bg-red-500", label: "B" },
  SUBTASK: { color: "bg-gray-400", label: "ST" },
};

export function IssueTable({ issues, project }: Props) {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  return (
    <>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500">
            <th className="px-4 py-3 w-8">Type</th>
            <th className="px-4 py-3 w-24">Key</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3 w-28">Status</th>
            <th className="px-4 py-3 w-24">Priority</th>
            <th className="px-4 py-3 w-32">Assignee</th>
            <th className="px-4 py-3 w-16 text-right">SP</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {issues.map((issue) => {
            const icon = typeIcons[issue.type];
            return (
              <tr
                key={issue.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedIssueId(issue.id)}
              >
                <td className="px-4 py-3">
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${icon.color}`}>
                    {icon.label}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{issue.issueKey}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{issue.title}</td>
                <td className="px-4 py-3"><StatusBadge status={issue.status} /></td>
                <td className="px-4 py-3"><PriorityBadge priority={issue.priority} /></td>
                <td className="px-4 py-3 text-gray-600">{issue.assignee?.name ?? "—"}</td>
                <td className="px-4 py-3 text-right text-gray-500">{issue.storyPoints ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedIssue && (
        <IssueDetailPanel
          issue={{
            ...selectedIssue,
            project,
            comments: [],
            worklogs: [],
          }}
          onClose={() => setSelectedIssueId(null)}
        />
      )}
    </>
  );
}
