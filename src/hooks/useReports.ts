import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { MonthRow } from '@/lib/reportMath'

export function useIncomeExpense(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'income-expense', from, to],
    queryFn: async (): Promise<MonthRow[]> => {
      const { data, error } = await supabase.rpc('income_expense_by_month', { p_from: from, p_to: to })
      if (error) throw error
      return (data ?? []).map((r: { month: string; income_cents: number; expense_cents: number }) => ({
        month: r.month,
        income: Number(r.income_cents),
        expense: Number(r.expense_cents),
      }))
    },
  })
}

export function useCategoryBreakdown(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'categories', from, to],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('expense_by_category', { p_from: from, p_to: to })
      if (error) throw error
      return (data ?? []).map((r: { category_id: string | null; total_cents: number }) => ({
        category_id: r.category_id,
        total_cents: Number(r.total_cents),
      }))
    },
  })
}

export type TxExportRow = Record<string, unknown>

export async function fetchAllTransactions(range?: { from: string; to: string }) {
  const PAGE = 1000
  const out: TxExportRow[] = []
  for (let start = 0; ; start += PAGE) {
    let q = supabase.from('transactions').select('*').order('date', { ascending: true }).order('id', { ascending: true }).range(start, start + PAGE - 1)
    if (range) q = q.gte('date', range.from).lt('date', range.to)
    const { data, error } = await q
    if (error) throw error
    out.push(...((data ?? []) as TxExportRow[]))
    if (!data || data.length < PAGE) break
  }
  return out
}