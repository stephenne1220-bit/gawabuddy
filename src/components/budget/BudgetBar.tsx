import { LEVEL_COLOR, levelFor } from '@/lib/budgetMath'
export function BudgetBar({ pct, height = 8 }: { pct: number; height?: number }) {
  const color = LEVEL_COLOR[levelFor(pct)]
  return (
    <div className="w-full overflow-hidden rounded-full bg-[#E9E4D4]" style={{ height }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(Math.floor(pct), 100)}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  )
}