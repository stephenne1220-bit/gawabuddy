import { useState } from 'react'
import { ChevronDown, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatMoney } from '@/lib/money'
import { formatDay, monthsUntil, savedPct, suggestedMonthly } from '@/lib/savingsMath'
import { EntryType, SavingsGoal, useDeleteEntry, useDeleteGoal, useGoalEntries } from '@/hooks/useSavings'
import { GoalEntrySheet } from './GoalEntrySheet'

export function GoalCard({ goal }: { goal: SavingsGoal }) {
  const [showHistory, setShowHistory] = useState(false)
  const [entryType, setEntryType] = useState<EntryType | null>(null)
  const entries = useGoalEntries(goal.id, showHistory)
  const delEntry = useDeleteEntry()
  const delGoal = useDeleteGoal()

  const remaining = Math.max(0, goal.target_cents - goal.saved_cents)
  const pct = savedPct(goal.saved_cents, goal.target_cents)
  const reached = remaining === 0
  const months = goal.deadline ? monthsUntil(goal.deadline) : null
  const pastDeadline = !reached && months === 0
  const monthly = !reached && months ? suggestedMonthly(remaining, months) : 0

  const timeLabel = reached ? 'Goal reached' : months === null ? 'No deadline' : pastDeadline ? 'Past deadline' : `${months} month${months === 1 ? '' : 's'} left`

  function removeEntry(id: string) {
    if (!confirm('Delete this entry?')) return
    delEntry.mutate(id, { onError: () => toast.error('Could not delete the entry.') })
  }

  function removeGoal() {
    if (!confirm(`Delete "${goal.name}" and all its history?`)) return
    delGoal.mutate(goal.id, { onSuccess: () => toast.success('Goal deleted'), onError: () => toast.error('Could not delete the goal.') })
  }

  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-semibold text-[#1F2937]">{goal.name}</h3>
        {goal.type === 'emergency' && (<span className="shrink-0 rounded-full bg-[#D4A017]/15 px-2 py-0.5 text-[11px] font-semibold text-[#8A6A00]">Emergency</span>)}
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E9E4D4]">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: reached ? '#1E8E3E' : '#D4A017' }} />
      </div>
      <div className="mt-2 flex items-baseline justify-between text-xs text-[#6B7280]">
        <span className="tabular-nums"><span className="font-semibold text-[#0B3D2E]">{formatMoney(goal.saved_cents)}</span> of {formatMoney(goal.target_cents)} · {Math.floor(pct)}%</span>
        <span className={pastDeadline ? 'font-semibold text-[#C0392B]' : ''}>{timeLabel}</span>
      </div>
      {monthly > 0 && <p className="mt-1 text-xs text-[#0B3D2E]">Suggested: {formatMoney(monthly)} / month</p>}
      {pastDeadline && <p className="mt-1 text-xs text-[#6B7280]">{formatMoney(remaining)} still to go.</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setEntryType('deposit')} className="flex-1 rounded-xl bg-[#0B3D2E] py-2.5 text-sm font-semibold text-white">Deposit</button>
        <button type="button" disabled={goal.saved_cents <= 0} onClick={() => setEntryType('withdrawal')} className="flex-1 rounded-xl border border-[#CFC8B0] py-2.5 text-sm font-semibold text-[#374151] disabled:opacity-40">Withdraw</button>
      </div>
      <button type="button" onClick={() => setShowHistory((v) => !v)} className="mt-3 flex w-full items-center justify-between text-xs font-medium text-[#6B7280]">
        History<ChevronDown size={16} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
      </button>
      {showHistory && (
        <div className="mt-2">
          {entries.isLoading ? (<div className="h-12 animate-pulse rounded-lg bg-[#F8F5EC]" />) : !entries.data || entries.data.length === 0 ? (<p className="py-2 text-xs text-[#9CA3AF]">No deposits or withdrawals yet.</p>) : (
            <ul className="divide-y divide-[#F1ECDC]">
              {entries.data.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0"><p className="text-xs font-medium text-[#1F2937]">{e.type === 'deposit' ? 'Deposit' : 'Withdrawal'}<span className="ml-2 font-normal text-[#9CA3AF]">{formatDay(e.date)}</span></p>{e.note && (<p className="truncate text-xs text-[#6B7280]">{e.note}</p>)}</div>
                  <div className="flex shrink-0 items-center gap-2"><span className="text-sm font-semibold tabular-nums" style={{ color: e.type === 'deposit' ? '#1E8E3E' : '#C0392B' }}>{e.type === 'deposit' ? '+' : '−'}{formatMoney(e.amount_cents)}</span><button type="button" aria-label="Delete entry" onClick={() => removeEntry(e.id)} className="rounded-full p-1.5 text-[#9CA3AF] hover:bg-[#C0392B]/10 hover:text-[#C0392B]"><Trash2 size={14} /></button></div>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={removeGoal} className="mt-2 text-xs font-medium text-[#C0392B]">Delete goal</button>
        </div>
      )}
      <GoalEntrySheet goal={goal} type={entryType} onOpenChange={(o) => !o && setEntryType(null)} />
    </div>
  )
}