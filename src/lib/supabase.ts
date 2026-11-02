import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://cxbevwccenradkjxoooh.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4YmV2d2NjZW5yYWRranhvb29oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2ODMxNjgsImV4cCI6MjA4MTI1OTE2OH0.DJSH0CpPAPciTPD4EsHsioLUOobkikiqVEW8wS02Itw'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ??
  DEFAULT_SUPABASE_URL

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  DEFAULT_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const TABLE = {
  users: 'zhenbot_users',
  transactions: 'zhenbot_transactions',
  referrals: 'zhenbot_referrals',
  networks: 'zhenbot_deposit_networks',
  chatThreads: 'zhenbot_chat_threads',
  chatMessages: 'zhenbot_chat_messages',
  wallets: 'zhenbot_wallets',
  // Live business operations & click telemetry tables
  clicks: 'zhenbot_clicks',
  enquiries: 'zhenbot_enquiries',
  clients: 'zhenbot_clients',
  portalUsers: 'zhenbot_portal_users',
  projects: 'zhenbot_projects',
  automations: 'zhenbot_automations',
  automationLogs: 'zhenbot_automation_logs',
  invoices: 'zhenbot_invoices',
  payments: 'zhenbot_payments',
  expenses: 'zhenbot_expenses',
  documents: 'zhenbot_documents',
  supportTickets: 'zhenbot_support_tickets',
  notifications: 'zhenbot_notifications',
  activityLogs: 'zhenbot_activity_logs',
  emails: 'zhenbot_emails',
} as const
