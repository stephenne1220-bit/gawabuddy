import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { GROUPS, type GroupKey } from '@/lib/budgetMath'
import { useCategories } from '@/hooks/useCategories'
import { useSaveCategory } from '@/hooks/useManage'

export type CategoryRow = { id: string; name: string; budget_group: GroupKey | null }
export type CategoryTarget = CategoryRow | 'new' | null

type Props = { target: CategoryTarget; onOpenChange: (open: boolean) => void }

export function CategorySheet({ target, onOpenChange }: Props) {
  return (
    <Sheet open={target !== null} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] pb-8">
        <SheetHeader><SheetTitle className="text-[#0B3D2E]">{target === 'new' ? 'Add category' : 'Edit category'}</SheetTitle></SheetHeader>
        {target && <CategoryForm existing={target === 'new' ? null : target} onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

const FIELD = 'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'

function CategoryForm({ existing, onDone }: { existing: CategoryRow | null; onDone: () => void }) {
  const save = useSaveCategory()
  const all = (useCategories().data ?? []) as CategoryRow[]
  const [name, setName] = useState(existing?.name ?? '')
  const [group, setGroup] = useState<string>(existing?.budget_group ?? (existing ? '' : 'needs'))

  function submit() {
    const clean = name.trim()
    if (!clean) return toast.error('Give the category a name.')
    if (clean.length > 40) return toast.error('Keep the name under 40 characters.')
    const clash = all.some((c) => c.id !== existing?.id && c.name.trim().toLowerCase() === clean.toLowerCase())
    if (clash) return toast.error('You already have a category with that name.')
    save.mutate({ id: existing?.id, name: clean, budget_group: (group || null) as GroupKey | null }, {
      onSuccess: () => { toast.success(existing ? 'Category updated' : 'Category added'); onDone() },
      onError: (e) => toast.error((e as { message?: string }).message || 'Could not save the category.'),
    })
  }

  return (
    <div className="mt-4 space-y-4">
      <label className="block text-xs font-medium text-[#6B7280]">Name<input autoFocus value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gym" className={FIELD} /></label>
      <label className="block text-xs font-medium text-[#6B7280]">Type<select value={group} onChange={(e) => setGroup(e.target.value)} className={FIELD}>{GROUPS.map((g) => (<option key={g.key} value={g.key}>{g.label} (spending, can be budgeted)</option>))}<option value="">Income</option></select></label>
      <button type="button" disabled={save.isPending} onClick={submit} className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50">{save.isPending ? 'Saving…' : 'Save'}</button>
    </div>
  )
}