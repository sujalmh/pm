"use server";

import { prisma } from "@/lib/db";

export async function getReportsData() {
  // 1. Workload Summary
  const users = await prisma.user.findMany({
    include: {
      assignedIssues: {
        where: { status: { not: "DONE" } },
        select: {
          originalEstimateMinutes: true,
          worklogs: {
            select: { durationMinutes: true }
          }
        }
      }
    }
  });

  const workloadSummary = users.map(user => {
    let estimated = 0;
    let logged = 0;
    
    user.assignedIssues.forEach(issue => {
      estimated += issue.originalEstimateMinutes || 0;
      issue.worklogs.forEach(w => logged += w.durationMinutes);
    });

    return {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      openTasks: user.assignedIssues.length,
      estimatedMinutes: estimated,
      loggedMinutes: logged
    };
  }).sort((a, b) => b.openTasks - a.openTasks);

  // 2. Sprint / Time Metrics (Issue Status Distribution across active projects)
  const statusDistribution = await prisma.issue.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });

  const metricsChartData = statusDistribution.map(s => ({
    name: s.status.replace("_", " "),
    value: s._count.status
  }));

  // 3. Project Tasks by Status
  const projects = await prisma.project.findMany({
    include: {
      issues: {
        select: { status: true }
      }
    }
  });

  const projectStatusData = projects.map(p => {
    const counts = {
      BACKLOG: 0,
      TODO: 0,
      IN_PROGRESS: 0,
      REVIEW: 0,
      DONE: 0
    };
    p.issues.forEach(i => {
      counts[i.status]++;
    });
    
    return {
      name: p.key,
      TODO: counts.TODO + counts.BACKLOG,
      IN_PROGRESS: counts.IN_PROGRESS,
      REVIEW: counts.REVIEW,
      DONE: counts.DONE
    };
  });

  return {
    workloadSummary,
    metricsChartData,
    projectStatusData
  };
}
