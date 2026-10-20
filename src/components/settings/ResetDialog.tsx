import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { exportAllData } from '@/lib/backup'
import { useResetData } from '@/hooks/useDataTools'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function ResetDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white text-[#1F2937]">{open && <Body onDone={() => onOpenChange(false)} />}</DialogContent>
    </Dialog>
  )
}

function Body({ onDone }: { onDone: () => void }) {
  const reset = useResetData()
  const [typed, setTyped] = useState('')
  const [exporting, setExporting] = useState(false)

  async function backup() {
    setExporting(true)
    try { const res = await exportAllData(); toast.success(`Backup saved (${res.total} records)`) }
    catch { toast.error('Could not create the backup.') }
    finally { setExporting(false) }
  }

  function confirmReset() {
    reset.mutate(undefined, {
      onSuccess: () => { toast.success('Your data was reset'); onDone() },
      onError: () => toast.error('Could not reset your data. Nothing was deleted.'),
    })
  }

  return (
    <>
      <DialogHeader><DialogTitle>Reset all data?</DialogTitle><DialogDescription>This cannot be undone.</DialogDescription></DialogHeader>
      <div className="space-y-2 text-xs text-[#374151]">
        <p><span className="font-semibold text-[#C0392B]">Deleted:</span> all transactions, budgets, savings goals and deposits, debts and payments, wish list items and bills (including any demo data).</p>
        <p><span className="font-semibold text-[#1E8E3E]">Kept:</span> your accounts, categories and settings.</p>
      </div>
      <button type="button" disabled={exporting} onClick={backup} className="w-full rounded-xl border border-[#CFC8B0] py-2.5 text-sm font-semibold text-[#374151] disabled:opacity-50">{exporting ? 'Preparing…' : 'Export a backup first'}</button>
      <label className="block text-xs font-medium text-[#6B7280]">Type RESET to confirm<input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" autoCapitalize="characters" className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#C0392B]" /></label>
      <div className="flex gap-2"><button type="button" onClick={onDone} className="flex-1 rounded-xl border border-[#CFC8B0] py-3 text-sm font-semibold text-[#374151]">Cancel</button><button type="button" disabled={typed.trim() !== 'RESET' || reset.isPending} onClick={confirmReset} className="flex-1 rounded-xl bg-[#C0392B] py-3 text-sm font-semibold text-white disabled:opacity-50">{reset.isPending ? 'Resetting…' : 'Reset data'}</button></div>
    </>
  )
}