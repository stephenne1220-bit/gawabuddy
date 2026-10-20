import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { currentMonthKey, monthLabel, shiftMonth } from '@/lib/budgetMath'
import { daysInMonth, fmtKey, occurrencesInMonth, parseKey } from '@/lib/billMath'
import { formatDay, todayKey } from '@/lib/savingsMath'
import { daysUntil } from '@/lib/debtMath'
import type { RecurringItem } from '@/hooks/useBills'
import { BillRow } from './BillRow'
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
function dotColor(date: string, isNext: boolean, income: boolean) {
  const days = daysUntil(date)
  if (isNext && days < 0) return '#C0392B'
  if (days >= 0 && days <= 7) return '#F59E0B'
  return income ? '#1E8E3E' : '#0B3D2E'
}
export function BillsCalendar({ items, onPay }: { items: RecurringItem[]; onPay: (item: RecurringItem) => void }) {
  const [month, setMonth] = useState(currentMonthKey()); const [selected, setSelected] = useState(todayKey())
  const [y, m] = parseKey(month)
  const occurrences = useMemo(() => occurrencesInMonth(items, month), [items, month]); const today = todayKey()
  const lead = (new Date(y, m - 1, 1).getDay() + 6) % 7; const total = daysInMonth(y, m)
  const cells: (number | null)[] = [ ...Array<null>(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1) ]
  const dayList = occurrences.get(selected) ?? []
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button type="button" aria-label="Previous month" onClick={() => setMonth((k) => shiftMonth(k, -1))} className="rounded-full p-2 text-[#0B3D2E] hover:bg-[#0B3D2E]/10"><ChevronLeft size={20} /></button>
        <h2 className="text-sm font-semibold text-[#0B3D2E]">{monthLabel(month)}</h2>
        <button type="button" aria-label="Next month" onClick={() => setMonth((k) => shiftMonth(k, 1))} className="rounded-full p-2 text-[#0B3D2E] hover:bg-[#0B3D2E]/10"><ChevronRight size={20} /></button>
      </div>
      <div className="rounded-2xl border border-[#EFEAD8] bg-white p-3 shadow-sm">
        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-[#9CA3AF]">{WEEKDAYS.map((d) => (<span key={d} className="py-1">{d}</span>))}</div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, i) => {
            if (day === null) return <span key={`b${i}`} />
            const key = fmtKey(y, m, day); const list = occurrences.get(key) ?? []; const isSelected = key === selected
            return (
              <button key={key} type="button" onClick={() => setSelected(key)} className={`flex h-12 flex-col items-center justify-start rounded-xl pt-1 text-sm ${isSelected ? 'bg-[#0B3D2E] text-white' : key === today ? 'bg-[#D4A017]/20 font-semibold text-[#0B3D2E]' : 'text-[#1F2937]'}`}>
                {day}
                <span className="mt-0.5 flex gap-0.5">{list.slice(0, 3).map((o, j) => (<span key={j} className="h-1.5 w-1.5 rounded-full" style={{ background: isSelected ? '#FFFFFF' : dotColor(key, o.isNext, o.item.type === 'income') }} />))}</span>
              </button>
            )
          })}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#6B7280]">{formatDay(selected)}</p>
        {dayList.length === 0 ? (<p className="rounded-2xl bg-white p-4 text-center text-xs text-[#9CA3AF] shadow-sm">Nothing due on this day.</p>) : (
          dayList.map((o) => (<BillRow key={`${o.item.id}-${selected}`} item={o.item} dueDate={selected} projected={!o.isNext} onPay={onPay} />))
        )}
      </div>
    </div>
  )
}