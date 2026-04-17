"use client";

import { useState } from "react";
import { createProject } from "@/lib/actions/projects";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface Team {
  id: string;
  name: string;
}

export function CreateProjectButton({ teams }: { teams: Team[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    const result = await createProject(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ New Project</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Project">
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Key</label>
            <input
              name="key"
              required
              maxLength={6}
              placeholder="e.g. PM"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Team</label>
            <select
              name="teamId"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select team...</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                name="startDate"
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                name="dueDate"
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
