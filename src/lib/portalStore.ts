import { supabase } from '@/lib/supabase'
import { businessStore, type Client, type Project, type Invoice } from '@/lib/businessStore'

// ====================================================
// CLIENT PORTAL MODELS & CONTRACTS
// ====================================================

export type ClientUserRole = 'owner' | 'admin' | 'finance' | 'viewer'

export interface ClientPortalUser {
  id: string
  client_id: string
  email: string
  full_name: string
  role: ClientUserRole
  status: 'active' | 'invited' | 'suspended'
  avatar_url?: string
  last_login?: string
  invitation_token?: string
  invitation_expires_at?: string
  created_at: string
}

export interface AutomationMetric {
  label: string
  value: string | number
  change?: string
}

export interface ClientAutomation {
  id: string
  client_id: string
  project_id?: string
  name: string
  category:
    | 'WhatsApp Automation'
    | 'Payment Verification'
    | 'Order & Delivery'
    | 'Business Records Sync'
    | 'Social Ads & Leads'
    | 'Custom Workflow'
  status: 'active' | 'paused' | 'needs_attention' | 'error' | 'maintenance'
  description: string
  trigger_event: string
  last_execution_at?: string
  last_execution_status?: 'success' | 'failed' | 'pending'
  total_executions: number
  successful_executions: number
  failed_executions: number
  uptime_percentage: number
  sync_schedule?: string
  metrics?: AutomationMetric[]
  error_details?: string
  created_at: string
}

export interface AutomationExecutionLog {
  id: string
  automation_id: string
  client_id: string
  event_name: string
  status: 'success' | 'failed' | 'processing'
  duration_ms: number
  payload_summary: string
  error_message?: string
  executed_at: string
}

export interface ClientDocument {
  id: string
  client_id: string
  project_id?: string
  title: string
  category:
    | 'Proposal'
    | 'Contract'
    | 'Specification'
    | 'Deliverable'
    | 'Report'
    | 'Guide'
    | 'Invoice'
    | 'Receipt'
  file_name: string
  file_size: string
  file_url?: string
  uploaded_by: string
  created_at: string
}

export interface SupportTicketMessage {
  id: string
  ticket_id: string
  sender_type: 'client' | 'admin'
  sender_name: string
  message: string
  created_at: string
}

export interface ClientSupportTicket {
  id: string
  client_id: string
  client_name: string
  ticket_number: string
  subject: string
  description: string
  project_id?: string
  automation_id?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'awaiting_client' | 'resolved' | 'closed'
  messages: SupportTicketMessage[]
  created_at: string
  updated_at: string
}

export interface ClientNotification {
  id: string
  client_id: string
  type: 'project' | 'milestone' | 'automation' | 'invoice' | 'payment' | 'document' | 'support'
  title: string
  message: string
  link?: string
  is_read: boolean
  created_at: string
}

export interface ClientPayment {
  id: string
  client_id: string
  invoice_id: string
  invoice_number: string
  reference: string
  amount: number
  payment_method: 'Paystack' | 'Bank Transfer' | 'Card'
  status: 'verified' | 'pending' | 'failed'
  paid_at: string
  receipt_url?: string
}

// ====================================================
// DEFAULT SEED DATA FOR CLIENT PORTAL
// ====================================================

const SEED_PORTAL_USERS: ClientPortalUser[] = [
  {
    id: 'usr-001',
    client_id: 'cli-001',
    email: 'tunde@primegadgets.ng',
    full_name: 'Tunde Adeleke',
    role: 'owner',
    status: 'active',
    last_login: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    created_at: '2026-02-15T09:00:00Z',
  },
  {
    id: 'usr-002',
    client_id: 'cli-001',
    email: 'finance@primegadgets.ng',
    full_name: 'Sarah Balogun',
    role: 'finance',
    status: 'active',
    last_login: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    created_at: '2026-02-18T10:00:00Z',
  },
  {
    id: 'usr-003',
    client_id: 'cli-002',
    email: 'operations@metrofastway.com',
    full_name: 'Ibrahim Danjuma',
    role: 'owner',
    status: 'active',
    last_login: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    created_at: '2026-03-01T11:30:00Z',
  },
  {
    id: 'usr-004',
    client_id: 'cli-003',
    email: 'chidinma@crestfieldproperties.com',
    full_name: 'Chidinma Okoye',
    role: 'owner',
    status: 'active',
    last_login: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    created_at: '2026-03-20T14:15:00Z',
  },
]

