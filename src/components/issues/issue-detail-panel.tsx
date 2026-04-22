"use client";

import { X, MessageSquare, Clock } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/ui/badge";
import { IssueStatus, Priority, IssueType } from "@/types";
import { addComment } from "@/lib/actions/comments";
import { addWorklog } from "@/lib/actions/worklogs";
import { useState } from "react";
import { formatMinutes } from "@/lib/time";

interface CommentData {
  id: string;
  body: string;
  createdAt: Date;
  user: { name: string };
}

interface WorklogData {
  id: string;
  durationMinutes: number;
  date: Date;
  note: string | null;
  user: { name: string };
}

interface IssueDetailProps {
  issue: {
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
    project: { name: string; key: string };
    sprint: { name: string } | null;
    comments: CommentData[];
    worklogs: WorklogData[];
  };
  onClose: () => void;
}

const typeIcons: Record<IssueType, { color: string; label: string }> = {
  EPIC: { color: "bg-purple-500", label: "E" },
  STORY: { color: "bg-green-500", label: "S" },
  TASK: { color: "bg-blue-500", label: "T" },
  BUG: { color: "bg-red-500", label: "B" },
  SUBTASK: { color: "bg-gray-400", label: "ST" },
};

export function IssueDetailPanel({ issue, onClose }: IssueDetailProps) {
  const [commentBody, setCommentBody] = useState("");
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [timeError, setTimeError] = useState("");
  const icon = typeIcons[issue.type];

  const estimatedMinutes = issue.originalEstimateMinutes || 0;
  const totalLogged = issue.worklogs.reduce((s, w) => s + w.durationMinutes, 0);
  const remainingMinutes = Math.max(0, estimatedMinutes - totalLogged);
  const overMinutes = Math.max(0, totalLogged - estimatedMinutes);
  const spentPercent =
    estimatedMinutes > 0
      ? Math.min(100, Math.round((totalLogged / estimatedMinutes) * 100))
      : 0;
  const isOverEstimate = totalLogged > estimatedMinutes && estimatedMinutes > 0;

  async function handleComment(formData: FormData) {
    formData.set("issueId", issue.id);
    await addComment(formData);
    setCommentBody("");
  }

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-[480px] flex-col border-l border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white ${icon.color}`}>
            {icon.label}
          </span>
          <span className="text-sm font-mono text-gray-500">{issue.issueKey}</span>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-100">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{issue.title}</h2>

          {issue.description && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{issue.description}</p>
          )}

          {/* Fields */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-medium text-gray-500">Status</p>
              <StatusBadge status={issue.status} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Priority</p>
              <PriorityBadge priority={issue.priority} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Assignee</p>
              <p className="text-gray-900">{issue.assignee?.name ?? "Unassigned"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Reporter</p>
              <p className="text-gray-900">{issue.reporter.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Sprint</p>
              <p className="text-gray-900">{issue.sprint?.name ?? "Backlog"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Story Points</p>
              <p className="text-gray-900">{issue.storyPoints ?? "—"}</p>
            </div>
            {issue.dueDate && (
              <div>
                <p className="text-xs font-medium text-gray-500">Due Date</p>
                <p className="text-gray-900">{new Date(issue.dueDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Time Tracking */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
            <h4 className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
              <Clock className="h-3.5 w-3.5" /> Time Tracking
            </h4>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase">Estimated</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {estimatedMinutes > 0 ? formatMinutes(estimatedMinutes) : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase">Logged</p>
                  <p className={`text-sm font-semibold ${isOverEstimate ? "text-red-600" : "text-indigo-600"}`}>
                    {totalLogged > 0 ? formatMinutes(totalLogged) : "0m"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase">Remaining</p>
                  <p className={`text-sm font-semibold ${isOverEstimate ? "text-red-600" : "text-green-600"}`}>
                    {estimatedMinutes > 0
                      ? isOverEstimate
                        ? `Over by ${formatMinutes(overMinutes)}`
                        : formatMinutes(remainingMinutes)
                      : "—"}
                  </p>
                </div>
              </div>
              {estimatedMinutes > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span>{spentPercent}% spent</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${isOverEstimate ? "bg-red-500" : spentPercent > 80 ? "bg-yellow-500" : "bg-indigo-500"}`}
                      style={{ width: `${spentPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
              <MessageSquare className="h-4 w-4" /> Activity
            </h3>

            {/* Comment form */}
            <form action={handleComment} className="mb-4">
              <textarea
                name="body"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="mt-1 flex justify-end">
                <button
                  type="submit"
                  disabled={!commentBody.trim()}
                  className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Comment
                </button>
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-3">
              {issue.comments.map((c) => (
                <div key={c.id} className="rounded-md bg-gray-50 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">{c.user.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">{c.body}</p>
                </div>
              ))}
            </div>

            {/* Worklogs */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <Clock className="h-3.5 w-3.5" /> Time Logs ({totalLogged > 0 ? formatMinutes(totalLogged) : "0m"})
                </h4>
                <button
                  type="button"
                  onClick={() => setShowTimeForm((v) => !v)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {showTimeForm ? "Cancel" : "+ Log Time"}
                </button>
              </div>

              {showTimeForm && (
                <form
                  action={async (formData: FormData) => {
                    setTimeError("");
                    formData.set("issueId", issue.id);
                    const result = await addWorklog(formData);
                    if (result?.error) {
                      setTimeError(result.error);
                      return;
                    }
                    setShowTimeForm(false);
                  }}
                  className="mb-3 space-y-2 rounded-md border border-gray-200 p-3"
                >
                  {timeError && <p className="text-xs text-red-600">{timeError}</p>}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                      required
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      name="durationMinutes"
                      type="number"
                      min={1}
                      required
                      placeholder="Minutes"
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <input
                    name="note"
                    placeholder="What did you work on?"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    Log
                  </button>
                </form>
              )}

              {issue.worklogs.length > 0 && (
                <div className="space-y-1">
                  {issue.worklogs.map((w) => (
                    <div key={w.id} className="flex items-center justify-between text-xs text-gray-500">
                      <span>{w.user.name} — {w.note || "No note"}</span>
                      <span>{w.durationMinutes}m · {new Date(w.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
