import { daysUntil } from '@/lib/debtMath'
import { formatDay } from '@/lib/savingsMath'
import type { Frequency, RecurringItem } from '@/hooks/useBills'

export const FREQUENCIES: { key: Frequency; label: string }[] = [
  { key: 'weekly', label: 'Weekly' }, { key: 'monthly', label: 'Monthly' }, { key: 'yearly', label: 'Yearly' },
]
export const frequencyLabel = (f: Frequency) => FREQUENCIES.find((x) => x.key === f)?.label ?? f
const pad = (n: number) => String(n).padStart(2, '0')
export const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate()
export const fmtKey = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`
export function parseKey(key: string): [number, number, number] { const [y, m, d] = key.split('-').map(Number); return [y, m, d] }
export function advanceDue(key: string, freq: Frequency, anchorDay: number): string {
  const [y, m, d] = parseKey(key)
  if (freq === 'weekly') { const n = new Date(y, m - 1, d + 7); return fmtKey(n.getFullYear(), n.getMonth() + 1, n.getDate()) }
  if (freq === 'monthly') { const ny = m === 12 ? y + 1 : y; const nm = m === 12 ? 1 : m + 1; return fmtKey(ny, nm, Math.min(anchorDay, daysInMonth(ny, nm))) }
  return fmtKey(y + 1, m, Math.min(d, daysInMonth(y + 1, m)))
}
export type BillTone = 'overdue' | 'soon' | 'later'
export function billStatus(due: string): { tone: BillTone; label: string; days: number } {
  const days = daysUntil(due)
  if (days < 0) { const n = -days; return { tone: 'overdue', label: `Overdue by ${n} day${n === 1 ? '' : 's'}`, days } }
  if (days === 0) return { tone: 'soon', label: 'Due today', days }
  if (days <= 7) return { tone: 'soon', label: `Due in ${days} day${days === 1 ? '' : 's'}`, days }
  return { tone: 'later', label: `Due ${formatDay(due)}`, days }
}
export type Occurrence = { item: RecurringItem; isNext: boolean }
export function occurrencesInMonth(items: RecurringItem[], monthKey: string) {
  const [y, m] = parseKey(monthKey); const start = fmtKey(y, m, 1); const end = fmtKey(y, m, daysInMonth(y, m)); const out = new Map<string, Occurrence[]>()
  for (const item of items) {
    let d = item.next_due; let isNext = true; let guard = 0
    while (d <= end && guard++ < 700) { if (d >= start) { const list = out.get(d) ?? []; list.push({ item, isNext }); out.set(d, list) } d = advanceDue(d, item.frequency, item.anchor_day); isNext = false }
  }
  return out
}