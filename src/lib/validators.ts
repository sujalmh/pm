import { z } from "zod/v4";

// ─── Project ─────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  key: z
    .string()
    .min(2, "Key must be 2–6 uppercase letters")
    .max(6)
    .regex(/^[A-Z]+$/, "Key must be uppercase letters only"),
  description: z.string().max(500).optional(),
  teamId: z.string().min(1, "Team is required"),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().min(1),
  status: z.enum(["PLANNING", "ACTIVE", "ARCHIVED"]).optional(),
});

// ─── Issue ───────────────────────────────────────────────

export const createIssueSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional(),
  type: z.enum(["EPIC", "STORY", "TASK", "BUG", "SUBTASK"]),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  assigneeId: z.string().optional(),
  storyPoints: z.coerce.number().int().min(0).max(100).optional(),
  originalEstimateMinutes: z.coerce.number().int().min(0).optional(),
  dueDate: z.string().optional(),
  sprintId: z.string().optional(),
});

export const updateIssueSchema = createIssueSchema.partial().extend({
  id: z.string().min(1),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
});

// ─── Sprint ──────────────────────────────────────────────

export const createSprintSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  name: z.string().min(1, "Name is required").max(100),
  goal: z.string().max(500).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const updateSprintSchema = createSprintSchema.partial().extend({
  id: z.string().min(1),
  status: z.enum(["PLANNED", "ACTIVE", "COMPLETED"]).optional(),
});

// ─── Comment ─────────────────────────────────────────────

export const createCommentSchema = z.object({
  issueId: z.string().min(1),
  body: z.string().min(1, "Comment is required").max(5000),
});

// ─── Worklog ─────────────────────────────────────────────

export const createWorklogSchema = z.object({
  issueId: z.string().min(1, "Issue is required"),
  date: z.string().min(1, "Date is required"),
  durationMinutes: z.coerce.number().int().min(1, "Duration must be at least 1 minute").max(1440),
  note: z.string().max(500).optional(),
});
