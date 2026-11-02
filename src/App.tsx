import { lazy, Suspense, useEffect } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { RequireAuth, PublicOnly } from '@/components/auth/Guards'
import { FullPageLoader } from '@/components/ui/Spinner'
import { businessStore } from '@/lib/businessStore'
import { portalStore } from '@/lib/portalStore'
import { initEmailHeaderConfig } from '@/lib/sendbyte'

const Landing = lazy(() => import('@/pages/Landing').then((m) => ({ default: m.Landing })))
const Auth = lazy(() => import('@/pages/Auth').then((m) => ({ default: m.Auth })))
const DashboardLayout = lazy(() =>
  import('@/layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })),
)
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Deposit = lazy(() => import('@/pages/Deposit').then((m) => ({ default: m.Deposit })))
const Withdraw = lazy(() => import('@/pages/Withdraw').then((m) => ({ default: m.Withdraw })))
const Referrals = lazy(() =>
  import('@/pages/Referrals').then((m) => ({ default: m.Referrals })),
)
const HistoryPage = lazy(() => import('@/pages/History').then((m) => ({ default: m.HistoryPage })))
const Admin = lazy(() => import('@/pages/Admin').then((m) => ({ default: m.AdminDashboard })))

// Client Portal Pages
const ClientPortal = lazy(() =>
  import('@/pages/portal/ClientPortal').then((m) => ({ default: m.ClientPortal }))
)
const PortalLogin = lazy(() =>
  import('@/pages/portal/PortalLogin').then((m) => ({ default: m.PortalLogin }))
)
const PortalActivate = lazy(() =>
  import('@/pages/portal/PortalActivate').then((m) => ({ default: m.PortalActivate }))
)

import { LiveChatWidget } from '@/components/chat/LiveChatWidget'

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<FullPageLoader />}>{node}</Suspense>
}

export default function App() {
  useEffect(() => {
    // Two-way synchronization with Supabase production database
    void businessStore.initSupabaseSync()
    void portalStore.initPortalSupabaseSync()
    void initEmailHeaderConfig()
  }, [])

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* 1. Public Website */}
            <Route path="/" element={withSuspense(<Landing />)} />

            {/* 2. Dashboard Workspace & Sign In */}
            <Route path="/portal" element={withSuspense(<ClientPortal />)} />
            <Route path="/portal/login" element={withSuspense(<PortalLogin />)} />
            <Route path="/login" element={withSuspense(<PortalLogin />)} />
            <Route path="/signin" element={withSuspense(<PortalLogin />)} />
            <Route path="/portal/activate" element={withSuspense(<PortalActivate />)} />

            {/* 3. Auth & Legacy User Routes */}
            <Route
              path="/auth"
              element={
                <PublicOnly>{withSuspense(<Auth />)}</PublicOnly>
              }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  {withSuspense(<DashboardLayout />)}
                </RequireAuth>
              }
            >
              <Route index element={withSuspense(<Dashboard />)} />
              <Route path="deposit" element={withSuspense(<Deposit />)} />
              <Route path="withdraw" element={withSuspense(<Withdraw />)} />
              <Route path="referrals" element={withSuspense(<Referrals />)} />
              <Route path="history" element={withSuspense(<HistoryPage />)} />
            </Route>

            {/* 4. Admin Management Platform */}
            <Route path="/admin" element={withSuspense(<Admin />)} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <LiveChatWidget />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
