import { useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useProfile } from '@/hooks/useProfile'
import { formatMoney } from '@/lib/money'
import { GROUPS, PLAN_SPLIT, buildPlan, parseAmountToCents } from '@/lib/budgetMath'
import type { BudgetLine, BudgetSave } from '@/hooks/useBudget'
type Props = { open: boolean; onOpenChange: (open: boolean) => void; monthLabel: string; lines: BudgetLine[]; saving: boolean; onApply: (rows: BudgetSave[]) => void }
export function ApplyPlanDialog({ open, onOpenChange, monthLabel, lines, saving, onApply }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply 50/30/20</DialogTitle>
          <DialogDescription>Preview for {monthLabel}: {PLAN_SPLIT.needs}% Needs, {PLAN_SPLIT.wants}% Wants, and 20% split evenly between Savings and Debt.</DialogDescription>
        </DialogHeader>
        <PlanPreview lines={lines} saving={saving} onApply={onApply} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
function PlanPreview({ lines, saving, onApply, onCancel }: { lines: BudgetLine[]; saving: boolean; onApply: (rows: BudgetSave[]) => void; onCancel: () => void }) {
  const { data: profile } = useProfile()
  const initial = Number(profile?.monthly_income ?? 0) / 100
  const [income, setIncome] = useState(initial ? String(initial) : '')
  const incomeCents = parseAmountToCents(income) ?? 0
  const byId = useMemo(() => new Map(lines.map((l) => [l.categoryId, l])), [lines])
  const plan = useMemo(() => buildPlan(incomeCents, lines.map((l) => ({ id: l.categoryId, group: l.group }))), [incomeCents, lines])
  const canSave = incomeCents > 0 && plan.lines.length > 0
  function apply() { onApply(plan.lines.map((l) => ({ category_id: l.categoryId, limit_cents: l.cents, rollover: byId.get(l.categoryId)?.rollover ?? false }))) }
  return (
    <div className="space-y-4">
      <label className="block text-xs font-medium text-[#6B7280]">Monthly income (KES)<input inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="e.g. 60000" className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]" /></label>
      {incomeCents > 0 && GROUPS.map((g) => {
        const members = plan.lines.filter((l) => l.group === g.key)
        if (members.length === 0) return null
        return (
          <div key={g.key} className="rounded-xl bg-[#F8F5EC] p-3">
            <div className="flex items-center justify-between text-sm font-semibold text-[#0B3D2E]"><span>{g.label} · {PLAN_SPLIT[g.key]}%</span><span className="tabular-nums">{formatMoney(plan.groupTotals[g.key])}</span></div>
            <ul className="mt-2 space-y-1">{members.map((l) => {
              const cur = byId.get(l.categoryId)
              return (<li key={l.categoryId} className="flex items-center justify-between text-xs text-[#374151]"><span className="truncate pr-2">{cur?.name}</span><span className="shrink-0 tabular-nums">{formatMoney(l.cents)}{cur && cur.limit > 0 && (<span className="ml-2 text-[#9CA3AF]">was {formatMoney(cur.limit)}</span>)}</span></li>)
            })}</ul>
          </div>
        )
      })}
      <p className="text-xs text-[#6B7280]">This replaces this month's limits. Rollover settings are kept.</p>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-[#CFC8B0] py-3 text-sm font-semibold text-[#374151]">Cancel</button>
        <button type="button" disabled={!canSave || saving} onClick={apply} className="flex-1 rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save budget'}</button>
      </div>
    </div>
  )
}