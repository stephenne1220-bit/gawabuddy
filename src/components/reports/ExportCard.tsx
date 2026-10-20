import { useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { fetchAllTransactions } from '@/hooks/useReports'
import { downloadCsv, toCsv } from '@/lib/exporters'
import type { SummaryPdfData } from '@/lib/reportPdf'
type Props = { period: { from: string; to: string; label: string }; pdfData: SummaryPdfData }
type Busy = 'period' | 'all' | 'pdf' | null
export function ExportCard({ period, pdfData }: Props) {
  const [busy, setBusy] = useState<Busy>(null)
  const accounts = useAccounts(); const categories = useCategories()
  const accountName = new Map(((accounts.data ?? []) as { id: string; name: string }[]).map((a) => [a.id, a.name]))
  const categoryName = new Map(((categories.data ?? []) as { id: string; name: string }[]).map((c) => [c.id, c.name]))
  async function exportCsv(scope: 'period' | 'all') {
    setBusy(scope)
    try {
      const rows = await fetchAllTransactions(scope === 'period' ? period : undefined)
      if (rows.length === 0) { toast.info('No transactions to export for that range.'); return }
      const csv = toCsv(['Date', 'Type', 'Amount (KES)', 'Category', 'Account', 'Note'], rows.map((r) => [String(r.date ?? ''), String(r.type ?? ''), (Number(r.amount_cents) / 100).toFixed(2), categoryName.get(String(r.category_id)) ?? '', accountName.get(String(r.account_id)) ?? '', String(r.note ?? r.description ?? r.memo ?? '')]))
      const stamp = scope === 'period' ? period.from.slice(0, 7) : 'all'
      downloadCsv(csv, `gawa-transactions-${stamp}.csv`); toast.success(`Exported ${rows.length} transaction${rows.length === 1 ? '' : 's'}`)
    } catch { toast.error('Could not export transactions. Try again.') } finally { setBusy(null) }
  }
  async function exportPdf() {
    setBusy('pdf')
    try {
      const { downloadSummaryPdf } = await import('@/lib/reportPdf')
      await downloadSummaryPdf(pdfData, `gawa-summary-${period.label.toLowerCase().replace(/\s+/g, '-')}.pdf`); toast.success('Summary report created')
    } catch { toast.error('Could not create the PDF. Try again.') } finally { setBusy(null) }
  }
  const btn = 'flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold disabled:opacity-50'
  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-[#0B3D2E]">Export</h3>
      <div className="mt-3 space-y-2">
        <button type="button" disabled={busy !== null} onClick={() => exportCsv('period')} className={`${btn} bg-[#0B3D2E] text-white`}><Download size={16} />{busy === 'period' ? 'Preparing…' : `Transactions CSV · ${period.label}`}</button>
        <button type="button" disabled={busy !== null} onClick={exportPdf} className={`${btn} bg-[#D4A017] text-[#0B3D2E]`}><FileText size={16} />{busy === 'pdf' ? 'Creating…' : `Summary PDF · ${period.label}`}</button>
        <button type="button" disabled={busy !== null} onClick={() => exportCsv('all')} className="w-full py-1 text-xs font-medium text-[#6B7280] underline disabled:opacity-50">{busy === 'all' ? 'Preparing…' : 'Export all transactions (CSV)'}</button>
      </div>
    </div>
  )
}