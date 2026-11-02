import { supabase } from '@/lib/supabase'

export interface LeadEnquiry {
  id: string
  name: string
  business_name: string
  phone: string
  email?: string
  service_of_interest: string
  details: string
  status: 'new' | 'unread' | 'contacted' | 'followup_required' | 'proposal_sent' | 'converted' | 'not_interested' | 'archived'
  source: string
  assigned_to?: string
  follow_up_date?: string
  internal_notes?: string[]
  created_at: string
}

export interface ProjectTask {
  id: string
  title: string
  completed: boolean
  due_date?: string
}

export interface ProjectMilestone {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed'
  due_date: string
}

export interface Project {
  id: string
  name: string
  client_id: string
  client_name: string
  category: 'WhatsApp Automation' | 'Payment & Invoicing' | 'Social & Ads' | 'Spreadsheet & CRM Sync' | 'Logistics & Dispatch' | 'Custom Workflow'
  budget: number
  status: 'new' | 'planning' | 'in_progress' | 'awaiting_client' | 'testing' | 'completed' | 'on_hold' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  start_date: string
  expected_delivery: string
  assigned_to: string
  progress: number
  description: string
  tasks: ProjectTask[]
  milestones: ProjectMilestone[]
  internal_notes?: string[]
  created_at: string
}

export interface Client {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  whatsapp: string
  industry: string
  client_type: 'Retainer' | 'Project-Based' | 'Enterprise' | 'Trial'
  status: 'active' | 'lead' | 'inactive' | 'archived'
  total_billed: number
  total_paid: number
  address?: string
  internal_notes?: string[]
  created_at: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

export interface Invoice {
  id: string
  invoice_number: string
  client_id: string
  client_name: string
  client_email: string
  client_address?: string
  project_id?: string
  project_name?: string
  issue_date: string
  due_date: string
  items: InvoiceItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  amount_paid: number
  status: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled'
  payment_method?: string
  notes?: string
  created_at: string
}

export interface Expense {
  id: string
  title: string
  category: 'Software & Subscriptions' | 'Infrastructure & Hosting' | 'Marketing' | 'Salaries & Contractors' | 'Office Expenses' | 'Operations' | 'Other'
  amount: number
  date: string
  payment_method: 'Bank Transfer' | 'Corporate Card' | 'Cash'
  vendor: string
  description: string
  is_recurring: boolean
  created_at: string
}

export interface EmailItem {
  id: string
  folder: 'inbox' | 'sent' | 'drafts' | 'followup' | 'trash'
  from_name: string
  from_email: string
  to_email: string
  to_name?: string
  subject: string
  preview: string
  body: string
  is_read: boolean
  is_starred: boolean
  requires_followup: boolean
  followup_due?: string
  followup_status?: 'due_today' | 'upcoming' | 'overdue' | 'completed'
  created_at: string
}

export interface NotificationItem {
  id: string
  type: 'enquiry' | 'lead' | 'chat' | 'payment' | 'invoice' | 'project' | 'system'
  title: string
  message: string
  link_tab?: string
  is_read: boolean
  created_at: string
}

export interface ActivityLogItem {
  id: string
  admin_name: string
  action: string
  target_type: string
  target_id: string
  details: string
  created_at: string
}

// ----------------------------------------------------
// DEFAULT SEED DATA
// ----------------------------------------------------

const SEED_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    company_name: 'Prime Gadgets & Logistics',
    contact_person: 'Tunde Adeleke',
    email: 'tunde@primegadgets.ng',
    phone: '+234 803 219 4481',
    whatsapp: '+234 803 219 4481',
    industry: 'Retail & E-commerce',
    client_type: 'Retainer',
    status: 'active',
    total_billed: 1850000,
    total_paid: 1850000,
    address: 'Victoria Island, Lagos',
    internal_notes: ['Client automated WhatsApp sales & Paystack reconciliation.'],
    created_at: '2026-02-15T09:00:00Z',
  },
  {
    id: 'cli-002',
    company_name: 'Metro Fastway Couriers',
    contact_person: 'Ibrahim Danjuma',
    email: 'operations@metrofastway.com',
    phone: '+234 812 550 9102',
    whatsapp: '+234 812 550 9102',
    industry: 'Logistics & Delivery',
    client_type: 'Enterprise',
    status: 'active',
    total_billed: 3200000,
    total_paid: 2400000,
    address: 'Central Business District, Abuja',
    internal_notes: ['Automating dispatch riders assignment and live SMS alerts.'],
    created_at: '2026-03-01T11:30:00Z',
  },
  {
    id: 'cli-003',
    company_name: 'Crestfield Real Estate Partners',
    contact_person: 'Chidinma Okoye',
    email: 'chidinma@crestfieldproperties.com',
    phone: '+234 802 884 1009',
    whatsapp: '+234 802 884 1009',
    industry: 'Real Estate',
    client_type: 'Project-Based',
    status: 'active',
    total_billed: 1450000,
    total_paid: 1450000,
    address: 'Ikoyi, Lagos',
    internal_notes: ['Lead qualification bot and inspection calendar sync.'],
    created_at: '2026-03-20T14:15:00Z',
  },
]

