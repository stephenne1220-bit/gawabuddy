import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { formatMoney } from '@/lib/money'
import { formatDay, monthsUntil, savedPct, suggestedMonthly } from '@/lib/savingsMath'
import { safeUrl } from '@/lib/wishMath'
import type { SavingsGoal } from '@/hooks/useSavings'
import { WishItem, useDeleteWishItem, useMoveToGoal, useSetWishStatus } from '@/hooks/useWishlist'
import { WishSavedSheet } from './WishSavedSheet'

const PRIORITY_STYLE = { high: 'bg-[#0B3D2E] text-white', medium: 'bg-[#D4A017]/20 text-[#8A6A00]', low: 'bg-[#F1ECDC] text-[#6B7280]' } as const
const STATUS_STYLE = { planned: 'bg-[#F1ECDC] text-[#6B7280]', saving: 'bg-[#D4A017]/20 text-[#8A6A00]', bought: 'bg-[#1E8E3E]/10 text-[#1E8E3E]' } as const
const STATUS_LABEL = { planned: 'Planned', saving: 'Saving', bought: 'Bought' } as const

type Props = { item: WishItem; goal?: SavingsGoal }

export function WishItemCard({ item, goal }: Props) {
  const [adding, setAdding] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const setStatus = useSetWishStatus()
  const move = useMoveToGoal()
  const del = useDeleteWishItem()
  const linked = !!item.savings_goal_id && !!goal
  const saved = linked ? goal!.saved_cents : item.saved_cents
  const cost = item.estimated_cost_cents
  const remaining = Math.max(0, cost - saved)
  const pct = savedPct(saved, cost)
  const bought = item.status === 'bought'
  const months = item.target_date ? monthsUntil(item.target_date) : null
  const monthly = !bought && remaining > 0 && months ? suggestedMonthly(remaining, months) : 0
  const photo = safeUrl(item.photo_url)
  const link = safeUrl(item.link)
  const timeLabel = bought ? 'Bought' : remaining === 0 ? 'Fully saved' : months === null ? 'No target date' : months === 0 ? 'Past target date' : `${months} month${months === 1 ? '' : 's'} left`

  function toggleBought() {
    const next = bought ? (saved > 0 || linked ? 'saving' : 'planned') : 'bought'
    setStatus.mutate({ id: item.id, status: next }, { onError: () => toast.error('Could not update the item.') })
  }

  function moveToBudget() {
    const carry = item.saved_cents > 0 ? ` The ${formatMoney(item.saved_cents)} you saved carries over.` : ''
    if (!confirm(`Create a savings goal for "${item.name}"?${carry}`)) return
    move.mutate(item.id, { onSuccess: () => toast.success('Moved to your savings goals'), onError: (e) => toast.error((e as { message?: string }).message || 'Could not move the item.') })
  }

  function remove() {
    if (!confirm(`Remove "${item.name}" from your wish list?`)) return
    del.mutate(item.id, { onSuccess: () => toast.success('Item removed'), onError: () => toast.error('Could not remove the item.') })
  }

  return (
    <div className={`rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm ${bought ? 'opacity-70' : ''}`}>
      <div className="flex gap-3">
        {photo && !imgFailed && (<img src={photo} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setImgFailed(true)} className="h-16 w-16 shrink-0 rounded-xl object-cover" />)}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2"><h3 className="truncate text-sm font-semibold text-[#1F2937]">{item.name}</h3><span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[item.status]}`}>{STATUS_LABEL[item.status]}</span></div>
          <div className="mt-1 flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${PRIORITY_STYLE[item.priority]}`}>{item.priority}</span>{item.category && (<span className="text-xs text-[#6B7280]">{item.category}</span>)}</div>
          <p className="mt-1 text-base font-semibold tabular-nums text-[#0B3D2E]">{formatMoney(cost)}</p>
        </div>
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#E9E4D4]"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: bought || remaining === 0 ? '#1E8E3E' : '#D4A017' }} /></div>
      <div className="mt-2 flex items-baseline justify-between text-xs text-[#6B7280]"><span className="tabular-nums"><span className="font-semibold text-[#0B3D2E]">{formatMoney(saved)}</span> saved · {Math.floor(pct)}%</span><span className={months === 0 && !bought && remaining > 0 ? 'font-semibold text-[#C0392B]' : ''}>{timeLabel}</span></div>
      {monthly > 0 && (<p className="mt-1 text-xs text-[#0B3D2E]">Save {formatMoney(monthly)} / month to reach it{item.target_date ? ` by ${formatDay(item.target_date)}` : ''}</p>)}
      {item.notes && <p className="mt-2 text-xs text-[#6B7280]">{item.notes}</p>}
      {link && (<a href={link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#0B3D2E] underline">View link <ExternalLink size={12} /></a>)}
      {linked && !bought && (<Link to="/goals?tab=savings" className="mt-3 block rounded-xl bg-[#0B3D2E]/5 p-3 text-center text-xs font-semibold text-[#0B3D2E]">Tracked in your savings goals →</Link>)}
      {!bought && !linked && (<div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => setAdding(true)} className="rounded-xl border border-[#CFC8B0] py-2.5 text-sm font-semibold text-[#374151]">Update savings</button><button type="button" disabled={move.isPending} onClick={moveToBudget} className="rounded-xl bg-[#0B3D2E] py-2.5 text-sm font-semibold text-white disabled:opacity-50">{move.isPending ? 'Moving…' : 'Move to Budget'}</button></div>)}
      <div className="mt-3 flex items-center justify-between"><button type="button" disabled={setStatus.isPending} onClick={toggleBought} className="text-xs font-semibold text-[#1E8E3E]">{bought ? 'Undo bought' : 'Mark as bought'}</button><button type="button" onClick={remove} className="text-xs font-medium text-[#C0392B]">Remove</button></div>
      <WishSavedSheet item={item} open={adding} onOpenChange={setAdding} />
    </div>
  )
}