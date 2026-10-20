import { currentMonthKey, monthLabel, shiftMonth } from '@/lib/budgetMath'
export type Mode = 'month' | 'year'
export type MonthRow = { month: string; income: number; expense: number }
export type Bar = { key: string; label: string; income: number; expense: number }
export type CatRow = { id: string | null; name: string; total: number; share: number }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const yearOf = (key: string) => Number(key.slice(0, 4))
export function periodRange(mode: Mode, anchor: string) {
  if (mode === 'month') return { from: anchor, to: shiftMonth(anchor, 1), label: monthLabel(anchor) }
  const y = yearOf(anchor); return { from: `${y}-01-01`, to: `${y + 1}-01-01`, label: String(y) }
}
export function chartRange(mode: Mode, anchor: string) {
  const y = yearOf(anchor)
  if (mode === 'month') return { from: `${y}-01-01`, to: `${y + 1}-01-01` }
  const end = Math.max(y, yearOf(currentMonthKey())); return { from: `${end - 4}-01-01`, to: `${end + 1}-01-01` }
}
export function selectedBarKey(mode: Mode, anchor: string) { return mode === 'month' ? anchor : `${yearOf(anchor)}-01-01` }
export function buildBars(mode: Mode, anchor: string, rows: MonthRow[]): Bar[] {
  if (mode === 'month') { const y = yearOf(anchor); const byMonth = new Map(rows.map((r) => [r.month, r])); return MONTHS.map((label, i) => { const key = `${y}-${String(i + 1).padStart(2, '0')}-01`; const r = byMonth.get(key); return { key, label, income: r?.income ?? 0, expense: r?.expense ?? 0 } }) }
  const end = Math.max(yearOf(anchor), yearOf(currentMonthKey())); return Array.from({ length: 5 }, (_, i) => end - 4 + i).map((yr) => { const inYear = rows.filter((r) => yearOf(r.month) === yr); return { key: `${yr}-01-01`, label: String(yr), income: inYear.reduce((s, r) => s + r.income, 0), expense: inYear.reduce((s, r) => s + r.expense, 0) } })
}
export function savingsRate(income: number, expense: number) { if (income <= 0) return null; return ((income - expense) / income) * 100 }
export function shortMoney(cents: number) { const s = cents / 100; const abs = Math.abs(s); if (abs >= 1_000_000) return `${(s / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`; if (abs >= 1_000) return `${Math.round(s / 1_000)}k`; return String(Math.round(s)) }
export function buildCategoryRows(rows: { category_id: string | null; total_cents: number }[], names: Map<string, string>, top = 8): CatRow[] {
  const total = rows.reduce((s, r) => s + r.total_cents, 0); if (total <= 0) return []
  const named = rows.map((r) => ({ id: r.category_id, name: r.category_id ? (names.get(r.category_id) ?? 'Unknown') : 'Uncategorized', total: r.total_cents })).sort((a, b) => b.total - a.total)
  const head = named.slice(0, top); const rest = named.slice(top).reduce((s, r) => s + r.total, 0); const out = rest > 0 ? [...head, { id: null, name: 'Other', total: rest }] : head
  return out.map((r) => ({ ...r, share: (r.total / total) * 100 }))
}