const SEED_PROJECTS: Project[] = [
  {
    id: 'prj-001',
    name: 'WhatsApp Storefront & Auto-Reconciliation',
    client_id: 'cli-001',
    client_name: 'Prime Gadgets & Logistics',
    category: 'WhatsApp Automation',
    budget: 850000,
    status: 'completed',
    priority: 'high',
    start_date: '2026-02-18',
    expected_delivery: '2026-02-28',
    assigned_to: 'Usman B. (Lead Dev)',
    progress: 100,
    description: 'Autonomous WhatsApp assistant taking inventory checks, Paystack invoice generation, and Google Sheets ledger sync.',
    tasks: [
      { id: 't1', title: 'Setup WhatsApp Cloud API endpoints', completed: true },
      { id: 't2', title: 'Connect Paystack dynamic webhook verification', completed: true },
      { id: 't3', title: 'Generate branded PDF receipts on payment approval', completed: true },
    ],
    milestones: [
      { id: 'm1', title: 'Catalog & Message Flows', status: 'completed', due_date: '2026-02-22' },
      { id: 'm2', title: 'Payment Webhook & Receipt PDF', status: 'completed', due_date: '2026-02-26' },
      { id: 'm3', title: 'Live Deployment & Staff Onboarding', status: 'completed', due_date: '2026-02-28' },
    ],
    created_at: '2026-02-18T10:00:00Z',
  },
  {
    id: 'prj-002',
    name: 'Multi-Rider Dispatch & Route Orchestration',
    client_id: 'cli-002',
    client_name: 'Metro Fastway Couriers',
    category: 'Logistics & Dispatch',
    budget: 1600000,
    status: 'in_progress',
    priority: 'urgent',
    start_date: '2026-03-05',
    expected_delivery: '2026-04-10',
    assigned_to: 'David O. (Workflow Architect)',
    progress: 75,
    description: 'System automatically batches pickup orders from Shopify & WooCommerce, locates the nearest driver, and sends job details with waypoint maps.',
    tasks: [
      { id: 't1', title: 'Driver WhatsApp bot with accept/reject buttons', completed: true },
      { id: 't2', title: 'Automated order ingestion webhook from eCommerce', completed: true },
      { id: 't3', title: 'Live tracking link generator for recipients', completed: false },
    ],
    milestones: [
      { id: 'm1', title: 'eCommerce Order Webhooks', status: 'completed', due_date: '2026-03-15' },
      { id: 'm2', title: 'Driver Dispatch Logic', status: 'completed', due_date: '2026-03-25' },
      { id: 'm3', title: 'Customer Live Tracking Portal', status: 'in_progress', due_date: '2026-04-05' },
    ],
    created_at: '2026-03-05T09:30:00Z',
  },
  {
    id: 'prj-003',
    name: 'Meta Ads to Telegram High-Intent Lead Pipeline',
    client_id: 'cli-003',
    client_name: 'Crestfield Real Estate Partners',
    category: 'Social & Ads',
    budget: 950000,
    status: 'testing',
    priority: 'medium',
    start_date: '2026-03-22',
    expected_delivery: '2026-04-02',
    assigned_to: 'Zainab M. (Automation Engineer)',
    progress: 90,
    description: 'Instant lead capture from Facebook/Instagram ad forms with immediate Telegram & WhatsApp qualification before booking site inspections.',
    tasks: [
      { id: 't1', title: 'Meta Lead Gen Webhook bridge', completed: true },
      { id: 't2', title: 'Automated qualification questionnaire', completed: true },
      { id: 't3', title: 'Calendar inspection slot booking sync', completed: true },
    ],
    milestones: [
      { id: 'm1', title: 'Webhook and Form Ingestion', status: 'completed', due_date: '2026-03-26' },
      { id: 'm2', title: 'AI Assistant Qualification Flow', status: 'completed', due_date: '2026-03-30' },
      { id: 'm3', title: 'Production Pilot Testing', status: 'in_progress', due_date: '2026-04-02' },
    ],
    created_at: '2026-03-22T13:00:00Z',
  },
]

