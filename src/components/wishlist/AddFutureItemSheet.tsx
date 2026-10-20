import { useState } from 'react'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { parseAmountToCents } from '@/lib/budgetMath'
import { PRIORITIES, parseUrl } from '@/lib/wishMath'
import { Priority, useAddWishItem } from '@/hooks/useWishlist'

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function AddFutureItemSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl bg-[#F8F5EC] px-6 pb-8">
        <SheetHeader>
          <SheetTitle className="text-[#0B3D2E]">Add future item</SheetTitle>
        </SheetHeader>
        {open && <ItemForm onDone={() => onOpenChange(false)} />}
      </SheetContent>
    </Sheet>
  )
}

const FIELD =
  'mt-1 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 py-2 text-base text-[#1F2937] outline-none focus:border-[#D4A017]'

const CATEGORY_HINTS = ['Tech', 'Home', 'Travel', 'Vehicle', 'Education', 'Fashion', 'Health', 'Other']

function ItemForm({ onDone }: { onDone: () => void }) {
  const add = useAddWishItem()
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [targetDate, setTargetDate] = useState('')
  const [category, setCategory] = useState('')
  const [saved, setSaved] = useState('')
  const [link, setLink] = useState('')
  const [photo, setPhoto] = useState('')
  const [notes, setNotes] = useState('')

  function submit() {
    const costCents = parseAmountToCents(cost)
    const savedCents = parseAmountToCents(saved) ?? 0
    const linkRes = parseUrl(link)
    const photoRes = parseUrl(photo)

    if (!name.trim()) return toast.error('Give the item a name.')
    if (!costCents) return toast.error('Enter the estimated cost, above zero.')
    if (!linkRes.ok) return toast.error('That link does not look valid.')
    if (!photoRes.ok) return toast.error('That photo link does not look valid.')

    add.mutate(
      {
        name: name.trim(),
        estimated_cost_cents: costCents,
        priority,
        target_date: targetDate || null,
        category: category.trim() || null,
        notes: notes.trim() || null,
        link: linkRes.value,
        photo_url: photoRes.value,
        status: savedCents > 0 ? 'saving' : 'planned',
        saved_cents: savedCents,
      },
      {
        onSuccess: () => {
          toast.success('Item added')
          onDone()
        },
        onError: () => toast.error('Could not add the item. Try again.'),
      },
    )
  }

  return (
    <div className="mt-4 space-y-4">
      <label className="block text-xs font-medium text-[#6B7280]">
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. New laptop"
          className={FIELD}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium text-[#6B7280]">
          Estimated cost (KES)
          <input
            inputMode="decimal"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="e.g. 80000"
            className={FIELD}
          />
        </label>
        <label className="block text-xs font-medium text-[#6B7280]">
          Saved so far (KES)
          <input
            inputMode="decimal"
            value={saved}
            onChange={(e) => setSaved(e.target.value)}
            placeholder="0"
            className={FIELD}
          />
        </label>
      </div>

      <div>
        <p className="text-xs font-medium text-[#6B7280]">Priority</p>
        <div className="mt-1 flex gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPriority(p.key)}
              className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold ${
                priority === p.key
                  ? 'border-[#0B3D2E] bg-[#0B3D2E] text-white'
                  : 'border-[#CFC8B0] bg-white text-[#374151]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-medium text-[#6B7280]">
          Target date (optional)
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className={FIELD}
          />
        </label>
        <label className="block text-xs font-medium text-[#6B7280]">
          Category (optional)
          <input
            list="wish-categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Tech"
            className={FIELD}
          />
          <datalist id="wish-categories">
            {CATEGORY_HINTS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
      </div>

      <label className="block text-xs font-medium text-[#6B7280]">
        Link (optional)
        <input
          inputMode="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://..."
          className={FIELD}
        />
      </label>

      <label className="block text-xs font-medium text-[#6B7280]">
        Photo link (optional)
        <input
          inputMode="url"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="Paste an image URL"
          className={FIELD}
        />
      </label>

      <label className="block text-xs font-medium text-[#6B7280]">
        Notes (optional)
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={FIELD}
        />
      </label>

      <button
        type="button"
        disabled={add.isPending}
        onClick={submit}
        className="w-full rounded-xl bg-[#0B3D2E] py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {add.isPending ? 'Saving…' : 'Add item'}
      </button>
    </div>
  )
}