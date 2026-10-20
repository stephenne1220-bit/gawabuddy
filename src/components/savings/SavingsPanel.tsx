import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useSavingsGoals } from '@/hooks/useSavings'
import { AddGoalSheet } from './AddGoalSheet'
import { GoalCard } from './GoalCard'

export function SavingsPanel() {
  const { data, isLoading, error } = useSavingsGoals()
  const [adding, setAdding] = useState(false)

  const goals = [...(data ?? [])].sort((a, b) => Number(b.type === 'emergency') - Number(a.type === 'emergency'))

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0B3D2E]">Savings</h2>
        <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1 rounded-full bg-[#D4A017] px-3 py-1.5 text-xs font-semibold text-[#0B3D2E]"><Plus size={14} /> New goal</button>
      </div>
      {error && (<p className="rounded-xl bg-[#C0392B]/10 p-3 text-sm text-[#C0392B]">Could not load your savings goals.</p>)}
      {isLoading ? (
        <div className="space-y-3"><div className="h-40 animate-pulse rounded-2xl bg-white/70" /><div className="h-40 animate-pulse rounded-2xl bg-white/70" /></div>
      ) : goals.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-[#0B3D2E]">No savings goals yet</p>
          <p className="mt-1 text-xs text-[#6B7280]">Start with an emergency fund, or save towards something specific.</p>
          <button type="button" onClick={() => setAdding(true)} className="mt-4 rounded-xl bg-[#0B3D2E] px-4 py-2.5 text-sm font-semibold text-white">Create your first goal</button>
        </div>
      ) : (goals.map((g) => <GoalCard key={g.id} goal={g} />))}
      <AddGoalSheet open={adding} onOpenChange={setAdding} />
    </section>
  )
}