const SEED_ENQUIRIES: LeadEnquiry[] = [
  {
    id: 'enq-001',
    name: 'Babajide Fashola',
    business_name: 'Apex Wholesale Pharmaceuticals',
    phone: '+234 809 112 3490',
    email: 'info@apexpharma.ng',
    service_of_interest: 'Typing sales data into multiple spreadsheets & CRM',
    details: 'We get over 400 wholesale purchase orders daily via email and WhatsApp. We want these orders parsed, validated against our warehouse inventory, and logged directly to our ERP.',
    status: 'new',
    source: 'Website Process Review Form',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'enq-002',
    name: 'Halima Aliyu',
    business_name: 'Velour Couture & Fabrics',
    phone: '+234 814 660 7711',
    email: 'sales@velourcouture.com',
    service_of_interest: 'Customer chats & social DMs (WhatsApp, Telegram, X, IG)',
    details: 'Our Instagram and WhatsApp DMs are flooded whenever we post new arrivals. Staff take 4 hours to reply, losing eager buyers. Need 24/7 instant replies and payment links.',
    status: 'contacted',
    source: 'Landing Page Contact Form',
    follow_up_date: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'enq-003',
    name: 'Emeka Nwosu',
    business_name: 'SwiftExpress Coldchain',
    phone: '+234 802 334 9912',
    email: 'emeka@swiftexpress.io',
    service_of_interest: 'Coordinating orders, warehouse & courier dispatches',
    details: 'Need automated rider dispatch system that alerts delivery drivers via WhatsApp and tracks temperature logs into Google Sheets.',
    status: 'proposal_sent',
    source: 'Direct WhatsApp Consultation',
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
]

const SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoice_number: 'ZH-INV-2026-001',
    client_id: 'cli-001',
    client_name: 'Prime Gadgets & Logistics',
    client_email: 'tunde@primegadgets.ng',
    client_address: 'Victoria Island, Lagos',
    project_id: 'prj-001',
    project_name: 'WhatsApp Storefront & Auto-Reconciliation',
    issue_date: '2026-02-18',
    due_date: '2026-02-28',
    items: [
      { id: 'i1', description: 'WhatsApp Business API Setup & Custom Dialog Flow', quantity: 1, unit_price: 450000, total: 450000 },
      { id: 'i2', description: 'Paystack Automated Reconciliation & PDF Receipts', quantity: 1, unit_price: 400000, total: 400000 },
    ],
    subtotal: 850000,
    discount: 0,
    tax: 0,
    total: 850000,
    amount_paid: 850000,
    status: 'paid',
    payment_method: 'Bank Transfer (Verified)',
    notes: 'Payment confirmed via automated bank webhook. Official digital receipt dispatched.',
    created_at: '2026-02-18T11:00:00Z',
  },
  {
    id: 'inv-002',
    invoice_number: 'ZH-INV-2026-002',
    client_id: 'cli-002',
    client_name: 'Metro Fastway Couriers',
    client_email: 'operations@metrofastway.com',
    client_address: 'Central Business District, Abuja',
    project_id: 'prj-002',
    project_name: 'Multi-Rider Dispatch & Route Orchestration',
    issue_date: '2026-03-05',
    due_date: '2026-03-20',
    items: [
      { id: 'i1', description: 'Custom Delivery Dispatch Engine (Phase 1)', quantity: 1, unit_price: 1000000, total: 1000000 },
      { id: 'i2', description: 'Driver Bot & Waypoint Integration', quantity: 1, unit_price: 600000, total: 600000 },
    ],
    subtotal: 1600000,
    discount: 0,
    tax: 0,
    total: 1600000,
    amount_paid: 1000000,
    status: 'partially_paid',
    payment_method: 'Bank Transfer',
    notes: 'Initial 60% commencement deposit paid. Balance due upon production testing.',
    created_at: '2026-03-05T10:00:00Z',
  },
  {
    id: 'inv-003',
    invoice_number: 'ZH-INV-2026-003',
    client_id: 'cli-003',
    client_name: 'Crestfield Real Estate Partners',
    client_email: 'chidinma@crestfieldproperties.com',
    client_address: 'Ikoyi, Lagos',
    project_id: 'prj-003',
    project_name: 'Meta Ads to Telegram High-Intent Lead Pipeline',
    issue_date: '2026-03-22',
    due_date: '2026-04-05',
    items: [
      { id: 'i1', description: 'Meta Ads to Telegram & WhatsApp Lead Routing', quantity: 1, unit_price: 950000, total: 950000 },
    ],
    subtotal: 950000,
    discount: 0,
    tax: 0,
    total: 950000,
    amount_paid: 950000,
    status: 'paid',
    payment_method: 'Paystack Direct Link',
    notes: 'Full payment received.',
    created_at: '2026-03-22T14:00:00Z',
  },
]

const SEED_EXPENSES: Expense[] = [
  {
    id: 'exp-001',
    title: 'Cloud Server Clusters & Edge Runtime',
    category: 'Infrastructure & Hosting',
    amount: 145000,
    date: '2026-03-01',
    payment_method: 'Corporate Card',
    vendor: 'Supabase & Cloudflare',
    description: 'High-availability database tier and low-latency webhook edge workers.',
    is_recurring: true,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'exp-002',
    title: 'WhatsApp Business API & Twilio Gateway',
    category: 'Software & Subscriptions',
    amount: 220000,
    date: '2026-03-05',
    payment_method: 'Corporate Card',
    vendor: 'Meta Platforms & Twilio',
    description: 'Monthly conversation session bundles for client WhatsApp bots.',
    is_recurring: true,
    created_at: '2026-03-05T09:00:00Z',
  },
  {
    id: 'exp-003',
    title: 'Senior Automation Engineer Contractor Stipend',
    category: 'Salaries & Contractors',
    amount: 450000,
    date: '2026-03-25',
    payment_method: 'Bank Transfer',
    vendor: 'David O. (Contract)',
    description: 'Specialist milestone delivery for logistics routing architecture.',
    is_recurring: false,
    created_at: '2026-03-25T16:00:00Z',
  },
]

