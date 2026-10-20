import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { currencyCode } from '@/lib/money'
import { ACCOUNT_TYPES, newKey, type Draft, type DraftAccount } from '@/lib/onboarding'
import type { AccountType } from '@/lib/types'

const MAX_ACCOUNTS = 8

export function StepAccounts({ draft, onChange }: { draft: Draft; onChange: (d: Draft) => void }) {
  function update(key: string, patch: Partial<DraftAccount>) {
    onChange({ ...draft, accounts: draft.accounts.map((a) => (a.key === key ? { ...a, ...patch } : a)) })
  }
  function remove(key: string) {
    onChange({ ...draft, accounts: draft.accounts.filter((a) => a.key !== key) })
  }
  function add() {
    onChange({ ...draft, accounts: [...draft.accounts, { key: newKey(), name: '', type: 'savings', opening: '' }] })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#0B3D2E]">Name your accounts</h2>
        <p className="mt-1 text-sm text-[#6B7280]">Where does your money live? Add what you have now. The opening balance is what each account holds today (optional).</p>
      </div>

      <ul className="space-y-3">
        {draft.accounts.map((a, i) => (
          <li key={a.key} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <Label htmlFor={`name-${a.key}`}>Account {i + 1}</Label>
                <Input id={`name-${a.key}`} value={a.name} maxLength={40} onChange={(e) => update(a.key, { name: e.target.value })} className="mt-1 h-11" />
              </div>
              <Button type="button" variant="ghost" size="icon" aria-label={`Remove account ${a.name || i + 1}`} disabled={draft.accounts.length === 1} onClick={() => remove(a.key)} className="h-11 w-11 shrink-0 text-[#C0392B]">
                <Trash2 size={18} />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`type-${a.key}`}>Type</Label>
                <select id={`type-${a.key}`} value={a.type} onChange={(e) => update(a.key, { type: e.target.value as AccountType })} className="mt-1 h-11 w-full rounded-lg border border-[#CFC8B0] bg-white px-3 text-base text-[#1F2937]">
                  {ACCOUNT_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
              </div>
              <div>
                <Label htmlFor={`open-${a.key}`}>Balance ({currencyCode()})</Label>
                <Input id={`open-${a.key}`} inputMode="decimal" placeholder="0" value={a.opening} onChange={(e) => update(a.key, { opening: e.target.value })} className="mt-1 h-11" />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Button type="button" variant="outline" disabled={draft.accounts.length >= MAX_ACCOUNTS} onClick={add} className="w-full rounded-xl">
        <Plus size={16} /> Add another account
      </Button>
    </div>
  )
}