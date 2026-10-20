import { Plus } from 'lucide-react'

export function FloatingAddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Add"
      onClick={onClick}
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4A017] text-[#0B3D2E] shadow-lg active:scale-95 md:bottom-8 md:right-8"
    >
      <Plus size={28} aria-hidden="true" />
    </button>
  )
}