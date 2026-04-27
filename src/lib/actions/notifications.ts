"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const sessionUser = await requireAuth();

  return prisma.notification.findMany({
    where: { userId: sessionUser.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getUnreadNotificationCount() {
  const sessionUser = await requireAuth();

  return prisma.notification.count({
    where: { userId: sessionUser.id, read: false },
  });
}

export async function markNotificationRead(id: string) {
  const sessionUser = await requireAuth();

  await prisma.notification.updateMany({
    where: { id, userId: sessionUser.id },
    data: { read: true },
  });
  revalidatePath("/");
}

export async function markAllNotificationsRead() {
  const sessionUser = await requireAuth();

  await prisma.notification.updateMany({
    where: { userId: sessionUser.id, read: false },
    data: { read: true },
  });
  revalidatePath("/");
}

/**
 * Checks for issues with due dates within the next 3 days and creates
 * REMINDER notifications for their assignees (batched approach — no N+1).
 */
export async function checkDueDateReminders() {
  const now = new Date();

  // Anchor to UTC midnight to avoid server-local-time drift across deployments
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  const next3Days = new Date(todayStart);
  next3Days.setUTCDate(todayStart.getUTCDate() + 3);

  const upcomingIssues = await prisma.issue.findMany({
    where: {
      status: { not: "DONE" },
      dueDate: { not: null, gte: todayStart, lte: next3Days },
      assigneeId: { not: null },
    },
    select: {
      id: true,
      title: true,
      issueKey: true,
      dueDate: true,
      assigneeId: true,
    },
  });

  if (upcomingIssues.length === 0) return { created: 0 };

  // Single query to find existing reminders sent today (batch dedup)
  const existing = await prisma.notification.findMany({
    where: {
      type: "REMINDER",
      createdAt: { gte: todayStart },
      issueId: { in: upcomingIssues.map((i) => i.id) },
    },
    select: { issueId: true, userId: true },
  });

  const sent = new Set(existing.map((n) => `${n.issueId}:${n.userId}`));

  const toCreate = upcomingIssues
    .filter((i) => i.assigneeId && !sent.has(`${i.id}:${i.assigneeId}`))
    .map((i) => ({
      userId: i.assigneeId!,
      type: "REMINDER" as const,
      message: `Reminder: "${i.title}" (${i.issueKey}) is due ${
        i.dueDate
          ? new Date(i.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
          : "soon"
      }`,
      issueId: i.id,
    }));

  if (toCreate.length === 0) return { created: 0 };

  const result = await prisma.notification.createMany({ data: toCreate });
  return { created: result.count };
}
