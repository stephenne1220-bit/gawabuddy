import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import type { Account } from '@/lib/types'

export function useAccounts() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['accounts'],
    enabled: !!user,
    queryFn: async (): Promise<Account[]> => {
      // Query the actual table, not the view
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: true })
      
      if (error) throw error
      
      // We need to manually calculate balance_cents since we are not using the view
      return (data ?? []).map(
        (a) =>
          ({
            ...a,
            opening_balance: Number(a.opening_balance),
            balance_cents: Number(a.opening_balance), // default to opening balance for now
          }) as Account,
      )
    },
  })
}