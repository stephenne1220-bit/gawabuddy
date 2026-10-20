import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { PieChart as PieIcon } from 'lucide-react'
import { EmptyState } from '@/components/app/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { useCategories } from '@/hooks/useCategories'
import { useSpendingByCategory } from '@/hooks/useDashboard'
import { formatMoney } from '@/lib/money'

const TOP = 5

export function SpendingDonut({ from, to }: { from: string; to: string }) {
  const spend = useSpendingByCategory(from, to)
  const categories = useCategories().data ?? []

  const slices = useMemo(() => {
    const byId = new Map(categories.map((c) => [c.id, c]))
    const rows = (spend.data ?? []).map((r) => {
      const c = r.category_id ? byId.get(r.category_id) : undefined
      return { name: c?.name ?? 'Uncategorized', value: r.total, color: c?.color ?? '#6B7280' }
    })
    const head = rows.slice(0, TOP)
    const rest = rows.slice(TOP).reduce((s, r) => s + r.value, 0)
    return rest > 0 ? [...head, { name: 'Other', value: rest, color: '#9CA3AF' }] : head
  }, [spend.data, categories])

  const total = slices.reduce((s, r) => s + r.value, 0)

  return (
    <section className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-[#0B3D2E]">Spending by category</h2>
      {spend.isLoading ? (
        <Skeleton className="mt-3 h-56 rounded-2xl bg-[#E9E4D4]" />
      ) : spend.isError ? (
        <p className="mt-3 text-xs text-[#C0392B]">Could not load spending.</p>
      ) : total === 0 ? (
        <div className="mt-3">
          <EmptyState icon={PieIcon} title="No spending this month" text="Your categories will show up here as you add expenses." />
        </div>
      ) : (
        <>
          <div className="relative mt-2 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slices} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="none">
                  {slices.map((s) => (<Cell key={s.name} fill={s.color} />))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-[#6B7280]">Spent</p>
              <p className="text-lg font-bold tabular-nums text-[#0B3D2E]">{formatMoney(total)}</p>
            </div>
          </div>
          <ul className="mt-2 space-y-2">
            {slices.map((s) => (
              <li key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="truncate text-[#1F2937]">{s.name}</span>
                </span>
                <span className="shrink-0 tabular-nums text-[#6B7280]">{formatMoney(s.value)} · {Math.round((s.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}