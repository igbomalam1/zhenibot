import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, TABLE } from '@/lib/supabase'
import type { ZhenbotUser } from '@/types/database'

interface SignUpParams {
  fullName: string
  email: string
  password: string
  referralCode?: string
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: ZhenbotUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (params: SignUpParams) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ZhenbotUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    // Proactively settle any matured 24h dividend cycles for users
    try {
      await supabase.rpc('zhenbot_credit_daily_dividends')
    } catch {
      // background settling fallback
    }

    const { data, error } = await supabase
      .from(TABLE.users)
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('[zhenbot] Failed to load profile', error.message)
      return
    }

    if (data) {
      setProfile(data as ZhenbotUser)
    } else {
      setProfile(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (session) {
      await fetchProfile(session.user.id)
    }
  }, [session, fetchProfile])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      if (data.session?.user.id) {
        void fetchProfile(data.session.user.id)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      if (nextSession?.user.id) {
        void fetchProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async ({ fullName, email, password, referralCode }: SignUpParams) => {
    let referrerId: string | null = null

    if (referralCode?.trim()) {
      const { data } = await supabase
        .from(TABLE.users)
        .select('id')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle()
      referrerId = (data?.id as string | undefined) ?? null
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          referral_code: referralCode?.trim().toUpperCase() ?? null,
          referrer_id: referrerId,
        },
      },
    })

    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading, signIn, signUp, signOut, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
