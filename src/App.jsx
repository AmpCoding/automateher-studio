import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'
const ADMIN_TOKEN_KEY = 'automateher_admin_token'

const painPoints = [
  {
    title: 'Too many places to check',
    copy: 'Requests, client notes, files, and approvals are scattered across inboxes, spreadsheets, and memory.',
  },
  {
    title: 'Follow-ups depend on willpower',
    copy: 'The team loses time remembering who needs a reminder, what is overdue, and what should happen next.',
  },
  {
    title: 'Leadership cannot see the bottleneck',
    copy: 'Work is happening, but status, ownership, and stalled steps are hard to understand at a glance.',
  },
]

const services = [
  {
    title: 'Custom portals',
    copy: 'Client, member, vendor, or staff portals that collect information, clarify next steps, and reduce back-and-forth.',
  },
  {
    title: 'Workflow automations',
    copy: 'Automated intake, routing, reminders, approvals, handoffs, and follow-ups built around the way your team works.',
  },
  {
    title: 'Dashboards and alerts',
    copy: 'Status views, deadline alerts, and operational snapshots that make daily decisions easier.',
  },
  {
    title: 'Process cleanup',
    copy: 'Practical mapping, simplification, and documentation so the new system is easier to run after launch.',
  },
]

const packages = [
  {
    name: 'Starter Package',
    price: '$750\u2013$1,500',
    description: 'A focused cleanup for one workflow, intake form, tracker, or lightweight portal.',
    features: ['Workflow audit', 'Simple portal or automation', 'Launch checklist'],
  },
  {
    name: 'Growth Package',
    price: '$2,500\u2013$5,000',
    description: 'A deeper build for teams ready to connect multiple processes and reduce repetitive admin.',
    features: ['Process map', 'Custom portal build', 'Dashboards and alerts'],
    featured: true,
  },
  {
    name: 'Monthly Support',
    price: '$99\u2013$499/month',
    description: 'Ongoing improvements, monitoring, fixes, and small enhancements after your system goes live.',
    features: ['Monthly check-ins', 'Light updates', 'Priority support window'],
  },
]

const budgetRanges = [
  'Under $1,000',
  '$1,000\u2013$2,500',
  '$2,500\u2013$5,000',
  '$5,000+',
  'Not sure yet',
]

const timelineOptions = [
  'As soon as possible',
  'Within 2\u20134 weeks',
  'Within 1\u20132 months',
  'Just exploring',
]

const contactMethods = ['Email', 'Phone', 'Text']

const leadStatuses = ['New', 'Reviewed', 'Contacted', 'Proposal Sent', 'Won', 'Lost']
const priorityOptions = ['Low', 'Normal', 'High', 'Urgent']
const packageInterestOptions = [
  'Not Sure Yet',
  'Starter Package',
  'Growth Package',
  'Monthly Support',
  'Custom Build',
]

function BrandName() {
  return (
    <span className="brand-word">
      Automate<span>HER</span> Studio
    </span>
  )
}

function Header() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <header className={isAdminPage ? 'site-header admin-site-header' : 'site-header'}>
      <div className="header-main section-shell">
        <Link className="brand" to="/" aria-label="AutomateHER Studio home">
          <span className="brand-mark">A</span>
          <BrandName />
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {!isAdminPage && (
            <>
              <a href="#services">Services</a>
              <a href="#packages">Packages</a>
              <a href="#audit">Audit</a>
            </>
          )}
          <NavLink to="/admin">Admin</NavLink>
        </nav>
        {isAdminPage ? (
          <Link className="nav-cta" to="/">
            View site
          </Link>
        ) : (
          <a className="nav-cta" href="#audit">
            Start audit
          </a>
        )}
      </div>
    </header>
  )
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="dashboard-window">
        <div className="window-top">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="dashboard-grid">
          <div className="metric-card">
            <small>Requests routed</small>
            <strong>42</strong>
            <span className="trend">+18%</span>
          </div>
          <div className="metric-card">
            <small>Overdue tasks</small>
            <strong>3</strong>
            <span className="trend quiet">watching</span>
          </div>
          <div className="workflow-card">
            <div className="workflow-row">
              <span>Intake</span>
              <strong>live</strong>
            </div>
            <div className="progress-track">
              <span></span>
            </div>
            <div className="automation-steps">
              <span>Form</span>
              <span>Route</span>
              <span>Alert</span>
            </div>
          </div>
          <div className="timeline-card">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="floating-note">
        <span className="status-dot"></span>
        <div>
          <strong>Follow-up sent</strong>
          <small>Client receives next step automatically</small>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero-section" id="top">
      <div className="section-shell hero-layout">
        <div className="hero-content">
          <p className="eyebrow">Workflow systems for small teams</p>
          <h1>Replace the spreadsheet scramble with systems that run cleanly.</h1>
          <p className="hero-copy">
            AutomateHER Studio helps small businesses and nonprofits turn messy
            spreadsheets, inbox follow-ups, and manual admin into custom portals,
            workflow automations, dashboards, alerts, and clear business processes.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#audit">
              Book a workflow audit
            </a>
            <a className="button button-secondary" href="#services">
              Explore services
            </a>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  )
}

