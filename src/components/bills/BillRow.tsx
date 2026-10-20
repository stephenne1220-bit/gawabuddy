import { toast } from 'sonner'
import { formatMoney } from '@/lib/money'
import { billStatus, frequencyLabel } from '@/lib/billMath'
import { RecurringItem, useDeleteRecurring } from '@/hooks/useBills'
const TONE = { overdue: 'bg-[#C0392B]/10 text-[#C0392B]', soon: 'bg-[#F59E0B]/15 text-[#B45309]', later: 'bg-[#F1ECDC] text-[#6B7280]' } as const
type Props = { item: RecurringItem; dueDate?: string; projected?: boolean; onPay?: (item: RecurringItem) => void }
export function BillRow({ item, dueDate, projected = false, onPay }: Props) {
  const del = useDeleteRecurring(); const status = billStatus(dueDate ?? item.next_due); const income = item.type === 'income'
  function remove() {
    if (!confirm(`Delete "${item.name}"? Past transactions stay.`)) return
    del.mutate(item.id, { onSuccess: () => toast.success('Bill deleted'), onError: () => toast.error('Could not delete the bill.') })
  }
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><h3 className="truncate text-sm font-semibold text-[#1F2937]">{item.name}</h3><p className="text-xs text-[#6B7280]">{frequencyLabel(item.frequency)}{income && ' · Income'}</p></div>
        <p className="shrink-0 text-base font-semibold tabular-nums" style={{ color: income ? '#1E8E3E' : '#1F2937' }}>{income ? '+' : ''}{formatMoney(item.amount_cents)}</p>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONE[status.tone]}`}>{projected ? `Upcoming · ${status.label.replace(/^Due /, '')}` : status.label}</span>
        {!projected && (
          <div className="flex items-center gap-3">
            <button type="button" onClick={remove} className="text-xs font-medium text-[#C0392B]">Delete</button>
            {onPay && (<button type="button" onClick={() => onPay(item)} className="rounded-xl bg-[#0B3D2E] px-3 py-2 text-xs font-semibold text-white">{income ? 'Mark as Received' : 'Mark as Paid'}</button>)}
          </div>
        )}
      </div>
    </div>
  )
}