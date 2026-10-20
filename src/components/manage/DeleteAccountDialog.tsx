import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDeleteAccount, useTxCount } from '@/hooks/useManage'
import type { AccountRow } from './AccountSheet'

type Props = { account: AccountRow | null; onOpenChange: (open: boolean) => void }

export function DeleteAccountDialog({ account, onOpenChange }: Props) {
  return (
    <Dialog open={account !== null} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-[#1F2937]">{account && <Body account={account} onDone={() => onOpenChange(false)} />}</DialogContent>
    </Dialog>
  )
}

function Body({ account, onDone }: { account: AccountRow; onDone: () => void }) {
  const count = useTxCount('account_id', account.id)
  const del = useDeleteAccount()
  const n = count.data ?? 0

  function confirmDelete() {
    del.mutate(account.id, { onSuccess: () => { toast.success('Account deleted'); onDone() }, onError: (e) => toast.error((e as { message?: string }).message || 'Could not delete the account.') })
  }

  return (
    <>
      <DialogHeader><DialogTitle>Delete "{account.name}"?</DialogTitle><DialogDescription>Bills that pay from or into this account are deleted too.{n > 0 ? ` This also permanently deletes its ${n} transaction${n === 1 ? '' : 's'}.` : ''}</DialogDescription></DialogHeader>
      {n > 0 && (<p className="rounded-lg bg-[#C0392B]/10 p-3 text-xs font-medium text-[#C0392B]">This cannot be undone. Export a backup from Settings first if you might need it.</p>)}
      <div className="flex gap-2"><button type="button" onClick={onDone} className="flex-1 rounded-xl border border-[#CFC8B0] py-3 text-sm font-semibold text-[#374151]">Cancel</button><button type="button" disabled={count.isLoading || del.isPending} onClick={confirmDelete} className="flex-1 rounded-xl bg-[#C0392B] py-3 text-sm font-semibold text-white disabled:opacity-50">{del.isPending ? 'Deleting…' : 'Delete'}</button></div>
    </>
  )
}