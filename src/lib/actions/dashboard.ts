"use server";

import { prisma } from "@/lib/db";

export async function getDashboardData() {
  try {
    // Use first manager for demo/session stand-in
    const user = await prisma.user.findFirst({ where: { role: "MANAGER" } });
    if (!user) return null;

    // 1. Stats
    const [openCount, inProgressCount, reviewCount, doneThisSprintCount] = await Promise.all([
      prisma.issue.count({ where: { assigneeId: user.id, status: { in: ["BACKLOG", "TODO"] } } }),
      prisma.issue.count({ where: { assigneeId: user.id, status: "IN_PROGRESS" } }),
      prisma.issue.count({ where: { assigneeId: user.id, status: "REVIEW" } }),
      prisma.issue.count({
        where: {
          assigneeId: user.id,
          status: "DONE",
          sprint: { status: "ACTIVE" }
        }
      })
    ]);

    const stats = [
      { label: "Open Issues", value: openCount.toString(), color: "text-blue-600" },
      { label: "In Progress", value: inProgressCount.toString(), color: "text-yellow-600" },
      { label: "In Review", value: reviewCount.toString(), color: "text-purple-600" },
      { label: "Done This Sprint", value: doneThisSprintCount.toString(), color: "text-green-600" },
    ];

    // 2. My Open Tasks (To Do / In Progress / Review)
    const myTasks = await prisma.issue.findMany({
      where: {
        assigneeId: user.id,
        status: { not: "DONE" }
      },
      include: { project: true },
      orderBy: { priority: "asc" }, // CRITICAL, HIGH, etc
      take: 10
    });

    // 3. Overdue and Due Soon Tasks
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next3Days = new Date(today);
    next3Days.setDate(today.getDate() + 3);

    const urgentTasks = await prisma.issue.findMany({
      where: {
        assigneeId: user.id,
        status: { not: "DONE" },
        dueDate: { not: null, lte: next3Days }
      },
      include: { project: true },
      orderBy: { dueDate: "asc" },
      take: 5
    });

    // 4. Project Progress (Active Sprints)
    const activeSprints = await prisma.sprint.findMany({
      where: { status: "ACTIVE" },
      include: {
        project: true,
        issues: {
          select: { status: true }
        }
      }
    });

    const projectProgress = activeSprints.map(sprint => {
      const total = sprint.issues.length;
      const done = sprint.issues.filter(i => i.status === "DONE").length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      return {
        projectId: sprint.project.id,
        projectName: sprint.project.name,
        projectKey: sprint.project.key,
        sprintName: sprint.name,
        total,
        done,
        pct
      };
    });

    return {
      user,
      stats,
      myTasks,
      urgentTasks,
      projectProgress
    };
  } catch (error) {
    console.error("Dashboard data fetch failed:", error);
    return null;
  }
}
