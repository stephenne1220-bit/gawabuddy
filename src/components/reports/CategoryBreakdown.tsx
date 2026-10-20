import { formatMoney } from '@/lib/money'
import type { CatRow } from '@/lib/reportMath'
export function CategoryBreakdown({ rows, loading, label }: { rows: CatRow[]; loading: boolean; label: string }) {
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[#0B3D2E]">Where the money went</h3><p className="text-xs text-[#6B7280]">{label}</p>
      {loading ? (<div className="mt-3 h-40 animate-pulse rounded-xl bg-[#F8F5EC]" />) : rows.length === 0 ? (<p className="mt-3 text-xs text-[#9CA3AF]">No expenses recorded for this period.</p>) : (
        <ul className="mt-3 space-y-3">
          {rows.map((r) => (
            <li key={r.id ?? r.name}>
              <div className="flex items-baseline justify-between text-xs"><span className="truncate pr-2 font-medium text-[#1F2937]">{r.name}</span><span className="shrink-0 tabular-nums text-[#6B7280]">{formatMoney(r.total)} · {r.share.toFixed(0)}%</span></div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E9E4D4]"><div className="h-full rounded-full bg-[#D4A017]" style={{ width: `${Math.max(2, r.share)}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}