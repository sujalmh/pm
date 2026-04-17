"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useState, useTransition } from "react";
import { KanbanColumn } from "./kanban-column";
import { KanbanCard } from "./kanban-card";
import { updateIssueStatus } from "@/lib/actions/issues";
import { IssueStatus, Priority, IssueType } from "@/types";

const COLUMNS: IssueStatus[] = ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"];

const columnLabels: Record<IssueStatus, string> = {
  BACKLOG: "Backlog",
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};

const columnColors: Record<IssueStatus, string> = {
  BACKLOG: "border-t-gray-400",
  TODO: "border-t-blue-500",
  IN_PROGRESS: "border-t-yellow-500",
  REVIEW: "border-t-purple-500",
  DONE: "border-t-green-500",
};

export interface BoardIssue {
  id: string;
  issueKey: string;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  storyPoints: number | null;
  assignee: { name: string } | null;
  project: { key: string };
}

interface Props {
  issues: BoardIssue[];
}

export function KanbanBoard({ issues: initialIssues }: Props) {
  const [issues, setIssues] = useState(initialIssues);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeIssue = issues.find((i) => i.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;

    const issue = issues.find((i) => i.id === issueId);
    if (!issue || issue.status === newStatus) return;

    // Optimistic update
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
    );

    // Persist
    startTransition(() => {
      updateIssueStatus(issueId, newStatus);
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            id={status}
            title={columnLabels[status]}
            colorClass={columnColors[status]}
            issues={issues.filter((i) => i.status === status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeIssue ? <KanbanCard issue={activeIssue} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
