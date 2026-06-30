import nodemailer from 'nodemailer'

function cleanText(value) {
  return String(value || '').trim()
}

function escapeHtml(value) {
  return cleanText(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatLeadDate(dateValue) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateValue))
}

function emailSettingsAreReady() {
  return (
    process.env.EMAIL_NOTIFICATIONS_ENABLED === 'true' &&
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.MAIL_FROM &&
    process.env.ADMIN_NOTIFICATION_EMAIL
  )
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

function createClientConfirmationEmail(lead) {
  const subject = 'Your AutomateHER Studio workflow audit request was received'
  const text = `Hi ${lead.name},

Thank you for requesting a workflow audit with AutomateHER Studio. Your request has been received.

I will review your process and follow up with next steps.

Here is a quick summary of what you submitted:
Business name: ${lead.business_name}
Business type: ${lead.business_type}
Workflow problem: ${lead.biggest_problem}
Budget range: ${lead.budget_range}
Project timeline: ${lead.project_timeline}

Warmly,
AutomateHER Studio`

  const html = `
    <div style="font-family: Arial, sans-serif; color: #2b1633; line-height: 1.6;">
      <h2 style="color: #3a1748;">Your workflow audit request was received</h2>
      <p>Hi ${escapeHtml(lead.name)},</p>
      <p>Thank you for requesting a workflow audit with AutomateHER Studio. Your request has been received.</p>
      <p>I will review your process and follow up with next steps.</p>
      <h3 style="color: #3a1748;">Submission summary</h3>
      <ul>
        <li><strong>Business name:</strong> ${escapeHtml(lead.business_name)}</li>
        <li><strong>Business type:</strong> ${escapeHtml(lead.business_type)}</li>
        <li><strong>Workflow problem:</strong> ${escapeHtml(lead.biggest_problem)}</li>
        <li><strong>Budget range:</strong> ${escapeHtml(lead.budget_range)}</li>
        <li><strong>Project timeline:</strong> ${escapeHtml(lead.project_timeline)}</li>
      </ul>
      <p>Warmly,<br />AutomateHER Studio</p>
    </div>
  `

  return {
    to: lead.email,
    subject,
    text,
    html,
  }
}

function createAdminNotificationEmail(lead) {
  const subject = `New Workflow Audit Lead: ${lead.business_name}`
  const phoneLine = lead.phone ? `Phone: ${lead.phone}\n` : ''
  const text = `New Workflow Audit Lead

Name: ${lead.name}
Email: ${lead.email}
${phoneLine}Business name: ${lead.business_name}
Business type: ${lead.business_type}
Current process: ${lead.current_process}
Workflow problem: ${lead.biggest_problem}
Tools used: ${lead.tools_used}
Budget range: ${lead.budget_range}
Project timeline: ${lead.project_timeline}
Preferred contact method: ${lead.preferred_contact_method}
Created date: ${formatLeadDate(lead.created_at)}`

  const phoneRow = lead.phone
    ? `<tr><th align="left">Phone</th><td>${escapeHtml(lead.phone)}</td></tr>`
    : ''
  const html = `
    <div style="font-family: Arial, sans-serif; color: #2b1633; line-height: 1.6;">
      <h2 style="color: #3a1748;">New Workflow Audit Lead</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <tr><th align="left">Name</th><td>${escapeHtml(lead.name)}</td></tr>
        <tr><th align="left">Email</th><td>${escapeHtml(lead.email)}</td></tr>
        ${phoneRow}
        <tr><th align="left">Business name</th><td>${escapeHtml(lead.business_name)}</td></tr>
        <tr><th align="left">Business type</th><td>${escapeHtml(lead.business_type)}</td></tr>
        <tr><th align="left">Current process</th><td>${escapeHtml(lead.current_process)}</td></tr>
        <tr><th align="left">Workflow problem</th><td>${escapeHtml(lead.biggest_problem)}</td></tr>
        <tr><th align="left">Tools used</th><td>${escapeHtml(lead.tools_used)}</td></tr>
        <tr><th align="left">Budget range</th><td>${escapeHtml(lead.budget_range)}</td></tr>
        <tr><th align="left">Project timeline</th><td>${escapeHtml(lead.project_timeline)}</td></tr>
        <tr><th align="left">Preferred contact method</th><td>${escapeHtml(lead.preferred_contact_method)}</td></tr>
        <tr><th align="left">Created date</th><td>${escapeHtml(formatLeadDate(lead.created_at))}</td></tr>
      </table>
    </div>
  `

  return {
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject,
    text,
    html,
  }
}

export async function sendWorkflowAuditEmails(lead) {
  if (!emailSettingsAreReady()) {
    console.log('Email notifications skipped. SMTP settings are not configured.')
    return { skipped: true }
  }

  const transporter = createTransporter()
  const from = process.env.MAIL_FROM

  await transporter.sendMail({
    from,
    ...createClientConfirmationEmail(lead),
  })

  await transporter.sendMail({
    from,
    ...createAdminNotificationEmail(lead),
  })

  return { sent: true }
}

export async function sendAdminTestEmail(adminUser) {
  if (!emailSettingsAreReady()) {
    console.log('Email notifications skipped. SMTP settings are not configured.')
    return { skipped: true }
  }

  const transporter = createTransporter()

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.ADMIN_NOTIFICATION_EMAIL,
    subject: 'AutomateHER Studio test email',
    text: `This is a test email from AutomateHER Studio. Requested by ${adminUser.email}.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #2b1633; line-height: 1.6;">
        <h2 style="color: #3a1748;">AutomateHER Studio test email</h2>
        <p>This is a test email from AutomateHER Studio.</p>
        <p>Requested by ${escapeHtml(adminUser.email)}.</p>
      </div>
    `,
  })

  return { sent: true }
}
