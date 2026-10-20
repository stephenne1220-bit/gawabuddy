import { useEffect, useMemo, useState } from 'react'
import { Receipt, Search, SlidersHorizontal, X } from 'lucide-react'
import { EmptyState } from '@/components/app/EmptyState'
import { PageHeader } from '@/components/app/PageHeader'
import { Skeleton } from '@/components/ui/skeleton'
import { AddSheet } from '@/components/transactions/AddSheet'
import { RowActionsSheet } from '@/components/transactions/RowActionsSheet'
import { TransactionRow } from '@/components/transactions/TransactionRow'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { useDebounced } from '@/hooks/useDebounced'
import { EMPTY_FILTERS, countFilters, useTransactions, type TxFilters } from '@/hooks/useTransactions'
import { monthKey, monthLabel } from '@/lib/dates'
import type { Transaction } from '@/lib/types'

export default function Transactions() {
  const [filters, setFilters] = useState<TxFilters>(EMPTY_FILTERS)
  const [searchText, setSearchText] = useState('')
  const [menuTx, setMenuTx] = useState<Transaction | null>(null)
  const [editTx, setEditTx] = useState<Transaction | null>(null)

  const debounced = useDebounced(searchText)
  useEffect(() => {
    setFilters((f) => (f.search === debounced ? f : { ...f, search: debounced }))
  }, [debounced])

  const accounts = useAccounts().data ?? []
  const categories = useCategories().data ?? []
  const list = useTransactions(filters)

  const accountName = useMemo(() => new Map(accounts.map((a) => [a.id, a.name])), [accounts])
  const categoryById = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const groups = useMemo(() => {
    const rows = list.data?.pages.flat() ?? []
    const out: { key: string; label: string; rows: Transaction[] }[] = []
    for (const tx of rows) {
      const key = monthKey(new Date(`${tx.date}T00:00:00`))
      const last = out[out.length - 1]
      if (last && last.key === key) last.rows.push(tx)
      else out.push({ key, label: monthLabel(key), rows: [tx] })
    }
    return out
  }, [list.data])

  const active = countFilters(filters)
  const filtering = active > 0 || filters.search.trim() !== ''

  function clearAll() {
    setSearchText('')
    setFilters(EMPTY_FILTERS)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <PageHeader title="Transactions" />

      <div className="flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Search transactions</span>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
          <input
            type="search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search merchant or note"
            className="h-11 w-full rounded-xl border border-[#CFC8B0] bg-white pl-9 pr-9 text-base text-[#1F2937] outline-none focus:border-[#D4A017]"
          />
          {searchText && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchText('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#6B7280]"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </label>
      </div>

      {list.isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-2xl bg-[#E9E4D4]" />
          ))}
        </div>
      ) : list.isError ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#C0392B]">Could not load your transactions</p>
          <button
            type="button"
            onClick={() => void list.refetch()}
            className="mt-3 rounded-xl bg-[#0B3D2E] px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : groups.length === 0 ? (
        filtering ? (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#0B3D2E]">No matches</p>
            <p className="mt-1 text-xs text-[#6B7280]">Try different words or clear the filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 rounded-xl border border-[#CFC8B0] px-4 py-2 text-sm font-semibold text-[#374151]"
            >
              Clear search and filters
            </button>
          </div>
        ) : (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            text="Tap the gold plus button to add your first expense or income."
          />
        )
      ) : (
        <>
          {groups.map((g) => (
            <section key={g.key} aria-label={g.label}>
              <h2 className="mb-1 px-1 text-sm font-semibold text-[#0B3D2E]">{g.label}</h2>
              <ul className="divide-y divide-[#F1ECDC] rounded-2xl border border-[#EFEAD8] bg-white px-4 shadow-sm">
                {g.rows.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    category={tx.category_id ? categoryById.get(tx.category_id) : undefined}
                    accountName={accountName.get(tx.account_id) ?? 'Account'}
                    toAccountName={tx.transfer_to_account_id ? accountName.get(tx.transfer_to_account_id) : undefined}
                    onMenu={setMenuTx}
                  />
                ))}
              </ul>
            </section>
          ))}

          {list.hasNextPage && (
            <button
              type="button"
              disabled={list.isFetchingNextPage}
              onClick={() => void list.fetchNextPage()}
              className="w-full rounded-xl border border-[#CFC8B0] bg-white py-3 text-sm font-semibold text-[#374151] disabled:opacity-50"
            >
              {list.isFetchingNextPage ? 'Loading…' : 'Load more'}
            </button>
          )}
        </>
      )}

      <RowActionsSheet
        tx={menuTx}
        onClose={() => setMenuTx(null)}
        onEdit={(tx) => {
          setMenuTx(null)
          setEditTx(tx)
        }}
      />
      <AddSheet open={editTx !== null} onOpenChange={(o) => !o && setEditTx(null)} editing={editTx} />
    </div>
  )
}