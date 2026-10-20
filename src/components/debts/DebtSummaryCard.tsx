import { Link } from 'react-router-dom'
import { formatMoney } from '@/lib/money'
import { savedPct } from '@/lib/savingsMath'
import { dueInfo } from '@/lib/debtMath'
import { useDebts } from '@/hooks/useDebts'

export function DebtSummaryCard() {
  const { data, isLoading } = useDebts()
  if (isLoading) return <div className="h-28 animate-pulse rounded-2xl bg-white/70" />
  if (!data || data.length === 0) return null
  const active = data.filter((d) => d.balance_cents > 0)
  if (active.length === 0) {
    return (<Link to="/goals?tab=debts" className="block rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm"><p className="text-sm font-semibold text-[#0B3D2E]">Debts</p><p className="mt-1 text-xs font-semibold text-[#1E8E3E]">All debts paid off. You are debt free.</p></Link>)
  }
  const balance = active.reduce((s, d) => s + d.balance_cents, 0)
  const minPay = active.reduce((s, d) => s + d.min_payment_cents, 0)
  const paid = data.reduce((s, d) => s + d.paid_cents, 0)
  const total = data.reduce((s, d) => s + d.total_cents, 0)
  const pct = savedPct(paid, total)
  const next = active.filter((d) => d.due_date).sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))[0]
  const nextInfo = next ? dueInfo(next.due_date, next.balance_cents) : null

  return (
    <Link to="/goals?tab=debts" className="block rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between"><p className="text-sm font-semibold text-[#0B3D2E]">Debts</p><span className="text-xs text-[#6B7280]">{active.length} active · {Math.floor(pct)}% paid</span></div>
      <p className="mt-2 text-xl font-semibold tabular-nums text-[#C0392B]">{formatMoney(balance)}</p>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E9E4D4]"><div className="h-full rounded-full bg-[#D4A017]" style={{ width: `${pct}%` }} /></div>
      <div className="mt-2 flex items-center justify-between text-xs text-[#6B7280]">{minPay > 0 ? <span>{formatMoney(minPay)} / month minimum</span> : <span />}{next && nextInfo && (<span className={nextInfo.tone === 'overdue' ? 'font-semibold text-[#C0392B]' : ''}>{next.name}: {nextInfo.label.toLowerCase()}</span>)}</div>
    </Link>
  )
}