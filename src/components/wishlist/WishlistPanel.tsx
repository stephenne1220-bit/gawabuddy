import { useState } from 'react'
import { Plus } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { monthsUntil, suggestedMonthly } from '@/lib/savingsMath'
import { sortWish } from '@/lib/wishMath'
import { useSavingsGoals } from '@/hooks/useSavings'
import { useWishlist } from '@/hooks/useWishlist'
import { AddFutureItemSheet } from './AddFutureItemSheet'
import { WishItemCard } from './WishItemCard'

export function WishlistPanel() {
  const wishes = useWishlist()
  const goals = useSavingsGoals()
  const [adding, setAdding] = useState(false)
  const goalById = new Map((goals.data ?? []).map((g) => [g.id, g]))
  const items = [...(wishes.data ?? [])].sort(sortWish)
  const open = items.filter((i) => i.status !== 'bought')
  const bought = items.filter((i) => i.status === 'bought')

  let total = 0
  let saved = 0
  let perMonth = 0
  for (const i of open) {
    const goal = i.savings_goal_id ? goalById.get(i.savings_goal_id) : undefined
    const s = goal ? goal.saved_cents : i.saved_cents
    const cost = i.estimated_cost_cents
    total += cost
    saved += Math.min(s, cost)
    if (i.target_date) {
      const m = monthsUntil(i.target_date)
      if (m > 0) perMonth += suggestedMonthly(Math.max(0, cost - s), m)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-base font-semibold text-[#0B3D2E]">Wish List</h2><button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1 rounded-full bg-[#D4A017] px-3 py-1.5 text-xs font-semibold text-[#0B3D2E]"><Plus size={14} /> Add item</button></div>
      {wishes.error && (<p className="rounded-xl bg-[#C0392B]/10 p-3 text-sm text-[#C0392B]">Could not load your wish list.</p>)}
      {wishes.isLoading ? (
        <div className="space-y-3"><div className="h-28 animate-pulse rounded-2xl bg-white/70" /><div className="h-44 animate-pulse rounded-2xl bg-white/70" /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm"><p className="text-sm font-semibold text-[#0B3D2E]">Nothing on your wish list yet</p><p className="mt-1 text-xs text-[#6B7280]">Add things you plan to buy to see what they cost and what to save each month.</p><button type="button" onClick={() => setAdding(true)} className="mt-4 rounded-xl bg-[#0B3D2E] px-4 py-2.5 text-sm font-semibold text-white">Add your first item</button></div>
      ) : (
        <>
          {open.length > 0 && (<div className="rounded-2xl bg-[#0B3D2E] p-4 text-white shadow-sm"><p className="text-xs text-white/70">Total future spending</p><p className="text-2xl font-semibold tabular-nums">{formatMoney(total)}</p><p className="mt-1 text-xs text-white/70">{formatMoney(saved)} saved · {formatMoney(Math.max(0, total - saved))} still needed</p>{perMonth > 0 && (<p className="mt-1 text-xs text-[#D4A017]">{formatMoney(perMonth)} / month to hit every target date</p>)}</div>)}
          {open.map((i) => (<WishItemCard key={i.id} item={i} goal={i.savings_goal_id ? goalById.get(i.savings_goal_id) : undefined} />))}
          {bought.length > 0 && (<><h3 className="pt-2 text-sm font-semibold text-[#6B7280]">Bought ({bought.length})</h3>{bought.map((i) => (<WishItemCard key={i.id} item={i} goal={i.savings_goal_id ? goalById.get(i.savings_goal_id) : undefined} />))}</>)}
        </>
      )}
      <AddFutureItemSheet open={adding} onOpenChange={setAdding} />
    </section>
  )
}