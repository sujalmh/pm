"use client";

import { useDraggable } from "@dnd-kit/core";
import { PriorityBadge } from "@/components/ui/badge";
import { BoardIssue } from "./kanban-board";
import { IssueType } from "@/types";

const typeIcons: Record<IssueType, { color: string; label: string }> = {
  EPIC: { color: "bg-purple-500", label: "E" },
  STORY: { color: "bg-green-500", label: "S" },
  TASK: { color: "bg-blue-500", label: "T" },
  BUG: { color: "bg-red-500", label: "B" },
  SUBTASK: { color: "bg-gray-400", label: "ST" },
};

interface Props {
  issue: BoardIssue;
  isDragOverlay?: boolean;
}

export function KanbanCard({ issue, isDragOverlay }: Props) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: issue.id,
  });
  const icon = typeIcons[issue.type];

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      {...(!isDragOverlay ? { ...attributes, ...listeners } : {})}
      className={`cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "opacity-40" : ""
      } ${isDragOverlay ? "shadow-lg ring-2 ring-indigo-200" : ""}`}
    >
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className={`inline-flex h-4 w-4 items-center justify-center rounded text-[8px] font-bold text-white ${icon.color}`}>
          {icon.label}
        </span>
        <span className="font-mono">{issue.issueKey}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium text-gray-900 line-clamp-2">{issue.title}</p>
      <div className="mt-2 flex items-center justify-between">
        <PriorityBadge priority={issue.priority} />
        <div className="flex items-center gap-2">
          {issue.storyPoints !== null && (
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
              {issue.storyPoints}
            </span>
          )}
          {issue.assignee && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-medium text-indigo-700">
              {issue.assignee.name.split(" ").map((n) => n[0]).join("")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
