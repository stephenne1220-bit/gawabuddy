import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatMoney } from '@/lib/money'
import { parseAmountToCents } from '@/lib/budgetMath'
import { todayKey } from '@/lib/savingsMath'
import { EntryType, SavingsGoal, useAddEntry } from '@/hooks/useSavings'

type Props = {
  goal: SavingsGoal
  type: EntryType | null
  onOpenChange: (open: boolean) => void
}

const FIELD = 'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'

export function GoalEntrySheet({ goal, type, onOpenChange }: Props) {
  return (
    <Sheet open={type !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] px-6 pb-8">
        <SheetHeader>
          <SheetTitle className="text-[#0B3D2E]">
            {type === 'withdrawal' ? 'Withdraw from' : 'Deposit to'} {goal.name}
          </SheetTitle>
        </SheetHeader>
        {type && <EntryForm goal={goal} type={type} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

function EntryForm({ goal, type, onDone }: { goal: SavingsGoal; type: EntryType; onDone: () => void }) {
  const add = useAddEntry()
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayKey())
  const [note, setNote] = useState('')

  function submit() {
    const cents = parseAmountToCents(amount)
    if (!cents) return toast.error('Enter an amount above zero.')
    if (type === 'withdrawal' && cents > goal.saved_cents) {
      return toast.error(`You can only withdraw up to ${formatMoney(goal.saved_cents)}.`)
    }
    add.mutate({ goal_id: goal.id, amount_cents: cents, type, date: date || todayKey(), note: note.trim() || null }, {
      onSuccess: () => { toast.success(type === 'deposit' ? 'Deposit saved' : 'Withdrawal saved'); onDone() },
      onError: () => toast.error('Could not save. Try again.'),
    })
  }

  return (
    <div className="mt-4 space-y-4">
      <label className="block text-xs font-medium text-[#6B7280]">
        Amount (KES)
        <input autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={FIELD} />
      </label>
      <label className="block text-xs font-medium text-[#6B7280]">
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={FIELD} />
      </label>
      <label className="block text-xs font-medium text-[#6B7280]">
        Note (optional)
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Salary top-up" className={FIELD} />
      </label>
      <button type="button" disabled={add.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">
        {add.isPending ? 'Saving…' : type === 'deposit' ? 'Save deposit' : 'Save withdrawal'}
      </button>
    </div>
  )
}