import { Delete } from 'lucide-react'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'back']

export function Keypad({ onKey }: { onKey: (key: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Number keypad">
      {KEYS.map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onKey(k)}
          aria-label={k === 'back' ? 'Delete last digit' : k === '.' ? 'Decimal point' : k}
          className="flex h-14 items-center justify-center rounded-2xl bg-white text-2xl font-semibold text-[#1F2937] shadow-sm active:scale-95 active:bg-[#F1ECDC]"
        >
          {k === 'back' ? <Delete size={24} aria-hidden="true" /> : k}
        </button>
      ))}
    </div>
  )
}