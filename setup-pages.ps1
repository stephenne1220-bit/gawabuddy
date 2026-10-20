$ErrorActionPreference = "Stop"

function Write-File($path, $content) {
    Set-Content -Path $path -Value $content -Encoding UTF8
    Write-Host "Created: $path" -ForegroundColor Green
}

# 1. Planner Page
Write-File "src/pages/Planner.tsx" @'
import { useState } from 'react'
import { DebtsPanel } from '@/components/debts/DebtsPanel'
import { WishlistPanel } from '@/components/wishlist/WishlistPanel'

const TABS = [
  { key: 'future', label: 'Future Purchases' },
  { key: 'debts', label: 'Debt Payoff' },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function Planner() {
  const [tab, setTab] = useState<TabKey>('future')

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4 pb-28">
      <div className="flex rounded-full bg-[#E9E4D4] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === t.key ? 'bg-[#0B3D2E] text-white' : 'text-[#374151]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'future' && <WishlistPanel />}
      {tab === 'debts' && <DebtsPanel />}
    </div>
  )
}
