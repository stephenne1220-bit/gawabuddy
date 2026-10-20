import { useState } from 'react'
import { ChevronDown, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatMoney } from '@/lib/money'
import { formatDay, savedPct } from '@/lib/savingsMath'
import { dueInfo } from '@/lib/debtMath'
import { Debt, useDebtPayments, useDeleteDebt, useDeletePayment } from '@/hooks/useDebts'
import { DebtPaymentSheet } from './DebtPaymentSheet'

const TONE: Record<string, string> = {
  ok: 'bg-[#1E8E3E]/10 text-[#1E8E3E]',
  soon: 'bg-[#F59E0B]/15 text-[#B45309]',
  overdue: 'bg-[#C0392B]/10 text-[#C0392B]',
  none: 'bg-[#F1ECDC] text-[#6B7280]',
}

export function DebtCard({ debt }: { debt: Debt }) {
  const [paying, setPaying] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const payments = useDebtPayments(debt.id, showHistory)
  const delPayment = useDeletePayment()
  const delDebt = useDeleteDebt()

  const pct = savedPct(debt.paid_cents, debt.total_cents)
  const paidOff = debt.balance_cents === 0
  const due = dueInfo(debt.due_date, debt.balance_cents)

  function removePayment(id: string) {
    if (!confirm('Delete this payment?')) return
    delPayment.mutate(id, { onError: () => toast.error('Could not delete the payment.') })
  }

  function removeDebt() {
    if (!confirm(`Delete "${debt.name}" and all its payments?`)) return
    delDebt.mutate(debt.id, { onSuccess: () => toast.success('Debt deleted'), onError: () => toast.error('Could not delete the debt.') })
  }

  return (
    <div className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0"><h3 className="truncate text-sm font-semibold text-[#1F2937]">{debt.name}</h3>{debt.lender && (<p className="truncate text-xs text-[#6B7280]">{debt.lender}</p>)}</div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONE[due.tone]}`}>{due.label}</span>
      </div>
      <p className="mt-3 text-xl font-semibold tabular-nums text-[#0B3D2E]">{formatMoney(debt.balance_cents)}<span className="ml-1 text-xs font-normal text-[#6B7280]">left</span></p>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#E9E4D4]"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: paidOff ? '#1E8E3E' : '#D4A017' }} /></div>
      <div className="mt-2 flex items-center justify-between text-xs text-[#6B7280]"><span className="tabular-nums">{formatMoney(debt.paid_cents)} of {formatMoney(debt.total_cents)} paid</span><span>{Math.floor(pct)}%</span></div>
      <p className="mt-1 text-xs text-[#6B7280]">{debt.interest_rate}% / year{debt.min_payment_cents > 0 && ` · min ${formatMoney(debt.min_payment_cents)} / month`}</p>
      <button type="button" disabled={paidOff} onClick={() => setPaying(true)} className="mt-3 w-full rounded-xl bg-[#0B3D2E] py-2.5 text-sm font-semibold text-white disabled:opacity-40">{paidOff ? 'Paid off' : 'Record payment'}</button>
      <button type="button" onClick={() => setShowHistory((v) => !v)} className="mt-3 flex w-full items-center justify-between text-xs font-medium text-[#6B7280]">Payment history<ChevronDown size={16} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} /></button>
      {showHistory && (
        <div className="mt-2">
          {payments.isLoading ? (<div className="h-12 animate-pulse rounded-lg bg-[#F8F5EC]" />) : !payments.data || payments.data.length === 0 ? (<p className="py-2 text-xs text-[#9CA3AF]">No payments yet.</p>) : (
            <ul className="divide-y divide-[#F1ECDC]">
              {payments.data.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0"><p className="text-xs font-medium text-[#1F2937]">{formatDay(p.date)}</p>{p.note && (<p className="truncate text-xs text-[#6B7280]">{p.note}</p>)}</div>
                  <div className="flex shrink-0 items-center gap-2"><span className="text-sm font-semibold tabular-nums text-[#1E8E3E]">{formatMoney(p.amount_cents)}</span><button type="button" aria-label="Delete payment" onClick={() => removePayment(p.id)} className="rounded-full p-1.5 text-[#9CA3AF] hover:bg-[#C0392B]/10 hover:text-[#C0392B]"><Trash2 size={14} /></button></div>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={removeDebt} className="mt-2 text-xs font-medium text-[#C0392B]">Delete debt</button>
        </div>
      )}
      <DebtPaymentSheet debt={debt} open={paying} onOpenChange={setPaying} />
    </div>
  )
}