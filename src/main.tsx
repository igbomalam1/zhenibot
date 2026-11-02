import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupGlobalClickTracker } from '@/lib/analytics'

// Initialize real-time user interaction & click stream to Supabase db
setupGlobalClickTracker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
