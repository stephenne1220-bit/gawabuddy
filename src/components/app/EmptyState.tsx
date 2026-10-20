import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#0B3D2E]/10 text-[#0B3D2E]">
        <Icon size={24} aria-hidden="true" />
      </div>
      <p className="mt-3 text-sm font-semibold text-[#0B3D2E]">{title}</p>
      <p className="mt-1 text-xs text-[#6B7280]">{text}</p>
    </div>
  )
}