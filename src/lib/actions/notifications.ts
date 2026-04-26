"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

/** Fetch the current user's notifications (unread first, last 50). */
export async function getMyNotifications() {
  const user = await requireAuth();
  return prisma.notification.findMany({
    where: { userId: user.id },
    include: {
      issue: { select: { issueKey: true, project: { select: { key: true } } } },
    },
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    take: 50,
  });
}

/** Mark a single notification as read. */
export async function markNotificationRead(id: string) {
  const user = await requireAuth();
  await prisma.notification.updateMany({
    where: { id, userId: user.id },
    data: { read: true },
  });
  revalidatePath("/");
}

/** Mark all of the current user's notifications as read. */
export async function markAllRead() {
  const user = await requireAuth();
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/");
}

/**
 * Create REMINDER notifications for issues due within 24 hours that
 * don't already have a reminder notification created today.
 * Called by the /api/reminders route handler on a polling interval.
 */
export async function checkDueDateReminders() {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Issues due in the next 24h that are not yet done
  const upcomingIssues = await prisma.issue.findMany({
    where: {
      dueDate: { gte: now, lte: in24h },
      status: { not: "DONE" },
      assigneeId: { not: null },
    },
    select: {
      id: true,
      issueKey: true,
      title: true,
      dueDate: true,
      assigneeId: true,
    },
  });

  if (upcomingIssues.length === 0) return { created: 0 };

  // For each issue, check if we already sent a reminder today
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  let created = 0;

  for (const issue of upcomingIssues) {
    if (!issue.assigneeId) continue;

    const existingReminder = await prisma.notification.findFirst({
      where: {
        issueId: issue.id,
        userId: issue.assigneeId,
        type: "REMINDER",
        createdAt: { gte: todayStart },
      },
    });

    if (!existingReminder) {
      const dueStr = issue.dueDate
        ? new Date(issue.dueDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          })
        : "soon";

      await prisma.notification.create({
        data: {
          userId: issue.assigneeId,
          type: "REMINDER",
          message: `Reminder: "${issue.title}" (${issue.issueKey}) is due ${dueStr}`,
          issueId: issue.id,
        },
      });
      created++;
    }
  }

  return { created };
}
