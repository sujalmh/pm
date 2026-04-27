import { describe, it, expect } from "vitest";
import {
  createProjectSchema,
  createIssueSchema,
  createCommentSchema,
  createWorklogSchema,
} from "./validators";

describe("createProjectSchema", () => {
  it("accepts valid project data", () => {
    const result = createProjectSchema.safeParse({
      name: "My Project",
      key: "MP",
      teamId: "team-1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a key with lowercase letters", () => {
    const result = createProjectSchema.safeParse({
      name: "My Project",
      key: "mp",
      teamId: "team-1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = createProjectSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("createIssueSchema", () => {
  it("accepts valid issue data", () => {
    const result = createIssueSchema.safeParse({
      projectId: "proj-1",
      title: "Fix the bug",
      type: "BUG",
      priority: "HIGH",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown type values", () => {
    const result = createIssueSchema.safeParse({
      projectId: "proj-1",
      title: "Fix the bug",
      type: "INVALID",
      priority: "HIGH",
    });
    expect(result.success).toBe(false);
  });
});

describe("createCommentSchema", () => {
  it("accepts a valid comment", () => {
    const result = createCommentSchema.safeParse({
      issueId: "issue-1",
      body: "This is a comment",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty body", () => {
    const result = createCommentSchema.safeParse({
      issueId: "issue-1",
      body: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("createWorklogSchema", () => {
  it("accepts valid worklog data", () => {
    const result = createWorklogSchema.safeParse({
      issueId: "issue-1",
      date: "2026-04-27",
      durationMinutes: 60,
    });
    expect(result.success).toBe(true);
  });

  it("rejects zero duration", () => {
    const result = createWorklogSchema.safeParse({
      issueId: "issue-1",
      date: "2026-04-27",
      durationMinutes: 0,
    });
    expect(result.success).toBe(false);
  });
});
