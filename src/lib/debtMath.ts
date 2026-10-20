import { formatDay } from '@/lib/savingsMath'

export type Strategy = 'snowball' | 'avalanche'
export type PlanDebt = { id: string; name: string; balance: number; rate: number; min: number }
export type PayoffResult = {
  strategy: Strategy
  feasible: boolean
  months: number
  totalInterest: number
  order: { id: string; name: string; month: number }[]
}

const MAX_MONTHS = 600

export function simulatePayoff(debts: PlanDebt[], extra: number, strategy: Strategy): PayoffResult {
  const queue = debts
    .filter((d) => d.balance > 0)
    .sort(
      strategy === 'snowball'
        ? (a, b) => a.balance - b.balance || b.rate - a.rate
        : (a, b) => b.rate - a.rate || a.balance - b.balance,
    )
  if (queue.length === 0) return { strategy, feasible: true, months: 0, totalInterest: 0, order: [] }

  const bal = new Map(queue.map((d) => [d.id, d.balance]))
  const budget = queue.reduce((s, d) => s + d.min, 0) + Math.max(0, extra)
  const order: PayoffResult['order'] = []
  let totalInterest = 0
  let month = 0

  while (month < MAX_MONTHS && queue.some((d) => (bal.get(d.id) ?? 0) > 0)) {
    month++
    let left = budget
    for (const d of queue) {
      const b = bal.get(d.id) ?? 0
      if (b <= 0) continue
      const interest = (b * d.rate) / 100 / 12
      bal.set(d.id, b + interest)
      totalInterest += interest
    }
    for (const d of queue) {
      const b = bal.get(d.id) ?? 0
      if (b <= 0) continue
      const pay = Math.min(d.min, b, left)
      bal.set(d.id, b - pay)
      left -= pay
    }
    for (const d of queue) {
      if (left <= 0) break
      const b = bal.get(d.id) ?? 0
      if (b <= 0) continue
      const pay = Math.min(b, left)
      bal.set(d.id, b - pay)
      left -= pay
    }
    for (const d of queue) {
      const b = bal.get(d.id) ?? 0
      if (b > 0 && b < 0.5 && !order.some((o) => o.id === d.id)) bal.set(d.id, 0)
      if ((bal.get(d.id) ?? 0) === 0 && !order.some((o) => o.id === d.id)) {
        order.push({ id: d.id, name: d.name, month })
      }
    }
  }
  const feasible = queue.every((d) => (bal.get(d.id) ?? 0) === 0)
  return { strategy, feasible, months: feasible ? month : 0, totalInterest: feasible ? Math.round(totalInterest) : 0, order }
}

export function monthsFromNowLabel(months: number) {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + months, 1).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })
}

export function durationLabel(months: number) {
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts: string[] = []
  if (y) parts.push(`${y} yr${y === 1 ? '' : 's'}`)
  if (m || !y) parts.push(`${m} mo`)
  return parts.join(' ')
}

export function daysUntil(dateKey: string) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((new Date(y, m - 1, d).getTime() - today.getTime()) / 86_400_000)
}

export type DueTone = 'ok' | 'soon' | 'overdue' | 'none'

export function dueInfo(due: string | null, balance: number): { label: string; tone: DueTone } {
  if (balance <= 0) return { label: 'Paid off', tone: 'ok' }
  if (!due) return { label: 'No due date', tone: 'none' }
  const days = daysUntil(due)
  if (days < 0) {
    const n = Math.abs(days)
    return { label: `Overdue by ${n} day${n === 1 ? '' : 's'}`, tone: 'overdue' }
  }
  if (days === 0) return { label: 'Due today', tone: 'soon' }
  if (days <= 7) return { label: `Due in ${days} day${days === 1 ? '' : 's'}`, tone: 'soon' }
  return { label: `Due ${formatDay(due)}`, tone: 'none' }
}