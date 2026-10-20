import { useMemo, useState } from 'react'
import { formatMoney } from '@/lib/money'
import { parseAmountToCents } from '@/lib/budgetMath'
import { PayoffResult, PlanDebt, Strategy, durationLabel, monthsFromNowLabel, simulatePayoff } from '@/lib/debtMath'
import type { Debt } from '@/hooks/useDebts'

const COPY: Record<Strategy, { title: string; blurb: string }> = {
  snowball: { title: 'Snowball', blurb: 'Smallest balance first. Quick wins keep you going.' },
  avalanche: { title: 'Avalanche', blurb: 'Highest interest first. Costs the least overall.' },
}

export function DebtPlanner({ debts }: { debts: Debt[] }) {
  const [extra, setExtra] = useState('')
  const extraCents = parseAmountToCents(extra) ?? 0
  const plan = useMemo<PlanDebt[]>(() => debts.filter((d) => d.balance_cents > 0).map((d) => ({ id: d.id, name: d.name, balance: d.balance_cents, rate: d.interest_rate, min: d.min_payment_cents })), [debts])
  const snowball = useMemo(() => simulatePayoff(plan, extraCents, 'snowball'), [plan, extraCents])
  const avalanche = useMemo(() => simulatePayoff(plan, extraCents, 'avalanche'), [plan, extraCents])
  const bothFeasible = snowball.feasible && avalanche.feasible
  const interestDiff = snowball.totalInterest - avalanche.totalInterest
  const monthsDiff = snowball.months - avalanche.months

  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-[#0B3D2E]">Payoff planner</h2>
      <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
        <label className="block text-xs font-medium text-[#6B7280]">Extra you can pay each month on top of minimums (KES)<input inputMode="decimal" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="0" className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]" /></label>
        <p className="mt-2 text-xs text-[#9CA3AF]">Your minimums keep being paid. When one debt is cleared, its payment moves to the next.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2"><ResultCard result={snowball} /><ResultCard result={avalanche} /></div>
      {bothFeasible && (<p className="rounded-xl bg-[#0B3D2E]/5 p-3 text-xs text-[#0B3D2E]">{interestDiff >= 100 ? `Avalanche saves you ${formatMoney(interestDiff)} in interest${monthsDiff > 0 ? ` and finishes ${monthsDiff} month${monthsDiff === 1 ? '' : 's'} sooner` : ''}.` : 'Both methods end up about the same here, so pick the one that keeps you motivated.'}</p>)}
    </section>
  )
}

function ResultCard({ result }: { result: PayoffResult }) {
  const copy = COPY[result.strategy]
  const first = result.order[0]
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[#0B3D2E]">{copy.title}</h3><p className="text-xs text-[#6B7280]">{copy.blurb}</p>
      {result.feasible ? (
        <>
          <p className="mt-3 text-xs text-[#6B7280]">Debt-free by</p>
          <p className="text-lg font-semibold text-[#0B3D2E]">{monthsFromNowLabel(result.months)}<span className="ml-2 text-xs font-normal text-[#6B7280]">({durationLabel(result.months)})</span></p>
          <p className="mt-2 text-xs text-[#6B7280]">Total interest</p><p className="text-base font-semibold tabular-nums text-[#C0392B]">{formatMoney(result.totalInterest)}</p>
          {first && (<p className="mt-2 text-xs text-[#6B7280]">First win: {first.name} in {first.month} month{first.month === 1 ? '' : 's'}</p>)}
          <ol className="mt-3 space-y-1 border-t border-[#F1ECDC] pt-3">{result.order.map((o, i) => (<li key={o.id} className="flex justify-between text-xs text-[#374151]"><span className="truncate pr-2">{i + 1}. {o.name}</span><span className="shrink-0 text-[#6B7280]">{monthsFromNowLabel(o.month)}</span></li>))}</ol>
        </>
      ) : (<p className="mt-3 text-xs text-[#C0392B]">Not paid off within 50 years at this pace. Add a minimum payment or an extra monthly amount above to see a debt-free date.</p>)}
    </div>
  )
}