const SEED_EMAILS: EmailItem[] = [
  {
    id: 'em-001',
    folder: 'inbox',
    from_name: 'Babajide Fashola',
    from_email: 'info@apexpharma.ng',
    to_email: 'automate@zhenibot.com',
    to_name: 'Zhenbot Automation',
    subject: 'RFP: Warehouse ERP & WhatsApp Order Processing Automation',
    preview: 'Good day Zhenbot team, we received your website confirmation and are interested in scheduling the process review...',
    body: `Good day Zhenbot team,

We received your confirmation regarding our inquiry on automating wholesale orders. 

Currently our sales desk in Lagos handles upwards of 400 requests every single morning. We need a reliable automation that verifies item stock in our SQL database, produces a proforma invoice, and sends back the payment account immediately.

Can we have a 20-minute Zoom or Google Meet tomorrow at 11:00 AM?

Warm regards,
Babajide Fashola
MD, Apex Wholesale Pharmaceuticals`,
    is_read: false,
    is_starred: true,
    requires_followup: true,
    followup_due: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    followup_status: 'due_today',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'em-002',
    folder: 'sent',
    from_name: 'Zhenbot Automation',
    from_email: 'automate@zhenibot.com',
    to_email: 'sales@velourcouture.com',
    to_name: 'Halima Aliyu',
    subject: 'Proposal & Architecture: Velour Couture 24/7 Sales Bot',
    preview: 'Hello Halima, following our WhatsApp conversation earlier today, please find attached our proposal for your Instagram & WhatsApp bot...',
    body: `Hello Halima,

Thank you for discussing your operations with us today.

As mapped during our review, your store is currently leaving approximately 40% of potential orders unclosed due to delayed DM replies during peak campaign hours.

Our proposal includes:
1. Instant Instagram and WhatsApp auto-responder with dynamic catalog presentation.
2. Direct payment links generated via Paystack with instant receipt dispatch.
3. Live spreadsheet sync for your inventory team.

Implementation timeline: 5 business days.

Let us know if you would like us to begin the setup this week.

Best regards,
Zhenbot Team
automate@zhenibot.com`,
    is_read: true,
    is_starred: false,
    requires_followup: true,
    followup_due: new Date(Date.now() + 2 * 86400000).toISOString(),
    followup_status: 'upcoming',
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
]

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'enquiry',
    title: 'New Website Process Review',
    message: 'Babajide Fashola submitted an enquiry for Apex Wholesale Pharmaceuticals.',
    link_tab: 'leads',
    is_read: false,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-002',
    type: 'payment',
    title: 'Invoice Payment Received',
    message: '₦950,000 received for Crestfield Real Estate Partners (ZH-INV-2026-003).',
    link_tab: 'invoices',
    is_read: false,
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-003',
    type: 'project',
    title: 'Milestone Completed',
    message: 'Driver Dispatch Logic completed on Multi-Rider Dispatch project.',
    link_tab: 'projects',
    is_read: true,
    created_at: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
  },
]

const SEED_LOGS: ActivityLogItem[] = [
  {
    id: 'log-001',
    admin_name: 'Usman B. (Super Admin)',
    action: 'Invoice Created',
    target_type: 'Invoice',
    target_id: 'ZH-INV-2026-003',
    details: 'Generated invoice for Crestfield Real Estate Partners (₦950,000).',
    created_at: '2026-03-22T14:02:00Z',
  },
  {
    id: 'log-002',
    admin_name: 'Usman B. (Super Admin)',
    action: 'Payment Confirmed',
    target_type: 'Transaction',
    target_id: 'ZH-INV-2026-003',
    details: 'Verified Paystack transfer of ₦950,000 and marked invoice paid.',
    created_at: '2026-03-22T14:15:00Z',
  },
  {
    id: 'log-003',
    admin_name: 'System Bot',
    action: 'Website Lead Captured',
    target_type: 'Enquiry',
    target_id: 'enq-001',
    details: 'Visitor Babajide Fashola completed website review request.',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
]

// ----------------------------------------------------
// LOCAL STORAGE KEYS & REACTIVE BROADCAST
// ----------------------------------------------------

const STORAGE_KEYS = {
  enquiries: 'zhenbot_ops_enquiries',
  projects: 'zhenbot_ops_projects',
  clients: 'zhenbot_ops_clients',
  invoices: 'zhenbot_ops_invoices',
  expenses: 'zhenbot_ops_expenses',
  emails: 'zhenbot_ops_emails',
  notifications: 'zhenbot_ops_notifications',
  logs: 'zhenbot_ops_logs',
}

function loadFromStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed))
      return seed
    }
    return JSON.parse(raw) as T
  } catch {
    return seed
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('zhenbot_ops_update', { detail: { key } }))
  } catch (err) {
    console.warn('Storage save failed:', err)
  }
}

// ----------------------------------------------------
// CENTRAL OPERATIONAL DATA API WITH LIVE SUPABASE SYNC
// ----------------------------------------------------

