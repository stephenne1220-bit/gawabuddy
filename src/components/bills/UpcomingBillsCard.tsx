import { Link } from 'react-router-dom'
import { formatMoney } from '@/lib/money'
import { billStatus } from '@/lib/billMath'
import { useRecurringItems } from '@/hooks/useBills'
const MAX_SHOWN = 4
export function UpcomingBillsCard() {
  const { data, isLoading } = useRecurringItems()
  if (isLoading) return <div className="h-28 animate-pulse rounded-2xl bg-white/70" />
  const items = data ?? []
  if (items.length === 0) return (<Link to="/bills" className="block rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm"><p className="text-sm font-semibold text-[#0B3D2E]">Upcoming bills</p><p className="mt-1 text-xs text-[#6B7280]">No bills yet. Tap to add rent, subscriptions and other regular payments.</p></Link>)
  const due = items.map((i) => ({ item: i, status: billStatus(i.next_due) })).filter((x) => x.status.days <= 7).sort((a, b) => a.item.next_due.localeCompare(b.item.next_due))
  const toPay = due.filter((x) => x.item.type === 'expense').reduce((s, x) => s + x.item.amount_cents, 0)
  const overdueCount = due.filter((x) => x.status.tone === 'overdue').length
  return (
    <Link to="/bills" className="block rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-baseline justify-between"><p className="text-sm font-semibold text-[#0B3D2E]">Upcoming bills</p>{overdueCount > 0 && (<span className="rounded-full bg-[#C0392B]/10 px-2 py-0.5 text-[11px] font-semibold text-[#C0392B]">{overdueCount} overdue</span>)}</div>
      {due.length === 0 ? (<p className="mt-2 text-xs text-[#6B7280]">Nothing due in the next 7 days.</p>) : (
        <>
          {toPay > 0 && (<p className="mt-2 text-xl font-semibold tabular-nums text-[#0B3D2E]">{formatMoney(toPay)}<span className="ml-1 text-xs font-normal text-[#6B7280]">to pay</span></p>)}
          <ul className="mt-2 divide-y divide-[#F1ECDC]">
            {due.slice(0, MAX_SHOWN).map(({ item, status }) => (
              <li key={item.id} className="flex items-center justify-between py-2"><div className="min-w-0 pr-2"><p className="truncate text-xs font-medium text-[#1F2937]">{item.name}</p><p className="text-[11px]" style={{ color: status.tone === 'overdue' ? '#C0392B' : '#6B7280' }}>{status.label}</p></div><span className="shrink-0 text-xs font-semibold tabular-nums" style={{ color: item.type === 'income' ? '#1E8E3E' : '#1F2937' }}>{item.type === 'income' ? '+' : ''}{formatMoney(item.amount_cents)}</span></li>
            ))}
          </ul>
          {due.length > MAX_SHOWN && (<p className="mt-1 text-xs text-[#6B7280]">+{due.length - MAX_SHOWN} more</p>)}
        </>
      )}
    </Link>
  )
}