import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { currencyCode, formatMoney, toCents } from '@/lib/money'
import type { Draft } from '@/lib/onboarding'

export function StepIncome({ draft, onChange }: { draft: Draft; onChange: (d: Draft) => void }) {
  const cents = toCents(draft.income)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#0B3D2E]">What is your monthly income?</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Use what you take home after tax. You can change it later.</p>
      </div>
      <div>
        <Label htmlFor="income">Monthly income ({currencyCode()})</Label>
        <Input
          id="income"
          inputMode="decimal"
          autoFocus
          placeholder="e.g. 60000"
          value={draft.income}
          onChange={(e) => onChange({ ...draft, income: e.target.value })}
          className="mt-1 h-12 text-lg"
        />
      </div>
      {cents ? <p className="text-3xl font-bold tabular-nums text-[#0B3D2E]">{formatMoney(cents)}</p> : null}
    </div>
  )
}