# Project Time Manager - Product Requirements & Design

## 1. Overview

Project Time Manager is a Jira-like web application built with Next.js for managing projects, tasks, sprints, team workloads, and time tracking. The product is intended for small to mid-size teams that need lightweight planning and execution tools without the complexity of enterprise PM suites.

The application should support project planning, ticket management, status tracking, assignee workflows, and detailed time logging for each task.

---

## 2. Product Goals

### Primary Goals
- Help teams plan and track work across projects
- Provide Jira-style issue workflows with boards and backlogs
- Track estimated vs actual time spent on work
- Improve visibility into team capacity and delivery progress
- Keep the UX clean, fast, and modern

### Success Metrics
- Users can create a project and first task in under 3 minutes
- Teams can view sprint status and overdue work at a glance
- Logged time can be reported by user, project, and date range
- Dashboard page loads quickly and works well on desktop/laptop

---

## 3. Target Users

### 1. Project Manager
- Creates projects and sprints
- Assigns work
- Monitors deadlines, progress, and team velocity

### 2. Team Member
- Views assigned tasks
- Updates task status
- Logs work hours and comments

### 3. Admin
- Manages users, roles, permissions, and workspace settings

---

## 4. Functional Requirements

## 4.1 Authentication & Access
- Sign up, sign in, sign out
- Email/password login initially
- Role-based access: Admin, Manager, Member
- Protected routes for authenticated users only

## 4.2 Workspace & Projects
- Create, edit, archive projects
- Each project has:
  - Name
  - Key (example: PM)
  - Description
  - Status
  - Team members
  - Start and due dates

## 4.3 Issue / Task Management
- Create Jira-like issues
- Issue types:
  - Epic
  - Story
  - Task
  - Bug
  - Subtask
- Fields:
  - Title
  - Description
  - Priority
  - Status
  - Assignee
  - Reporter
  - Labels
  - Story points
  - Original estimate
  - Due date
  - Project and sprint reference
- Support comments and activity history

## 4.4 Board & Workflow
- Kanban/Scrum style board
- Default columns:
  - Backlog
  - To Do
  - In Progress
  - Review
  - Done
- Drag-and-drop issue movement between columns
- Filters by assignee, priority, label, sprint

## 4.5 Sprint & Backlog Management
- Create sprints
- Add/remove issues from sprint
- Start and complete sprint
- Backlog ordering by drag-and-drop
- Sprint summary with completed vs pending work

## 4.6 Time Tracking
- Log hours against an issue
- Manual entry with date, duration, note
- Show:
  - Estimated time
  - Time spent
  - Remaining time
- Time report views by:
  - User
  - Project
  - Sprint
  - Date range

## 4.7 Dashboard & Reporting
- Personal dashboard:
  - My tasks
  - Overdue work
  - Logged time this week
- Project dashboard:
  - Tasks by status
  - Sprint burndown summary
  - Team workload overview
- Export basic reports to CSV in later phase

## 4.8 Notifications
- In-app notifications for assignment changes, mentions, and due date reminders
- Email notifications can be phase 2

## 4.9 Search & Filters
- Global search by task key/title
- Saved filters for common views

---

## 5. Non-Functional Requirements

- Responsive desktop-first layout
- Fast navigation with server/client rendering balance
- Secure authentication and protected APIs
- Clear audit history for task updates
- Scalable structure for future integrations
- Accessible UI with keyboard support and readable contrast

---

## 6. Recommended Tech Stack

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui for reusable components
- dnd-kit for board drag-and-drop
- TanStack Query for server state

### Backend
- Next.js Route Handlers or Server Actions
- Prisma ORM
- PostgreSQL
- NextAuth or Auth.js for authentication

### Optional Supporting Tools
- Zod for validation
- Zustand for light client state
- Recharts for dashboard charts
- Prisma seed scripts for demo data

---

## 7. Information Architecture

### Main Navigation
- Dashboard
- Projects
- Backlog
- Board
- Calendar
- Reports
- My Work
- Settings

### Key Pages
1. Landing / Login
2. Dashboard
3. Project List
4. Project Detail
5. Backlog View
6. Sprint Board View
7. Issue Detail Drawer/Page
8. Time Reports
9. Team Management
10. Settings

---

## 8. Core Data Model

