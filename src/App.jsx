import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

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

function BrandName() {
  return (
    <span className="brand-word">
      Automate<span>HER</span> Studio
    </span>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="header-main section-shell">
        <a className="brand" href="#top" aria-label="AutomateHER Studio home">
          <span className="brand-mark">A</span>
          <BrandName />
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#audit">Audit</a>
          <a href="#admin">Admin</a>
        </nav>
        <a className="nav-cta" href="#audit">
          Start audit
        </a>
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

function WorkflowAuditForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const submission = Object.fromEntries(formData.entries())

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      })

      if (!response.ok) {
        throw new Error('Unable to submit workflow audit request.')
      }

      form.reset()
      setSubmitted(true)
    } catch {
      setErrorMessage(
        'Something went wrong while sending your request. Please try again in a moment.',
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
        <button className="button button-secondary" onClick={() => setSubmitted(false)}>
          Send another request
        </button>
      </div>
    )
  }

  return (
    <div className="audit-form-panel">
      <form className="audit-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" required />
        </div>
        <div className="form-field">
          <label htmlFor="business-name">Business name</label>
          <input id="business-name" name="businessName" type="text" required />
        </div>
        <div className="form-field">
          <label htmlFor="business-type">Business type</label>
          <input
            id="business-type"
            name="businessType"
            type="text"
            placeholder="Nonprofit, salon, agency, clinic..."
            required
          />
        </div>
        <div className="form-field full-width">
          <label htmlFor="current-process">Current process</label>
          <textarea
            id="current-process"
            name="currentProcess"
            rows="4"
            placeholder="What happens today from intake to completion?"
            required
          ></textarea>
        </div>
        <div className="form-field full-width">
          <label htmlFor="workflow-problem">Biggest workflow problem</label>
          <textarea
            id="workflow-problem"
            name="workflowProblem"
            rows="4"
            placeholder="Where do things get delayed, duplicated, missed, or confusing?"
            required
          ></textarea>
        </div>
        <div className="form-field">
          <label htmlFor="tools-used">Tools currently used</label>
          <input
            id="tools-used"
            name="toolsUsed"
            type="text"
            placeholder="Google Sheets, Airtable, email, Zapier..."
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="budget-range">Budget range</label>
          <select id="budget-range" name="budgetRange" defaultValue="" required>
            <option value="" disabled>
              Select a range
            </option>
            {budgetRanges.map((range) => (
              <option value={range} key={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="project-timeline">Project timeline</label>
          <select id="project-timeline" name="projectTimeline" defaultValue="" required>
            <option value="" disabled>
              Select a timeline
            </option>
            {timelineOptions.map((timeline) => (
              <option value={timeline} key={timeline}>
                {timeline}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="contact-method">Preferred contact method</label>
          <select id="contact-method" name="preferredContactMethod" defaultValue="" required>
            <option value="" disabled>
              Select a method
            </option>
            {contactMethods.map((method) => (
              <option value={method} key={method}>
                {method}
              </option>
            ))}
          </select>
        </div>
        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}
        <button className="button button-primary form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending request...' : 'Request workflow audit'}
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

function AdminDashboard() {
  const [leads, setLeads] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function loadLeads() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/audit-leads`)

      if (!response.ok) {
        throw new Error('Unable to load workflow audit leads.')
      }

      const data = await response.json()
      setLeads(data)
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
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

  useEffect(() => {
    let shouldUpdate = true

    async function loadInitialLeads() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/audit-leads`)

        if (!response.ok) {
          throw new Error('Unable to load workflow audit leads.')
        }

        const data = await response.json()

        if (shouldUpdate) {
          setLeads(data)
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
  }, [])

  return (
    <section className="admin-section" id="admin">
      <div className="section-shell section-block">
        <SectionIntro eyebrow="Development admin" title="Workflow audit leads">
          View incoming workflow audit requests and update lead status while the
          dashboard is still development-only.
        </SectionIntro>
        <div className="admin-toolbar">
          <p>No authentication is connected yet. Keep this dashboard local during development.</p>
          <button className="button button-secondary" type="button" onClick={loadLeads}>
            Refresh leads
          </button>
        </div>
        {errorMessage && (
          <p className="admin-message" role="alert">
            {errorMessage}
          </p>
        )}
        {isLoading ? (
          <p className="admin-message">Loading workflow audit leads...</p>
        ) : leads.length === 0 ? (
          <p className="admin-message">No workflow audit leads yet.</p>
        ) : (
          <div className="lead-grid">
            {leads.map((lead) => (
              <article className="lead-card" key={lead.id}>
                <div className="lead-card-header">
                  <div>
                    <h3>{lead.name}</h3>
                    <p>{lead.business_name}</p>
                  </div>
                  <span>{formatLeadDate(lead.created_at)}</span>
                </div>
                <dl className="lead-details">
                  <div>
                    <dt>Email</dt>
                    <dd>{lead.email}</dd>
                  </div>
                  <div>
                    <dt>Business type</dt>
                    <dd>{lead.business_type}</dd>
                  </div>
                  <div>
                    <dt>Budget</dt>
                    <dd>{lead.budget_range}</dd>
                  </div>
                  <div>
                    <dt>Timeline</dt>
                    <dd>{lead.project_timeline}</dd>
                  </div>
                  <div>
                    <dt>Contact</dt>
                    <dd>{lead.preferred_contact_method}</dd>
                  </div>
                </dl>
                <label className="lead-status-label" htmlFor={`lead-status-${lead.id}`}>
                  Status
                </label>
                <select
                  id={`lead-status-${lead.id}`}
                  value={lead.status}
                  onChange={(event) => updateLeadStatus(lead.id, event.target.value)}
                >
                  {leadStatuses.map((status) => (
                    <option value={status} key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>
        )}
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
  return (
    <footer className="site-footer">
      <div className="section-shell footer-layout">
        <div>
          <a className="brand footer-brand" href="#top" aria-label="AutomateHER Studio home">
            <span className="brand-mark">A</span>
            <BrandName />
          </a>
          <p>Service-first automation, portals, and process cleanup.</p>
        </div>
        <div className="footer-links">
          <a href="#services">Services</a>
          <a href="#packages">Packages</a>
          <a href="#audit">Workflow audit</a>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero />
        <PainPoints />
        <Services />
        <Packages />
        <WorkflowAudit />
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  )
}

export default App
