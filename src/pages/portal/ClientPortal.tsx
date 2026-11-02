import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PortalSidebar, type PortalSection } from '@/components/portal/PortalSidebar'
import { PortalTopBar } from '@/components/portal/PortalTopBar'
import { PortalDashboardOverview } from '@/components/portal/PortalDashboardOverview'
import { PortalProjects } from '@/components/portal/PortalProjects'
import { PortalAutomations } from '@/components/portal/PortalAutomations'
import { PortalReports } from '@/components/portal/PortalReports'
import { PortalFinancials } from '@/components/portal/PortalFinancials'
import { PortalDocuments } from '@/components/portal/PortalDocuments'
import { PortalSupport } from '@/components/portal/PortalSupport'
import { PortalProfile } from '@/components/portal/PortalProfile'
import { PortalNotifications } from '@/components/portal/PortalNotifications'
import { portalStore, type ClientPortalUser } from '@/lib/portalStore'
import { businessStore, type Client } from '@/lib/businessStore'

export function ClientPortal() {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState<PortalSection>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Session state
  const [session, setSession] = useState<{ user: ClientPortalUser; client: Client } | null>(() =>
    portalStore.getCurrentSession()
  )

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  void refreshTrigger

  // Listen to updates & auth changes
  useEffect(() => {
    void portalStore.initPortalSupabaseSync()
    void businessStore.initSupabaseSync()

    const handleUpdate = () => {
      setRefreshTrigger((prev) => prev + 1)
      setSession(portalStore.getCurrentSession())
    }

    window.addEventListener('zhenbot_portal_update', handleUpdate)
    window.addEventListener('zhenbot_portal_auth_change', handleUpdate)
    window.addEventListener('zhenbot_ops_update', handleUpdate)

    return () => {
      window.removeEventListener('zhenbot_portal_update', handleUpdate)
      window.removeEventListener('zhenbot_portal_auth_change', handleUpdate)
      window.removeEventListener('zhenbot_ops_update', handleUpdate)
    }
  }, [])

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#111827]">Sign in to Dashboard</h2>
        <p className="text-xs text-[#64748B] mt-1 mb-4">
          Please authenticate with your credentials.
        </p>
        <button
          type="button"
          onClick={() => navigate('/portal/login')}
          className="h-10 px-5 rounded-xl bg-[#00B82E] text-white text-xs font-semibold cursor-pointer"
        >
          Sign In
        </button>
      </div>
    )
  }

  const { client, user } = session

  // Filtered client data from unified stores
  const clientProjects = portalStore.getClientProjects(client.id)
  const clientInvoices = portalStore.getClientInvoices(client.id)
  const clientAutomations = portalStore.getAutomationsByClient(client.id)
  const clientLogs = portalStore.getClientLogs(client.id)
  const clientDocuments = portalStore.getDocumentsByClient(client.id)
  const clientTickets = portalStore.getSupportTicketsByClient(client.id)
  const clientPayments = portalStore.getClientPayments(client.id)
  const clientNotifications = portalStore.getClientNotifications(client.id)
  const teamMembers = portalStore.getPortalUsersByClient(client.id)
  const allClients = businessStore.getClients()

  const unpaidInvoices = clientInvoices.filter(
    (i) => i.status !== 'paid' && i.status !== 'cancelled'
  )
  const openTickets = clientTickets.filter((t) => t.status === 'open' || t.status === 'in_progress')
  const unreadNotifs = clientNotifications.filter((n) => !n.is_read)

  const handleSwitchClient = (clientId: string) => {
    const newSession = portalStore.switchClientForPreview(clientId)
    if (newSession) {
      setSession(newSession)
      setRefreshTrigger((prev) => prev + 1)
    }
  }

  const handleLogout = () => {
    portalStore.clearSession()
    navigate('/portal/login')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans selection:bg-[#00B82E]/20 selection:text-[#111827]">
      {/* Desktop Collapsible Sidebar */}
      <div className="hidden lg:block shrink-0">
        <PortalSidebar
          currentSection={currentSection}
          onSelectSection={setCurrentSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          unreadCounts={{
            notifications: unreadNotifs.length,
            invoices: unpaidInvoices.length,
            tickets: openTickets.length,
          }}
          companyName={client.company_name}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white h-full z-10 flex flex-col shadow-2xl">
            <PortalSidebar
              currentSection={currentSection}
              onSelectSection={(sec) => {
                setCurrentSection(sec)
                setMobileMenuOpen(false)
              }}
              collapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
              unreadCounts={{
                notifications: unreadNotifs.length,
                invoices: unpaidInvoices.length,
                tickets: openTickets.length,
              }}
              companyName={client.company_name}
            />
          </div>
        </div>
      )}

      {/* Main Workspace Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PortalTopBar
          currentSection={currentSection}
          user={user}
          client={client}
          allClients={allClients}
          notifications={clientNotifications}
          onSwitchClient={handleSwitchClient}
          onSelectSection={setCurrentSection}
          onMarkNotificationRead={(id) => portalStore.markClientNotificationRead(id)}
          onMarkAllNotificationsRead={() => portalStore.markAllClientNotificationsRead(client.id)}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <PortalDashboardOverview
              projects={clientProjects}
              automations={clientAutomations}
              invoices={clientInvoices}
              logs={clientLogs}
              tickets={clientTickets}
              companyName={client.company_name}
              onNavigate={setCurrentSection}
            />
          )}

          {currentSection === 'projects' && (
            <PortalProjects projects={clientProjects} companyName={client.company_name} />
          )}

          {currentSection === 'automations' && (
            <PortalAutomations
              automations={clientAutomations}
              onRefresh={() => setRefreshTrigger((p) => p + 1)}
            />
          )}

          {currentSection === 'reports' && (
            <PortalReports logs={clientLogs} companyName={client.company_name} />
          )}

          {currentSection === 'invoices' && (
            <PortalFinancials
              invoices={clientInvoices}
              payments={clientPayments}
              companyName={client.company_name}
              clientEmail={client.email}
              defaultTab="invoices"
            />
          )}

          {currentSection === 'payments' && (
            <PortalFinancials
              invoices={clientInvoices}
              payments={clientPayments}
              companyName={client.company_name}
              clientEmail={client.email}
              defaultTab="payments"
            />
          )}

          {currentSection === 'receipts' && (
            <PortalFinancials
              invoices={clientInvoices}
              payments={clientPayments}
              companyName={client.company_name}
              clientEmail={client.email}
              defaultTab="receipts"
            />
          )}

          {currentSection === 'documents' && (
            <PortalDocuments
              documents={clientDocuments}
              clientId={client.id}
              companyName={client.company_name}
              onRefresh={() => setRefreshTrigger((p) => p + 1)}
            />
          )}

          {currentSection === 'support' && (
            <PortalSupport
              tickets={clientTickets}
              clientId={client.id}
              companyName={client.company_name}
              clientName={user.full_name}
              onRefresh={() => setRefreshTrigger((p) => p + 1)}
            />
          )}

          {currentSection === 'profile' && (
            <PortalProfile
              client={client}
              user={user}
              teamMembers={teamMembers}
              onRefresh={() => setRefreshTrigger((p) => p + 1)}
              defaultTab="profile"
            />
          )}

          {currentSection === 'team' && (
            <PortalProfile
              client={client}
              user={user}
              teamMembers={teamMembers}
              onRefresh={() => setRefreshTrigger((p) => p + 1)}
              defaultTab="team"
            />
          )}

          {currentSection === 'settings' && (
            <PortalProfile
              client={client}
              user={user}
              teamMembers={teamMembers}
              onRefresh={() => setRefreshTrigger((p) => p + 1)}
              defaultTab="security"
            />
          )}

          {currentSection === 'notifications' && (
            <PortalNotifications
              notifications={clientNotifications}
              onMarkRead={(id) => portalStore.markClientNotificationRead(id)}
              onMarkAllRead={() => portalStore.markAllClientNotificationsRead(client.id)}
              onNavigate={setCurrentSection}
            />
          )}
        </main>
      </div>
    </div>
  )
}
