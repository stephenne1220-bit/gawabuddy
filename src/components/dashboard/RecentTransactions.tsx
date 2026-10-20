import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { EmptyState } from '@/components/app/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionRow } from '@/components/transactions/TransactionRow'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useRecentTransactions } from '@/hooks/useTransactions'

export function RecentTransactions() {
  const recent = useRecentTransactions(5)
  const accounts = useAccounts().data ?? []
  const categories = useCategories().data ?? []

  const accountName = useMemo(() => new Map(accounts.map((a) => [a.id, a.name])), [accounts])
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  return (
    <section className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#0B3D2E]">Recent transactions</h2>
        <Link to="/transactions" className="text-xs font-semibold text-[#0B3D2E] underline">View all</Link>
      </div>
      {recent.isLoading ? (
        <div className="mt-3 space-y-2">
          {[0, 1, 2].map((i) => (<Skeleton key={i} className="h-12 rounded-xl bg-[#E9E4D4]" />))}
        </div>
      ) : recent.isError ? (
        <p className="mt-3 text-xs text-[#C0392B]">Could not load transactions.</p>
      ) : (recent.data ?? []).length === 0 ? (
        <div className="mt-3">
          <EmptyState icon={Receipt} title="Nothing here yet" text="Tap the gold plus button to add your first transaction." />
        </div>
      ) : (
        <ul className="mt-1 divide-y divide-[#F1ECDC]">
          {recent.data!.map((tx) => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              category={tx.category_id ? categoryById.get(tx.category_id) : undefined}
              accountName={accountName.get(tx.account_id) ?? 'Account'}
              toAccountName={tx.transfer_to_account_id ? accountName.get(tx.transfer_to_account_id) : undefined}
            />
          ))}
        </ul>
      )}
    </section>
  )
}