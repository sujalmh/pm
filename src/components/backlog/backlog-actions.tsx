"use client";

import { useState } from "react";
import { createSprint } from "@/lib/actions/sprints";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

export function BacklogActions({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    formData.set("projectId", projectId);
    const result = await createSprint(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setOpen(false);
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)} className="text-xs">
        + Sprint
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Create Sprint">
        <form action={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal</label>
            <textarea
              name="goal"
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
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                name="endDate"
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Create Sprint</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
