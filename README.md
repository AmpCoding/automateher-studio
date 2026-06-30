# AutomateHER Studio

AutomateHER Studio is a service-first tech startup website built with React,
Vite, Node.js, Express, and PostgreSQL. It helps small businesses and nonprofits
replace messy spreadsheets, emails, and manual follow-ups with custom portals,
workflow automations, dashboards, alerts, and business process cleanup.

This version includes:

- Responsive Sapphire & Soft Pearl marketing homepage
- Workflow Audit lead form with frontend and backend validation
- Express API for workflow audit leads
- PostgreSQL schema for saved submissions
- JWT-protected admin dashboard for reviewing leads and updating status

The admin dashboard uses a simple local admin login. Replace development
secrets and passwords before deploying.

## Tech Stack

- React
- React Router
- JavaScript
- Vite
- Plain CSS
- Node.js
- Express
- PostgreSQL
- pg
- bcryptjs
- jsonwebtoken

## Frontend Setup

Install frontend dependencies from the project root:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Server Setup

Install server dependencies:

```bash
cd server
npm install
```

Create a local PostgreSQL database:

```bash
createdb automateher_studio
```

Create the workflow audit leads and admin users tables:

```bash
psql automateher_studio -f schema.sql
```

Create a `.env` file inside `server`:

```bash
cp .env.example .env
```

Default `.env` values:

```bash
PORT=5001
DATABASE_URL=postgres://localhost:5432/automateher_studio
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_NAME=Local Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
```

Use a long random value for `JWT_SECRET`, and change the admin password before
deployment.

Create the first local admin user after setting `server/.env`:

```bash
npm run seed:admin
```

Start the backend development server from the `server` folder:

```bash
npm run dev
```

Or from the project root:

```bash
npm run dev:server
```

The API runs at `http://localhost:5001`.

## Workflow Audit Form

The public Workflow Audit form submits to the Express backend and saves each
lead to PostgreSQL. Name, email, business details, process notes, workflow
problem, tools used, budget range, timeline, and preferred contact method are
required. Phone is optional.

## API Routes

Public routes:

- `GET /api/health`
- `POST /api/audit-leads`
- `POST /api/auth/login`

Protected admin routes:

- `GET /api/auth/me`
- `GET /api/audit-leads`
- `PATCH /api/audit-leads/:id/status`
- `PATCH /api/audit-leads/:id/notes`

## Admin Dashboard

Visit `http://localhost:5173/admin/login` and sign in with the seeded local
admin user. After login, `http://localhost:5173/admin` fetches workflow audit
leads from the backend, shows lead metrics, supports searching and status
filtering, allows status updates, and supports internal admin notes for each
lead.

Status options:

- New
- Reviewed
- Contacted
- Proposal Sent
- Won
- Lost

## Production Build

Build the frontend:

```bash
npm run build
```

Preview the frontend production build:

```bash
npm run preview
```