const SEED_AUTOMATIONS: ClientAutomation[] = [
  // Prime Gadgets (cli-001)
  {
    id: 'auto-001',
    client_id: 'cli-001',
    project_id: 'prj-001',
    name: 'WhatsApp Storefront & Auto-Enquiry Bot',
    category: 'WhatsApp Automation',
    status: 'active',
    description:
      'Autonomous conversational agent handling customer product enquiries, real-time inventory checks, and instant order intake.',
    trigger_event: 'Inbound WhatsApp webhook',
    last_execution_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    last_execution_status: 'success',
    total_executions: 1420,
    successful_executions: 1416,
    failed_executions: 4,
    uptime_percentage: 99.8,
    sync_schedule: 'Real-time Webhook',
    metrics: [
      { label: 'Conversations Handled', value: '1,420', change: '+24% this week' },
      { label: 'Avg Response Time', value: '1.2s', change: 'Instant' },
      { label: 'Orders Converted', value: '382', change: '26.9% rate' },
    ],
    created_at: '2026-02-28T12:00:00Z',
  },
  {
    id: 'auto-002',
    client_id: 'cli-001',
    project_id: 'prj-001',
    name: 'Paystack Reconciliation & Digital PDF Receipts',
    category: 'Payment Verification',
    status: 'active',
    description:
      'Listens for bank transfer & card charge webhook confirmations, reconciles order reference, and dispatches signed PDF receipts via WhatsApp & Email.',
    trigger_event: 'Paystack charge.success webhook',
    last_execution_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    last_execution_status: 'success',
    total_executions: 382,
    successful_executions: 382,
    failed_executions: 0,
    uptime_percentage: 100.0,
    sync_schedule: 'Instant on Payment',
    metrics: [
      { label: 'Payments Reconciled', value: '₦18.4M', change: '100% verified' },
      { label: 'PDF Receipts Generated', value: '382', change: 'Zero delay' },
      { label: 'Disputes Prevented', value: '47', change: 'No fake alerts' },
    ],
    created_at: '2026-02-28T14:30:00Z',
  },
  // Metro Fastway (cli-002)
  {
    id: 'auto-003',
    client_id: 'cli-002',
    project_id: 'prj-002',
    name: 'Multi-Rider Dispatch & Route Orchestrator',
    category: 'Order & Delivery',
    status: 'active',
    description:
      'Batches incoming orders from ecommerce stores, calculates distance to active okada couriers, and dispatches WhatsApp accept/reject cards.',
    trigger_event: 'Order created in store system',
    last_execution_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    last_execution_status: 'success',
    total_executions: 890,
    successful_executions: 885,
    failed_executions: 5,
    uptime_percentage: 99.4,
    sync_schedule: 'Every 2 minutes',
    metrics: [
      { label: 'Jobs Dispatched', value: '890', change: '+35% volume' },
      { label: 'Rider Match Rate', value: '98.2%', change: '< 3 mins' },
      { label: 'Active Couriers Connected', value: '18', change: 'Abuja/Lagos' },
    ],
    created_at: '2026-03-15T09:00:00Z',
  },
  {
    id: 'auto-004',
    client_id: 'cli-002',
    project_id: 'prj-002',
    name: 'WooCommerce & Shopify Webhook Ingestor',
    category: 'Business Records Sync',
    status: 'active',
    description:
      'Seamlessly captures orders from online merchant storefronts and logs them into centralized courier logistics pipeline.',
    trigger_event: 'POST /api/webhooks/orders',
    last_execution_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    last_execution_status: 'success',
    total_executions: 1120,
    successful_executions: 1118,
    failed_executions: 2,
    uptime_percentage: 99.9,
    sync_schedule: 'Real-time',
    metrics: [
      { label: 'Webhooks Ingested', value: '1,120', change: 'Zero drop' },
      { label: 'Sync Latency', value: '340ms', change: 'Fast' },
    ],
    created_at: '2026-03-15T11:00:00Z',
  },
  // Crestfield Real Estate (cli-003)
  {
    id: 'auto-005',
    client_id: 'cli-003',
    project_id: 'prj-003',
    name: 'Meta Ads to Telegram High-Intent Lead Pipeline',
    category: 'Social Ads & Leads',
    status: 'active',
    description:
      'Instant lead capture from Meta ads, automatic budget and location qualification questionnaire, and calendar booking trigger.',
    trigger_event: 'Meta leadgen webhook',
    last_execution_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    last_execution_status: 'success',
    total_executions: 640,
    successful_executions: 633,
    failed_executions: 7,
    uptime_percentage: 98.9,
    sync_schedule: 'Real-time',
    metrics: [
      { label: 'Leads Captured', value: '640', change: '+52% M-o-M' },
      { label: 'Pre-qualified Buyers', value: '284', change: '₦50M+ budget' },
      { label: 'Inspections Booked', value: '92', change: 'Confirmed' },
    ],
    created_at: '2026-03-25T16:00:00Z',
  },
]