function SectionIntro({ eyebrow, title, children }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  )
}

function PainPoints() {
  return (
    <section className="section-shell section-block" id="pain-points">
      <SectionIntro
        eyebrow="What gets untangled"
        title="Operational friction that quietly costs time"
      >
        The work may be getting done, but it should not require constant
        checking, retyping, and chasing.
      </SectionIntro>
      <div className="card-grid pain-grid">
        {painPoints.map((item, index) => (
          <article className="info-card pain-card" key={item.title}>
            <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="section-band" id="services">
      <div className="section-shell section-block">
        <SectionIntro
          eyebrow="Services"
          title="Clean systems for the work your team repeats every week"
        >
          Each build starts with the real process, then turns it into tools your
          team can trust.
        </SectionIntro>
        <div className="card-grid services-grid">
          {services.map((service) => (
            <article className="info-card service-card" key={service.title}>
              <span className="service-icon" aria-hidden="true">
                {service.title.slice(0, 1)}
              </span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PackageCard({ plan }) {
  return (
    <article className={plan.featured ? 'package-card featured' : 'package-card'}>
      {plan.featured && <p className="badge">Most requested</p>}
      <h3>{plan.name}</h3>
      <p className="package-price">{plan.price}</p>
      <p className="package-description">{plan.description}</p>
      <ul>
        {plan.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
    </article>
  )
}

function Packages() {
  return (
    <section className="section-shell section-block" id="packages">
      <SectionIntro eyebrow="Packages" title="Start with the right level of cleanup">
        Pricing depends on scope, tools, integrations, and how much process
        cleanup is needed before the build.
      </SectionIntro>
      <div className="packages-grid">
        {packages.map((plan) => (
          <PackageCard plan={plan} key={plan.name} />
        ))}
      </div>
    </section>
  )
}

const auditRequiredFields = {
  name: 'Name is required.',
  email: 'Email is required.',
  businessName: 'Business name is required.',
  businessType: 'Business type is required.',
  currentProcess: 'Current process is required.',
  workflowProblem: 'Workflow problem is required.',
  toolsUsed: 'Tools currently used is required.',
  budgetRange: 'Budget range is required.',
  projectTimeline: 'Project timeline is required.',
  preferredContactMethod: 'Preferred contact method is required.',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function RequiredMarker() {
  return <span className="required-marker">Required</span>
}

function FieldMessage({ id, children, isError = false }) {
  if (!children) {
    return null
  }

  return (
    <p className={isError ? 'field-message field-error' : 'field-message'} id={id}>
      {children}
    </p>
  )
}

function WorkflowAuditForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  function validateSubmission(submission) {
    const errors = {}

    Object.entries(auditRequiredFields).forEach(([fieldName, message]) => {
      if (!String(submission[fieldName] || '').trim()) {
        errors[fieldName] = message
      }
    })

    if (submission.email && !emailPattern.test(String(submission.email).trim())) {
      errors.email = 'Please enter a valid email address.'
    }

    return errors
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const submission = Object.fromEntries(formData.entries())
    const validationErrors = validateSubmission(submission)

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setErrorMessage('Please review the highlighted fields before submitting.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')
    setFieldErrors({})

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Unable to submit workflow audit request.')
      }

      form.reset()
      setSubmitted(true)
    } catch (error) {
      setErrorMessage(
        error.message || 'Something went wrong while sending your request. Please try again in a moment.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="thank-you" role="status">
        <p className="eyebrow">Request received</p>
        <h3>Thank you!</h3>
        <p>
          Your workflow audit request has been received. I&rsquo;ll review your
          process and follow up with next steps.
        </p>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            setSubmitted(false)
            setErrorMessage('')
            setFieldErrors({})
          }}
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <div className="audit-form-panel">
      <form className="audit-form" onSubmit={handleSubmit} noValidate>
        <div className={fieldErrors.name ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="name">
            Name <RequiredMarker />
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            aria-describedby="name-message"
            aria-invalid={Boolean(fieldErrors.name)}
          />
          <FieldMessage id="name-message" isError={Boolean(fieldErrors.name)}>
            {fieldErrors.name}
          </FieldMessage>
        </div>
        <div className={fieldErrors.email ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="email">
            Email <RequiredMarker />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-describedby="email-message"
            aria-invalid={Boolean(fieldErrors.email)}
          />
          <FieldMessage id="email-message" isError={Boolean(fieldErrors.email)}>
            {fieldErrors.email || 'Use the best email for follow-up.'}
          </FieldMessage>
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
            aria-describedby="phone-message"
          />
          <FieldMessage id="phone-message">Optional if email is easiest.</FieldMessage>
        </div>
        <div className={fieldErrors.businessName ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="business-name">
            Business name <RequiredMarker />
          </label>
          <input
            id="business-name"
            name="businessName"
            type="text"
            placeholder="Your business or organization"
            aria-describedby="business-name-message"
            aria-invalid={Boolean(fieldErrors.businessName)}
          />
          <FieldMessage id="business-name-message" isError={Boolean(fieldErrors.businessName)}>
            {fieldErrors.businessName}
          </FieldMessage>
        </div>
        <div className={fieldErrors.businessType ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="business-type">
            Business type <RequiredMarker />
          </label>
          <input
            id="business-type"
            name="businessType"
            type="text"
            placeholder="Nonprofit, salon, agency, clinic..."
            aria-describedby="business-type-message"
            aria-invalid={Boolean(fieldErrors.businessType)}
          />
          <FieldMessage id="business-type-message" isError={Boolean(fieldErrors.businessType)}>
            {fieldErrors.businessType}
          </FieldMessage>
        </div>
        <div className={fieldErrors.currentProcess ? 'form-field full-width has-error' : 'form-field full-width'}>
          <label htmlFor="current-process">
            Current process <RequiredMarker />
          </label>
          <textarea
            id="current-process"
            name="currentProcess"
            rows="4"
            placeholder="What happens today from intake to completion?"
            aria-describedby="current-process-message"
            aria-invalid={Boolean(fieldErrors.currentProcess)}
          ></textarea>
          <FieldMessage id="current-process-message" isError={Boolean(fieldErrors.currentProcess)}>
            {fieldErrors.currentProcess || 'A short overview is perfect. Bullet-style notes are fine.'}
          </FieldMessage>
        </div>
        <div className={fieldErrors.workflowProblem ? 'form-field full-width has-error' : 'form-field full-width'}>
          <label htmlFor="workflow-problem">
            Biggest workflow problem <RequiredMarker />
          </label>
          <textarea
            id="workflow-problem"
            name="workflowProblem"
            rows="4"
            placeholder="Where do things get delayed, duplicated, missed, or confusing?"
            aria-describedby="workflow-problem-message"
            aria-invalid={Boolean(fieldErrors.workflowProblem)}
          ></textarea>
          <FieldMessage id="workflow-problem-message" isError={Boolean(fieldErrors.workflowProblem)}>
            {fieldErrors.workflowProblem || 'This saves to the backend as workflowProblem and becomes biggest_problem in PostgreSQL.'}
          </FieldMessage>
        </div>
        <div className={fieldErrors.toolsUsed ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="tools-used">
            Tools currently used <RequiredMarker />
          </label>
          <input
            id="tools-used"
            name="toolsUsed"
            type="text"
            placeholder="Google Sheets, Airtable, email, Zapier..."
            aria-describedby="tools-used-message"
            aria-invalid={Boolean(fieldErrors.toolsUsed)}
          />
          <FieldMessage id="tools-used-message" isError={Boolean(fieldErrors.toolsUsed)}>
            {fieldErrors.toolsUsed}
          </FieldMessage>
        </div>
        <div className={fieldErrors.budgetRange ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="budget-range">
            Budget range <RequiredMarker />
          </label>
          <select
            id="budget-range"
            name="budgetRange"
            defaultValue=""
            aria-describedby="budget-range-message"
            aria-invalid={Boolean(fieldErrors.budgetRange)}
          >
            <option value="" disabled>
              Select a range
            </option>
            {budgetRanges.map((range) => (
              <option value={range} key={range}>
                {range}
              </option>
            ))}
          </select>
          <FieldMessage id="budget-range-message" isError={Boolean(fieldErrors.budgetRange)}>
            {fieldErrors.budgetRange}
          </FieldMessage>
        </div>
        <div className={fieldErrors.projectTimeline ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="project-timeline">
            Project timeline <RequiredMarker />
          </label>
          <select
            id="project-timeline"
            name="projectTimeline"
            defaultValue=""
            aria-describedby="project-timeline-message"
            aria-invalid={Boolean(fieldErrors.projectTimeline)}
          >
            <option value="" disabled>
              Select a timeline
            </option>
            {timelineOptions.map((timeline) => (
              <option value={timeline} key={timeline}>
                {timeline}
              </option>
            ))}
          </select>
          <FieldMessage id="project-timeline-message" isError={Boolean(fieldErrors.projectTimeline)}>
            {fieldErrors.projectTimeline}
          </FieldMessage>
        </div>
        <div className={fieldErrors.preferredContactMethod ? 'form-field has-error' : 'form-field'}>
          <label htmlFor="contact-method">
            Preferred contact method <RequiredMarker />
          </label>
          <select
            id="contact-method"
            name="preferredContactMethod"
            defaultValue=""
            aria-describedby="contact-method-message"
            aria-invalid={Boolean(fieldErrors.preferredContactMethod)}
          >
            <option value="" disabled>
              Select a method
            </option>
            {contactMethods.map((method) => (
              <option value={method} key={method}>
                {method}
              </option>
            ))}
          </select>
          <FieldMessage id="contact-method-message" isError={Boolean(fieldErrors.preferredContactMethod)}>
            {fieldErrors.preferredContactMethod}
          </FieldMessage>
        </div>
        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}
        <button className="button button-primary form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Request workflow audit'}
        </button>
      </form>
      <p className="form-note">
        This free audit helps identify what can be automated, simplified, or
        moved out of spreadsheets.
      </p>
    </div>
  )
}

function formatLeadDate(dateValue) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue))
}

function formatDateInputValue(dateValue) {
  if (!dateValue) {
    return ''
  }

  return new Date(dateValue).toISOString().slice(0, 10)
}

function isFollowUpDue(dateValue) {
  if (!dateValue) {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const followUpDate = new Date(dateValue)
  followUpDate.setHours(0, 0, 0, 0)

  return followUpDate <= today
}

function getStoredAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || ''
}

function saveStoredAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}

function clearStoredAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

function AdminLogin({ authToken, onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(location.state?.message || '')

  async function handleLogin(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.message || 'Unable to log in. Please try again.')
      }

      onLogin(data.token, data.admin)
      navigate('/admin', { replace: true })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authToken) {
    return <Navigate to="/admin" replace />
  }

  return (
    <section className="admin-section admin-login-section">
      <div className="section-shell admin-login-layout">
        <div className="admin-login-copy">
          <p className="eyebrow">Admin access</p>
          <h1>
            Automate<span className="brand-inline-her">HER</span> Studio Admin
          </h1>
          <p>Log in to review workflow audit leads, update statuses, and manage internal notes.</p>
        </div>
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div>
            <p className="eyebrow">Secure login</p>
            <h2>Welcome back</h2>
          </div>
          <div className="form-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              autoComplete="email"
              placeholder="admin@example.com"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              autoComplete="current-password"
              placeholder="Enter your admin password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {errorMessage && (
            <p className="admin-message error-message" role="alert">
              {errorMessage}
            </p>
          )}
          <button className="button button-secondary admin-login-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </section>
  )
}

function ProtectedAdminRoute({ authToken, onAuthReady, onUnauthorized, adminUser }) {
  const [isChecking, setIsChecking] = useState(true)
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    let shouldUpdate = true

    async function verifySession() {
      if (!authToken) {
        setIsChecking(false)
        setIsAllowed(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message || 'Please log in again.')
        }

        if (shouldUpdate) {
          onAuthReady(data.admin)
          setIsAllowed(true)
        }
      } catch {
        if (shouldUpdate) {
          onUnauthorized()
          setIsAllowed(false)
        }
      } finally {
        if (shouldUpdate) {
          setIsChecking(false)
        }
      }
    }

    verifySession()

    return () => {
      shouldUpdate = false
    }
  }, [authToken, onAuthReady, onUnauthorized])

  if (!authToken) {
    return <Navigate to="/admin/login" replace />
  }

  if (isChecking) {
    return (
      <section className="admin-section">
        <div className="section-shell admin-shell">
          <p className="admin-message loading-message">Checking admin session...</p>
        </div>
      </section>
    )
  }

  if (!isAllowed) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ message: 'Please log in to access the admin dashboard.' }}
      />
    )
  }

  return <AdminDashboard authToken={authToken} adminUser={adminUser} onUnauthorized={onUnauthorized} />
}

