import { useState } from 'react'
import { Plus } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { billStatus } from '@/lib/billMath'
import { RecurringItem, useRecurringItems } from '@/hooks/useBills'
import { AddBillSheet } from '@/components/bills/AddBillSheet'
import { BillRow } from '@/components/bills/BillRow'
import { BillsCalendar } from '@/components/bills/BillsCalendar'
import { MarkPaidSheet } from '@/components/bills/MarkPaidSheet'

type View = 'list' | 'calendar'

export default function Bills() {
  const { data, isLoading, error } = useRecurringItems()
  const [view, setView] = useState<View>('list')
  const [adding, setAdding] = useState(false)
  const [paying, setPaying] = useState<RecurringItem | null>(null)

  const items = data ?? []
  const withStatus = items.map((i) => ({ item: i, status: billStatus(i.next_due) }))
  const overdue = withStatus.filter((x) => x.status.tone === 'overdue')
  const soon = withStatus.filter((x) => x.status.tone === 'soon')
  const later = withStatus.filter((x) => x.status.tone === 'later')

  const sum = (list: typeof withStatus) =>
    list.filter((x) => x.item.type === 'expense').reduce((s, x) => s + x.item.amount_cents, 0)

  const section = (title: string, list: typeof withStatus, tone?: string) =>
    list.length > 0 && (
      <section className="space-y-2">
        <h2 className="text-sm font-semibold" style={{ color: tone ?? '#0B3D2E' }}>
          {title} ({list.length})
        </h2>
        {list.map(({ item }) => (
          <BillRow key={item.id} item={item} onPay={setPaying} />
        ))}
      </section>
    )

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-[#0B3D2E]">Bills</h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 rounded-full bg-[#D4A017] px-3 py-1.5 text-xs font-semibold text-[#0B3D2E]"
        >
          <Plus size={14} /> Add bill
        </button>
      </div>

      <div className="flex rounded-full bg-[#E9E4D4] p-1">
        {(['list', 'calendar'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-colors ${
              view === v ? 'bg-[#0B3D2E] text-white' : 'text-[#374151]'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-[#C0392B]/10 p-3 text-sm text-[#C0392B]">
          Could not load your bills.
        </p>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-white/70" />
          <div className="h-24 animate-pulse rounded-2xl bg-white/70" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#0B3D2E]">No bills yet</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Add rent, subscriptions, loan repayments or your salary so you never miss
            a due date.
          </p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-4 rounded-xl bg-[#0B3D2E] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Add your first bill
          </button>
        </div>
      ) : view === 'calendar' ? (
        <BillsCalendar items={items} onPay={setPaying} />
      ) : (
        <>
          <div className="rounded-2xl bg-[#0B3D2E] p-4 text-white shadow-sm">
            <p className="text-xs text-white/70">Due in the next 7 days</p>
            <p className="text-2xl font-semibold tabular-nums">{formatMoney(sum(soon))}</p>
            {overdue.length > 0 && (
              <p className="mt-1 text-xs text-[#F5B7AE]">
                {overdue.length} overdue · {formatMoney(sum(overdue))}
              </p>
            )}
          </div>
          {section('Overdue', overdue, '#C0392B')}
          {section('Next 7 days', soon)}
          {section('Later', later)}
        </>
      )}

      <AddBillSheet open={adding} onOpenChange={setAdding} />
      <MarkPaidSheet item={paying} onOpenChange={(o) => !o && setPaying(null)} />
    </div>
  )
}