import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { formatMoney } from '@/lib/money'
import { useAccounts } from '@/hooks/useAccounts'
import { AccountSheet, type AccountRow, type AccountTarget } from '@/components/manage/AccountSheet'
import { DeleteAccountDialog } from '@/components/manage/DeleteAccountDialog'

export default function ManageAccounts() {
  const accounts = useAccounts()
  const [editing, setEditing] = useState<AccountTarget>(null)
  const [deleting, setDeleting] = useState<AccountRow | null>(null)
  const rows = [...((accounts.data ?? []) as AccountRow[])].sort((a, b) => a.name.localeCompare(b.name))
  const onlyOne = rows.length <= 1

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <div className="flex items-center justify-between">
        <Link to="/settings" className="flex items-center gap-1 text-sm font-medium text-[#0B3D2E]"><ArrowLeft size={16} /> Settings</Link>
        <button type="button" onClick={() => setEditing('new')} className="flex items-center gap-1 rounded-full bg-[#D4A017] px-3 py-1.5 text-xs font-semibold text-[#0B3D2E]"><Plus size={14} /> Add account</button>
      </div>
      <h1 className="text-base font-semibold text-[#0B3D2E]">Accounts</h1>
      {accounts.isLoading ? (<div className="h-40 animate-pulse rounded-2xl bg-white/70" />) : rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm"><p className="text-sm font-semibold text-[#0B3D2E]">No accounts yet</p><p className="mt-1 text-xs text-[#6B7280]">Add an account such as Cash, M-Pesa or your bank.</p></div>
      ) : (
        <ul className="divide-y divide-[#F1ECDC] rounded-2xl border border-[#EFEAD8] bg-white px-4 shadow-sm">{rows.map((a) => {
          const bal = Number(a.balance_cents)
          const hasBalance = a.balance_cents !== undefined && a.balance_cents !== null && Number.isFinite(bal)
          return (<li key={a.id} className="flex items-center justify-between py-3"><div className="min-w-0 pr-2"><p className="truncate text-sm font-medium text-[#1F2937]">{a.name}</p>{hasBalance && (<p className="text-xs tabular-nums text-[#6B7280]">{formatMoney(bal)}</p>)}</div><span className="flex shrink-0 items-center gap-1"><button type="button" aria-label={`Rename ${a.name}`} onClick={() => setEditing(a)} className="rounded-full p-2 text-[#6B7280] hover:bg-[#0B3D2E]/10"><Pencil size={16} /></button><button type="button" aria-label={`Delete ${a.name}`} disabled={onlyOne} onClick={() => setDeleting(a)} className="rounded-full p-2 text-[#6B7280] hover:bg-[#C0392B]/10 hover:text-[#C0392B] disabled:opacity-30"><Trash2 size={16} /></button></span></li>)
        })}</ul>
      )}
      {onlyOne && rows.length === 1 && (<p className="text-xs text-[#6B7280]">Keep at least one account so you can record transactions.</p>)}
      <AccountSheet target={editing} onOpenChange={(o) => !o && setEditing(null)} />
      <DeleteAccountDialog account={deleting} onOpenChange={(o) => !o && setDeleting(null)} />
    </div>
  )
}