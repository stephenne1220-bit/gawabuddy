import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAccounts } from '@/hooks/useAccounts'
import { useSaveAccount } from '@/hooks/useManage'

export type AccountRow = { id: string; name: string; balance_cents?: unknown }
export type AccountTarget = AccountRow | 'new' | null

type Props = { target: AccountTarget; onOpenChange: (open: boolean) => void }

export function AccountSheet({ target, onOpenChange }: Props) {
  return (
    <Sheet open={target !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">{target === 'new' ? 'Add account' : 'Rename account'}</SheetTitle></SheetHeader>
        {target && <AccountForm existing={target === 'new' ? null : target} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

function AccountForm({ existing, onDone }: { existing: AccountRow | null; onDone: () => void }) {
  const save = useSaveAccount()
  const all = (useAccounts().data ?? []) as AccountRow[]
  const [name, setName] = useState(existing?.name ?? '')

  function submit() {
    const clean = name.trim()
    if (!clean) return toast.error('Give the account a name.')
    if (clean.length > 40) return toast.error('Keep the name under 40 characters.')
    if (all.some((a) => a.id !== existing?.id && a.name.trim().toLowerCase() === clean.toLowerCase())) return toast.error('You already have an account with that name.')
    save.mutate({ id: existing?.id, name: clean }, {
      onSuccess: () => { toast.success(existing ? 'Account renamed' : 'Account added'); onDone() },
      onError: (e) => toast.error((e as { message?: string }).message || 'Could not save the account.'),
    })
  }

  return (
    <div className="mt-4 space-y-4"><label className="block text-xs font-medium text-[#6B7280]">Name<input autoFocus value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="e.g. M-Pesa" className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]" /></label><button type="button" disabled={save.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{save.isPending ? 'Saving…' : 'Save'}</button></div>
  )
}