import type { ReactNode } from 'react'
import { setMonthStartDay } from '@/lib/budgetMath'
import { setCurrency } from '@/lib/money'
import { DEFAULT_SETTINGS, useSettings } from '@/hooks/useSettings'

export function SettingsSync({ children }: { children: ReactNode }) {
  const { data, isLoading } = useSettings()
  if (isLoading) {
    return <div role="status" className="flex min-h-screen items-center justify-center text-sm text-[#6B7280]">Loading…</div>
  }
  const s = data ?? DEFAULT_SETTINGS
  setCurrency(s.currency)
  setMonthStartDay(s.month_start_day)
  return <div key={`${s.currency}-${s.month_start_day}`} className="contents">{children}</div>
}