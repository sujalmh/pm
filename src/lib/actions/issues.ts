"use server";

import { prisma } from "@/lib/db";
import { createIssueSchema, updateIssueSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function getIssuesByProject(projectId: string) {
  return prisma.issue.findMany({
    where: { projectId },
    include: { assignee: true, reporter: true, sprint: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getIssueById(id: string) {
  return prisma.issue.findUnique({
    where: { id },
    include: {
      assignee: true,
      reporter: true,
      sprint: true,
      project: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      worklogs: {
        include: { user: true },
        orderBy: { date: "desc" },
      },
    },
  });
}

export async function getIssueByKey(issueKey: string) {
  return prisma.issue.findUnique({
    where: { issueKey },
    include: {
      assignee: true,
      reporter: true,
      sprint: true,
      project: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      worklogs: {
        include: { user: true },
        orderBy: { date: "desc" },
      },
    },
  });
}

async function nextIssueKey(projectId: string): Promise<string> {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    select: { key: true },
  });
  const count = await prisma.issue.count({ where: { projectId } });
  return `${project.key}-${count + 1}`;
}

export async function createIssue(formData: FormData) {
  const raw = {
    projectId: formData.get("projectId"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    type: formData.get("type"),
    priority: formData.get("priority"),
    assigneeId: formData.get("assigneeId") || undefined,
    storyPoints: formData.get("storyPoints") || undefined,
    originalEstimateMinutes: formData.get("originalEstimateMinutes") || undefined,
    dueDate: formData.get("dueDate") || undefined,
    sprintId: formData.get("sprintId") || undefined,
  };

  const parsed = createIssueSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { dueDate, ...rest } = parsed.data;
  const issueKey = await nextIssueKey(rest.projectId);

  // Use a hardcoded reporterId for now — will be replaced with session user
  const reporter = await prisma.user.findFirst({ where: { role: "MANAGER" } });
  if (!reporter) return { error: "No reporter found" };

  await prisma.issue.create({
    data: {
      ...rest,
      issueKey,
      reporterId: reporter.id,
      assigneeId: rest.assigneeId || null,
      sprintId: rest.sprintId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/backlog");
  revalidatePath("/board");
  return { success: true };
}

export async function updateIssue(formData: FormData) {
  const raw = {
    id: formData.get("id"),
    title: formData.get("title") || undefined,
    description: formData.get("description") || undefined,
    type: formData.get("type") || undefined,
    priority: formData.get("priority") || undefined,
    status: formData.get("status") || undefined,
    assigneeId: formData.get("assigneeId") || undefined,
    storyPoints: formData.get("storyPoints") || undefined,
    originalEstimateMinutes: formData.get("originalEstimateMinutes") || undefined,
    dueDate: formData.get("dueDate") || undefined,
    sprintId: formData.get("sprintId") || undefined,
    projectId: formData.get("projectId") || undefined,
  };

  const parsed = updateIssueSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, dueDate, ...rest } = parsed.data;
  await prisma.issue.update({
    where: { id },
    data: {
      ...rest,
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
    },
  });

  revalidatePath("/projects");
  revalidatePath("/backlog");
  revalidatePath("/board");
  return { success: true };
}

export async function updateIssueStatus(id: string, status: string) {
  await prisma.issue.update({
    where: { id },
    data: { status: status as "BACKLOG" | "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" },
  });
  revalidatePath("/board");
  revalidatePath("/backlog");
}

export async function updateIssueSprint(id: string, sprintId: string | null) {
  await prisma.issue.update({
    where: { id },
    data: { sprintId },
  });
  revalidatePath("/backlog");
  revalidatePath("/board");
}

export async function deleteIssue(id: string) {
  await prisma.issue.delete({ where: { id } });
  revalidatePath("/projects");
  revalidatePath("/backlog");
  revalidatePath("/board");
}
