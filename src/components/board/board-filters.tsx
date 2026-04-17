"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  projects: { id: string; key: string; name: string }[];
  sprints: { id: string; name: string }[];
  users: { id: string; name: string }[];
  current: { project?: string; sprint?: string; assignee?: string; priority?: string };
}

export function BoardFilters({ projects, sprints, users, current }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset sprint when project changes
    if (key === "project") params.delete("sprint");
    router.push(`/board?${params.toString()}`);
  }

  const selectClass =
    "rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={current.project ?? ""}
        onChange={(e) => setFilter("project", e.target.value)}
        className={selectClass}
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>{p.key} — {p.name}</option>
        ))}
      </select>

      {sprints.length > 0 && (
        <select
          value={current.sprint ?? ""}
          onChange={(e) => setFilter("sprint", e.target.value)}
          className={selectClass}
        >
          <option value="">Active Sprint</option>
          {sprints.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      )}

      <select
        value={current.assignee ?? ""}
        onChange={(e) => setFilter("assignee", e.target.value)}
        className={selectClass}
      >
        <option value="">All Assignees</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select
        value={current.priority ?? ""}
        onChange={(e) => setFilter("priority", e.target.value)}
        className={selectClass}
      >
        <option value="">All Priorities</option>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>
  );
}
