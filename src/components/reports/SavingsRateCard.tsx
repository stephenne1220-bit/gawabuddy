import { formatMoney } from '@/lib/money'
type Props = { income: number; expense: number; rate: number | null; label: string; loading: boolean }
export function SavingsRateCard({ income, expense, rate, label, loading }: Props) {
  if (loading) return <div className="h-28 animate-pulse rounded-2xl bg-white/70" />
  const color = rate === null ? '#6B7280' : rate < 0 ? '#C0392B' : rate < 20 ? '#B45309' : '#1E8E3E'
  const kept = income - expense
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <p className="text-xs text-[#6B7280]">Savings rate · {label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums" style={{ color }}>{rate === null ? 'n/a' : `${rate.toFixed(1)}%`}</p>
      <p className="mt-1 text-xs text-[#6B7280]">{rate === null ? 'No income recorded for this period.' : kept >= 0 ? `You kept ${formatMoney(kept)} of ${formatMoney(income)} income.` : `You spent ${formatMoney(-kept)} more than you earned.`}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-[#F8F5EC] p-2"><p className="text-[#6B7280]">Income</p><p className="font-semibold tabular-nums text-[#0B3D2E]">{formatMoney(income)}</p></div>
        <div className="rounded-xl bg-[#F8F5EC] p-2"><p className="text-[#6B7280]">Expenses</p><p className="font-semibold tabular-nums text-[#1F2937]">{formatMoney(expense)}</p></div>
      </div>
    </div>
  )
}