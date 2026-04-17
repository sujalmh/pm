import { PrismaClient } from "../src/generated/prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const password = await hash("password123", 12);

  // ── Users ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@coreason.dev" },
    update: {},
    create: {
      name: "Sujal Admin",
      email: "admin@coreason.dev",
      passwordHash: password,
      role: "ADMIN",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "priya@coreason.dev" },
    update: {},
    create: {
      name: "Priya Sharma",
      email: "priya@coreason.dev",
      passwordHash: password,
      role: "MANAGER",
    },
  });

  const alex = await prisma.user.upsert({
    where: { email: "alex@coreason.dev" },
    update: {},
    create: {
      name: "Alex Chen",
      email: "alex@coreason.dev",
      passwordHash: password,
      role: "MEMBER",
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: "maria@coreason.dev" },
    update: {},
    create: {
      name: "Maria Lopez",
      email: "maria@coreason.dev",
      passwordHash: password,
      role: "MEMBER",
    },
  });

  const james = await prisma.user.upsert({
    where: { email: "james@coreason.dev" },
    update: {},
    create: {
      name: "James Wilson",
      email: "james@coreason.dev",
      passwordHash: password,
      role: "MEMBER",
    },
  });

  const aiko = await prisma.user.upsert({
    where: { email: "aiko@coreason.dev" },
    update: {},
    create: {
      name: "Aiko Tanaka",
      email: "aiko@coreason.dev",
      passwordHash: password,
      role: "MEMBER",
    },
  });

  // ── Teams ──────────────────────────────────────────────
  const platformTeam = await prisma.team.create({
    data: {
      name: "Platform Engineering",
      description: "Backend services, infrastructure, and CI/CD",
      leadId: manager.id,
      members: {
        create: [
          { userId: manager.id },
          { userId: alex.id },
          { userId: james.id },
        ],
      },
    },
  });

  const designTeam = await prisma.team.create({
    data: {
      name: "Product Design",
      description: "UI/UX design and customer-facing experiences",
      leadId: manager.id,
      members: {
        create: [
          { userId: manager.id },
          { userId: maria.id },
          { userId: aiko.id },
        ],
      },
    },
  });

  // ── Projects ───────────────────────────────────────────
  const agrProject = await prisma.project.create({
    data: {
      name: "API Gateway Rebuild",
      key: "AGR",
      description:
        "Rewrite the API gateway for better performance and observability",
      status: "ACTIVE",
      teamId: platformTeam.id,
      startDate: new Date("2026-04-01"),
      dueDate: new Date("2026-07-31"),
    },
  });

  const cpv2Project = await prisma.project.create({
    data: {
      name: "Customer Portal v2",
      key: "CPV2",
      description: "Redesign the customer-facing portal with new branding",
      status: "ACTIVE",
      teamId: designTeam.id,
      startDate: new Date("2026-04-15"),
      dueDate: new Date("2026-08-31"),
    },
  });

  const intlProject = await prisma.project.create({
    data: {
      name: "Internal Tools",
      key: "INTL",
      description: "Developer productivity tooling and CI/CD improvements",
      status: "PLANNING",
      teamId: platformTeam.id,
    },
  });

  // ── Sprints ────────────────────────────────────────────
  const agrSprint = await prisma.sprint.create({
    data: {
      projectId: agrProject.id,
      name: "Sprint 1",
      goal: "Set up gateway skeleton and auth middleware",
      startDate: new Date("2026-04-01"),
      endDate: new Date("2026-04-14"),
      status: "ACTIVE",
    },
  });

  const cpv2Sprint = await prisma.sprint.create({
    data: {
      projectId: cpv2Project.id,
      name: "Sprint 1",
      goal: "Design system and homepage prototype",
      startDate: new Date("2026-04-15"),
      endDate: new Date("2026-04-28"),
      status: "ACTIVE",
    },
  });

  // ── Issues for AGR ─────────────────────────────────────
  const agrIssues = [
    {
      issueKey: "AGR-1",
      type: "EPIC" as const,
      title: "Gateway Foundation",
      description: "Set up the core gateway project structure",
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      assigneeId: alex.id,
      reporterId: manager.id,
      storyPoints: 13,
    },
    {
      issueKey: "AGR-2",
      type: "STORY" as const,
      title: "Implement request routing",
      description: "Route incoming requests to downstream services",
      priority: "HIGH" as const,
      status: "TODO" as const,
      assigneeId: alex.id,
      reporterId: manager.id,
      storyPoints: 8,
      originalEstimateMinutes: 480,
    },
    {
      issueKey: "AGR-3",
      type: "TASK" as const,
      title: "Add health check endpoint",
      description: "GET /health returning service status",
      priority: "MEDIUM" as const,
      status: "DONE" as const,
      assigneeId: james.id,
      reporterId: manager.id,
      storyPoints: 2,
      originalEstimateMinutes: 120,
    },
    {
      issueKey: "AGR-4",
      type: "BUG" as const,
      title: "Fix timeout on large payloads",
      description: "Requests > 5MB are timing out after 30s",
      priority: "CRITICAL" as const,
      status: "TODO" as const,
      assigneeId: james.id,
      reporterId: alex.id,
      storyPoints: 5,
    },
    {
      issueKey: "AGR-5",
      type: "TASK" as const,
      title: "Set up CI pipeline",
      description: "GitHub Actions build and test workflow",
      priority: "MEDIUM" as const,
      status: "BACKLOG" as const,
      assigneeId: null,
      reporterId: manager.id,
      storyPoints: 3,
    },
    {
      issueKey: "AGR-6",
      type: "STORY" as const,
      title: "Auth middleware with JWT validation",
      description: "Validate JWT tokens on all protected routes",
      priority: "HIGH" as const,
      status: "REVIEW" as const,
      assigneeId: alex.id,
      reporterId: manager.id,
      storyPoints: 5,
      originalEstimateMinutes: 360,
    },
  ];

  for (const issue of agrIssues) {
    await prisma.issue.create({
      data: {
        ...issue,
        projectId: agrProject.id,
        sprintId: issue.status !== "BACKLOG" ? agrSprint.id : null,
      },
    });
  }

  // ── Issues for CPV2 ────────────────────────────────────
  const cpv2Issues = [
    {
      issueKey: "CPV2-1",
      type: "EPIC" as const,
      title: "Design System Setup",
      description: "Create shared component library and tokens",
      priority: "HIGH" as const,
      status: "IN_PROGRESS" as const,
      assigneeId: maria.id,
      reporterId: manager.id,
      storyPoints: 13,
    },
    {
      issueKey: "CPV2-2",
      type: "STORY" as const,
      title: "Homepage redesign",
      description: "New hero section and feature cards",
      priority: "HIGH" as const,
      status: "TODO" as const,
      assigneeId: aiko.id,
      reporterId: manager.id,
      storyPoints: 8,
      originalEstimateMinutes: 600,
    },
    {
      issueKey: "CPV2-3",
      type: "TASK" as const,
      title: "Set up Storybook",
      description: "Component documentation environment",
      priority: "MEDIUM" as const,
      status: "DONE" as const,
      assigneeId: maria.id,
      reporterId: manager.id,
      storyPoints: 3,
      originalEstimateMinutes: 180,
    },
    {
      issueKey: "CPV2-4",
      type: "BUG" as const,
      title: "Color contrast issues on buttons",
      description: "Primary buttons fail WCAG AA check",
      priority: "HIGH" as const,
      status: "TODO" as const,
      assigneeId: aiko.id,
      reporterId: maria.id,
      storyPoints: 2,
    },
    {
      issueKey: "CPV2-5",
      type: "STORY" as const,
      title: "Navigation component",
      description: "Responsive top nav with mobile drawer",
      priority: "MEDIUM" as const,
      status: "BACKLOG" as const,
      assigneeId: null,
      reporterId: manager.id,
      storyPoints: 5,
      originalEstimateMinutes: 360,
    },
  ];

  for (const issue of cpv2Issues) {
    await prisma.issue.create({
      data: {
        ...issue,
        projectId: cpv2Project.id,
        sprintId: issue.status !== "BACKLOG" ? cpv2Sprint.id : null,
      },
    });
  }

  console.log("✅ Seed complete");
  console.log(`   Admin: ${admin.email}`);
  console.log(`   Manager: ${manager.email}`);
  console.log(`   Members: ${alex.email}, ${maria.email}, ${james.email}, ${aiko.email}`);
  console.log(`   Teams: ${platformTeam.name}, ${designTeam.name}`);
  console.log(`   Projects: ${agrProject.key}, ${cpv2Project.key}, ${intlProject.key}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