let isSupabaseSyncInitialized = false

export const businessStore = {
  /**
   * Initializes live two-way sync with Supabase and sets up Realtime listeners
   */
  async initSupabaseSync() {
    if (isSupabaseSyncInitialized || typeof window === 'undefined') return
    isSupabaseSyncInitialized = true

    try {
      // 1. Fetch Clients
      const { data: clients } = await supabase.from('zhenbot_clients').select('*')
      if (clients && clients.length > 0) {
        saveToStorage(STORAGE_KEYS.clients, clients)
      }

      // 2. Fetch Projects
      const { data: projects } = await supabase.from('zhenbot_projects').select('*')
      if (projects && projects.length > 0) {
        saveToStorage(STORAGE_KEYS.projects, projects)
      }

      // 3. Fetch Invoices
      const { data: invoices } = await supabase.from('zhenbot_invoices').select('*')
      if (invoices && invoices.length > 0) {
        saveToStorage(STORAGE_KEYS.invoices, invoices)
      }

      // 4. Fetch Enquiries
      const { data: enquiries } = await supabase.from('zhenbot_enquiries').select('*').order('created_at', { ascending: false })
      if (enquiries && enquiries.length > 0) {
        saveToStorage(STORAGE_KEYS.enquiries, enquiries)
      }

      // 5. Fetch Expenses
      const { data: expenses } = await supabase.from('zhenbot_expenses').select('*').order('date', { ascending: false })
      if (expenses && expenses.length > 0) {
        saveToStorage(STORAGE_KEYS.expenses, expenses)
      }

      // 6. Fetch Emails
      const { data: emails } = await supabase.from('zhenbot_emails').select('*').order('created_at', { ascending: false })
      if (emails && emails.length > 0) {
        saveToStorage(STORAGE_KEYS.emails, emails)
      }

      // 7. Fetch Notifications
      const { data: notifs } = await supabase.from('zhenbot_notifications').select('*').order('created_at', { ascending: false })
      if (notifs && notifs.length > 0) {
        saveToStorage(STORAGE_KEYS.notifications, notifs)
      }

      // 8. Fetch Logs
      const { data: logs } = await supabase.from('zhenbot_activity_logs').select('*').order('created_at', { ascending: false }).limit(100)
      if (logs && logs.length > 0) {
        saveToStorage(STORAGE_KEYS.logs, logs)
      }
    } catch (err) {
      console.warn('Initial Supabase fetch fallback to local cache:', err)
    }

    // Subscribe to realtime database updates across all business tables
    try {
      supabase
        .channel('zhenbot_business_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_clients' },
          async () => {
            const { data } = await supabase.from('zhenbot_clients').select('*')
            if (data) saveToStorage(STORAGE_KEYS.clients, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_projects' },
          async () => {
            const { data } = await supabase.from('zhenbot_projects').select('*')
            if (data) saveToStorage(STORAGE_KEYS.projects, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_invoices' },
          async () => {
            const { data } = await supabase.from('zhenbot_invoices').select('*')
            if (data) saveToStorage(STORAGE_KEYS.invoices, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_enquiries' },
          async () => {
            const { data } = await supabase.from('zhenbot_enquiries').select('*').order('created_at', { ascending: false })
            if (data) saveToStorage(STORAGE_KEYS.enquiries, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_expenses' },
          async () => {
            const { data } = await supabase.from('zhenbot_expenses').select('*').order('date', { ascending: false })
            if (data) saveToStorage(STORAGE_KEYS.expenses, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_notifications' },
          async () => {
            const { data } = await supabase.from('zhenbot_notifications').select('*').order('created_at', { ascending: false })
            if (data) saveToStorage(STORAGE_KEYS.notifications, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_emails' },
          async () => {
            const { data } = await supabase.from('zhenbot_emails').select('*').order('created_at', { ascending: false })
            if (data) saveToStorage(STORAGE_KEYS.emails, data)
          }
        )
        .subscribe()
    } catch {
      //
    }
  },

  // --- ENQUIRIES & LEADS ---
  getEnquiries(): LeadEnquiry[] {
    return loadFromStorage(STORAGE_KEYS.enquiries, SEED_ENQUIRIES)
  },

  async addEnquiry(enquiry: Omit<LeadEnquiry, 'id' | 'created_at'>): Promise<LeadEnquiry> {
    const newEnquiry: LeadEnquiry = {
      ...enquiry,
      id: 'enq-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    }

    const current = this.getEnquiries()
    saveToStorage(STORAGE_KEYS.enquiries, [newEnquiry, ...current])

    // Live Supabase Insert
    try {
      await supabase.from('zhenbot_enquiries').insert([
        {
          id: newEnquiry.id,
          name: newEnquiry.name,
          business_name: newEnquiry.business_name,
          phone: newEnquiry.phone,
          email: newEnquiry.email || null,
          service_of_interest: newEnquiry.service_of_interest,
          details: newEnquiry.details,
          status: newEnquiry.status,
          source: newEnquiry.source,
          assigned_to: newEnquiry.assigned_to || null,
          follow_up_date: newEnquiry.follow_up_date || null,
          internal_notes: newEnquiry.internal_notes || [],
          created_at: newEnquiry.created_at,
        },
      ])
    } catch (err) {
      console.warn('Supabase enquiry insert:', err)
    }

    // Automatically trigger notification
    this.addNotification({
      type: 'enquiry',
      title: 'New Website Submission',
      message: `${newEnquiry.name} submitted an enquiry for ${newEnquiry.business_name || 'Business Automation'}.`,
      link_tab: 'leads',
    })

    // Log activity
    this.addLog({
      admin_name: 'Visitor / Web Lead',
      action: 'Website Lead Captured',
      target_type: 'Enquiry',
      target_id: newEnquiry.id,
      details: `${newEnquiry.name} (${newEnquiry.phone}) requested process review: ${newEnquiry.service_of_interest}`,
    })

    return newEnquiry
  },

  updateEnquiryStatus(id: string, status: LeadEnquiry['status'], note?: string) {
    const list = this.getEnquiries()
    let updatedNotes: string[] = []
    const updated = list.map((item) => {
      if (item.id === id) {
        const notes = item.internal_notes || []
        if (note) notes.unshift(`[${new Date().toLocaleDateString()}] ${note}`)
        updatedNotes = notes
        return { ...item, status, internal_notes: notes }
      }
      return item
    })
    saveToStorage(STORAGE_KEYS.enquiries, updated)

    // Live Supabase Update
    supabase
      .from('zhenbot_enquiries')
      .update({ status, internal_notes: updatedNotes })
      .eq('id', id)
      .then(() => {})
  },

  convertEnquiryToClient(enquiryId: string): Client | null {
    const enquiry = this.getEnquiries().find((e) => e.id === enquiryId)
    if (!enquiry) return null

    const newClient: Client = {
      id: 'cli-' + Date.now().toString(36),
      company_name: enquiry.business_name || enquiry.name + ' Business',
      contact_person: enquiry.name,
      email: enquiry.email || 'automate@zhenibot.com',
      phone: enquiry.phone,
      whatsapp: enquiry.phone,
      industry: 'General Automation',
      client_type: 'Project-Based',
      status: 'active',
      total_billed: 0,
      total_paid: 0,
      internal_notes: [`Converted from lead inquiry: ${enquiry.details}`],
      created_at: new Date().toISOString(),
    }

    this.addClient(newClient)
    this.updateEnquiryStatus(enquiryId, 'converted', 'Converted to client directory')

    this.addLog({
      admin_name: 'Admin',
      action: 'Lead Converted to Client',
      target_type: 'Client',
      target_id: newClient.id,
      details: `Converted ${enquiry.name} (${newClient.company_name}) to active client.`,
    })

    return newClient
  },

  // --- CLIENTS ---
  getClients(): Client[] {
    return loadFromStorage(STORAGE_KEYS.clients, SEED_CLIENTS)
  },

  addClient(client: Omit<Client, 'id' | 'created_at'> | Client): Client {
    const fullClient: Client = {
      ...client,
      id: 'id' in client ? client.id : 'cli-' + Date.now().toString(36),
      created_at: 'created_at' in client ? client.created_at : new Date().toISOString(),
    }
    const current = this.getClients()
    saveToStorage(STORAGE_KEYS.clients, [fullClient, ...current])

    // Live Supabase Insert
    supabase
      .from('zhenbot_clients')
      .insert([
        {
          id: fullClient.id,
          company_name: fullClient.company_name,
          contact_person: fullClient.contact_person,
          email: fullClient.email,
          phone: fullClient.phone,
          whatsapp: fullClient.whatsapp,
          industry: fullClient.industry,
          client_type: fullClient.client_type,
          status: fullClient.status,
          total_billed: fullClient.total_billed || 0,
          total_paid: fullClient.total_paid || 0,
          address: fullClient.address || null,
          internal_notes: fullClient.internal_notes || [],
          created_at: fullClient.created_at,
        },
      ])
      .then(() => {})

    return fullClient
  },

  updateClient(id: string, updates: Partial<Client>) {
    const list = this.getClients()
    saveToStorage(
      STORAGE_KEYS.clients,
      list.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    )

    // Live Supabase Update
    supabase
      .from('zhenbot_clients')
      .update(updates)
      .eq('id', id)
      .then(() => {})
  },

  // --- PROJECTS ---
  getProjects(): Project[] {
    return loadFromStorage(STORAGE_KEYS.projects, SEED_PROJECTS)
  },

  addProject(project: Omit<Project, 'id' | 'created_at'>): Project {
    const newProject: Project = {
      ...project,
      id: 'prj-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    }
    const current = this.getProjects()
    saveToStorage(STORAGE_KEYS.projects, [newProject, ...current])

    // Live Supabase Insert
    supabase
      .from('zhenbot_projects')
      .insert([
        {
          id: newProject.id,
          client_id: newProject.client_id,
          client_name: newProject.client_name,
          name: newProject.name,
          category: newProject.category,
          budget: newProject.budget,
          status: newProject.status,
          priority: newProject.priority,
          start_date: newProject.start_date,
          expected_delivery: newProject.expected_delivery,
          assigned_to: newProject.assigned_to,
          progress: newProject.progress,
          description: newProject.description,
          tasks: newProject.tasks || [],
          milestones: newProject.milestones || [],
          internal_notes: newProject.internal_notes || [],
          created_at: newProject.created_at,
        },
      ])
      .then(() => {})

    this.addLog({
      admin_name: 'Admin',
      action: 'Project Created',
      target_type: 'Project',
      target_id: newProject.id,
      details: `Created automation project "${newProject.name}" for ${newProject.client_name}. Budget: ₦${newProject.budget.toLocaleString()}`,
    })

    return newProject
  },

  updateProject(id: string, updates: Partial<Project>) {
    const list = this.getProjects()
    saveToStorage(
      STORAGE_KEYS.projects,
      list.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    )

    // Live Supabase Update
    supabase
      .from('zhenbot_projects')
      .update(updates)
      .eq('id', id)
      .then(() => {})
  },

  // --- INVOICES ---
  getInvoices(): Invoice[] {
    return loadFromStorage(STORAGE_KEYS.invoices, SEED_INVOICES)
  },

  addInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'invoice_number'>): Invoice {
    const existing = this.getInvoices()
    const nextNum = existing.length + 1
    const invoiceNumber = `ZH-INV-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`

    const newInvoice: Invoice = {
      ...invoice,
      id: 'inv-' + Date.now().toString(36),
      invoice_number: invoiceNumber,
      created_at: new Date().toISOString(),
    }

    saveToStorage(STORAGE_KEYS.invoices, [newInvoice, ...existing])

    // Live Supabase Insert
    supabase
      .from('zhenbot_invoices')
      .insert([
        {
          id: newInvoice.id,
          invoice_number: newInvoice.invoice_number,
          client_id: newInvoice.client_id,
          client_name: newInvoice.client_name,
          client_email: newInvoice.client_email,
          client_address: newInvoice.client_address || null,
          project_id: newInvoice.project_id || null,
          project_name: newInvoice.project_name || null,
          issue_date: newInvoice.issue_date,
          due_date: newInvoice.due_date,
          items: newInvoice.items || [],
          subtotal: newInvoice.subtotal,
          discount: newInvoice.discount || 0,
          tax: newInvoice.tax || 0,
          total: newInvoice.total,
          amount_paid: newInvoice.amount_paid || 0,
          status: newInvoice.status,
          payment_method: newInvoice.payment_method || null,
          notes: newInvoice.notes || null,
          created_at: newInvoice.created_at,
        },
      ])
      .then(() => {})

    this.addLog({
      admin_name: 'Admin',
      action: 'Invoice Created',
      target_type: 'Invoice',
      target_id: newInvoice.id,
      details: `Generated invoice ${newInvoice.invoice_number} for ${newInvoice.client_name} (₦${newInvoice.total.toLocaleString()}).`,
    })

    return newInvoice
  },

  recordInvoicePayment(invoiceId: string, amount: number, paymentMethod: string) {
    const list = this.getInvoices()
    let targetInv: Invoice | undefined
    const updated = list.map((inv) => {
      if (inv.id === invoiceId) {
        const newPaid = (inv.amount_paid || 0) + amount
        const newStatus = newPaid >= inv.total ? 'paid' : 'partially_paid'
        targetInv = {
          ...inv,
          amount_paid: newPaid,
          status: newStatus as Invoice['status'],
          payment_method: paymentMethod,
        }
        return targetInv
      }
      return inv
    })
    saveToStorage(STORAGE_KEYS.invoices, updated)

    if (targetInv) {
      // Live Supabase Invoice Update
      supabase
        .from('zhenbot_invoices')
        .update({
          amount_paid: targetInv.amount_paid,
          status: targetInv.status,
          payment_method: targetInv.payment_method,
        })
        .eq('id', invoiceId)
        .then(() => {})

      // Live Supabase Payment Record
      const payRef = 'PAY-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      supabase
        .from('zhenbot_payments')
        .insert([
          {
            invoice_id: invoiceId,
            client_id: targetInv.client_id,
            amount: amount,
            payment_method: paymentMethod,
            reference: payRef,
            status: 'verified',
            payment_date: new Date().toISOString(),
          },
        ])
        .then(() => {})

      // Also update client totals
      const clients = this.getClients()
      const client = clients.find((c) => c.id === targetInv!.client_id)
      const newTotalPaid = (client?.total_paid || 0) + amount
      saveToStorage(
        STORAGE_KEYS.clients,
        clients.map((c) =>
          c.id === targetInv!.client_id ? { ...c, total_paid: newTotalPaid } : c,
        ),
      )

      supabase
        .from('zhenbot_clients')
        .update({ total_paid: newTotalPaid })
        .eq('id', targetInv.client_id)
        .then(() => {})

      this.addNotification({
        type: 'payment',
        title: 'Payment Recorded',
        message: `₦${amount.toLocaleString()} recorded for invoice ${targetInv.invoice_number}.`,
        link_tab: 'invoices',
      })

      this.addLog({
        admin_name: 'Admin',
        action: 'Payment Recorded',
        target_type: 'Invoice',
        target_id: targetInv.invoice_number,
        details: `Recorded ₦${amount.toLocaleString()} paid via ${paymentMethod}.`,
      })
    }
  },

  // --- EXPENSES ---
  getExpenses(): Expense[] {
    return loadFromStorage(STORAGE_KEYS.expenses, SEED_EXPENSES)
  },

  addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Expense {
    const newExpense: Expense = {
      ...expense,
      id: 'exp-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    }
    const current = this.getExpenses()
    saveToStorage(STORAGE_KEYS.expenses, [newExpense, ...current])

    // Live Supabase Insert
    supabase
      .from('zhenbot_expenses')
      .insert([
        {
          id: newExpense.id,
          title: newExpense.title,
          category: newExpense.category,
          amount: newExpense.amount,
          date: newExpense.date,
          payment_method: newExpense.payment_method,
          vendor: newExpense.vendor,
          description: newExpense.description || null,
          is_recurring: newExpense.is_recurring,
          created_at: newExpense.created_at,
        },
      ])
      .then(() => {})

    this.addLog({
      admin_name: 'Admin',
      action: 'Expense Recorded',
      target_type: 'Expense',
      target_id: newExpense.id,
      details: `Logged expense: ${newExpense.title} (₦${newExpense.amount.toLocaleString()} - ${newExpense.vendor}).`,
    })

    return newExpense
  },

  // --- EMAILS ---
  getEmails(): EmailItem[] {
    return loadFromStorage(STORAGE_KEYS.emails, SEED_EMAILS)
  },

  addEmail(email: Omit<EmailItem, 'id' | 'created_at'>): EmailItem {
    const newEmail: EmailItem = {
      ...email,
      id: 'em-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    }
    const current = this.getEmails()
    saveToStorage(STORAGE_KEYS.emails, [newEmail, ...current])

    // Live Supabase Insert
    supabase
      .from('zhenbot_emails')
      .insert([
        {
          id: newEmail.id,
          folder: newEmail.folder,
          from_name: newEmail.from_name,
          from_email: newEmail.from_email,
          to_email: newEmail.to_email,
          to_name: newEmail.to_name || null,
          subject: newEmail.subject,
          preview: newEmail.preview,
          body: newEmail.body,
          is_read: newEmail.is_read,
          is_starred: newEmail.is_starred,
          requires_followup: newEmail.requires_followup,
          followup_due: newEmail.followup_due || null,
          followup_status: newEmail.followup_status || null,
          created_at: newEmail.created_at,
        },
      ])
      .then(() => {})

    return newEmail
  },

  markEmailRead(id: string) {
    const list = this.getEmails()
    saveToStorage(
      STORAGE_KEYS.emails,
      list.map((e) => (e.id === id ? { ...e, is_read: true } : e)),
    )

    supabase
      .from('zhenbot_emails')
      .update({ is_read: true })
      .eq('id', id)
      .then(() => {})
  },

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    return loadFromStorage(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS)
  },

  addNotification(notif: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...notif,
      id: 'notif-' + Date.now().toString(36),
      is_read: false,
      created_at: new Date().toISOString(),
    }
    const current = this.getNotifications()
    saveToStorage(STORAGE_KEYS.notifications, [newNotif, ...current])

    // Live Supabase Insert
    supabase
      .from('zhenbot_notifications')
      .insert([
        {
          id: newNotif.id,
          type: newNotif.type,
          title: newNotif.title,
          message: newNotif.message,
          link_tab: newNotif.link_tab || null,
          is_read: false,
          created_at: newNotif.created_at,
        },
      ])
      .then(() => {})

    return newNotif
  },

  markAllNotificationsRead() {
    const list = this.getNotifications()
    saveToStorage(
      STORAGE_KEYS.notifications,
      list.map((n) => ({ ...n, is_read: true })),
    )

    supabase
      .from('zhenbot_notifications')
      .update({ is_read: true })
      .eq('is_read', false)
      .then(() => {})
  },

  // --- ACTIVITY LOGS ---
  getLogs(): ActivityLogItem[] {
    return loadFromStorage(STORAGE_KEYS.logs, SEED_LOGS)
  },

  addLog(log: Omit<ActivityLogItem, 'id' | 'created_at'>): ActivityLogItem {
    const newLog: ActivityLogItem = {
      ...log,
      id: 'log-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    }
    const current = this.getLogs()
    saveToStorage(STORAGE_KEYS.logs, [newLog, ...current.slice(0, 99)])

    // Live Supabase Insert
    supabase
      .from('zhenbot_activity_logs')
      .insert([
        {
          id: newLog.id,
          admin_name: newLog.admin_name,
          action: newLog.action,
          target_type: newLog.target_type,
          target_id: newLog.target_id,
          details: newLog.details,
          created_at: newLog.created_at,
        },
      ])
      .then(() => {})

    return newLog
  },
}

