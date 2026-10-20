import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { exportAllData } from '@/lib/backup'
import { useClearDemo, useHasDemo, useLoadDemo } from '@/hooks/useDataTools'
import { ResetDialog } from './ResetDialog'

function Row({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (<div className="flex items-center justify-between gap-4 py-3"><div className="min-w-0"><p className="text-sm font-medium text-[#1F2937]">{title}</p><p className="mt-0.5 text-xs text-[#6B7280]">{hint}</p></div><div className="shrink-0">{children}</div></div>)
}

const BTN = 'rounded-xl border border-[#CFC8B0] px-3 py-2 text-sm font-semibold text-[#374151] disabled:opacity-50'

export function DataSection() {
  const [exporting, setExporting] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const demo = useHasDemo()
  const load = useLoadDemo()
  const clear = useClearDemo()

  async function exportAll() {
    setExporting(true)
    try {
      const res = await exportAllData()
      toast.success(`Backup saved (${res.total} records)`)
      if (res.failed.length > 0) toast.warning(`Some data could not be read: ${res.failed.join(', ')}`)
    } catch { toast.error('Could not create the backup. Try again.') } finally { setExporting(false) }
  }

  function loadDemo() { load.mutate(undefined, { onSuccess: () => toast.success('Demo data loaded'), onError: (e) => toast.error((e as { message?: string }).message || 'Could not load the demo data.') }) }
  function clearDemo() { if (!confirm('Remove the demo data? Anything you added yourself stays.')) return; clear.mutate(undefined, { onSuccess: () => toast.success('Demo data cleared'), onError: () => toast.error('Could not clear the demo data.') }) }

  return (
    <section className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-[#0B3D2E]">Data</h2>
      <div className="mt-1 divide-y divide-[#F1ECDC]">
        <Row title="Export all data" hint="Downloads a backup of everything as a JSON file."><button type="button" disabled={exporting} onClick={exportAll} className={BTN}>{exporting ? 'Preparing…' : 'Export'}</button></Row>
        <Row title="Demo data" hint={demo.data ? 'Sample data is loaded. Clearing removes only the sample entries.' : 'Fill the app with sample entries to explore. You can clear them later.'}>{demo.data ? (<button type="button" disabled={clear.isPending} onClick={clearDemo} className={BTN}>{clear.isPending ? 'Clearing…' : 'Clear'}</button>) : (<button type="button" disabled={demo.isLoading || load.isPending} onClick={loadDemo} className={BTN}>{load.isPending ? 'Loading…' : 'Load'}</button>)}</Row>
        <Row title="Reset data" hint="Deletes transactions, budgets, savings, debts, wish list and bills. Keeps accounts, categories and settings."><button type="button" onClick={() => setResetOpen(true)} className="rounded-xl border border-[#C0392B] px-3 py-2 text-sm font-semibold text-[#C0392B]">Reset…</button></Row>
      </div>
      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} />
    </section>
  )
}