import { useState } from 'react'
import { Plus } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { useDebts } from '@/hooks/useDebts'
import { AddDebtSheet } from './AddDebtSheet'
import { DebtCard } from './DebtCard'
import { DebtPlanner } from './DebtPlanner'

export function DebtsPanel() {
  const { data, isLoading, error } = useDebts()
  const [adding, setAdding] = useState(false)
  const debts = [...(data ?? [])].sort((a, b) => Number(a.balance_cents === 0) - Number(b.balance_cents === 0))
  const active = debts.filter((d) => d.balance_cents > 0)
  const totalBalance = active.reduce((s, d) => s + d.balance_cents, 0)
  const totalMin = active.reduce((s, d) => s + d.min_payment_cents, 0)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-base font-semibold text-[#0B3D2E]">Debts</h2><button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1 rounded-full bg-[#D4A017] px-3 py-1.5 text-xs font-semibold text-[#0B3D2E]"><Plus size={14} /> Add debt</button></div>
      {error && (<p className="rounded-xl bg-[#C0392B]/10 p-3 text-sm text-[#C0392B]">Could not load your debts.</p>)}
      {isLoading ? (
        <div className="space-y-3"><div className="h-44 animate-pulse rounded-2xl bg-white/70" /><div className="h-44 animate-pulse rounded-2xl bg-white/70" /></div>
      ) : debts.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm"><p className="text-sm font-semibold text-[#0B3D2E]">No debts tracked</p><p className="mt-1 text-xs text-[#6B7280]">Add loans or balances you owe to track payoff and compare repayment strategies.</p><button type="button" onClick={() => setAdding(true)} className="mt-4 rounded-xl bg-[#0B3D2E] px-4 py-2.5 text-sm font-semibold text-white">Add your first debt</button></div>
      ) : (
        <>
          {active.length > 0 && (<div className="rounded-2xl bg-[#0B3D2E] p-4 text-white shadow-sm"><p className="text-xs text-white/70">Total owed</p><p className="text-2xl font-semibold tabular-nums">{formatMoney(totalBalance)}</p>{totalMin > 0 && (<p className="mt-1 text-xs text-white/70">{formatMoney(totalMin)} in minimum payments per month</p>)}</div>)}
          {debts.map((d) => (<DebtCard key={d.id} debt={d} />))}
          {active.length > 0 && <DebtPlanner debts={debts} />}
        </>
      )}
      <AddDebtSheet open={adding} onOpenChange={setAdding} />
    </section>
  )
}