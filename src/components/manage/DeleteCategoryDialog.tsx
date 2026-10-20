import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCategories } from '@/hooks/useCategories'
import { useDeleteCategory, useTxCount } from '@/hooks/useManage'
import type { CategoryRow } from './CategorySheet'

type Props = { category: CategoryRow | null; onOpenChange: (open: boolean) => void }

export function DeleteCategoryDialog({ category, onOpenChange }: Props) {
  return (
    <Dialog open={category !== null} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-[#1F2937]">{category && <Body category={category} onDone={() => onOpenChange(false)} />}</DialogContent>
    </Dialog>
  )
}

function Body({ category, onDone }: { category: CategoryRow; onDone: () => void }) {
  const count = useTxCount('category_id', category.id)
  const others = ((useCategories().data ?? []) as CategoryRow[]).filter((c) => c.id !== category.id)
  const del = useDeleteCategory()
  const [moveTo, setMoveTo] = useState('')
  const used = (count.data ?? 0) > 0
  const loading = count.isLoading
  const noTarget = used && others.length === 0
  const canDelete = !loading && !noTarget && (!used || moveTo !== '')

  function confirmDelete() {
    del.mutate({ id: category.id, moveTo: used ? moveTo : undefined }, {
      onSuccess: () => { toast.success('Category deleted'); onDone() },
      onError: (e) => toast.error((e as { message?: string }).message || 'Could not delete the category.'),
    })
  }

  return (
    <>
      <DialogHeader><DialogTitle>Delete "{category.name}"?</DialogTitle><DialogDescription>Its budget limits are deleted with it.{used ? ` ${count.data} transaction${count.data === 1 ? ' uses' : 's use'} this category, so pick where they should go.` : ''}</DialogDescription></DialogHeader>
      {loading && <div className="h-10 animate-pulse rounded-lg bg-[#F8F5EC]" />}
      {used && !noTarget && (<label className="block text-xs font-medium text-[#6B7280]">Move transactions to<select value={moveTo} onChange={(e) => setMoveTo(e.target.value)} className="mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]"><option value="">Choose a category</option>{others.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></label>)}
      {noTarget && (<p className="text-xs text-[#C0392B]">Create another category first so these transactions have somewhere to go.</p>)}
      <div className="flex gap-2"><button type="button" onClick={onDone} className="flex-1 rounded-xl border border-[#CFC8B0] py-3 text-sm font-semibold text-[#374151]">Cancel</button><button type="button" disabled={!canDelete || del.isPending} onClick={confirmDelete} className="flex-1 rounded-xl bg-[#C0392B] py-3 text-sm font-semibold text-white disabled:opacity-50">{del.isPending ? 'Deleting…' : 'Delete'}</button></div>
    </>
  )
}