const SEED_AUTOMATION_LOGS: AutomationExecutionLog[] = [
  {
    id: 'log-a-01',
    automation_id: 'auto-001',
    client_id: 'cli-001',
    event_name: 'WhatsApp Enquiry Received',
    status: 'success',
    duration_ms: 180,
    payload_summary: 'Enquiry for "iPhone 15 Pro Max 256GB" -> Catalog matched, price & payment link sent.',
    executed_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-a-02',
    automation_id: 'auto-001',
    client_id: 'cli-001',
    event_name: 'Inventory Stock Check',
    status: 'success',
    duration_ms: 95,
    payload_summary: 'Verified SKU-9921 in stock (4 units available at Ikeja store).',
    executed_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-a-03',
    automation_id: 'auto-002',
    client_id: 'cli-001',
    event_name: 'Paystack Webhook Verified',
    status: 'success',
    duration_ms: 310,
    payload_summary: 'Ref: PSTK_99182371 -> ₦1,450,000 received. PDF receipt #REC-8841 generated & sent.',
    executed_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-a-04',
    automation_id: 'auto-003',
    client_id: 'cli-002',
    event_name: 'Driver Dispatch Match',
    status: 'success',
    duration_ms: 450,
    payload_summary: 'Order #ORD-7719 matched to Driver Musa (1.2km away). Accepted in 42s.',
    executed_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-a-05',
    automation_id: 'auto-004',
    client_id: 'cli-002',
    event_name: 'WooCommerce Order Ingestion',
    status: 'success',
    duration_ms: 220,
    payload_summary: 'Order from Store #3 (Garki II to Wuse 2 delivery).',
    executed_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-a-06',
    automation_id: 'auto-005',
    client_id: 'cli-003',
    event_name: 'Meta Lead Form Ingested',
    status: 'success',
    duration_ms: 240,
    payload_summary: 'Lead from Instagram Ad: 4-Bedroom Terrace Ikoyi. Qualification sent via WhatsApp.',
    executed_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
]

const SEED_DOCUMENTS: ClientDocument[] = [
  // Prime Gadgets
  {
    id: 'doc-001',
    client_id: 'cli-001',
    project_id: 'prj-001',
    title: 'Service Agreement & Master Automation Contract',
    category: 'Contract',
    file_name: 'Prime_Gadgets_Zhenbot_Contract_Signed.pdf',
    file_size: '1.4 MB',
    uploaded_by: 'Zhenbot Legal Team',
    created_at: '2026-02-16T10:00:00Z',
  },
  {
    id: 'doc-002',
    client_id: 'cli-001',
    project_id: 'prj-001',
    title: 'Technical System Architecture & API Blueprint',
    category: 'Specification',
    file_name: 'WhatsApp_Paystack_Integration_Spec_v1.pdf',
    file_size: '2.8 MB',
    uploaded_by: 'Usman B. (Lead Dev)',
    created_at: '2026-02-20T14:30:00Z',
  },
  {
    id: 'doc-003',
    client_id: 'cli-001',
    project_id: 'prj-001',
    title: 'Staff Operation Manual: Managing WhatsApp Catalog',
    category: 'Guide',
    file_name: 'Store_Staff_WhatsApp_Automation_Guide.pdf',
    file_size: '3.1 MB',
    uploaded_by: 'Zhenbot Support Team',
    created_at: '2026-02-28T16:00:00Z',
  },
  // Metro Fastway
  {
    id: 'doc-004',
    client_id: 'cli-002',
    project_id: 'prj-002',
    title: 'Delivery Routing Architecture & Driver Protocol',
    category: 'Specification',
    file_name: 'MetroFastway_Dispatch_Spec_Final.pdf',
    file_size: '3.4 MB',
    uploaded_by: 'David O. (Workflow Architect)',
    created_at: '2026-03-08T11:00:00Z',
  },
  {
    id: 'doc-005',
    client_id: 'cli-002',
    project_id: 'prj-002',
    title: 'Milestone 2 Deliverable: Driver Dispatch Engine',
    category: 'Deliverable',
    file_name: 'Dispatch_Engine_Test_Report_M2.pdf',
    file_size: '1.9 MB',
    uploaded_by: 'David O. (Workflow Architect)',
    created_at: '2026-03-25T15:00:00Z',
  },
  // Crestfield
  {
    id: 'doc-006',
    client_id: 'cli-003',
    project_id: 'prj-003',
    title: 'Meta Ads Lead Ingestion Flow & Qualification Matrix',
    category: 'Specification',
    file_name: 'Crestfield_LeadGen_Matrix_v2.pdf',
    file_size: '2.1 MB',
    uploaded_by: 'Zainab M. (Automation Eng)',
    created_at: '2026-03-24T12:00:00Z',
  },
]

const SEED_SUPPORT_TICKETS: ClientSupportTicket[] = [
  {
    id: 'tkt-001',
    client_id: 'cli-001',
    client_name: 'Prime Gadgets & Logistics',
    ticket_number: 'ZH-TCK-2026-001',
    subject: 'Add New "Pre-owned Laptops" Category to WhatsApp Catalog',
    description:
      'We are expanding our product lineup to include certified pre-owned MacBooks. We need this new menu option added to the automated WhatsApp greeting flow.',
    project_id: 'prj-001',
    automation_id: 'auto-001',
    priority: 'medium',
    status: 'in_progress',
    messages: [
      {
        id: 'msg-t1',
        ticket_id: 'tkt-001',
        sender_type: 'client',
        sender_name: 'Tunde Adeleke',
        message:
          'Good day Zhenbot team. We want to introduce a "Pre-owned MacBooks" category in our WhatsApp automated sales assistant. What spreadsheet format should we upload?',
        created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      },
      {
        id: 'msg-t2',
        ticket_id: 'tkt-001',
        sender_type: 'admin',
        sender_name: 'Usman B. (Lead Dev)',
        message:
          'Hello Tunde, we can enable this immediately. You can use the existing inventory template sheet on tab "Laptops". Once you add the models and prices, the sync bot will reflect them in 60 seconds.',
        created_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
  },
  {
    id: 'tkt-002',
    client_id: 'cli-002',
    client_name: 'Metro Fastway Couriers',
    ticket_number: 'ZH-TCK-2026-002',
    subject: 'Increase Driver Response Timeout from 60s to 90s',
    description:
      'Some riders navigating busy Abuja highway traffic need slightly more time to tap the WhatsApp "Accept Delivery" button before job re-routing.',
    project_id: 'prj-002',
    automation_id: 'auto-003',
    priority: 'high',
    status: 'resolved',
    messages: [
      {
        id: 'msg-t3',
        ticket_id: 'tkt-002',
        sender_type: 'client',
        sender_name: 'Ibrahim Danjuma',
        message:
          'Hello, our rider fleet manager noticed that during peak hours 60 seconds is too brief when drivers are riding. Can we extend the timer to 90 seconds?',
        created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
      {
        id: 'msg-t4',
        ticket_id: 'tkt-002',
        sender_type: 'admin',
        sender_name: 'David O. (Workflow Architect)',
        message:
          'Configured and deployed to production. Driver timeout is now updated to 90 seconds. All test pings are clearing normally.',
        created_at: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
  },
]

const SEED_CLIENT_PAYMENTS: ClientPayment[] = [
  {
    id: 'pay-001',
    client_id: 'cli-001',
    invoice_id: 'inv-001',
    invoice_number: 'ZH-INV-2026-001',
    reference: 'PAY_ZH_8819203',
    amount: 850000,
    payment_method: 'Bank Transfer',
    status: 'verified',
    paid_at: '2026-02-18T14:30:00Z',
    receipt_url: '/receipts/ZH-INV-2026-001.pdf',
  },
  {
    id: 'pay-002',
    client_id: 'cli-002',
    invoice_id: 'inv-002',
    invoice_number: 'ZH-INV-2026-002',
    reference: 'PAY_ZH_9921477',
    amount: 1000000,
    payment_method: 'Bank Transfer',
    status: 'verified',
    paid_at: '2026-03-05T12:15:00Z',
    receipt_url: '/receipts/ZH-INV-2026-002.pdf',
  },
  {
    id: 'pay-003',
    client_id: 'cli-003',
    invoice_id: 'inv-003',
    invoice_number: 'ZH-INV-2026-003',
    reference: 'PAY_ZH_1004819',
    amount: 950000,
    payment_method: 'Paystack',
    status: 'verified',
    paid_at: '2026-03-22T14:20:00Z',
    receipt_url: '/receipts/ZH-INV-2026-003.pdf',
  },
]

const SEED_CLIENT_NOTIFICATIONS: ClientNotification[] = [
  {
    id: 'cn-001',
    client_id: 'cli-001',
    type: 'automation',
    title: 'Daily Automation Health Check Passed',
    message: 'Your WhatsApp bot processed 142 conversations today with 99.8% uptime.',
    is_read: false,
    created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cn-002',
    client_id: 'cli-001',
    type: 'support',
    title: 'Support Ticket Update',
    message: 'Zhenbot team responded to ticket ZH-TCK-2026-001 ("Add New Laptops Category").',
    is_read: false,
    created_at: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
  },
  {
    id: 'cn-003',
    client_id: 'cli-002',
    type: 'milestone',
    title: 'Milestone 2 Completed',
    message: 'Driver Dispatch Logic completed and tested for Metro Fastway Couriers.',
    is_read: true,
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
]

// ====================================================
// STORAGE KEYS & REACTIVE BROADCAST
// ====================================================

const PORTAL_STORAGE_KEYS = {
  users: 'zhenbot_portal_users',
  automations: 'zhenbot_portal_automations',
  logs: 'zhenbot_portal_logs',
  documents: 'zhenbot_portal_documents',
  tickets: 'zhenbot_portal_tickets',
  payments: 'zhenbot_portal_payments',
  notifications: 'zhenbot_portal_notifications',
  session: 'zhenbot_portal_active_session',
}

function loadPortalData<T>(key: string, seed: T): T {
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

function savePortalData<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('zhenbot_portal_update', { detail: { key } }))
  } catch (err) {
    console.warn('Portal storage save failed:', err)
  }
}

// ====================================================
// PORTAL STORE REPOSITORY & CLIENT ACCESS API
// ====================================================

let isPortalSyncInitialized = false

export const portalStore = {
  /**
   * Hydrates portal state live from Supabase tables
   */
  async initPortalSupabaseSync() {
    if (isPortalSyncInitialized || typeof window === 'undefined') return
    isPortalSyncInitialized = true

    try {
      // 1. Fetch Portal Users
      const { data: users } = await supabase.from('zhenbot_portal_users').select('*')
      if (users && users.length > 0) {
        savePortalData(PORTAL_STORAGE_KEYS.users, users)
      }

      // 2. Fetch Automations
      const { data: automations } = await supabase.from('zhenbot_automations').select('*')
      if (automations && automations.length > 0) {
        savePortalData(PORTAL_STORAGE_KEYS.automations, automations)
      }

      // 3. Fetch Automation Logs
      const { data: logs } = await supabase.from('zhenbot_automation_logs').select('*').order('executed_at', { ascending: false }).limit(200)
      if (logs && logs.length > 0) {
        savePortalData(PORTAL_STORAGE_KEYS.logs, logs)
      }

      // 4. Fetch Documents
      const { data: docs } = await supabase.from('zhenbot_documents').select('*').order('created_at', { ascending: false })
      if (docs && docs.length > 0) {
        savePortalData(PORTAL_STORAGE_KEYS.documents, docs)
      }

      // 5. Fetch Support Tickets
      const { data: tickets } = await supabase.from('zhenbot_support_tickets').select('*').order('updated_at', { ascending: false })
      if (tickets && tickets.length > 0) {
        savePortalData(PORTAL_STORAGE_KEYS.tickets, tickets)
      }

      // 6. Fetch Payments
      const { data: payments } = await supabase.from('zhenbot_payments').select('*').order('payment_date', { ascending: false })
      if (payments && payments.length > 0) {
        savePortalData(PORTAL_STORAGE_KEYS.payments, payments)
      }
    } catch (err) {
      console.warn('Initial portal Supabase sync error:', err)
    }

    // Subscribe to realtime updates on portal tables
    try {
      supabase
        .channel('zhenbot_portal_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_automations' },
          async () => {
            const { data } = await supabase.from('zhenbot_automations').select('*')
            if (data) savePortalData(PORTAL_STORAGE_KEYS.automations, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_support_tickets' },
          async () => {
            const { data } = await supabase.from('zhenbot_support_tickets').select('*').order('updated_at', { ascending: false })
            if (data) savePortalData(PORTAL_STORAGE_KEYS.tickets, data)
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'zhenbot_documents' },
          async () => {
            const { data } = await supabase.from('zhenbot_documents').select('*')
            if (data) savePortalData(PORTAL_STORAGE_KEYS.documents, data)
          }
        )
        .subscribe()
    } catch {
      //
    }
  },
  // --- AUTHENTICATION & SESSION MANAGEMENT ---
  getCurrentSession(): { user: ClientPortalUser; client: Client } | null {
    try {
      const raw = localStorage.getItem(PORTAL_STORAGE_KEYS.session)
      if (raw) {
        const session = JSON.parse(raw) as { userId: string; clientId: string }
        const users = this.getPortalUsers()
        const clients = businessStore.getClients()
        const user = users.find((u) => u.id === session.userId)
        const client = clients.find((c) => c.id === session.clientId)
        if (user && client) return { user, client }
      }
    } catch {
      // fallback
    }

    // Default active session for instant experience: Prime Gadgets & Logistics (cli-001)
    const clients = businessStore.getClients()
    const users = this.getPortalUsers()
    const defaultClient = clients.find((c) => c.id === 'cli-001') || clients[0]
    const defaultUser =
      users.find((u) => u.client_id === defaultClient?.id) || users[0]

    if (defaultClient && defaultUser) {
      const session = { user: defaultUser, client: defaultClient }
      this.setSession(defaultUser, defaultClient)
      return session
    }

    return null
  },

  setSession(user: ClientPortalUser, client: Client) {
    try {
      localStorage.setItem(
        PORTAL_STORAGE_KEYS.session,
        JSON.stringify({ userId: user.id, clientId: client.id })
      )
      window.dispatchEvent(new CustomEvent('zhenbot_portal_auth_change'))
    } catch {
      //
    }
  },

  clearSession() {
    try {
      localStorage.removeItem(PORTAL_STORAGE_KEYS.session)
      window.dispatchEvent(new CustomEvent('zhenbot_portal_auth_change'))
    } catch {
      //
    }
  },

  login(email: string, _password?: string): { user: ClientPortalUser; client: Client } | null {
    const users = this.getPortalUsers()
    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    )
    if (!foundUser) return null

    const clients = businessStore.getClients()
    const foundClient = clients.find((c) => c.id === foundUser.client_id)
    if (!foundClient) return null

    // Update last login
    const updatedUser = {
      ...foundUser,
      last_login: new Date().toISOString(),
      status: 'active' as const,
    }
    this.updateUser(updatedUser)

    this.setSession(updatedUser, foundClient)
    return { user: updatedUser, client: foundClient }
  },

  switchClientForPreview(clientId: string): { user: ClientPortalUser; client: Client } | null {
    const clients = businessStore.getClients()
    const client = clients.find((c) => c.id === clientId)
    if (!client) return null

    let user = this.getPortalUsers().find((u) => u.client_id === clientId && u.role === 'owner')
    if (!user) {
      // Auto-provision owner user if not existing
      user = this.addUser({
        client_id: client.id,
        email: client.email,
        full_name: client.contact_person,
        role: 'owner',
        status: 'active',
      })
    }

    this.setSession(user, client)
    return { user, client }
  },

  activateInvitation(
    token: string,
    fullName: string,
    _password?: string
  ): { user: ClientPortalUser; client: Client } | null {
    const users = this.getPortalUsers()
    const user = users.find((u) => u.invitation_token === token)
    if (!user) return null

    const updatedUser: ClientPortalUser = {
      ...user,
      full_name: fullName.trim() || user.full_name,
      status: 'active',
      invitation_token: undefined,
      last_login: new Date().toISOString(),
    }
    this.updateUser(updatedUser)

    const client = businessStore.getClients().find((c) => c.id === user.client_id)
    if (!client) return null

    this.setSession(updatedUser, client)
    return { user: updatedUser, client }
  },

  generateInviteLink(
    clientId: string,
    email: string,
    fullName: string,
    role: ClientUserRole = 'owner'
  ): string {
    const token = 'inv_' + Math.random().toString(36).substring(2, 12)
    const existing = this.getPortalUsers().find(
      (u) => u.client_id === clientId && u.email.toLowerCase() === email.toLowerCase()
    )

    if (existing) {
      this.updateUser({ ...existing, invitation_token: token, status: 'invited' })
    } else {
      this.addUser({
        client_id: clientId,
        email,
        full_name: fullName,
        role,
        status: 'invited',
        invitation_token: token,
        invitation_expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
      })
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zhenibot.com'
    return `${origin}/portal/activate?token=${token}`
  },

  // --- PORTAL USERS & TEAM MEMBERS ---
  getPortalUsers(): ClientPortalUser[] {
    return loadPortalData(PORTAL_STORAGE_KEYS.users, SEED_PORTAL_USERS)
  },

  getPortalUsersByClient(clientId: string): ClientPortalUser[] {
    return this.getPortalUsers().filter((u) => u.client_id === clientId)
  },

  addUser(user: Omit<ClientPortalUser, 'id' | 'created_at'>): ClientPortalUser {
    const newUser: ClientPortalUser = {
      ...user,
      id: 'usr-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    }
    const current = this.getPortalUsers()
    savePortalData(PORTAL_STORAGE_KEYS.users, [newUser, ...current])

    supabase
      .from('zhenbot_portal_users')
      .insert([
        {
          id: newUser.id,
          client_id: newUser.client_id,
          email: newUser.email,
          full_name: newUser.full_name,
          role: newUser.role,
          status: newUser.status,
          avatar_url: newUser.avatar_url || null,
          invitation_token: newUser.invitation_token || null,
          invitation_expires_at: newUser.invitation_expires_at || null,
          created_at: newUser.created_at,
        },
      ])
      .then(() => {})

    return newUser
  },

  updateUser(user: ClientPortalUser) {
    const current = this.getPortalUsers()
    savePortalData(
      PORTAL_STORAGE_KEYS.users,
      current.map((u) => (u.id === user.id ? user : u))
    )

    supabase
      .from('zhenbot_portal_users')
      .update({
        full_name: user.full_name,
        role: user.role,
        status: user.status,
        last_login: user.last_login || null,
        invitation_token: user.invitation_token || null,
      })
      .eq('id', user.id)
      .then(() => {})
  },

  revokeUserAccess(userId: string) {
    const current = this.getPortalUsers()
    savePortalData(
      PORTAL_STORAGE_KEYS.users,
      current.map((u) => (u.id === userId ? { ...u, status: 'suspended' as const } : u))
    )

    supabase
      .from('zhenbot_portal_users')
      .update({ status: 'suspended' })
      .eq('id', userId)
      .then(() => {})
  },

  // --- AUTOMATIONS ---
  getAutomations(): ClientAutomation[] {
    return loadPortalData(PORTAL_STORAGE_KEYS.automations, SEED_AUTOMATIONS)
  },

  getAutomationsByClient(clientId: string): ClientAutomation[] {
    return this.getAutomations().filter((a) => a.client_id === clientId)
  },

  getAutomationLogs(automationId: string): AutomationExecutionLog[] {
    const all = loadPortalData(PORTAL_STORAGE_KEYS.logs, SEED_AUTOMATION_LOGS)
    return all.filter((l) => l.automation_id === automationId)
  },

  getClientLogs(clientId: string): AutomationExecutionLog[] {
    const all = loadPortalData(PORTAL_STORAGE_KEYS.logs, SEED_AUTOMATION_LOGS)
    return all.filter((l) => l.client_id === clientId)
  },

  updateAutomationStatus(
    automationId: string,
    status: ClientAutomation['status']
  ) {
    const all = this.getAutomations()
    savePortalData(
      PORTAL_STORAGE_KEYS.automations,
      all.map((a) => (a.id === automationId ? { ...a, status } : a))
    )

    supabase
      .from('zhenbot_automations')
      .update({ status })
      .eq('id', automationId)
      .then(() => {})
  },

  // --- DOCUMENTS ---
  getDocuments(): ClientDocument[] {
    return loadPortalData(PORTAL_STORAGE_KEYS.documents, SEED_DOCUMENTS)
  },

  getDocumentsByClient(clientId: string): ClientDocument[] {
    return this.getDocuments().filter((d) => d.client_id === clientId)
  },

  addDocument(doc: Omit<ClientDocument, 'id' | 'created_at'>): ClientDocument {
    const newDoc: ClientDocument = {
      ...doc,
      id: 'doc-' + Date.now().toString(36),
      created_at: new Date().toISOString(),
    }
    const current = this.getDocuments()
    savePortalData(PORTAL_STORAGE_KEYS.documents, [newDoc, ...current])

    supabase
      .from('zhenbot_documents')
      .insert([
        {
          id: newDoc.id,
          client_id: newDoc.client_id,
          project_id: newDoc.project_id || null,
          title: newDoc.title,
          category: newDoc.category,
          file_name: newDoc.file_name,
          file_size: newDoc.file_size,
          file_url: newDoc.file_url || null,
          uploaded_by: newDoc.uploaded_by,
          created_at: newDoc.created_at,
        },
      ])
      .then(() => {})

    return newDoc
  },

  // --- SUPPORT TICKETS ---
  getSupportTickets(): ClientSupportTicket[] {
    return loadPortalData(PORTAL_STORAGE_KEYS.tickets, SEED_SUPPORT_TICKETS)
  },

  getSupportTicketsByClient(clientId: string): ClientSupportTicket[] {
    return this.getSupportTickets().filter((t) => t.client_id === clientId)
  },

  addSupportTicket(
    ticket: Omit<ClientSupportTicket, 'id' | 'ticket_number' | 'messages' | 'created_at' | 'updated_at'>,
    firstMessage: string
  ): ClientSupportTicket {
    const current = this.getSupportTickets()
    const nextNum = current.length + 1
    const ticketNumber = `ZH-TCK-${new Date().getFullYear()}-${String(nextNum).padStart(3, '0')}`

    const newTicket: ClientSupportTicket = {
      ...ticket,
      id: 'tkt-' + Date.now().toString(36),
      ticket_number: ticketNumber,
      messages: [
        {
          id: 'msg-' + Date.now().toString(36),
          ticket_id: 'tkt-' + Date.now().toString(36),
          sender_type: 'client',
          sender_name: ticket.client_name,
          message: firstMessage,
          created_at: new Date().toISOString(),
        },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    savePortalData(PORTAL_STORAGE_KEYS.tickets, [newTicket, ...current])

    supabase
      .from('zhenbot_support_tickets')
      .insert([
        {
          id: newTicket.id,
          client_id: newTicket.client_id,
          client_name: newTicket.client_name,
          ticket_number: newTicket.ticket_number,
          subject: newTicket.subject,
          description: newTicket.description,
          project_id: newTicket.project_id || null,
          automation_id: newTicket.automation_id || null,
          priority: newTicket.priority,
          status: newTicket.status,
          messages: newTicket.messages,
          created_at: newTicket.created_at,
          updated_at: newTicket.updated_at,
        },
      ])
      .then(() => {})

    // Broadcast to Admin Notifications
    businessStore.addNotification({
      type: 'chat',
      title: 'New Client Support Ticket',
      message: `${ticket.client_name} created support ticket ${ticketNumber}: "${ticket.subject}".`,
      link_tab: 'chats',
    })

    return newTicket
  },

  addTicketReply(ticketId: string, message: string, senderType: 'client' | 'admin', senderName: string) {
    const all = this.getSupportTickets()
    let updatedTicket: ClientSupportTicket | undefined

    const updated = all.map((t) => {
      if (t.id === ticketId) {
        const newMsg: SupportTicketMessage = {
          id: 'msg-' + Date.now().toString(36),
          ticket_id: ticketId,
          sender_type: senderType,
          sender_name: senderName,
          message,
          created_at: new Date().toISOString(),
        }
        updatedTicket = {
          ...t,
          status: senderType === 'client' ? ('open' as const) : ('awaiting_client' as const),
          messages: [...t.messages, newMsg],
          updated_at: new Date().toISOString(),
        }
        return updatedTicket
      }
      return t
    })

    savePortalData(PORTAL_STORAGE_KEYS.tickets, updated)

    if (updatedTicket) {
      supabase
        .from('zhenbot_support_tickets')
        .update({
          status: updatedTicket.status,
          messages: updatedTicket.messages,
          updated_at: updatedTicket.updated_at,
        })
        .eq('id', ticketId)
        .then(() => {})
    }
  },

  updateTicketStatus(ticketId: string, status: ClientSupportTicket['status']) {
    const all = this.getSupportTickets()
    savePortalData(
      PORTAL_STORAGE_KEYS.tickets,
      all.map((t) => (t.id === ticketId ? { ...t, status, updated_at: new Date().toISOString() } : t))
    )

    supabase
      .from('zhenbot_support_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId)
      .then(() => {})
  },

  // --- CLIENT PAYMENTS ---
  getClientPayments(clientId: string): ClientPayment[] {
    const all = loadPortalData(PORTAL_STORAGE_KEYS.payments, SEED_CLIENT_PAYMENTS)
    return all.filter((p) => p.client_id === clientId)
  },

  addClientPayment(payment: Omit<ClientPayment, 'id'>): ClientPayment {
    const newPayment: ClientPayment = {
      ...payment,
      id: 'pay-' + Date.now().toString(36),
    }
    const current = loadPortalData(PORTAL_STORAGE_KEYS.payments, SEED_CLIENT_PAYMENTS)
    savePortalData(PORTAL_STORAGE_KEYS.payments, [newPayment, ...current])

    supabase
      .from('zhenbot_payments')
      .insert([
        {
          id: newPayment.id,
          invoice_id: newPayment.invoice_id,
          client_id: newPayment.client_id,
          amount: newPayment.amount,
          payment_method: newPayment.payment_method,
          reference: newPayment.reference,
          status: newPayment.status,
          payment_date: newPayment.paid_at || new Date().toISOString(),
        },
      ])
      .then(() => {})

    return newPayment
  },

  // --- CLIENT NOTIFICATIONS ---
  getClientNotifications(clientId: string): ClientNotification[] {
    const all = loadPortalData(PORTAL_STORAGE_KEYS.notifications, SEED_CLIENT_NOTIFICATIONS)
    return all.filter((n) => n.client_id === clientId)
  },

  markClientNotificationRead(id: string) {
    const all = loadPortalData(PORTAL_STORAGE_KEYS.notifications, SEED_CLIENT_NOTIFICATIONS)
    savePortalData(
      PORTAL_STORAGE_KEYS.notifications,
      all.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  },

  markAllClientNotificationsRead(clientId: string) {
    const all = loadPortalData(PORTAL_STORAGE_KEYS.notifications, SEED_CLIENT_NOTIFICATIONS)
    savePortalData(
      PORTAL_STORAGE_KEYS.notifications,
      all.map((n) => (n.client_id === clientId ? { ...n, is_read: true } : n))
    )
  },

  // --- CLIENT DATA AGGREGATORS (Using Shared Admin Store) ---
  getClientProjects(clientId: string): Project[] {
    return businessStore.getProjects().filter((p) => p.client_id === clientId)
  },

  getClientInvoices(clientId: string): Invoice[] {
    return businessStore.getInvoices().filter((i) => i.client_id === clientId)
  },
}
