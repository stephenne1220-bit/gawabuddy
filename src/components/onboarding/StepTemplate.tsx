import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatMoney, toCents } from '@/lib/money'
import type { Draft, Template } from '@/lib/onboarding'

const OPTIONS: { value: Template; title: string; text: string }[] = [
  { value: '50_30_20', title: '50 / 30 / 20', text: '50% needs, 30% wants, 20% savings and debt.' },
  { value: 'custom', title: 'Custom', text: 'Set your own split.' },
]

export function StepTemplate({ draft, onChange }: { draft: Draft; onChange: (d: Draft) => void }) {
  const income = toCents(draft.income) ?? 0
  const share = (p: number) => formatMoney(Math.floor((income * p) / 100))

  const custom = [
    { id: 'needs', label: 'Needs', value: draft.needs },
    { id: 'wants', label: 'Wants', value: draft.wants },
    { id: 'savings', label: 'Savings and debt', value: draft.savings },
  ] as const

  const total = custom.reduce((s, c) => s + (Number(c.value) || 0), 0)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#0B3D2E]">Pick a budget template</h2>
        <p className="mt-1 text-sm text-[#6B7280]">This is how your income is split between needs, wants and savings.</p>
      </div>

      <div role="radiogroup" aria-label="Budget template" className="grid gap-3">
        {OPTIONS.map((o) => {
          const active = draft.template === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange({ ...draft, template: o.value })}
              className={`rounded-2xl border p-4 text-left ${
                active ? 'border-[#0B3D2E] bg-[#0B3D2E]/5' : 'border-[#CFC8B0] bg-white'
              }`}
            >
              <p className="text-sm font-semibold text-[#0B3D2E]">{o.title}</p>
              <p className="mt-0.5 text-xs text-[#6B7280]">{o.text}</p>
            </button>
          )
        })}
      </div>

      {draft.template === '50_30_20' ? (
        income > 0 && (
          <ul className="space-y-1 rounded-2xl bg-white p-4 text-sm shadow-sm">
            <li className="flex justify-between"><span>Needs · 50%</span><span className="font-semibold tabular-nums">{share(50)}</span></li>
            <li className="flex justify-between"><span>Wants · 30%</span><span className="font-semibold tabular-nums">{share(30)}</span></li>
            <li className="flex justify-between"><span>Savings and debt · 20%</span><span className="font-semibold tabular-nums">{share(20)}</span></li>
          </ul>
        )
      ) : (
        <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
          {custom.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3">
              <Label htmlFor={`pct-${c.id}`}>{c.label} (%)</Label>
              <Input
                id={`pct-${c.id}`}
                inputMode="numeric"
                value={c.value}
                onChange={(e) => onChange({ ...draft, [c.id]: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                className="h-10 w-24 text-right"
              />
            </div>
          ))}
          <p className={`text-sm font-semibold ${total === 100 ? 'text-[#1E8E3E]' : 'text-[#C0392B]'}`} aria-live="polite">
            Total: {total}% {total === 100 ? '' : '(must be 100%)'}
          </p>
        </div>
      )}
    </div>
  )
}