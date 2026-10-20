import { Landmark, PiggyBank, Smartphone, Wallet, type LucideIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAccounts } from '@/hooks/useAccounts'
import { formatMoney } from '@/lib/money'
import type { AccountType } from '@/lib/types'

const ICONS: Record<AccountType, LucideIcon> = {
  cash: Wallet,
  mpesa: Smartphone,
  bank: Landmark,
  savings: PiggyBank,
}

export function AccountBalances() {
  const { data, isLoading, isError } = useAccounts()
  const total = (data ?? []).reduce((s, a) => s + a.balance_cents, 0)

  return (
    <section className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-[#0B3D2E]">Accounts</h2>

      {isLoading ? (
        <div className="mt-3 space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 rounded-xl bg-[#E9E4D4]" />
          ))}
        </div>
      ) : isError ? (
        <p className="mt-3 text-xs text-[#C0392B]">Could not load your accounts.</p>
      ) : (data ?? []).length === 0 ? (
        <p className="mt-3 text-xs text-[#6B7280]">No accounts yet.</p>
      ) : (
        <>
          <p className="mt-1 text-xs text-[#6B7280]">Total across accounts</p>
          <p className="text-2xl font-bold tabular-nums text-[#0B3D2E]">{formatMoney(total)}</p>
          <ul className="mt-2 divide-y divide-[#F1ECDC]">
            {data!.map((a) => {
              const Icon = ICONS[a.type] ?? Wallet
              return (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E]">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#1F2937]">{a.name}</span>
                  <span
                    className={`shrink-0 text-sm font-bold tabular-nums ${
                      a.balance_cents < 0 ? 'text-[#C0392B]' : 'text-[#1F2937]'
                    }`}
                  >
                    {formatMoney(a.balance_cents)}
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}