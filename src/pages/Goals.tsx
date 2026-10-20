import { useSearchParams } from 'react-router-dom'
import { SavingsPanel } from '@/components/savings/SavingsPanel'
import { DebtsPanel } from '@/components/debts/DebtsPanel'
import { WishlistPanel } from '@/components/wishlist/WishlistPanel'

const TABS = [
  { key: 'savings', label: 'Savings' },
  { key: 'debts', label: 'Debts' },
  { key: 'wishlist', label: 'Wish List' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function Goals() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('tab')
  const tab: TabKey = TABS.some((t) => t.key === raw) ? (raw as TabKey) : 'savings'

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <div className="flex rounded-full bg-[#E9E4D4] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setParams({ tab: t.key }, { replace: true })}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-[#0B3D2E] text-white' : 'text-[#374151]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'savings' && <SavingsPanel />}
      {tab === 'debts' && <DebtsPanel />}
      {tab === 'wishlist' && <WishlistPanel />}
    </div>
  )
}