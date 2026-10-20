import { formatMoney } from '@/lib/money'
import { useNetWorth } from '@/hooks/useNetWorth'
export function NetWorthCard() {
  const nw = useNetWorth()
  if (nw.isLoading) return <div className="h-40 animate-pulse rounded-2xl bg-white/70" />
  const rows: { label: string; value: number; sign: string }[] = [ { label: 'Accounts', value: nw.accounts, sign: '' }, { label: 'Savings', value: nw.savings, sign: '+' }, { label: 'Debts', value: nw.debts, sign: '−' } ]
  return (
    <div className="rounded-2xl bg-[#0B3D2E] p-4 text-white shadow-sm">
      <p className="text-xs text-white/70">Net worth today</p>
      <p className="text-3xl font-semibold tabular-nums" style={{ color: nw.total < 0 ? '#F5B7AE' : '#FFFFFF' }}>{formatMoney(nw.total)}</p>
      <ul className="mt-3 space-y-1 border-t border-white/15 pt-3 text-xs">{rows.map((r) => (<li key={r.label} className="flex justify-between"><span className="text-white/70">{r.label}</span><span className="tabular-nums">{r.sign}{formatMoney(r.value)}</span></li>))}</ul>
      {!nw.accountsAvailable && (<p className="mt-3 rounded-lg bg-white/10 p-2 text-xs text-[#F5D58A]">Account balances were not found, so accounts are counted as zero.</p>)}
    </div>
  )
}