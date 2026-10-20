import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatMoney } from '@/lib/money'
import { parseAmountToCents } from '@/lib/budgetMath'
import { todayKey } from '@/lib/savingsMath'
import { Debt, useAddPayment } from '@/hooks/useDebts'

type Props = { debt: Debt; open: boolean; onOpenChange: (open: boolean) => void }

const FIELD = 'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'

export function DebtPaymentSheet({ debt, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] px-6 pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">Pay {debt.name}</SheetTitle></SheetHeader>
        {open && <PaymentForm debt={debt} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

function PaymentForm({ debt, onDone }: { debt: Debt; onDone: () => void }) {
  const add = useAddPayment()
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayKey())
  const [note, setNote] = useState('')
  const [nextDue, setNextDue] = useState(debt.due_date ?? '')
  const minToPay = Math.min(debt.min_payment_cents, debt.balance_cents)

  function submit() {
    const cents = parseAmountToCents(amount)
    if (!cents) return toast.error('Enter an amount above zero.')
    if (cents > debt.balance_cents) return toast.error(`That is more than the remaining balance (${formatMoney(debt.balance_cents)}).`)
    const dueChanged = nextDue && nextDue !== (debt.due_date ?? '')
    add.mutate({ payment: { debt_id: debt.id, amount_cents: cents, date: date || todayKey(), note: note.trim() || null }, nextDue: dueChanged ? nextDue : undefined }, {
      onSuccess: (dueUpdated) => { if (dueUpdated) toast.success('Payment saved'); else toast.warning('Payment saved, but the due date could not be updated.'); onDone() },
      onError: () => toast.error('Could not save the payment. Try again.'),
    })
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xs text-[#6B7280]">Remaining balance: {formatMoney(debt.balance_cents)}</p>
      <label className="block text-xs font-medium text-[#6B7280]">Amount (KES)<input autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={FIELD} /></label>
      <div className="flex gap-2">
        {minToPay > 0 && (<button type="button" onClick={() => setAmount(String(minToPay / 100))} className="rounded-full border border-[#D4A017] bg-[#D4A017]/10 px-3 py-1.5 text-xs font-semibold text-[#0B3D2E]">Minimum · {formatMoney(minToPay)}</button>)}
        <button type="button" onClick={() => setAmount(String(debt.balance_cents / 100))} className="rounded-full border border-[#CFC8B0] px-3 py-1.5 text-xs font-semibold text-[#374151]">Pay off · {formatMoney(debt.balance_cents)}</button>
      </div>
      <label className="block text-xs font-medium text-[#6B7280]">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Next payment due (optional)<input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Note (optional)<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. M-Pesa payment" className={FIELD} /></label>
      <button type="button" disabled={add.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{add.isPending ? 'Saving…' : 'Save payment'}</button>
    </div>
  )
}