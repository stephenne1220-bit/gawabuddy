import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Debt = {
  id: string
  name: string
  lender: string | null
  total_cents: number
  interest_rate: number
  min_payment_cents: number
  due_date: string | null
  paid_cents: number
  balance_cents: number
  created_at: string
}

export type DebtPayment = { id: string; debt_id: string; amount_cents: number; date: string; note: string | null }

export function useDebts() {
  return useQuery({
    queryKey: ['debts', 'list'],
    queryFn: async (): Promise<Debt[]> => {
      const { data, error } = await supabase.from('debts_with_balance').select('*').order('created_at', { ascending: true })
      if (error) throw error
      return (data ?? []).map((d) => ({ ...d, total_cents: Number(d.total_cents), interest_rate: Number(d.interest_rate), min_payment_cents: Number(d.min_payment_cents), paid_cents: Number(d.paid_cents), balance_cents: Number(d.balance_cents) }))
    },
  })
}

export function useDebtPayments(debtId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['debts', 'payments', debtId], enabled,
    queryFn: async (): Promise<DebtPayment[]> => {
      const { data, error } = await supabase.from('debt_payments').select('id, debt_id, amount_cents, date, note').eq('debt_id', debtId).order('date', { ascending: false }).order('created_at', { ascending: false }).limit(100)
      if (error) throw error
      return (data ?? []).map((p) => ({ ...p, amount_cents: Number(p.amount_cents) }))
    },
  })
}

function useRefreshDebts() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: ['debts'] })
}

export function useAddDebt() {
  const refresh = useRefreshDebts()
  return useMutation({
    mutationFn: async (d: { name: string; lender: string | null; total_cents: number; interest_rate: number; min_payment_cents: number; due_date: string | null }) => {
      const { error } = await supabase.from('debts').insert(d)
      if (error) throw error
    },
    onSuccess: refresh,
  })
}

export function useDeleteDebt() {
  const refresh = useRefreshDebts()
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('debts').delete().eq('id', id); if (error) throw error },
    onSuccess: refresh,
  })
}

export function useAddPayment() {
  const refresh = useRefreshDebts()
  return useMutation({
    mutationFn: async (args: { payment: { debt_id: string; amount_cents: number; date: string; note: string | null }; nextDue?: string }): Promise<boolean> => {
      const { error } = await supabase.from('debt_payments').insert(args.payment)
      if (error) throw error
      if (args.nextDue) {
        const { error: e2 } = await supabase.from('debts').update({ due_date: args.nextDue }).eq('id', args.payment.debt_id)
        if (e2) return false
      }
      return true
    },
    onSuccess: refresh,
  })
}

export function useDeletePayment() {
  const refresh = useRefreshDebts()
  return useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from('debt_payments').delete().eq('id', id); if (error) throw error },
    onSuccess: refresh,
  })
}