import { useRef, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { formatMoney } from '@/lib/money'
import { levelFor, parseAmountToCents, usedPct } from '@/lib/budgetMath'
import type { BudgetLine } from '@/hooks/useBudget'
import { BudgetBar } from './BudgetBar'
export function CategoryBudgetRow({ line, onLimit, onRollover }: { line: BudgetLine; onLimit: (cents: number) => void; onRollover: (on: boolean) => void }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const finished = useRef(false)
  const pct = usedPct(line.spent, line.available)
  const level = levelFor(pct)
  const overBy = line.spent - line.available
  function startEdit() { finished.current = false; setDraft(line.limit ? String(line.limit / 100) : ''); setEditing(true) }
  function commit() { if (finished.current) return; finished.current = true; setEditing(false); const cents = parseAmountToCents(draft); if (cents !== null && cents !== line.limit) onLimit(cents) }
  function cancel() { finished.current = true; setEditing(false) }
  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium text-[#1F2937]">{line.name}</span>
        {level === 'warn' && (<span className="shrink-0 rounded-full bg-[#F59E0B]/15 px-2 py-0.5 text-[11px] font-semibold text-[#B45309]">{Math.floor(pct)}% used</span>)}
        {level === 'over' && (<span className="shrink-0 rounded-full bg-[#C0392B]/10 px-2 py-0.5 text-[11px] font-semibold text-[#C0392B]">{overBy > 0 ? `Over by ${formatMoney(overBy)}` : 'Limit reached'}</span>)}
      </div>
      <div className="mt-2"><BudgetBar pct={pct} /></div>
      <div className="mt-2 flex items-center justify-between text-xs text-[#6B7280]">
        <span>Spent {formatMoney(line.spent)} of {formatMoney(line.available)}</span>
        {line.carryIn > 0 && (<span className="text-[#0B3D2E]">+{formatMoney(line.carryIn)} carried over</span>)}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <span>Limit</span>
          {editing ? (<input autoFocus inputMode="decimal" value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }} className="w-28 rounded-md border border-[#D4A017] bg-white px-2 py-1 text-sm text-[#1F2937] outline-none" />) : (
            <button type="button" onClick={startEdit} className="rounded-md border border-dashed border-[#CFC8B0] px-2 py-1 text-sm font-medium text-[#0B3D2E] tabular-nums">{formatMoney(line.limit)}</button>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs text-[#6B7280]">Rollover <Switch checked={line.rollover} onCheckedChange={onRollover} /></label>
      </div>
    </div>
  )
}