"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./kanban-card";
import { BoardIssue } from "./kanban-board";

interface Props {
  id: string;
  title: string;
  colorClass: string;
  issues: BoardIssue[];
}

export function KanbanColumn({ id, title, colorClass, issues }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[60vh] w-72 flex-shrink-0 flex-col rounded-lg border-t-2 bg-gray-50 ${colorClass} ${
        isOver ? "ring-2 ring-indigo-300" : ""
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-xs font-semibold uppercase text-gray-500">{title}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {issues.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2">
        {issues.map((issue) => (
          <KanbanCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
