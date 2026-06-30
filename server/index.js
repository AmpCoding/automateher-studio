import bcrypt from 'bcryptjs'
import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import jwt from 'jsonwebtoken'
import { pool } from './db.js'
import { sendAdminTestEmail, sendWorkflowAuditEmails } from './email.js'

const app = express()
const PORT = process.env.PORT || 5001
const HOST = process.env.HOST || '127.0.0.1'
const JWT_SECRET = process.env.JWT_SECRET

const allowedStatuses = ['New', 'Reviewed', 'Contacted', 'Proposal Sent', 'Won', 'Lost']

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanText(value) {
  return String(value || '').trim()
}

function createAdminToken(adminUser) {
  return jwt.sign(
    {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    },
    JWT_SECRET,
    { expiresIn: '8h' },
  )
}

function formatAdminProfile(adminUser) {
  return {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: adminUser.role,
  }
}

function requireJwtSecret(response) {
  if (JWT_SECRET) {
    return true
  }

  response.status(500).json({ message: 'Admin authentication is not configured yet.' })
  return false
}

async function requireAuth(request, response, next) {
  if (!requireJwtSecret(response)) {
    return
  }

  const authHeader = request.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token) {
    return response.status(401).json({ message: 'Please log in to access the admin dashboard.' })
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET)
    const result = await pool.query(
      'SELECT id, name, email, role FROM admin_users WHERE id = $1',
      [decodedToken.id],
    )

    if (result.rowCount === 0) {
      return response.status(401).json({ message: 'Your admin session is no longer valid.' })
    }

    request.adminUser = result.rows[0]
    next()
  } catch {
    response.status(401).json({ message: 'Your admin session has expired. Please log in again.' })
  }
}

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ ok: true, service: 'AutomateHER Studio API' })
})

app.post('/api/auth/login', async (request, response) => {
  if (!requireJwtSecret(response)) {
    return
  }

  const { email, password } = request.body || {}
  const cleanEmail = cleanText(email).toLowerCase()

  if (!cleanEmail || !password) {
    return response.status(400).json({ message: 'Please enter your email and password.' })
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, password_hash, role FROM admin_users WHERE email = $1',
      [cleanEmail],
    )

    if (result.rowCount === 0) {
      return response.status(401).json({ message: 'Email or password is incorrect.' })
    }

    const adminUser = result.rows[0]
    const passwordMatches = await bcrypt.compare(password, adminUser.password_hash)

    if (!passwordMatches) {
      return response.status(401).json({ message: 'Email or password is incorrect.' })
    }

    response.json({
      token: createAdminToken(adminUser),
      admin: formatAdminProfile(adminUser),
    })
  } catch (error) {
    console.error('Error logging in admin user:', error)
    response.status(500).json({ message: 'Unable to log in right now. Please try again.' })
  }
})

app.get('/api/auth/me', requireAuth, (request, response) => {
  response.json({ admin: formatAdminProfile(request.adminUser) })
})

app.post('/api/audit-leads', async (request, response) => {
  const {
    name,
    email,
    phone,
    businessName,
    businessType,
    currentProcess,
    workflowProblem,
    toolsUsed,
    budgetRange,
    projectTimeline,
    preferredContactMethod,
  } = request.body || {}

  const requiredFields = [
    { label: 'Name', value: name },
    { label: 'Email', value: email },
    { label: 'Business name', value: businessName },
    { label: 'Business type', value: businessType },
    { label: 'Current process', value: currentProcess },
    { label: 'Workflow problem', value: workflowProblem },
    { label: 'Tools currently used', value: toolsUsed },
    { label: 'Budget range', value: budgetRange },
    { label: 'Project timeline', value: projectTimeline },
    { label: 'Preferred contact method', value: preferredContactMethod },
  ]
  const missingField = requiredFields.find((field) => !cleanText(field.value))

  if (missingField) {
    return response.status(400).json({ message: `Please complete the ${missingField.label} field.` })
  }

  if (!emailPattern.test(cleanText(email))) {
    return response.status(400).json({ message: 'Please enter a valid email address.' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO workflow_audit_leads (
        name,
        email,
        phone,
        business_name,
        business_type,
        current_process,
        biggest_problem,
        tools_used,
        budget_range,
        project_timeline,
        preferred_contact_method
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        cleanText(name),
        cleanText(email),
        cleanText(phone),
        cleanText(businessName),
        cleanText(businessType),
        cleanText(currentProcess),
        cleanText(workflowProblem),
        cleanText(toolsUsed),
        cleanText(budgetRange),
        cleanText(projectTimeline),
        cleanText(preferredContactMethod),
      ],
    )

    const savedLead = result.rows[0]

    try {
      await sendWorkflowAuditEmails(savedLead)
    } catch (emailError) {
      console.error('Error sending workflow audit emails:', emailError)
    }

    response.status(201).json(savedLead)
  } catch (error) {
    console.error('Error creating audit lead:', error)
    response.status(500).json({ message: 'Unable to save the workflow audit request.' })
  }
})

app.get('/api/audit-leads', requireAuth, async (request, response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM workflow_audit_leads ORDER BY created_at DESC',
    )

    response.json(result.rows)
  } catch (error) {
    console.error('Error fetching audit leads:', error)
    response.status(500).json({ message: 'Unable to load workflow audit leads.' })
  }
})

app.patch('/api/audit-leads/:id/status', requireAuth, async (request, response) => {
  const { id } = request.params
  const { status } = request.body || {}

  if (!allowedStatuses.includes(status)) {
    return response.status(400).json({ message: 'Invalid lead status.' })
  }

  try {
    const result = await pool.query(
      `UPDATE workflow_audit_leads
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id],
    )

    if (result.rowCount === 0) {
      return response.status(404).json({ message: 'Workflow audit lead not found.' })
    }

    response.json(result.rows[0])
  } catch (error) {
    console.error('Error updating audit lead status:', error)
    response.status(500).json({ message: 'Unable to update the workflow audit lead.' })
  }
})

app.patch('/api/audit-leads/:id/notes', requireAuth, async (request, response) => {
  const { id } = request.params
  const { notes } = request.body || {}

  if (typeof notes !== 'string') {
    return response.status(400).json({ message: 'Notes must be text.' })
  }

  try {
    const result = await pool.query(
      `UPDATE workflow_audit_leads
       SET notes = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [notes, id],
    )

    if (result.rowCount === 0) {
      return response.status(404).json({ message: 'Workflow audit lead not found.' })
    }

    response.json(result.rows[0])
  } catch (error) {
    console.error('Error updating audit lead notes:', error)
    response.status(500).json({ message: 'Unable to update the workflow audit lead notes.' })
  }
})

app.post('/api/admin/test-email', requireAuth, async (request, response) => {
  try {
    const result = await sendAdminTestEmail(request.adminUser)

    if (result.skipped) {
      return response.json({ message: 'Email notifications skipped. SMTP settings are not configured.' })
    }

    response.json({ message: 'Test email sent.' })
  } catch (error) {
    console.error('Error sending admin test email:', error)
    response.status(500).json({ message: 'Unable to send test email right now.' })
  }
})

const server = app.listen(PORT, HOST, () => {
  console.log(`AutomateHER Studio API running on http://${HOST}:${PORT}`)
})

server.on('error', (error) => {
  console.error('Server error:', error)
})
