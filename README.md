# AutomateHER Studio

AutomateHER Studio is a service-first tech startup website built with React,
Vite, Node.js, Express, and PostgreSQL. It helps small businesses and nonprofits
replace messy spreadsheets, emails, and manual follow-ups with custom portals,
workflow automations, dashboards, alerts, and business process cleanup.

This version includes:

- Responsive Sapphire & Soft Pearl marketing homepage
- Workflow Audit lead form
- Express API for workflow audit leads
- PostgreSQL schema for saved submissions
- Development-only admin dashboard for reviewing leads and updating status

The admin dashboard does not have authentication yet. Keep it local during
development until authentication is added.

## Tech Stack

- React
- JavaScript
- Vite
- Plain CSS
- Node.js
- Express
- PostgreSQL
- pg

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

Create the workflow audit leads table:

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

## API Routes

- `GET /api/health`
- `POST /api/audit-leads`
- `GET /api/audit-leads`
- `PATCH /api/audit-leads/:id/status`

## Admin Dashboard

Open the frontend and use the `Admin` link in the header, or scroll to the
development admin section. The dashboard fetches workflow audit leads from the
backend and allows status updates.

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
