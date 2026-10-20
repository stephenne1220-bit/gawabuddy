import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { GroupKey } from '@/lib/budgetMath'

const CATEGORY_DEFAULTS: Record<string, unknown> = {}
const ACCOUNT_DEFAULTS: Record<string, unknown> = {}

async function userId() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('You are signed out. Sign in again.')
  return data.user.id
}

export async function countTx(column: 'category_id' | 'account_id', id: string) {
  const { count, error } = await supabase.from('transactions').select('id', { count: 'exact', head: true }).eq(column, id)
  if (error) throw error
  return count ?? 0
}

export function useTxCount(column: 'category_id' | 'account_id', id: string | null) {
  return useQuery({
    queryKey: ['manage', 'tx-count', column, id],
    enabled: !!id,
    staleTime: 0,
    queryFn: () => countTx(column, id as string),
  })
}

function useRefreshAll() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries()
}

export function useSaveCategory() {
  const refresh = useRefreshAll()
  return useMutation({
    mutationFn: async (c: { id?: string; name: string; budget_group: GroupKey | null }) => {
      if (c.id) {
        const { error } = await supabase.from('categories').update({ name: c.name, budget_group: c.budget_group }).eq('id', c.id)
        if (error) throw error
        return
      }
      const { error } = await supabase.from('categories').insert({ ...CATEGORY_DEFAULTS, user_id: await userId(), name: c.name, budget_group: c.budget_group })
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useDeleteCategory() {
  const refresh = useRefreshAll()
  return useMutation({
    mutationFn: async (a: { id: string; moveTo?: string }) => {
      if (a.moveTo) {
        const { error } = await supabase.from('transactions').update({ category_id: a.moveTo }).eq('category_id', a.id)
        if (error) throw error
      }
      const { error } = await supabase.from('categories').delete().eq('id', a.id)
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useSaveAccount() {
  const refresh = useRefreshAll()
  return useMutation({
    mutationFn: async (a: { id?: string; name: string }) => {
      if (a.id) {
        const { error } = await supabase.from('accounts').update({ name: a.name }).eq('id', a.id)
        if (error) throw error
        return
      }
      const { error } = await supabase.from('accounts').insert({ ...ACCOUNT_DEFAULTS, user_id: await userId(), name: a.name })
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useDeleteAccount() {
  const refresh = useRefreshAll()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error: e1 } = await supabase.from('transactions').delete().eq('account_id', id)
      if (e1) throw e1
      const { error: e2 } = await supabase.from('accounts').delete().eq('id', id)
      if (e2) throw e2
    },
    onSuccess: refresh,
  })
}