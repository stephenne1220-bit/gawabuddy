import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useDeleteTransaction } from '@/hooks/useTransactions'
import { formatMoney } from '@/lib/money'
import type { Transaction } from '@/lib/types'

type Props = {
  tx: Transaction | null // null = closed
  onEdit: (tx: Transaction) => void
  onClose: () => void
}

export function RowActionsSheet({ tx, onEdit, onClose }: Props) {
  const del = useDeleteTransaction()

  function remove() {
    if (!tx) return
    if (!confirm('Delete this transaction? This cannot be undone.')) return
    del.mutate(tx.id, {
      onSuccess: () => {
        toast.success('Transaction deleted')
        onClose()
      },
      onError: () => toast.error('Could not delete it. Try again.'),
    })
  }

  return (
    <Sheet open={tx !== null} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl bg-[#F8F5EC] px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <SheetHeader className="p-0">
          <SheetTitle className="text-base text-[#0B3D2E]">
            {tx ? `${tx.merchant || tx.type} · ${formatMoney(tx.amount_cents)}` : ''}
          </SheetTitle>
          <SheetDescription className="sr-only">Choose what to do with this transaction.</SheetDescription>
        </SheetHeader>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => tx && onEdit(tx)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left text-sm font-semibold text-[#1F2937] shadow-sm"
          >
            <Pencil size={18} aria-hidden="true" /> Edit
          </button>
          <button
            type="button"
            disabled={del.isPending}
            onClick={remove}
            className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left text-sm font-semibold text-[#C0392B] shadow-sm disabled:opacity-50"
          >
            <Trash2 size={18} aria-hidden="true" /> Delete
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}