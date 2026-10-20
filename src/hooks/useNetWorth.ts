import { useAccounts } from '@/hooks/useAccounts'
import { useDebts } from '@/hooks/useDebts'
import { useSavingsGoals } from '@/hooks/useSavings'

function useAccountsTotal() {
  const accounts = useAccounts()
  const list = (accounts.data ?? []) as { balance_cents?: unknown }[]
  const available = list.every((a) => a.balance_cents !== undefined && a.balance_cents !== null && Number.isFinite(Number(a.balance_cents)))
  const total = available ? list.reduce((s, a) => s + Number(a.balance_cents), 0) : 0
  return { total, available, isLoading: accounts.isLoading }
}

export function useNetWorth() {
  const acc = useAccountsTotal()
  const goals = useSavingsGoals()
  const debts = useDebts()
  const savings = (goals.data ?? []).reduce((s, g) => s + g.saved_cents, 0)
  const owed = (debts.data ?? []).reduce((s, d) => s + d.balance_cents, 0)
  return {
    isLoading: acc.isLoading || goals.isLoading || debts.isLoading,
    accountsAvailable: acc.available,
    accounts: acc.total,
    savings,
    debts: owed,
    total: acc.total + savings - owed,
  }
}