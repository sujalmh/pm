# Project Time Manager - Delivery Tasks

## Phase 1 - Product Foundation

- [x] Initialize Next.js app with TypeScript and App Router
- [x] Add Tailwind CSS and base design system
- [x] Configure ESLint, formatting, and env handling
- [x] Set up PostgreSQL database
- [x] Configure Prisma schema and migrations
- [x] Seed demo users, projects, and issues
- [x] Set up authentication and protected routes
- [x] Define user roles: Admin, Manager, Member

## Phase 2 - Core Layout & Navigation

- [x] Build app shell with sidebar and top navigation
- [x] Create dashboard landing page
- [x] Create projects list page
- [x] Create project detail page
- [x] Add reusable cards, tables, modals, and forms
- [x] Add loading, empty, and error states

## Phase 3 - Project & Issue Management

- [x] Create project CRUD flows
- [x] Create issue CRUD flows
- [x] Support issue types: Epic, Story, Task, Bug, Subtask
- [x] Add validation for required fields
- [x] Add assignee, priority, labels, due date, estimate fields
- [x] Create issue detail side panel or modal
- [x] Add comments and activity history

## Phase 4 - Backlog & Sprint Planning

- [x] Build backlog page
- [x] Add drag-and-drop issue ordering
- [x] Create sprint CRUD flows
- [x] Move tasks into and out of active sprint
- [x] Add sprint start and complete actions
- [x] Show sprint progress summary

## Phase 5 - Board Experience

- [x] Build Jira-like Kanban/Scrum board
- [x] Add columns: Backlog, To Do, In Progress, Review, Done
- [x] Enable drag-and-drop status updates
- [x] Add board filters by assignee, sprint, priority, label
- [x] Persist board changes to database

## Phase 6 - Time Tracking

- [x] Add time log form on issue details
- [x] Store worklog entries with date, duration, note
- [x] Calculate estimated, spent, and remaining time
- [x] Add personal weekly time summary
- [x] Add project-level time report page

## Phase 7 - Dashboard & Reports

- [x] Show my open tasks
- [x] Show overdue and due-soon tasks
- [x] Show project tasks by status
- [x] Add workload summary per team member
- [x] Add simple charts for sprint/time metrics
- [x] Add CSV export for reports in later iteration

## Phase 8 - Permissions & Notifications

- [ ] Restrict admin-only settings
- [ ] Restrict project editing to managers/admins
- [ ] Add in-app notifications for assignment and mentions
- [ ] Add reminder logic for due dates

## Phase 9 - Quality & Testing

- [ ] Add unit tests for utilities and validation
- [ ] Add integration tests for key flows
- [ ] Test auth, project creation, issue flow, board updates, and time logging
- [ ] Verify responsive layout and accessibility basics
- [ ] Optimize performance for dashboard and board pages

## Phase 10 - Deployment

- [ ] Prepare production environment variables
- [ ] Deploy app to Vercel
- [ ] Configure managed PostgreSQL instance
- [ ] Set up logging and error monitoring
- [ ] Create admin demo account

---

## Suggested Initial Sprint

### Sprint 1
- [ ] App setup
- [ ] Auth
- [ ] Database schema
- [ ] Basic dashboard shell

### Sprint 2
- [ ] Project CRUD
- [ ] Issue CRUD
- [ ] Basic board

### Sprint 3
- [ ] Sprint management
- [ ] Time logging
- [ ] Reports

---

## Definition of Done

A feature is complete when:
- [ ] UX is implemented
- [ ] Validation is working
- [ ] Database persistence is verified
- [ ] Role permissions are enforced
- [ ] Tests cover the critical path
- [ ] The feature is reviewed for polish and usability
