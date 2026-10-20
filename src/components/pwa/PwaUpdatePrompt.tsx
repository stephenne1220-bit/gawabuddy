import { useRegisterSW } from 'virtual:pwa-register/react'

export function PwaUpdatePrompt() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, registration) { if (registration) setInterval(() => void registration.update(), 60 * 60 * 1000) },
  })
  if (!needRefresh) return null
  return (
    <div role="status" className="fixed inset-x-3 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-50 flex items-center justify-between gap-3 rounded-2xl bg-[#0B3D2E] p-3 text-white shadow-lg">
      <p className="text-sm">A new version of Gawa App is ready.</p>
      <div className="flex shrink-0 gap-2"><button type="button" onClick={() => setNeedRefresh(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-white/80">Later</button><button type="button" onClick={() => void updateServiceWorker(true)} className="rounded-xl bg-[#D4A017] px-3 py-2 text-sm font-semibold text-[#0B3D2E]">Update</button></div>
    </div>
  )
}