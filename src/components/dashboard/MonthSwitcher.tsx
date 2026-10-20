import { ChevronLeft, ChevronRight } from 'lucide-react'
import { currentMonthKey, monthLabel, shiftMonth } from '@/lib/dates'

export function MonthSwitcher({ month, onChange }: { month: string; onChange: (key: string) => void }) {
  const atCurrent = month >= currentMonthKey()

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#EFEAD8] bg-white px-2 py-1 shadow-sm">
      <button type="button" aria-label="Previous month" onClick={() => onChange(shiftMonth(month, -1))} className="rounded-full p-2 text-[#0B3D2E] hover:bg-[#0B3D2E]/10">
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <p aria-live="polite" className="text-sm font-semibold text-[#0B3D2E]">
        {monthLabel(month)}
      </p>
      <button type="button" aria-label="Next month" disabled={atCurrent} onClick={() => onChange(shiftMonth(month, 1))} className="rounded-full p-2 text-[#0B3D2E] hover:bg-[#0B3D2E]/10 disabled:opacity-30">
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </div>
  )
}