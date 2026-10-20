import { Link } from 'react-router-dom'
import { formatMoney } from '@/lib/money'
import { LEVEL_COLOR } from '@/lib/budgetMath'
import { summarize, useBudget } from '@/hooks/useBudget'
import { BudgetBar } from './BudgetBar'
const LABEL = { ok: 'On track', warn: 'Watch it', over: 'Over budget' } as const
export function BudgetHealthCard({ month }: { month: string }) {
  const { lines, isLoading } = useBudget(month)
  if (isLoading) return <div className="h-24 animate-pulse rounded-2xl bg-white/70" />
  const s = summarize(lines)
  if (!s.hasBudget) return (<Link to="/budget" className="block rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm"><p className="text-sm font-semibold text-[#0B3D2E]">Budget health</p><p className="mt-1 text-xs text-[#6B7280]">No limits set for this month. Tap to set up your budget.</p></Link>)
  return (
    <Link to="/budget" className="block rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between"><p className="text-sm font-semibold text-[#0B3D2E]">Budget health</p><span className="text-xs font-semibold" style={{ color: LEVEL_COLOR[s.level] }}>{LABEL[s.level]} · {Math.floor(s.pct)}%</span></div>
      <div className="mt-3"><BudgetBar pct={s.pct} height={10} /></div>
      <p className="mt-2 text-xs text-[#6B7280]">{formatMoney(s.spent)} spent of {formatMoney(s.available)} budgeted</p>
    </Link>
  )
}