### User
- id
- name
- email
- role (Admin | Manager | Member)
- avatar
- createdAt

### Team
- id
- name
- description
- leadId (references User)
- createdAt

### TeamMember
- id
- teamId
- userId
- joinedAt

### Project
- id
- teamId (references Team)
- name
- key
- description
- status
- startDate
- dueDate

### Sprint
- id
- projectId
- name
- goal
- startDate
- endDate
- status

### Issue
- id
- projectId
- sprintId
- issueKey
- type
- title
- description
- priority
- status
- assigneeId
- reporterId
- storyPoints
- originalEstimateMinutes
- dueDate

### Worklog
- id
- issueId
- userId
- date
- durationMinutes
- note

### Comment
- id
- issueId
- userId
- body
- createdAt

---

## 9. High-Level System Design

### Architecture Style
- Monolithic Next.js application for MVP
- Clear separation between UI, domain logic, and data access

### Suggested Folder Structure
```text
src/
  app/
    dashboard/
    projects/
    board/
    reports/
    api/
  components/
    ui/
    board/
    issues/
    layout/
  lib/
    auth/
    db/
    validators/
    services/
  hooks/
  types/
```

### Rendering Strategy
- Server components for dashboards, lists, and initial data fetches
- Client components for drag-and-drop board interactions, filters, and forms

---

## 10. Key User Flows

### Flow A: Create Project
1. Manager opens Projects
2. Clicks New Project
3. Enters project details
4. Invites team members
5. Creates initial backlog

### Flow B: Plan Sprint
1. Manager creates sprint from backlog
2. Selects issues for sprint
3. Assigns owners and estimates
4. Starts sprint

### Flow C: Daily Work Update
1. Member opens My Work or Board
2. Moves issue to In Progress
3. Logs work hours
4. Adds comment/blocker update
5. Moves issue to Review or Done

---

## 11. UI / UX Notes

- Jira-inspired left sidebar and top project context header
- Board cards should show title, key, priority, assignee, estimate, and logged time
- Use color sparingly for status and priority indicators
- Keep forms compact and keyboard-friendly
- Issue details should open in a side panel for fast edits

---

## 12. MVP Scope

### Include in MVP
- Authentication
- Project CRUD
- Issue CRUD
- Board view
- Sprint setup
- Time logging
- Dashboard summary
- Role-based permissions

### Exclude from MVP
- Advanced automations
- Third-party integrations
- Email digest notifications
- Gantt charts
- Mobile app

---

## 13. Future Enhancements

- Calendar and roadmap timeline
- Slack/Teams integration
- GitHub/GitLab linking
- AI sprint summary and estimation suggestions
- Recurring tasks
- Approval workflow for time entries

---

## 14. Seed / Demo Data

The database seed script should create the following records so the app is usable immediately after setup.

### Users

| Name | Email | Role |
|---|---|---|
| Sujal Admin | admin@coreason.dev | Admin |
| Priya Sharma | priya@coreason.dev | Manager |
| Alex Chen | alex@coreason.dev | Member |
| Maria Lopez | maria@coreason.dev | Member |
| James Wilson | james@coreason.dev | Member |
| Aiko Tanaka | aiko@coreason.dev | Member |

### Teams

| Team Name | Lead | Members |
|---|---|---|
| Platform Engineering | Priya Sharma | Alex Chen, James Wilson |
| Product Design | Priya Sharma | Maria Lopez, Aiko Tanaka |

### Projects

| Project | Key | Team | Status | Description |
|---|---|---|---|---|
| API Gateway Rebuild | AGR | Platform Engineering | Active | Rewrite the API gateway for better performance and observability |
| Customer Portal v2 | CPV2 | Product Design | Active | Redesign the customer-facing portal with new branding |
| Internal Tools | INTL | Platform Engineering | Planning | Developer productivity tooling and CI/CD improvements |

### Default Sprint per Project

Each active project is seeded with one sprint named "Sprint 1" containing 5-8 sample issues across all types (Epic, Story, Task, Bug) in mixed statuses.

---

## 15. Delivery Recommendation

Build the product in phases:
1. Foundation and authentication
2. Projects and issue management
3. Board and sprint planning
4. Time tracking and reporting
5. Polish, permissions, and deployment
