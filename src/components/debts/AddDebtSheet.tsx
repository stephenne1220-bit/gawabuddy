import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { parseAmountToCents } from '@/lib/budgetMath'
import { useAddDebt } from '@/hooks/useDebts'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function AddDebtSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] px-6 pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">Add debt</SheetTitle></SheetHeader>
        {open && <DebtForm onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

const FIELD = 'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'

function DebtForm({ onDone }: { onDone: () => void }) {
  const add = useAddDebt()
  const [name, setName] = useState('')
  const [lender, setLender] = useState('')
  const [total, setTotal] = useState('')
  const [rate, setRate] = useState('')
  const [minPay, setMinPay] = useState('')
  const [due, setDue] = useState('')

  function submit() {
    const totalCents = parseAmountToCents(total)
    const minCents = parseAmountToCents(minPay) ?? 0
    const rateNum = rate.trim() === '' ? 0 : Number(rate)
    if (!name.trim()) return toast.error('Give this debt a name.')
    if (!totalCents) return toast.error('Enter the amount you owe, above zero.')
    if (!Number.isFinite(rateNum) || rateNum < 0 || rateNum > 1000) return toast.error('Enter a valid yearly interest rate, or 0 if none.')
    add.mutate({ name: name.trim(), lender: lender.trim() || null, total_cents: totalCents, interest_rate: rateNum, min_payment_cents: minCents, due_date: due || null }, {
      onSuccess: () => { toast.success('Debt added'); onDone() },
      onError: () => toast.error('Could not add the debt. Try again.'),
    })
  }

  return (
    <div className="mt-4 space-y-4">
      <label className="block text-xs font-medium text-[#6B7280]">Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Car loan" className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Lender (optional)<input value={lender} onChange={(e) => setLender(e.target.value)} placeholder="e.g. Sacco, bank, friend" className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Amount you owe (KES)<input inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} placeholder="e.g. 50000" className={FIELD} /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium text-[#6B7280]">Interest (% per year)<input inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="0 if none" className={FIELD} /></label>
        <label className="block text-xs font-medium text-[#6B7280]">Minimum / month (KES)<input inputMode="decimal" value={minPay} onChange={(e) => setMinPay(e.target.value)} placeholder="e.g. 2500" className={FIELD} /></label>
      </div>
      <label className="block text-xs font-medium text-[#6B7280]">Next payment due (optional)<input type="date" value={due} onChange={(e) => setDue(e.target.value)} className={FIELD} /></label>
      <button type="button" disabled={add.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{add.isPending ? 'Saving…' : 'Add debt'}</button>
    </div>
  )
}