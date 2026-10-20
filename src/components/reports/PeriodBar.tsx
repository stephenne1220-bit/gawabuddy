import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Mode } from '@/lib/reportMath'
type Props = { mode: Mode; onMode: (m: Mode) => void; label: string; onPrev: () => void; onNext: () => void }
export function PeriodBar({ mode, onMode, label, onPrev, onNext }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex rounded-full bg-[#E9E4D4] p-1">
        {(['month', 'year'] as const).map((m) => (<button key={m} type="button" onClick={() => onMode(m)} className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${mode === m ? 'bg-[#0B3D2E] text-white' : 'text-[#374151]'}`}>{m === 'month' ? 'Monthly' : 'Yearly'}</button>))}
      </div>
      <div className="flex items-center justify-between">
        <button type="button" aria-label={mode === 'month' ? 'Previous month' : 'Previous year'} onClick={onPrev} className="rounded-full p-2 text-[#0B3D2E] hover:bg-[#0B3D2E]/10"><ChevronLeft size={20} /></button>
        <h2 className="text-base font-semibold text-[#0B3D2E]">{label}</h2>
        <button type="button" aria-label={mode === 'month' ? 'Next month' : 'Next year'} onClick={onNext} className="rounded-full p-2 text-[#0B3D2E] hover:bg-[#0B3D2E]/10"><ChevronRight size={20} /></button>
      </div>
    </div>
  )
}