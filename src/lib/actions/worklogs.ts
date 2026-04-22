"use server";

import { prisma } from "@/lib/db";
import { createWorklogSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function addWorklog(formData: FormData) {
  const raw = {
    issueId: formData.get("issueId"),
    date: formData.get("date"),
    durationMinutes: formData.get("durationMinutes"),
    note: formData.get("note") || undefined,
  };

  const parsed = createWorklogSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Use first manager as logger — will be replaced with session user
  const user = await prisma.user.findFirst({ where: { role: "MANAGER" } });
  if (!user) return { error: "No user found" };

  await prisma.worklog.create({
    data: {
      issueId: parsed.data.issueId,
      userId: user.id,
      date: new Date(parsed.data.date),
      durationMinutes: parsed.data.durationMinutes,
      note: parsed.data.note || null,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/time");
  return { success: true };
}

export async function deleteWorklog(id: string) {
  await prisma.worklog.delete({ where: { id } });
  revalidatePath("/projects");
  revalidatePath("/time");
}

export async function getWorklogsByUser(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return prisma.worklog.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
    },
    include: {
      issue: {
        select: {
          issueKey: true,
          title: true,
          project: { select: { name: true, key: true } },
        },
      },
      user: { select: { name: true } },
    },
    orderBy: { date: "asc" },
  });
}

export async function getWorklogsByProject(
  projectId: string,
  startDate?: Date,
  endDate?: Date,
) {
  return prisma.worklog.findMany({
    where: {
      issue: { projectId },
      ...(startDate && endDate ? { date: { gte: startDate, lte: endDate } } : {}),
    },
    include: {
      issue: {
        select: {
          id: true,
          issueKey: true,
          title: true,
          originalEstimateMinutes: true,
          status: true,
        },
      },
      user: { select: { id: true, name: true } },
    },
    orderBy: { date: "desc" },
  });
}

export async function getWeeklyTimeSummary(startDate: Date, endDate: Date) {
  // Use first manager — will be replaced with session user
  const user = await prisma.user.findFirst({ where: { role: "MANAGER" } });
  if (!user) return { worklogs: [], user: null, totalMinutes: 0, dailyTotals: {} as Record<string, number> };

  const worklogs = await getWorklogsByUser(user.id, startDate, endDate);

  const totalMinutes = worklogs.reduce((sum, w) => sum + w.durationMinutes, 0);

  // Group by day
  const dailyTotals: Record<string, number> = {};
  for (const w of worklogs) {
    const key = new Date(w.date).toISOString().split("T")[0];
    dailyTotals[key] = (dailyTotals[key] || 0) + w.durationMinutes;
  }

  return { worklogs, user, totalMinutes, dailyTotals };
}

export async function getProjectTimeReport(projectId: string) {
  const worklogs = await getWorklogsByProject(projectId);

  const totalMinutes = worklogs.reduce((sum, w) => sum + w.durationMinutes, 0);

  // Group by issue
  const byIssue: Record<string, {
    issueKey: string;
    title: string;
    estimateMinutes: number | null;
    loggedMinutes: number;
    status: string;
  }> = {};

  for (const w of worklogs) {
    if (!byIssue[w.issue.id]) {
      byIssue[w.issue.id] = {
        issueKey: w.issue.issueKey,
        title: w.issue.title,
        estimateMinutes: w.issue.originalEstimateMinutes,
        loggedMinutes: 0,
        status: w.issue.status,
      };
    }
    byIssue[w.issue.id].loggedMinutes += w.durationMinutes;
  }

  // Group by member
  const byMember: Record<string, { name: string; totalMinutes: number }> = {};
  for (const w of worklogs) {
    if (!byMember[w.user.id]) {
      byMember[w.user.id] = { name: w.user.name, totalMinutes: 0 };
    }
    byMember[w.user.id].totalMinutes += w.durationMinutes;
  }

  return {
    totalMinutes,
    issueBreakdown: Object.values(byIssue),
    memberBreakdown: Object.values(byMember),
  };
}
