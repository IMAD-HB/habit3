# Habit 3 Backend

Backend API for **Habit 3**, a productivity application inspired by Stephen Covey's _The 7 Habits of Highly Effective People_, particularly the principle of putting first things first.

The backend provides authentication and APIs for managing roles, activities, weekly plans, and scheduled time blocks.

## Tech Stack

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- bcrypt
- Axios-compatible REST API
- tsx

## Features

- User registration and authentication
- JWT-based protected routes
- Password hashing with bcrypt
- User-scoped data
- Role management
- Activity management
- Eisenhower Matrix classification
- Weekly priority planning
- Weekly plan navigation
- Copying priorities from the previous week
- Time-block scheduling
- Time-block status management
- Overlap prevention for scheduled blocks
- Weekly plan validation
- Activity ownership validation

## Project Structure

```text
backend/
├── config/
│   └── db.ts
├── controllers/
│   ├── authController.ts
│   ├── roleController.ts
│   ├── activityController.ts
│   ├── weeklyPlanController.ts
│   └── timeBlockController.ts
├── middleware/
│   └── auth.ts
├── models/
│   ├── User.ts
│   ├── Role.ts
│   ├── Activity.ts
│   ├── WeeklyPlan.ts
│   └── TimeBlock.ts
├── routes/
│   ├── authRoutes.ts
│   ├── roleRoutes.ts
│   ├── activityRoutes.ts
│   ├── weeklyPlanRoutes.ts
│   └── timeBlockRoutes.ts
├── services/
├── utils/
├── validators/
├── .env
├── .gitignore
├── package.json
├── server.ts
└── tsconfig.json
```

## Data Model

### User

Users own all of their productivity data.

### Role

Represents an important role in the user's life, such as:

- Son
- Brother
- Friend
- Student

Each role can contain a name, description, color, and display order.

### Activity

Represents an activity associated with a role.

Activities include:

- Title
- Description
- Role
- Eisenhower quadrant
- Estimated duration
- Completion status

The four quadrants are:

| Quadrant | Meaning               |
| -------- | --------------------- |
| I        | Urgent & Important    |
| II       | Important, Not Urgent |
| III      | Urgent, Not Important |
| IV       | Not Important         |

### Weekly Plan

Represents the user's priorities for a specific Sunday–Saturday week.

A weekly plan contains:

- Week start
- Week end
- Selected priority activities

A user can have only one weekly plan for a given week.

### Time Block

Represents protected time assigned to an activity within a weekly plan.

Time blocks contain:

- Weekly plan
- Activity
- Start time
- End time
- Status

Available statuses:

- `planned`
- `completed`
- `cancelled`

Time blocks must belong to the selected weekly plan and cannot overlap.

## Authentication

Authentication uses JWT.

Protected endpoints require:

```http
Authorization: Bearer <token>
```

Passwords are hashed using bcrypt before being stored.

## API Routes

### Authentication

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Roles

```text
POST   /api/roles
GET    /api/roles
GET    /api/roles/:id
PATCH  /api/roles/:id
DELETE /api/roles/:id
```

### Activities

```text
POST   /api/activities
GET    /api/activities
GET    /api/activities/:id
PATCH  /api/activities/:id
DELETE /api/activities/:id
```

Activities can optionally be filtered by role.

### Weekly Plans

```text
POST   /api/weekly-plans
GET    /api/weekly-plans
GET    /api/weekly-plans/:id
PATCH  /api/weekly-plans/:id
DELETE /api/weekly-plans/:id
```

### Time Blocks

```text
POST   /api/time-blocks
GET    /api/time-blocks
GET    /api/time-blocks/:id
PATCH  /api/time-blocks/:id
DELETE /api/time-blocks/:id
```

Time blocks can optionally be filtered by weekly plan.

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` to Git.

## Installation

From the backend directory:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

## Type Checking

```bash
npm run typecheck
```

## Build

```bash
npm run build
```

## Production

After building:

```bash
npm start
```

## Development Workflow

The backend follows a layered structure:

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Model / Database
   ↓
Response
```

Authentication middleware protects private routes and attaches the authenticated user to the request.

All productivity data is scoped to the authenticated user to prevent users from accessing another user's data.

## Current Planning Workflow

Habit 3 follows this general process:

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

The backend currently supports the core functionality through weekly plans and time blocks.

```

```
