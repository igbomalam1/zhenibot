import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { RequireAuth, PublicOnly } from '@/components/auth/Guards'
import { FullPageLoader } from '@/components/ui/Spinner'

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
import { LiveChatWidget } from '@/components/chat/LiveChatWidget'

function withSuspense(node: ReactNode) {
  return <Suspense fallback={<FullPageLoader />}>{node}</Suspense>
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={withSuspense(<Landing />)} />
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

            <Route path="/admin" element={withSuspense(<Admin />)} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <LiveChatWidget />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}