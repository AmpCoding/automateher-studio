CREATE TABLE IF NOT EXISTS workflow_audit_leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  current_process TEXT NOT NULL,
  biggest_problem TEXT NOT NULL,
  tools_used TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  project_timeline TEXT NOT NULL,
  preferred_contact_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS workflow_audit_leads_created_at_idx
  ON workflow_audit_leads (created_at DESC);
