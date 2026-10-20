import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { currentMonthKey, shiftMonth } from '@/lib/budgetMath'

export type GoalType = 'emergency' | 'custom'
export type EntryType = 'deposit' | 'withdrawal'

export type SavingsGoal = {
  id: string
  name: string
  target_cents: number
  deadline: string | null
  type: GoalType
  saved_cents: number
  created_at: string
}

export type SavingsEntry = {
  id: string
  goal_id: string
  amount_cents: number
  type: EntryType
  date: string
  note: string | null
}

export function useSavingsGoals() {
  return useQuery({
    queryKey: ['savings', 'goals'],
    queryFn: async (): Promise<SavingsGoal[]> => {
      const { data, error } = await supabase.from('savings_goals_with_saved').select('*').order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((g) => ({ ...g, target_cents: Number(g.target_cents), saved_cents: Number(g.saved_cents) }))
    },
  })
}

export function useGoalEntries(goalId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['savings', 'entries', goalId], enabled,
    queryFn: async (): Promise<SavingsEntry[]> => {
      const { data, error } = await supabase.from('savings_entries').select('id, goal_id, amount_cents, type, date, note').eq('goal_id', goalId).order('date', { ascending: false }).order('created_at', { ascending: false }).limit(100)
      if (error) throw error
      return (data ?? []).map((e) => ({ ...e, amount_cents: Number(e.amount_cents) }))
    },
  })
}

export function useAvgExpenses(enabled: boolean) {
  return useQuery({
    queryKey: ['savings', 'avg-expenses'], enabled, staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<number> => {
      const to = currentMonthKey()
      const { data, error } = await supabase.rpc('avg_monthly_expenses', { p_from: shiftMonth(to, -3), p_to: to })
      if (error) throw error
      return Number(data ?? 0)
    },
  })
}

function useRefreshSavings() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['savings'] })
}

export function useAddGoal() {
  const refresh = useRefreshSavings()
  return useMutation({
    mutationFn: async (g: { name: string; target_cents: number; deadline: string | null; type: GoalType }) => {
      const { error } = await supabase.from('savings_goals').insert(g)
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useDeleteGoal() {
  const refresh = useRefreshSavings()
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('savings_goals').delete().eq('id', id); if (error) throw error },
    onSuccess: refresh,
  })
}

export function useAddEntry() {
  const refresh = useRefreshSavings()
  return useMutation({
    mutationFn: async (e: { goal_id: string; amount_cents: number; type: EntryType; date: string; note: string | null }) => {
      const { error } = await supabase.from('savings_entries').insert(e)
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useDeleteEntry() {
  const refresh = useRefreshSavings()
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('savings_entries').delete().eq('id', id); if (error) throw error },
    onSuccess: refresh,
  })
}