import { formatMoney } from '@/lib/money'

export function StatCard({
  label,
  cents,
  valueClass = 'text-[#0B3D2E]',
}: {
  label: string
  cents: number
  valueClass?: string
}) {
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-[#6B7280]">{label}</p>
      <p className={`mt-1 truncate text-2xl font-bold tabular-nums ${valueClass}`}>
        {formatMoney(cents)}
      </p>
    </div>
  )
}