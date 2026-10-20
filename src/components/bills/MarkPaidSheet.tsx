import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatMoney } from '@/lib/money'
import { parseAmountToCents } from '@/lib/budgetMath'
import { formatDay, todayKey } from '@/lib/savingsMath'
import { RecurringItem, useMarkPaid } from '@/hooks/useBills'
type Props = { item: RecurringItem | null; onOpenChange: (open: boolean) => void }
const FIELD = 'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'
export function MarkPaidSheet({ item, onOpenChange }: Props) {
  const income = item?.type === 'income'
  return (
    <Sheet open={item !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">{income ? 'Received' : 'Pay'} {item?.name}</SheetTitle></SheetHeader>
        {item && <PaidForm item={item} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}
function PaidForm({ item, onDone }: { item: RecurringItem; onDone: () => void }) {
  const mark = useMarkPaid(); const income = item.type === 'income'
  const [amount, setAmount] = useState(String(item.amount_cents / 100)); const [date, setDate] = useState(todayKey())
  function submit() {
    const cents = parseAmountToCents(amount)
    if (!cents) return toast.error('Enter an amount above zero.')
    mark.mutate({ id: item.id, paidOn: date || todayKey(), amount: cents === item.amount_cents ? null : cents }, {
      onSuccess: (nextDue) => { toast.success(`Saved. Next due ${formatDay(nextDue)}.`); onDone() },
      onError: () => toast.error('Could not save. Try again.'),
    })
  }
  return (
    <div className="mt-4 space-y-4">
      <p className="text-xs text-[#6B7280]">Usual amount: {formatMoney(item.amount_cents)}. A {income ? 'income' : 'expense'} transaction is added to your account and the due date moves forward.</p>
      <label className="block text-xs font-medium text-[#6B7280]">Amount (KES)<input autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={FIELD} /></label>
      <button type="button" disabled={mark.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{mark.isPending ? 'Saving…' : income ? 'Mark as Received' : 'Mark as Paid'}</button>
    </div>
  )
}