import { supabase } from '@/lib/supabase'

export interface ClickEvent {
  event_name: string
  element_id?: string
  section?: string
  metadata?: Record<string, any>
  page_url?: string
}

let sessionId: string = ''
if (typeof window !== 'undefined') {
  sessionId =
    sessionStorage.getItem('zh_session_id') ||
    'sess_' + Math.random().toString(36).substring(2, 10)
  sessionStorage.setItem('zh_session_id', sessionId)
}

/**
 * Tracks every user click or interaction live to Supabase `zhenbot_clicks` table
 */
export async function trackClick(
  eventName: string,
  options: {
    elementId?: string
    section?: string
    metadata?: Record<string, any>
  } = {}
) {
  try {
    const pageUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.hash : ''
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''

    // Asynchronously insert to Supabase
    await supabase.from('zhenbot_clicks').insert([
      {
        event_name: eventName,
        element_id: options.elementId || null,
        section: options.section || null,
        metadata: options.metadata || {},
        page_url: pageUrl,
        user_agent: userAgent,
        session_id: sessionId,
      },
    ])
  } catch (err) {
    // Non-blocking for offline or edge environments
    console.debug('Analytics click track skipped:', err)
  }
}

/**
 * Global click interceptor for data-analytics or automated click telemetry
 */
export function setupGlobalClickTracker() {
  if (typeof window === 'undefined') return

  window.addEventListener('click', (e) => {
    try {
      const target = (e.target as HTMLElement).closest('button, a, [data-track-click]') as HTMLElement | null
      if (!target) return

      const trackName =
        target.getAttribute('data-track-click') ||
        target.getAttribute('title') ||
        target.getAttribute('aria-label') ||
        target.innerText?.trim().substring(0, 40) ||
        target.tagName.toLowerCase()

      const section = target.closest('section, header, footer, aside, main')?.tagName.toLowerCase()

      trackClick('click_' + trackName.toLowerCase().replace(/[^a-z0-9_]/g, '_'), {
        elementId: target.id || undefined,
        section,
        metadata: {
          tag: target.tagName,
          href: target.getAttribute('href') || undefined,
          text: target.innerText?.trim().substring(0, 60),
        },
      })
    } catch {
      //
    }
  }, { passive: true })
}
