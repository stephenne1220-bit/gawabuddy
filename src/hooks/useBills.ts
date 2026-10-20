import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Frequency = 'weekly' | 'monthly' | 'yearly'
export type RecurringType = 'income' | 'expense'
export type RecurringItem = { id: string; name: string; type: RecurringType; amount_cents: number; frequency: Frequency; next_due: string; anchor_day: number; account_id: string; category_id: string | null; created_at: string }

export function useRecurringItems() {
  return useQuery({
    queryKey: ['bills', 'list'],
    queryFn: async (): Promise<RecurringItem[]> => {
      const { data, error } = await supabase.from('recurring_items').select('*').order('next_due', { ascending: true })
      if (error) throw error
      return (data ?? []).map((i) => ({ ...i, amount_cents: Number(i.amount_cents), anchor_day: Number(i.anchor_day) }))
    },
  })
}

export function useAddRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (item: { name: string; type: RecurringType; amount_cents: number; frequency: Frequency; next_due: string; anchor_day: number; account_id: string; category_id: string | null }) => {
      const { error } = await supabase.from('recurring_items').insert(item)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bills'] }),
  })
}

export function useDeleteRecurring() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('recurring_items').delete().eq('id', id); if (error) throw error },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bills'] }),
  })
}

export function useMarkPaid() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (a: { id: string; paidOn: string; amount: number | null }) => {
      const { data, error } = await supabase.rpc('mark_recurring_paid', { p_item: a.id, p_paid_on: a.paidOn, p_amount: a.amount })
      if (error) throw error
      return data as string
    },
    onSuccess: () => qc.invalidateQueries(),
  })
}