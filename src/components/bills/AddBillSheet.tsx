import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAccounts } from '@/hooks/useAccounts'
import { useCategories } from '@/hooks/useCategories'
import { parseAmountToCents } from '@/lib/budgetMath'
import { todayKey } from '@/lib/savingsMath'
import { FREQUENCIES, parseKey } from '@/lib/billMath'
import { Frequency, RecurringType, useAddRecurring } from '@/hooks/useBills'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function AddBillSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] px-6 pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">Add bill</SheetTitle></SheetHeader>
        {open && <BillForm onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

const FIELD = 'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'

type CategoryLike = { id: string; name: string; budget_group: string | null }

function BillForm({ onDone }: { onDone: () => void }) {
  const add = useAddRecurring(); const accounts = useAccounts(); const categories = useCategories()
  const accountList = (accounts.data ?? []) as { id: string; name: string }[]
  const allCats = (categories.data ?? []) as CategoryLike[]
  const [type, setType] = useState<RecurringType>('expense'); const [name, setName] = useState('')
  const [amount, setAmount] = useState(''); const [frequency, setFrequency] = useState<Frequency>('monthly')
  const [nextDue, setNextDue] = useState(todayKey()); const [accountId, setAccountId] = useState(''); const [categoryId, setCategoryId] = useState('')
  const filtered = allCats.filter((c) => (type === 'expense' ? !!c.budget_group : !c.budget_group))
  const catOptions = filtered.length > 0 ? filtered : allCats
  const effectiveAccount = accountId || accountList[0]?.id || ''
  function submit() {
    const cents = parseAmountToCents(amount)
    if (!name.trim()) return toast.error('Give the bill a name.')
    if (!cents) return toast.error('Enter an amount above zero.')
    if (!nextDue) return toast.error('Pick the next due date.')
    if (!effectiveAccount) return toast.error('Add an account first.')
    if (type === 'expense' && !categoryId) return toast.error('Pick a category.')
    add.mutate({ name: name.trim(), type, amount_cents: cents, frequency, next_due: nextDue, anchor_day: parseKey(nextDue)[2], account_id: effectiveAccount, category_id: categoryId || null }, {
      onSuccess: () => { toast.success('Bill added'); onDone() },
      onError: () => toast.error('Could not add the bill. Try again.'),
    })
  }
  const chip = (active: boolean) => `flex-1 rounded-xl border py-2.5 text-sm font-semibold ${active ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white' : 'border-[#CFC8B0] bg-white text-[#374151]'}`
  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => { setType('expense'); setCategoryId('') }} className={chip(type === 'expense')}>Bill to pay</button>
        <button type="button" onClick={() => { setType('income'); setCategoryId('') }} className={chip(type === 'income')}>Recurring income</button>
      </div>
      <label className="block text-xs font-medium text-[#6B7280]">Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder={type === 'expense' ? 'e.g. Rent' : 'e.g. Salary'} className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Amount (KES)<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className={FIELD} /></label>
      <div><p className="text-xs font-medium text-[#6B7280]">Repeats</p><div className="mt-1 flex gap-2">{FREQUENCIES.map((f) => (<button key={f.key} type="button" onClick={() => setFrequency(f.key)} className={chip(frequency === f.key)}>{f.label}</button>))}</div></div>
      <label className="block text-xs font-medium text-[#6B7280]">Next due date<input type="date" value={nextDue} onChange={(e) => setNextDue(e.target.value)} className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">{type === 'expense' ? 'Pay from' : 'Paid into'}<select value={effectiveAccount} onChange={(e) => setAccountId(e.target.value)} className={FIELD}>{accountList.map((a) => (<option key={a.id} value={a.id}>{a.name}</option>))}</select></label>
      <label className="block text-xs font-medium text-[#6B7280]">Category{type === 'income' ? ' (optional)' : ''}<select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={FIELD}><option value="">{type === 'expense' ? 'Choose a category' : 'None'}</option>{catOptions.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></label>
      <button type="button" disabled={add.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{add.isPending ? 'Saving…' : 'Add bill'}</button>
    </div>
  )
}