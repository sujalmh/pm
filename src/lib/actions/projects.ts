"use server";

import { prisma } from "@/lib/db";
import { createProjectSchema, updateProjectSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return prisma.project.findMany({
    include: {
      team: true,
      _count: { select: { issues: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectByKey(key: string) {
  return prisma.project.findUnique({
    where: { key },
    include: {
      team: { include: { members: { include: { user: true } } } },
      sprints: { orderBy: { createdAt: "desc" } },
      issues: {
        include: { assignee: true, reporter: true, sprint: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createProject(formData: FormData) {
  const raw = {
    name: formData.get("name"),
    key: formData.get("key"),
    description: formData.get("description"),
    teamId: formData.get("teamId"),
    startDate: formData.get("startDate"),
    dueDate: formData.get("dueDate"),
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { startDate, dueDate, ...rest } = parsed.data;
  await prisma.project.create({
    data: {
      ...rest,
      startDate: startDate ? new Date(startDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath("/projects");
  return { success: true };
}

export async function updateProject(formData: FormData) {
  const raw = {
    id: formData.get("id"),
    name: formData.get("name") || undefined,
    key: formData.get("key") || undefined,
    description: formData.get("description") || undefined,
    teamId: formData.get("teamId") || undefined,
    status: formData.get("status") || undefined,
    startDate: formData.get("startDate") || undefined,
    dueDate: formData.get("dueDate") || undefined,
  };

  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { id, startDate, dueDate, ...rest } = parsed.data;
  await prisma.project.update({
    where: { id },
    data: {
      ...rest,
      ...(startDate !== undefined && { startDate: new Date(startDate) }),
      ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
    },
  });

  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/projects");
}

export async function getTeams() {
  return prisma.team.findMany({
    include: { lead: true, members: { include: { user: true } } },
    orderBy: { name: "asc" },
  });
}
