import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatMoney } from '@/lib/money'
import { parseAmountToCents } from '@/lib/budgetMath'
import { GoalType, useAddGoal, useAvgExpenses, useSavingsGoals } from '@/hooks/useSavings'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function AddGoalSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] px-6 pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">New savings goal</SheetTitle></SheetHeader>
        {open && <GoalForm onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

const FIELD = 'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'

function GoalForm({ onDone }: { onDone: () => void }) {
  const { data: goals } = useSavingsGoals()
  const hasEmergency = !!goals?.some((g) => g.type === 'emergency')
  const add = useAddGoal()
  const [type, setType] = useState<GoalType>('custom')
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')
  const avg = useAvgExpenses(type === 'emergency')

  function pickType(t: GoalType) {
    setType(t)
    if (t === 'emergency') setName('Emergency Fund')
    else if (name === 'Emergency Fund') setName('')
  }

  function submit() {
    const cents = parseAmountToCents(target)
    if (!name.trim()) return toast.error('Give your goal a name.')
    if (!cents) return toast.error('Enter a target amount above zero.')
    add.mutate({ name: name.trim(), target_cents: cents, deadline: deadline || null, type }, {
      onSuccess: () => { toast.success('Goal created'); onDone() },
      onError: (e) => toast.error((e as { code?: string }).code === '23505' ? 'You already have an emergency fund.' : 'Could not create the goal. Try again.'),
    })
  }

  const typeBtn = (t: GoalType, label: string, disabled = false) => (
    <button type="button" disabled={disabled} onClick={() => pickType(t)} className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold disabled:opacity-40 ${type === t ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white' : 'border-[#CFC8B0] bg-white text-[#374151]'}`}>{label}</button>
  )

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">{typeBtn('custom', 'Custom goal')}{typeBtn('emergency', hasEmergency ? 'Emergency (added)' : 'Emergency fund', hasEmergency)}</div>
      {type === 'emergency' && (
        <div className="rounded-xl bg-white p-3 text-xs text-[#6B7280]">
          {avg.isLoading ? ('Checking your spending…') : avg.data && avg.data > 0 ? (
            <>
              <p>Your average monthly spending is {formatMoney(avg.data)}. Aim for 3 to 6 months of it:</p>
              <div className="mt-2 flex gap-2">{[3, 6].map((n) => (<button key={n} type="button" onClick={() => setTarget(String((avg.data! * n) / 100))} className="flex-1 rounded-lg border border-[#D4A017] bg-[#D4A017]/10 py-2 font-semibold text-[#0B3D2E]">{n} months · {formatMoney(avg.data! * n)}</button>))}</div>
            </>
          ) : ('Not enough spending history yet. Enter your own target for now.')}
        </div>
      )}
      <label className="block text-xs font-medium text-[#6B7280]">Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. New laptop" className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Target (KES)<input inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. 150000" className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Deadline (optional)<input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className={FIELD} /></label>
      <button type="button" disabled={add.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{add.isPending ? 'Saving…' : 'Create goal'}</button>
    </div>
  )
}