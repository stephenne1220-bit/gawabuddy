import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type MonthTotals = { income: number; spent: number; saved: number }
export type CategorySpend = { category_id: string | null; total: number }

export function useMonthTotals(from: string, to: string) {
  return useQuery({
    queryKey: ['dashboard', 'totals', from, to],
    queryFn: async (): Promise<MonthTotals> => {
      const { data, error } = await supabase.rpc('month_totals', { p_from: from, p_to: to })
      if (error) throw error
      const row = (data ?? [])[0]
      return {
        income: Number(row?.income_cents ?? 0),
        spent: Number(row?.spent_cents ?? 0),
        saved: Number(row?.saved_cents ?? 0),
      }
    },
  })
}

export function useSpendingByCategory(from: string, to: string) {
  return useQuery({
    queryKey: ['dashboard', 'by-category', from, to],
    queryFn: async (): Promise<CategorySpend[]> => {
      const { data, error } = await supabase.rpc('month_spending_by_category', {
        p_from: from,
        p_to: to,
      })
      if (error) throw error
      return (data ?? []).map((r: { category_id: string | null; total_cents: number }) => ({
        category_id: r.category_id,
        total: Number(r.total_cents),
      }))
    },
  })
}