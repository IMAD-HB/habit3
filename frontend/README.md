# Habit 3 Frontend

Frontend application for **Habit 3**, a productivity application inspired by Stephen Covey's _The 7 Habits of Highly Effective People_.

The application helps users translate their values and roles into weekly priorities and protected time.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack React Query
- Zustand
- Axios

## Features

- User registration and login
- Protected application routes
- Dashboard
- Role management
- Activity management
- Eisenhower Matrix classification
- Weekly priority planning
- Previous/next week navigation
- Copy last week's priorities
- Weekly schedule
- Time-block creation
- Time-block editing
- Time-block deletion
- Time-block status management
- Responsive navigation
- Mobile sidebar menu
- Sticky navigation bar

## Project Structure

```text
frontend/
├── src/
│   ├── assets/
│   │   └── schedule-icon.gif
│   ├── components/
│   │   ├── activities/
│   │   ├── dashboard/
│   │   ├── roles/
│   │   ├── schedule/
│   │   └── weekly-plan/
│   ├── layouts/
│   │   └── AppLayout.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── pages/
│   │   ├── ActivitiesPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── RolesPage.tsx
│   │   ├── SchedulePage.tsx
│   │   └── WeeklyPlanPage.tsx
│   ├── router/
│   │   ├── AppRouter.tsx
│   │   └── ProtectedRoute.tsx
│   ├── services/
│   │   ├── activityService.ts
│   │   ├── roleService.ts
│   │   ├── timeBlockService.ts
│   │   └── weeklyPlanService.ts
│   ├── stores/
│   │   └── authStore.ts
│   ├── types/
│   │   ├── activity.ts
│   │   ├── role.ts
│   │   ├── timeBlock.ts
│   │   └── weeklyPlan.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Application Pages

### Dashboard

Provides an overview of the current week, including:

- Weekly priorities
- Progress statistics
- Today's scheduled time
- Quick access to planning

### Roles

Allows users to define and manage their important life roles.

Examples:

```text
Son
Brother
Friend
Student
```

### Activities

Allows users to create activities associated with their roles.

Activities can be classified using the Eisenhower Matrix:

```text
I   → Urgent & Important
II  → Important, Not Urgent
III → Urgent, Not Important
IV  → Not Important
```

### Weekly Plan

Allows users to select their priorities for a specific week.

Weeks run from:

```text
Sunday → Saturday
```

Users can:

- Navigate between weeks
- Select important activities
- Save weekly priorities
- Edit an existing plan
- Delete a plan
- Copy the previous week's priorities

### Schedule

Turns weekly priorities into protected time blocks.

Users can:

- Select a weekly plan
- Schedule priority activities
- View the week's schedule
- Edit time blocks
- Change their status
- Delete scheduled blocks

## Navigation

Desktop screens use a horizontal navigation bar.

Small screens use a sidebar menu opened through the menu button.

The application header is sticky so navigation remains available while scrolling.

## State Management

### Zustand

Zustand manages authentication state.

The authentication store handles:

- Current user
- JWT token
- Login state
- Logout
- Authentication initialization

The token is stored in `localStorage`.

### TanStack React Query

TanStack React Query manages server state.

Examples of query keys:

```ts
["roles"]["activities"]["weekly-plans"][("time-blocks", weeklyPlanId)];
```

Mutations invalidate the relevant queries after successful changes so the interface stays synchronized with the backend.

## API Client

Axios is configured in:

```text
src/lib/api.ts
```

The client automatically attaches the JWT token to authenticated requests.

The development backend is currently configured as:

```text
http://localhost:5000/api
```

## Installation

From the frontend directory:

```bash
npm install
```

## Development

Start the Vite development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Production Build

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Application Architecture

The application separates page-level coordination from reusable UI components.

For example:

```text
WeeklyPlanPage
├── WeeklyPlanHeader
├── WeekNavigator
├── ActivityPriorityList
├── WeeklyPrioritySummary
├── WeeklyPlanEmptyState
├── WeeklyPlanError
└── WeeklyPlanErrorMessage
```

The pages are responsible primarily for:

- Queries
- Mutations
- State
- Derived data
- Event handlers
- Coordinating components

Components are responsible primarily for presentation and focused UI behavior.

## Responsive Design

The interface is designed for both desktop and small screens.

Desktop:

```text
Sticky Navbar
├── App Logo
├── Navigation
└── User / Logout
```

Mobile:

```text
Sticky Navbar
├── Menu
└── App Logo

Sidebar
├── Navigation
└── User / Logout
```

## Planning Workflow

The frontend follows the Habit 3 planning process:

```text
Values
   ↓
Roles
   ↓
Activities
   ↓
Weekly Priorities
   ↓
Time Allocation
   ↓
Weekly Schedule
   ↓
Weekly Review
```

The goal is to help users focus their time on important activities rather than simply reacting to urgent tasks.

```

```
