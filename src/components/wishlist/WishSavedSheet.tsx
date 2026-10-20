import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatMoney } from '@/lib/money'
import { parseAmountToCents } from '@/lib/budgetMath'
import { WishItem, useAddWishSaved } from '@/hooks/useWishlist'

type Props = { item: WishItem; open: boolean; onOpenChange: (open: boolean) => void }

export function WishSavedSheet({ item, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">Savings for {item.name}</SheetTitle></SheetHeader>
        {open && <SavedForm item={item} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

function SavedForm({ item, onDone }: { item: WishItem; onDone: () => void }) {
  const save = useAddWishSaved()
  const [mode, setMode] = useState<'add' | 'remove'>('add')
  const [amount, setAmount] = useState('')

  function submit() {
    const cents = parseAmountToCents(amount)
    if (!cents) return toast.error('Enter an amount above zero.')
    if (mode === 'remove' && cents > item.saved_cents) return toast.error(`You can only take out up to ${formatMoney(item.saved_cents)}.`)
    save.mutate({ id: item.id, delta: mode === 'add' ? cents : -cents }, {
      onSuccess: () => { toast.success(mode === 'add' ? 'Savings added' : 'Savings updated'); onDone() },
      onError: () => toast.error('Could not save. Try again.'),
    })
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-xs text-[#6B7280]">Saved so far: {formatMoney(item.saved_cents)}</p>
      <div className="flex gap-2">{(['add', 'remove'] as const).map((m) => (<button key={m} type="button" onClick={() => setMode(m)} className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold ${mode === m ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white' : 'border-[#CFC8B0] bg-white text-[#374151]'}`}>{m === 'add' ? 'Add savings' : 'Take out'}</button>))}</div>
      <label className="block text-xs font-medium text-[#6B7280]">Amount (KES)<input autoFocus inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]" /></label>
      <button type="button" disabled={save.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{save.isPending ? 'Saving…' : 'Save'}</button>
    </div>
  )
}