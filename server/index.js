import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import { pool } from './db.js'

const app = express()
const PORT = process.env.PORT || 5001
const HOST = process.env.HOST || '127.0.0.1'

const allowedStatuses = ['New', 'Reviewed', 'Contacted', 'Proposal Sent', 'Won', 'Lost']

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function cleanText(value) {
  return String(value || '').trim()
}

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ ok: true, service: 'AutomateHER Studio API' })
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

    response.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating audit lead:', error)
    response.status(500).json({ message: 'Unable to save the workflow audit request.' })
  }
})

app.get('/api/audit-leads', async (request, response) => {
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

app.patch('/api/audit-leads/:id/status', async (request, response) => {
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

app.patch('/api/audit-leads/:id/notes', async (request, response) => {
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

const server = app.listen(PORT, HOST, () => {
  console.log(`AutomateHER Studio API running on http://${HOST}:${PORT}`)
})

server.on('error', (error) => {
  console.error('Server error:', error)
})
