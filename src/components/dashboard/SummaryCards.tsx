import { StatCard } from '@/components/app/StatCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useMonthTotals } from '@/hooks/useDashboard'

export function SummaryCards({ from, to }: { from: string; to: string }) {
  const { data, isLoading, isError, refetch } = useMonthTotals(from, to)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl bg-[#E9E4D4]" />
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
        <p className="text-sm font-semibold text-[#C0392B]">Could not load this month</p>
        <button type="button" onClick={() => void refetch()} className="mt-2 rounded-xl bg-[#0B3D2E] px-4 py-2 text-sm font-semibold text-white">
          Try again
        </button>
      </div>
    )
  }

  const remaining = data.income - data.spent

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard label="Total Income" cents={data.income} valueClass="text-[#1E8E3E]" />
      <StatCard label="Total Spent" cents={data.spent} valueClass="text-[#C0392B]" />
      <StatCard label="Remaining" cents={remaining} valueClass={remaining < 0 ? 'text-[#C0392B]' : 'text-[#0B3D2E]'} />
      <StatCard label="Net Savings" cents={data.saved} />
    </div>
  )
}