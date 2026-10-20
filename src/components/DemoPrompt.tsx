import { useState } from 'react'
import { toast } from 'sonner'
import { useHasTransactions, useLoadDemo } from '@/hooks/useDataTools'

const KEY = 'gawa-demo-dismissed'

export function DemoPrompt() {
  const has = useHasTransactions()
  const load = useLoadDemo()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1'
    } catch {
      return false
    }
  })

  if (has.isLoading || has.data !== false || dismissed) return null

  function dismiss() {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* ignore */
    }
    setDismissed(true)
  }

  function loadDemo() {
    load.mutate(undefined, {
      onSuccess: () => toast.success('Demo data loaded. Clear it any time in Settings.'),
      onError: (e) =>
        toast.error((e as { message?: string }).message || 'Could not load the demo data.'),
    })
  }

  return (
    <div className="rounded-2xl border border-[#D4A017] bg-[#D4A017]/10 p-4">
      <p className="text-sm font-semibold text-[#0B3D2E]">New here?</p>
      <p className="mt-1 text-xs text-[#374151]">
        Load some demo data to see how budgets, goals and reports look. You can clear it
        any time in Settings.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={load.isPending}
          onClick={loadDemo}
          className="flex-1 rounded-xl bg-[#0B3D2E] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {load.isPending ? 'Loading…' : 'Load demo data'}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-xl border border-[#CFC8B0] px-4 py-2.5 text-sm font-semibold text-[#374151]"
        >
          Not now
        </button>
      </div>
    </div>
  )
}