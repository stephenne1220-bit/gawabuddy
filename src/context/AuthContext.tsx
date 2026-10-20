import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthValue = { session: Session | null; user: User | null; loading: boolean }
const AuthContext = createContext<AuthValue>({ session: null, user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => { if (!active) return; setSession(data.session); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => { if (event === 'SIGNED_OUT') queryClient.clear(); setSession(next); setLoading(false) })
    return () => { active = false; sub.subscription.unsubscribe() }
  }, [queryClient])
  const value = useMemo(() => ({ session, user: session?.user ?? null, loading }), [session, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)