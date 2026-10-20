import { useOnline } from '@/lib/online'

export function OfflineBanner() {
  const online = useOnline()
  if (online) return null
  return (
    <div role="status" className="sticky top-0 z-40 bg-[#F59E0B] px-4 py-2 text-center text-xs font-semibold text-[#0c1b16]">
      You are offline. Showing your last saved data.
    </div>
  )
}