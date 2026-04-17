"use server";

import { prisma } from "@/lib/db";
import { createSprintSchema, updateSprintSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function getSprintsByProject(projectId: string) {
  return prisma.sprint.findMany({
    where: { projectId },
    include: {
      _count: { select: { issues: true } },
      issues: {
        select: { status: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createSprint(formData: FormData) {
  const raw = {
    projectId: formData.get("projectId"),
    name: formData.get("name"),
    goal: formData.get("goal") || undefined,
    startDate: formData.get("startDate") || undefined,
    endDate: formData.get("endDate") || undefined,
  };

  const parsed = createSprintSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { startDate, endDate, ...rest } = parsed.data;
  await prisma.sprint.create({
    data: {
      ...rest,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  revalidatePath("/backlog");
  return { success: true };
}

export async function startSprint(id: string) {
  // Only one active sprint per project
  const sprint = await prisma.sprint.findUniqueOrThrow({
    where: { id },
    select: { projectId: true },
  });

  await prisma.sprint.updateMany({
    where: { projectId: sprint.projectId, status: "ACTIVE" },
    data: { status: "COMPLETED" },
  });

  await prisma.sprint.update({
    where: { id },
    data: {
      status: "ACTIVE",
      startDate: new Date(),
    },
  });

  revalidatePath("/backlog");
  revalidatePath("/board");
}

export async function completeSprint(id: string) {
  // Move incomplete issues back to backlog
  await prisma.issue.updateMany({
    where: {
      sprintId: id,
      status: { not: "DONE" },
    },
    data: { sprintId: null },
  });

  await prisma.sprint.update({
    where: { id },
    data: {
      status: "COMPLETED",
      endDate: new Date(),
    },
  });

  revalidatePath("/backlog");
  revalidatePath("/board");
}
