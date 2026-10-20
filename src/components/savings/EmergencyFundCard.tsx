import { Link } from 'react-router-dom'
import { formatMoney } from '@/lib/money'
import { savedPct } from '@/lib/savingsMath'
import { useSavingsGoals } from '@/hooks/useSavings'

const SIZE = 76
const STROKE = 9
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

export function EmergencyFundCard() {
  const { data, isLoading } = useSavingsGoals()

  if (isLoading) return <div className="h-28 animate-pulse rounded-2xl bg-white/70" />

  const goal = data?.find((g) => g.type === 'emergency')

  if (!goal) {
    return (
      <Link to="/goals" className="block rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-[#0B3D2E]">Emergency fund</p>
        <p className="mt-1 text-xs text-[#6B7280]">Not started yet. Tap to set a target of 3 to 6 months of expenses.</p>
      </Link>
    )
  }

  const pct = savedPct(goal.saved_cents, goal.target_cents)
  const done = pct >= 100

  return (
    <Link to="/goals" className="flex items-center gap-4 rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="#E9E4D4" strokeWidth={STROKE} />
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke={done ? '#1E8E3E' : '#D4A017'} strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct / 100)} style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#0B3D2E]">{Math.floor(pct)}%</span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#0B3D2E]">Emergency fund</p>
        <p className="mt-1 text-xs tabular-nums text-[#6B7280]">{formatMoney(goal.saved_cents)} of {formatMoney(goal.target_cents)}</p>
        {done && <p className="mt-1 text-xs font-semibold text-[#1E8E3E]">Fully funded</p>}
      </div>
    </Link>
  )
}