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
- Admin follow-up tracking for priority, package interest, and follow-up dates
- Optional email notifications for Workflow Audit submissions

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
- nodemailer

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
EMAIL_NOTIFICATIONS_ENABLED=true
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
MAIL_FROM="AutomateHER Studio <hello@automateherstudio.com>"
ADMIN_NOTIFICATION_EMAIL=your_admin_email@example.com
```

Use a long random value for `JWT_SECRET`, and change the admin password before
deployment.

Do not commit `server/.env`. It should contain real local secrets only on your
machine.

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

When email notifications are enabled and SMTP is configured, each successful
submission sends a confirmation email to the lead and a new lead notification to
the admin email address. The lead is saved before email is sent, so email
delivery problems do not block form submission.

If `EMAIL_NOTIFICATIONS_ENABLED` is not `true` or SMTP settings are incomplete,
the server logs `Email notifications skipped. SMTP settings are not configured.`
and continues saving leads normally.

To test email locally, fill in the SMTP values in `server/.env`, set
`ADMIN_NOTIFICATION_EMAIL` to your own test inbox, restart the backend, submit a
Workflow Audit form, or call the protected test route:

```bash
POST /api/admin/test-email
```

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
- `PATCH /api/audit-leads/:id/follow-up`
- `POST /api/admin/test-email`

## Admin Dashboard

Visit `http://localhost:5173/admin/login` and sign in with the seeded local
admin user. After login, `http://localhost:5173/admin` fetches workflow audit
leads from the backend, shows lead metrics, supports searching and status
filtering, allows status updates, supports internal admin notes, and tracks
priority, package interest, and follow-up date for each lead.

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
