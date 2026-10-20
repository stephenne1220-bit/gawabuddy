export function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`
}

export function monthsUntil(deadline: string): number {
  const [y, m, d] = deadline.split('-').map(Number)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const ms = new Date(y, m - 1, d).getTime() - today.getTime()
  if (ms <= 0) return 0
  return Math.max(1, Math.ceil(ms / 86_400_000 / 30.4375))
}

export function suggestedMonthly(remainingCents: number, months: number) {
  if (remainingCents <= 0 || months <= 0) return 0
  return Math.ceil(remainingCents / months / 100) * 100
}

export function savedPct(saved: number, target: number) {
  if (target <= 0) return 0
  return Math.max(0, Math.min(100, (saved / target) * 100))
}

export function formatDay(key: string) {
  return new Date(`${key}T00:00:00`).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}