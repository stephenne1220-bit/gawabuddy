import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { GROUPS } from '@/lib/budgetMath'
import { useCategories } from '@/hooks/useCategories'
import { CategorySheet, type CategoryRow, type CategoryTarget } from '@/components/manage/CategorySheet'
import { DeleteCategoryDialog } from '@/components/manage/DeleteCategoryDialog'

const SECTIONS = [...GROUPS.map((g) => ({ key: g.key as string | null, label: g.label })), { key: null, label: 'Income' }]

export default function ManageCategories() {
  const cats = useCategories()
  const [editing, setEditing] = useState<CategoryTarget>(null)
  const [deleting, setDeleting] = useState<CategoryRow | null>(null)
  const rows = [...((cats.data ?? []) as CategoryRow[])].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <div className="flex items-center justify-between">
        <Link to="/settings" className="flex items-center gap-1 text-sm font-medium text-[#0B3D2E]"><ArrowLeft size={16} /> Settings</Link>
        <button type="button" onClick={() => setEditing('new')} className="flex items-center gap-1 rounded-full bg-[#D4A017] px-3 py-1.5 text-xs font-semibold text-[#0B3D2E]"><Plus size={14} /> Add category</button>
      </div>
      <h1 className="text-base font-semibold text-[#0B3D2E]">Categories</h1>
      {cats.isLoading ? (<div className="space-y-3"><div className="h-32 animate-pulse rounded-2xl bg-white/70" /><div className="h-32 animate-pulse rounded-2xl bg-white/70" /></div>) : rows.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm"><p className="text-sm font-semibold text-[#0B3D2E]">No categories yet</p><p className="mt-1 text-xs text-[#6B7280]">Add categories to organise your spending and income.</p></div>
      ) : (SECTIONS.map((s) => {
        const list = rows.filter((c) => (c.budget_group ?? null) === s.key)
        if (list.length === 0) return null
        return (
          <section key={s.label} className="rounded-2xl border border-[#EFEAD8] bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-[#0B3D2E]">{s.label}</h2>
            <ul className="mt-1 divide-y divide-[#F1ECDC]">{list.map((c) => (<li key={c.id} className="flex items-center justify-between py-2.5"><span className="truncate pr-2 text-sm text-[#1F2937]">{c.name}</span><span className="flex shrink-0 items-center gap-1"><button type="button" aria-label={`Edit ${c.name}`} onClick={() => setEditing(c)} className="rounded-full p-2 text-[#6B7280] hover:bg-[#0B3D2E]/10"><Pencil size={16} /></button><button type="button" aria-label={`Delete ${c.name}`} onClick={() => setDeleting(c)} className="rounded-full p-2 text-[#6B7280] hover:bg-[#C0392B]/10 hover:text-[#C0392B]"><Trash2 size={16} /></button></span></li>))}</ul>
          </section>
        )
      }))}
      <CategorySheet target={editing} onOpenChange={(o) => !o && setEditing(null)} />
      <DeleteCategoryDialog category={deleting} onOpenChange={(o) => !o && setDeleting(null)} />
    </div>
  )
}