function AdminDashboard({ authToken, adminUser, onUnauthorized }) {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [packageFilter, setPackageFilter] = useState('All')
  const [isAdminDarkMode, setIsAdminDarkMode] = useState(false)
  const [noteDrafts, setNoteDrafts] = useState({})
  const [noteMessages, setNoteMessages] = useState({})
  const [savingNoteId, setSavingNoteId] = useState(null)
  const [followUpDrafts, setFollowUpDrafts] = useState({})
  const [followUpMessages, setFollowUpMessages] = useState({})
  const [savingFollowUpId, setSavingFollowUpId] = useState(null)

  function buildNoteDrafts(leadList) {
    return leadList.reduce((drafts, lead) => {
      drafts[lead.id] = lead.notes || ''
      return drafts
    }, {})
  }

  function buildFollowUpDrafts(leadList) {
    return leadList.reduce((drafts, lead) => {
      drafts[lead.id] = {
        priority: lead.priority || 'Normal',
        followUpDate: formatDateInputValue(lead.follow_up_date),
        packageInterest: lead.package_interest || 'Not Sure Yet',
      }
      return drafts
    }, {})
  }

  async function loadLeads() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-leads`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized()
          return
        }

        throw new Error('Unable to load workflow audit leads.')
      }

      const data = await response.json()
      setLeads(data)
      setNoteDrafts(buildNoteDrafts(data))
      setFollowUpDrafts(buildFollowUpDrafts(data))
    } catch {
      setErrorMessage('Unable to load leads. Make sure the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  async function updateLeadStatus(leadId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-leads/${leadId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized()
          return
        }

        throw new Error('Unable to update workflow audit lead.')
      }

      const updatedLead = await response.json()
      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
      )
    } catch {
      setErrorMessage('Unable to update the lead status. Please try again.')
    }
  }

  async function updateLeadNotes(leadId) {
    setSavingNoteId(leadId)
    setNoteMessages((currentMessages) => ({
      ...currentMessages,
      [leadId]: { type: '', text: '' },
    }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-leads/${leadId}/notes`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: noteDrafts[leadId] || '' }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized()
          return
        }

        throw new Error('Unable to update workflow audit lead notes.')
      }

      const updatedLead = await response.json()
      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
      )
      setNoteDrafts((currentDrafts) => ({
        ...currentDrafts,
        [updatedLead.id]: updatedLead.notes || '',
      }))
      setNoteMessages((currentMessages) => ({
        ...currentMessages,
        [leadId]: { type: 'success', text: 'Notes saved.' },
      }))
    } catch {
      setNoteMessages((currentMessages) => ({
        ...currentMessages,
        [leadId]: { type: 'error', text: 'Unable to save notes. Please try again.' },
      }))
    } finally {
      setSavingNoteId(null)
    }
  }

  async function updateLeadFollowUp(leadId) {
    const draft = followUpDrafts[leadId] || {}
    setSavingFollowUpId(leadId)
    setFollowUpMessages((currentMessages) => ({
      ...currentMessages,
      [leadId]: { type: '', text: '' },
    }))

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-leads/${leadId}/follow-up`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priority: draft.priority || 'Normal',
          followUpDate: draft.followUpDate || '',
          packageInterest: draft.packageInterest || 'Not Sure Yet',
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          onUnauthorized()
          return
        }

        throw new Error('Unable to update workflow audit lead follow-up.')
      }

      const updatedLead = await response.json()
      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
      )
      setFollowUpDrafts((currentDrafts) => ({
        ...currentDrafts,
        [updatedLead.id]: {
          priority: updatedLead.priority || 'Normal',
          followUpDate: formatDateInputValue(updatedLead.follow_up_date),
          packageInterest: updatedLead.package_interest || 'Not Sure Yet',
        },
      }))
      setFollowUpMessages((currentMessages) => ({
        ...currentMessages,
        [leadId]: { type: 'success', text: 'Follow-up saved.' },
      }))
    } catch {
      setFollowUpMessages((currentMessages) => ({
        ...currentMessages,
        [leadId]: { type: 'error', text: 'Unable to save follow-up details. Please try again.' },
      }))
    } finally {
      setSavingFollowUpId(null)
    }
  }

  useEffect(() => {
    let shouldUpdate = true

    async function loadInitialLeads() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/audit-leads`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            onUnauthorized()
            return
          }

          throw new Error('Unable to load workflow audit leads.')
        }

        const data = await response.json()

        if (shouldUpdate) {
          setLeads(data)
          setNoteDrafts(buildNoteDrafts(data))
          setFollowUpDrafts(buildFollowUpDrafts(data))
          setErrorMessage('')
        }
      } catch {
        if (shouldUpdate) {
          setErrorMessage('Unable to load leads. Make sure the backend server is running.')
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      }
    }

    loadInitialLeads()

    return () => {
      shouldUpdate = false
    }
  }, [authToken, onUnauthorized])

  const metrics = [
    { label: 'Total Leads', value: leads.length },
    { label: 'Urgent Leads', value: leads.filter((lead) => lead.priority === 'Urgent').length },
    { label: 'Follow-Ups Due', value: leads.filter((lead) => isFollowUpDue(lead.follow_up_date)).length },
    {
      label: 'Proposal Sent',
      value: leads.filter((lead) => lead.status === 'Proposal Sent').length,
    },
    { label: 'Won', value: leads.filter((lead) => lead.status === 'Won').length },
    { label: 'Lost', value: leads.filter((lead) => lead.status === 'Lost').length },
  ]
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || (lead.priority || 'Normal') === priorityFilter
    const matchesPackage =
      packageFilter === 'All' || (lead.package_interest || 'Not Sure Yet') === packageFilter
    const searchableText = [lead.name, lead.business_name, lead.email]
      .join(' ')
      .toLowerCase()
    const matchesSearch = normalizedSearch === '' || searchableText.includes(normalizedSearch)

    return matchesStatus && matchesPriority && matchesPackage && matchesSearch
  })

  return (
    <section className={`admin-section ${isAdminDarkMode ? 'admin-mode-dark' : 'admin-mode-light'}`}>
      <div className="section-shell admin-shell">
        <div className="admin-hero">
          <div>
            <p className="eyebrow">Internal workspace</p>
            <h1>
              Automate<span className="brand-inline-her">HER</span> Studio Admin
            </h1>
            <p>Workflow Audit Lead Dashboard</p>
          </div>
          <p className="admin-dev-note">
            Development-only admin dashboard. Authentication will be added in a
            future version.
          </p>
        </div>

        <div className="admin-appearance-panel" aria-label="Admin appearance controls">
          <div>
            <p className="eyebrow">Admin appearance</p>
            <h2>Midnight Plum dashboard</h2>
          </div>
          <div className="appearance-controls">
            {adminUser && <p className="admin-user-chip">Signed in as {adminUser.name}</p>}
            <button
              className={isAdminDarkMode ? 'mode-toggle is-on' : 'mode-toggle'}
              type="button"
              aria-pressed={isAdminDarkMode}
              onClick={() => setIsAdminDarkMode((currentMode) => !currentMode)}
            >
              <span aria-hidden="true"></span>
              {isAdminDarkMode ? 'Dark mode' : 'Light mode'}
            </button>
            <button className="button button-secondary logout-button" type="button" onClick={onUnauthorized}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-metrics" aria-label="Workflow audit lead metrics">
          {metrics.map((metric) => (
            <article className="metric-tile" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </div>

        <div className="lead-management-card">
          <div className="admin-toolbar">
            <div>
              <p className="eyebrow">Lead management</p>
              <h2>Workflow audit requests</h2>
            </div>
            <button className="button button-secondary" type="button" onClick={loadLeads}>
              Refresh leads
            </button>
          </div>

          <div className="admin-filters">
            <div className="form-field">
              <label htmlFor="lead-search">Search leads</label>
              <input
                id="lead-search"
                type="search"
                value={searchTerm}
                placeholder="Search name, business, or email"
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="status-filter">Filter by status</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                {leadStatuses.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="priority-filter">Filter by priority</label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="All">All priorities</option>
                {priorityOptions.map((priority) => (
                  <option value={priority} key={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="package-filter">Filter by package</label>
              <select
                id="package-filter"
                value={packageFilter}
                onChange={(event) => setPackageFilter(event.target.value)}
              >
                <option value="All">All packages</option>
                {packageInterestOptions.map((packageInterest) => (
                  <option value={packageInterest} key={packageInterest}>
                    {packageInterest}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMessage && (
            <p className="admin-message error-message" role="alert">
              {errorMessage}
            </p>
          )}
          {isLoading ? (
            <p className="admin-message loading-message">Loading workflow audit leads...</p>
          ) : leads.length === 0 ? (
            <div className="admin-empty-state">
              <span aria-hidden="true">A</span>
              <h3>No workflow audit leads yet.</h3>
              <p>
                Once someone submits the audit form, their request will appear
                here.
              </p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="admin-empty-state">
              <span aria-hidden="true">A</span>
              <h3>No matching leads.</h3>
              <p>Try another search term or choose a different status filter.</p>
            </div>
          ) : (
            <div className="lead-card-list">
              {filteredLeads.map((lead) => (
                <article className="admin-lead-card" key={lead.id}>
                  <div className="lead-summary">
                    <div className="lead-identity">
                      <p className="eyebrow">Workflow lead</p>
                      <h3>{lead.name}</h3>
                      <p>{lead.business_name}</p>
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </div>
                    <div className="lead-summary-badges" aria-label={`Summary for ${lead.name}`}>
                      <span className="lead-badge status-badge">{lead.status}</span>
                      <span className={`lead-badge priority-${(lead.priority || 'Normal').toLowerCase()}`}>
                        {lead.priority || 'Normal'}
                      </span>
                      <span className="lead-badge">{lead.package_interest || 'Not Sure Yet'}</span>
                      <span className="lead-badge">
                        {lead.follow_up_date ? `Follow up ${formatLeadDate(lead.follow_up_date)}` : 'No follow-up date'}
                      </span>
                    </div>
                  </div>

                  <details className="lead-details-panel">
                    <summary>View Details</summary>
                    <div className="lead-card-sections">
                      <section className="lead-section">
                        <h4>Business Details</h4>
                        <dl className="lead-detail-list">
                          <div>
                            <dt>Business type</dt>
                            <dd>{lead.business_type}</dd>
                          </div>
                          <div>
                            <dt>Current process</dt>
                            <dd>{lead.current_process}</dd>
                          </div>
                          <div>
                            <dt>Workflow problem</dt>
                            <dd>{lead.biggest_problem}</dd>
                          </div>
                          <div>
                            <dt>Tools used</dt>
                            <dd>{lead.tools_used}</dd>
                          </div>
                          <div>
                            <dt>Budget range</dt>
                            <dd>{lead.budget_range}</dd>
                          </div>
                          <div>
                            <dt>Project timeline</dt>
                            <dd>{lead.project_timeline}</dd>
                          </div>
                          <div>
                            <dt>Preferred contact</dt>
                            <dd>{lead.preferred_contact_method}</dd>
                          </div>
                          <div>
                            <dt>Created</dt>
                            <dd>{formatLeadDate(lead.created_at)}</dd>
                          </div>
                        </dl>
                      </section>

                      <section className="lead-section">
                        <h4>Admin Actions</h4>
                        <div className="admin-action-grid">
                          <div className="form-field">
                            <label htmlFor={`lead-status-${lead.id}`}>Status</label>
                            <select
                              id={`lead-status-${lead.id}`}
                              className="status-select"
                              value={lead.status}
                              onChange={(event) => updateLeadStatus(lead.id, event.target.value)}
                            >
                              {leadStatuses.map((status) => (
                                <option value={status} key={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-field">
                            <label htmlFor={`lead-priority-${lead.id}`}>Priority</label>
                            <select
                              id={`lead-priority-${lead.id}`}
                              value={followUpDrafts[lead.id]?.priority || 'Normal'}
                              onChange={(event) =>
                                setFollowUpDrafts((currentDrafts) => ({
                                  ...currentDrafts,
                                  [lead.id]: {
                                    ...currentDrafts[lead.id],
                                    priority: event.target.value,
                                  },
                                }))
                              }
                            >
                              {priorityOptions.map((priority) => (
                                <option value={priority} key={priority}>
                                  {priority}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-field">
                            <label htmlFor={`lead-package-${lead.id}`}>Package interest</label>
                            <select
                              id={`lead-package-${lead.id}`}
                              value={followUpDrafts[lead.id]?.packageInterest || 'Not Sure Yet'}
                              onChange={(event) =>
                                setFollowUpDrafts((currentDrafts) => ({
                                  ...currentDrafts,
                                  [lead.id]: {
                                    ...currentDrafts[lead.id],
                                    packageInterest: event.target.value,
                                  },
                                }))
                              }
                            >
                              {packageInterestOptions.map((packageInterest) => (
                                <option value={packageInterest} key={packageInterest}>
                                  {packageInterest}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-field">
                            <label htmlFor={`lead-follow-up-${lead.id}`}>Follow-up date</label>
                            <input
                              id={`lead-follow-up-${lead.id}`}
                              type="date"
                              value={followUpDrafts[lead.id]?.followUpDate || ''}
                              onChange={(event) =>
                                setFollowUpDrafts((currentDrafts) => ({
                                  ...currentDrafts,
                                  [lead.id]: {
                                    ...currentDrafts[lead.id],
                                    followUpDate: event.target.value,
                                  },
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="lead-card-actions">
                          <button
                            className="button button-secondary notes-save-button"
                            type="button"
                            disabled={savingFollowUpId === lead.id}
                            onClick={() => updateLeadFollowUp(lead.id)}
                          >
                            {savingFollowUpId === lead.id ? 'Saving follow-up...' : 'Save Follow-Up'}
                          </button>
                          {followUpMessages[lead.id]?.text && (
                            <p className={`note-save-message ${followUpMessages[lead.id].type}`}>
                              {followUpMessages[lead.id].text}
                            </p>
                          )}
                        </div>
                      </section>

                      <section className="lead-section">
                        <h4>Internal Notes</h4>
                        <p className="current-notes">{lead.notes || 'No internal notes yet.'}</p>
                        <label htmlFor={`lead-notes-${lead.id}`}>Notes textarea</label>
                        <textarea
                          id={`lead-notes-${lead.id}`}
                          value={noteDrafts[lead.id] || ''}
                          rows="4"
                          placeholder="Add private follow-up details, context, next steps, or reminders..."
                          onChange={(event) =>
                            setNoteDrafts((currentDrafts) => ({
                              ...currentDrafts,
                              [lead.id]: event.target.value,
                            }))
                          }
                        ></textarea>
                        <div className="lead-card-actions">
                          <button
                            className="button button-secondary notes-save-button"
                            type="button"
                            disabled={savingNoteId === lead.id}
                            onClick={() => updateLeadNotes(lead.id)}
                          >
                            {savingNoteId === lead.id ? 'Saving notes...' : 'Save Notes'}
                          </button>
                          {noteMessages[lead.id]?.text && (
                            <p className={`note-save-message ${noteMessages[lead.id].type}`}>
                              {noteMessages[lead.id].text}
                            </p>
                          )}
                        </div>
                      </section>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function WorkflowAudit() {
  return (
    <section className="audit-section" id="audit">
      <div className="section-shell audit-layout">
        <div className="audit-copy">
          <p className="eyebrow">Workflow audit</p>
          <h2>Tell us where the manual work is piling up.</h2>
          <p>
            Use this quick audit request to outline the process that needs
            attention. We will look for patterns, prioritize the biggest source
            of friction, and recommend the simplest system worth building first.
          </p>
          <div className="audit-note">
            <strong>Good fit for:</strong>
            <span>
              intake chaos, recurring follow-ups, approval bottlenecks, client
              portals, and reporting gaps.
            </span>
          </div>
        </div>
        <WorkflowAuditForm />
      </div>
    </section>
  )
}

function Footer() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <footer className={isAdminPage ? 'site-footer admin-site-footer' : 'site-footer'}>
      <div className="section-shell footer-layout">
        <div>
          <Link className="brand footer-brand" to="/" aria-label="AutomateHER Studio home">
            <span className="brand-mark">A</span>
            <BrandName />
          </Link>
          <p>Service-first automation, portals, and process cleanup.</p>
        </div>
        <div className="footer-links">
          <a href={isAdminPage ? '/#services' : '#services'}>Services</a>
          <a href={isAdminPage ? '/#packages' : '#packages'}>Packages</a>
          <a href={isAdminPage ? '/#audit' : '#audit'}>Workflow audit</a>
        </div>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Services />
      <Packages />
      <WorkflowAudit />
    </>
  )
}

function App() {
  const navigate = useNavigate()
  const [authToken, setAuthToken] = useState(getStoredAdminToken)
  const [adminUser, setAdminUser] = useState(null)

  const handleLogin = useCallback((token, adminProfile) => {
    saveStoredAdminToken(token)
    setAuthToken(token)
    setAdminUser(adminProfile)
  }, [])

  const handleAuthReady = useCallback((adminProfile) => {
    setAdminUser(adminProfile)
  }, [])

  const handleUnauthorized = useCallback(() => {
    clearStoredAdminToken()
    setAuthToken('')
    setAdminUser(null)
    navigate('/admin/login', {
      replace: true,
      state: { message: 'Please log in to access the admin dashboard.' },
    })
  }, [navigate])

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin/login"
            element={<AdminLogin authToken={authToken} onLogin={handleLogin} />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute
                authToken={authToken}
                adminUser={adminUser}
                onAuthReady={handleAuthReady}
                onUnauthorized={handleUnauthorized}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
